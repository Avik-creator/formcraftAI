'use server';

import { createNewForm } from '@/lib/form';
import connectDb from '../db/connection';
import Form from '../models/form';
import { convertToPlainObject, verifyAuth } from '../utils';
import { FormConfig } from '@/types/index';
import { assertCanCreateFormAction } from './billing';

export const createFormConfigAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    // Enforce billing limit: Free plan can create up to 3 forms
    const canCreate = await assertCanCreateFormAction();
    if (!canCreate.success) {
      return { success: false as const, error: canCreate.error };
    }

    const newForm = createNewForm(userId as string);
    const form = new Form(newForm);
    const res = await form.save();

    return {
      success: true,
      data: await convertToPlainObject(res) as FormConfig,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return {
      success: false,
      error: error,
    };
  }
};

export const getAllUserFormsAction = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const forms = await Form.aggregate([
      {
        $match: {
          createdBy: userId,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $lookup: {
          from: 'formsubmissions',
          localField: 'id',
          foreignField: 'formId',
          as: 'submissions',
        },
      },
      {
        $addFields: {
          meta: {
            title: '$name',
            description: '$description',
            status: '$status',
            submissions: {
              $sum: {
                $map: {
                  input: '$submissions',
                  as: 'submission',
                  in: { $cond: [{ $eq: ['$$submission.status', 'completed'] }, 1, 0] },
                },
              },
            },
            lastModified: '$updatedAt',
          },
        },
      },
      { $unset: ['submissions'] },
    ]);

    return {
      success: true,
      data: await convertToPlainObject(forms),
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return {
      success: false,
      error: error,
    };
  }
};

export const deleteFormAction = async (id: string) => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const res = await Form.deleteOne({
      id,
      createdBy: userId,
    });

    return {
      success: true,
      data: await convertToPlainObject(res),
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };

    return {
      success: false,
      error: error,
    };
  }
};

export const updateFormConfigAction = async (id: string, update: Partial<FormConfig>) => {
  try {
    const userId = await verifyAuth();
    await connectDb();
    const res = await Form.updateOne(
      { id, createdBy: userId },
      { ...update, createdBy: userId, id },
      { upsert: true },
    );

    return {
      success: true,
      data: await convertToPlainObject(res),
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return {
      success: false,
      error: error,
    };
  }
};

export const publishFormAction = async (id: string) => {
  try {
    const userId = await verifyAuth();
    await connectDb();
    const res = await Form.findOneAndUpdate({ id, createdBy: userId }, { status: 'published' }, { new: true });

    if (!res) throw new Error('Form not found');

    return {
      success: true,
      data: await convertToPlainObject(res),
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };

    return {
      success: false,
      error: error,
    };
  }
};

export const getFormConfigWithIdAction = async (id: string) => {
  try {
    await connectDb();
    const res = await Form.findOne({ id })?.lean();

    if (res?.status !== 'published') throw new Error('This form is not published yet. Please contact its owner.');

    // Ensure theme is properly set with defaults if missing
    const formData = await convertToPlainObject(res) as unknown as FormConfig;
    
    // Ensure all required properties are present with defaults
    if (!formData.fieldEntities) {
      formData.fieldEntities = {};
    }
    
    if (!formData.pageEntities) {
      formData.pageEntities = {};
    }
    
    if (!formData.pages) {
      formData.pages = [];
    }
    
    if (!formData.theme || Object.keys(formData.theme).length === 0) {
      formData.theme = {
        type: 'midnight-black',
        id: 'midnight-black',
        properties: {
          formBackgroundColor: '#000000',
          primaryTextColor: '#ffffff',
          secondaryTextColor: '#a1a1aa',
          inputPlaceholderColor: '#71717a',
          inputBorderColor: '#3f3f46',
          borderRadius: '8px',
        },
      };
    }

    return {
      success: true,
      data: formData,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };

    return {
      success: false,
      error,
    };
  }
};
