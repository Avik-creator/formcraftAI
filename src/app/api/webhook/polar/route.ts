import { Webhooks } from '@polar-sh/nextjs';
import connectDb from '@/backend/db/connection';
import UserBillingProfile from '@/backend/models/userBillingProfile';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async () => {},
  onCustomerCreated: async (event) => {
    await connectDb();
    const customer = event.data as any;
    const appUserId =
      (customer?.metadata as Record<string, string> | undefined)?.appUserId ||
      (customer?.externalId as string | undefined);
    if (!appUserId) return;
    await UserBillingProfile.updateOne(
      { userId: appUserId },
      { $setOnInsert: { userId: appUserId }, $set: { polarCustomerId: customer.id } },
      { upsert: true },
    );
  },
  onSubscriptionActive: async (event) => {
    await connectDb();
    const sub = event.data as any;
    const appUserId =
      (sub?.customer?.metadata as Record<string, string> | undefined)?.appUserId ||
      (sub?.customer?.externalId as string | undefined);
    if (!appUserId) return;
    await UserBillingProfile.updateOne(
      { userId: appUserId },
      { $setOnInsert: { userId: appUserId }, $set: { planId: 'proplan', isPro: true } },
      { upsert: true },
    );
  },
  onSubscriptionCanceled: async (event) => {
    await connectDb();
    const sub = event.data as any;
    const appUserId =
      (sub?.customer?.metadata as Record<string, string> | undefined)?.appUserId ||
      (sub?.customer?.externalId as string | undefined);
    if (!appUserId) return;
    await UserBillingProfile.updateOne(
      { userId: appUserId },
      { $setOnInsert: { userId: appUserId }, $set: { planId: 'free', isPro: false } },
      { upsert: true },
    );
  },
  onOrderPaid: async (event) => {
    await connectDb();
    const order = event.data as any;
    const customer = order?.customer;
    const appUserId =
      (order?.metadata as Record<string, string> | undefined)?.appUserId ||
      (customer?.metadata as Record<string, string> | undefined)?.appUserId ||
      (customer?.externalId as string | undefined);
    if (!appUserId) return;
    await UserBillingProfile.updateOne(
      { userId: appUserId },
      {
        $setOnInsert: { userId: appUserId },
        $set: { planId: 'proplan', isPro: true, polarCustomerId: customer?.id },
      },
      { upsert: true },
    );
  },
  onOrderRefunded: async (event) => {
    await connectDb();
    const order = event.data as any;
    const customer = order?.customer;
    const appUserId =
      (order?.metadata as Record<string, string> | undefined)?.appUserId ||
      (customer?.metadata as Record<string, string> | undefined)?.appUserId ||
      (customer?.externalId as string | undefined);
    if (!appUserId) return;
    await UserBillingProfile.updateOne(
      { userId: appUserId },
      { $setOnInsert: { userId: appUserId }, $set: { planId: 'free', isPro: false } },
      { upsert: true },
    );
  },
});


