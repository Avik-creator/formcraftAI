import { getAllFontsAction } from "@/backend/actions/google";

export const getAllFonts = async () => {
    const res = await getAllFontsAction();
  
    if (!res?.success) throw new Error(res?.data as string);
  
    return res?.data || [];
  };
  