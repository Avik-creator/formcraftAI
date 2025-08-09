import {
    createFormConfigAction,
    deleteFormAction,
    getAllUserFormsAction,
    publishFormAction,
    updateFormConfigAction,
  } from '@/backend/actions/form';
  import { FormConfig, FormConfigWithMeta } from '@/types/index';
  
  export const fetchAllForms = async () => {
    const res = await getAllUserFormsAction();
  
    if (res?.success) return res?.data as FormConfigWithMeta[];
  
    if (res?.error) {
      throw new Error(res?.error as string);
    }
  };
  
  export const createForm = async () => {
    const res = await createFormConfigAction();
  
    if (res?.success) return res?.data as FormConfig;
  
    if (res?.error) {
      throw new Error(res?.error as string);
    }
  };
  
  export const deleteForm = async (id: string) => {
    const res = await deleteFormAction(id);
  
    if (res?.success) return res?.data as unknown as Record<string, unknown>;
  
    if (res?.error) {
      throw new Error(res?.error as string);
    }
  };
  
  export const updateForm = async (id: string, update: Partial<FormConfig>): Promise<FormConfig> => {
    const res = await updateFormConfigAction(id, update);
  
    if (res?.success) return res?.data as FormConfig;
  
    if (res?.error) {
      throw new Error(res?.error as string);
    }
    // Should not reach here, but satisfy return type
    return update as FormConfig;
  };
  
  export const publishForm = async (id: string): Promise<FormConfig> => {
    const res = await publishFormAction(id);
  
    if (res?.success) return res?.data as FormConfig;
  
    if (res?.error) {
      throw new Error(res?.error as string);
    }
    // Fallback (unreachable) to satisfy return type
    throw new Error('Failed to publish form');
  };
  