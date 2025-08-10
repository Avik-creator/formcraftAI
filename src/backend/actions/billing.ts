'use server';

import connectDb from '../db/connection';
import Form from '../models/form';
import FormSubmission from '../models/formSubmission';
import { convertToPlainObject, verifyAuth } from '../utils';
import UserBillingProfile from '../models/userBillingProfile';

type BillingPlanId = 'free' | 'proplan';

type BillingLimits = {
  maxForms: number | null; // null indicates unlimited
  monthlySubmissions: number | null; // null indicates unlimited
};

type BillingUsage = {
  formsCount: number;
  submissionsThisMonth: number;
};

type BillingInfo = {
  userId: string;
  planId: BillingPlanId;
  isPro: boolean;
  limits: BillingLimits;
  usage: BillingUsage;
};

function getPlanLimits(isPro: boolean): BillingLimits {
  if (isPro) {
    return {
      maxForms: null,
      monthlySubmissions: null,
    };
  }

  return {
    maxForms: 3,
    monthlySubmissions: 100,
  };
}

function getMonthRange(date: Date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

export const getUserPlanAction = async () => {
  try {
    const userId = await verifyAuth();
    await connectDb();

    const profile = await UserBillingProfile.findOne({ userId }).lean();
    const isPro = Boolean(profile?.isPro);
    const planId: BillingPlanId = isPro ? 'proplan' : 'free';

    return {
      success: true as const,
      data: await convertToPlainObject({ userId, isPro, planId }),
    };
  } catch (error) {
    if (error instanceof Error) return { success: false as const, error: error.message };
    return { success: false as const, error };
  }
};

export const getUserUsageAction = async (targetUserId?: string) => {
  try {
    const userId = targetUserId ?? (await verifyAuth());
    await connectDb();

    const formsCount = await Form.countDocuments({ createdBy: userId });

    const { start, end } = getMonthRange();
    const formsForUser = await Form.find({ createdBy: userId }, { id: 1, _id: 0 }).lean();
    const formIds = formsForUser.map((f) => f.id);

    const submissionsThisMonth = formIds.length
      ? await FormSubmission.countDocuments({
          formId: { $in: formIds },
          createdAt: { $gte: start, $lt: end },
        })
      : 0;

    return {
      success: true as const,
      data: await convertToPlainObject({ formsCount, submissionsThisMonth }) as unknown as BillingUsage,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false as const, error: error.message };
    return { success: false as const, error };
  }
};

export const getBillingInfoAction = async () => {
  try {
    const userId = await verifyAuth();
    await connectDb();

    const profile = await UserBillingProfile.findOne({ userId }).lean();
    const isPro = Boolean(profile?.isPro);
    const planId: BillingPlanId = isPro ? 'proplan' : 'free';
    const limits = getPlanLimits(isPro);

    const usageRes = await getUserUsageAction(userId);
    if (!usageRes.success) throw new Error(String(usageRes.error ?? 'Failed to fetch usage'));

    const info: BillingInfo = {
      userId,
      planId,
      isPro,
      limits,
      usage: usageRes.data,
    };

    return { success: true as const, data: await convertToPlainObject(info) as unknown as BillingInfo };
  } catch (error) {
    if (error instanceof Error) return { success: false as const, error: error.message };
    return { success: false as const, error };
  }
};

export const assertCanCreateFormAction = async () => {
  try {
    const userId = await verifyAuth();
    await connectDb();

    const profile = await UserBillingProfile.findOne({ userId }).lean();
    const isPro = Boolean(profile?.isPro);
    if (isPro) return { success: true as const, data: { allowed: true } };

    const currentForms = await Form.countDocuments({ createdBy: userId });
    const limit = 3;

    if (currentForms >= limit) {
      return {
        success: false as const,
        error: 'Free plan allows up to 3 forms. Upgrade to Pro to create more.',
      };
    }

    return { success: true as const, data: { allowed: true } };
  } catch (error) {
    if (error instanceof Error) return { success: false as const, error: error.message };
    return { success: false as const, error };
  }
};

export const assertCanAcceptSubmissionForOwnerAction = async (ownerUserId: string) => {
  try {
    await connectDb();

    const ownerProfile = await UserBillingProfile.findOne({ userId: ownerUserId }).lean();
    const isPro = Boolean(ownerProfile?.isPro);

    if (isPro) return { success: true as const, data: { allowed: true } };

    const { start, end } = getMonthRange();
    const ownerForms = await Form.find({ createdBy: ownerUserId }, { id: 1, _id: 0 }).lean();
    const ownerFormIds = ownerForms.map((f) => f.id);

    if (ownerFormIds.length === 0) {
      return { success: true as const, data: { allowed: true } };
    }

    const submissionsThisMonth = await FormSubmission.countDocuments({
      formId: { $in: ownerFormIds },
      createdAt: { $gte: start, $lt: end },
    });

    if (submissionsThisMonth >= 100) {
      return {
        success: false as const,
        error: 'Monthly submission limit (100) reached for the form owner. Upgrade to Pro for unlimited submissions.',
      };
    }

    return { success: true as const, data: { allowed: true } };
  } catch (error) {
    if (error instanceof Error) return { success: false as const, error: error.message };
    return { success: false as const, error };
  }
};


