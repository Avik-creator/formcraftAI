import { CustomerPortal } from '@polar-sh/nextjs';
import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDb from '@/backend/db/connection';
import UserBillingProfile from '@/backend/models/userBillingProfile';

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: async (_req: NextRequest) => {
    const { userId } = await auth();
    if (!userId) return '';
    await connectDb();
    const profile = await UserBillingProfile.findOne({ userId }).lean();
    return profile?.polarCustomerId ?? '';
  },
  server: 'sandbox',
});


