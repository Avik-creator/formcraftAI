export const getAllFontsAction = async () => {
    try {
  
      const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env?.GOOGLE_FONTS_API_KEY}&sort=popularity`);
      const data = await res.json();
  
      return {
        success: true,
        data
      };
    } catch (error) {
      if (error instanceof Error) return { success: false, error: error?.message };
      return { success: false, error: error };
    }
  }