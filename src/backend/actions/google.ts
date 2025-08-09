export const getAllFontsAction = async () => {
  const fallback = {
    items: [
      { family: 'Poppins' },
      { family: 'Inter' },
      { family: 'Roboto' },
      { family: 'Open Sans' },
      { family: 'Lato' },
      { family: 'Montserrat' },
      { family: 'Nunito' },
      { family: 'Raleway' },
    ],
  };

  try {
    const apiKey = process.env?.GOOGLE_FONTS_API_KEY;

    if (!apiKey) {
      return { success: true, data: fallback };
    }

    const res = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
      { cache: 'no-store' },
    );

    if (!res.ok) {
      return { success: true, data: fallback };
    }

    const data = await res.json();
    return {
      success: true,
      data: data ?? fallback,
    };
  } catch (error) {
    // Gracefully fall back to a curated list so UI still works
    if (error instanceof Error) return { success: true, data: fallback };
    return { success: true, data: fallback };
  }
}