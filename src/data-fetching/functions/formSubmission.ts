import { createNewFormSubmissionAction, getFormSubmissionsAction } from '@/backend/actions/formSubmission';
import { FormSubmissionModelType } from '@/backend/models/formSubmission';
import type { FormConfig } from '@/types/index';

export type FormSubmissionResponse = (FormSubmissionModelType & { _id?: string }) & { createdAt: Date | string; updatedAt: Date | string };

export const createFormSubmission = async (
  data: Record<string, unknown>,
): Promise<FormSubmissionResponse> => {
  const res = await createNewFormSubmissionAction(data as FormSubmissionModelType);
  if (res?.success) return res?.data as FormSubmissionResponse;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
  throw new Error('Failed to create form submission');
};

export const getFormSubmissions = async (
  formId: string,
  filter?: Record<string, unknown>,
): Promise<{ formConfig: FormConfig; submissions: FormSubmissionResponse[] }> => {
  const res = await getFormSubmissionsAction(formId, filter);

  if (res?.success) return res?.data as unknown as { formConfig: FormConfig; submissions: FormSubmissionResponse[] };

  if (res?.error) {
    throw new Error(res?.error as string);
  }
  throw new Error('Failed to fetch form submissions');
};
