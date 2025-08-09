'use server';

import { auth } from '@clerk/nextjs/server';

export const verifyAuth = async () => {
    const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
};

export const convertToPlainObject = async (obj: any): Promise<any> => {
  try {
    // Handle null and undefined
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Handle primitive types
    if (typeof obj !== 'object') {
      return obj;
    }

    // Handle Date objects
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(item => convertToPlainObject(item)));
    }

    // Handle objects with toJSON method (like MongoDB documents)
    if (obj.toJSON && typeof obj.toJSON === 'function') {
      const jsonObj = obj.toJSON();
      return convertToPlainObject(jsonObj);
    }

    // Handle plain objects
    if (obj.constructor === Object) {
      const plainObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        plainObj[key] = await convertToPlainObject(value);
      }
      return plainObj;
    }

    // For other object types, try JSON serialization as fallback
    const jsonString = JSON.stringify(obj);
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Error converting object to plain object:', error);
    // Return a safe fallback
    return obj;
  }
};
