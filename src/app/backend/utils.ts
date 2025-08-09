'use server';

import { auth } from '@clerk/nextjs/server';

export const verifyAuth = async () => {
    const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  return userId;
};

export const convertToPlainObject = (obj: object) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};
