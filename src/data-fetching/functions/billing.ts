import {
  assertCanAcceptSubmissionForOwnerAction,
  assertCanCreateFormAction,
  getBillingInfoAction,
  getUserPlanAction,
  getUserUsageAction,
} from '@/backend/actions/billing';

export type BillingPlanId = 'free' | 'proplan';

export type BillingLimits = {
  maxForms: number | null;
  monthlySubmissions: number | null;
};

export type BillingUsage = {
  formsCount: number;
  submissionsThisMonth: number;
};

export type BillingInfo = {
  userId: string;
  planId: BillingPlanId;
  isPro: boolean;
  limits: BillingLimits;
  usage: BillingUsage;
};

export const fetchUserPlan = async () => {
  const res = await getUserPlanAction();

  if (res?.success) return res?.data as { userId: string; isPro: boolean; planId: BillingPlanId };

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};

export const fetchUserUsage = async () => {
  const res = await getUserUsageAction();

  if (res?.success) return res?.data as BillingUsage;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};

export const fetchBillingInfo = async () => {
  const res = await getBillingInfoAction();

  if (res?.success) return res?.data as BillingInfo;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};

export const ensureCanCreateForm = async () => {
  const res = await assertCanCreateFormAction();

  if (res?.success) return true;

  if (res?.error) {
    throw new Error(res?.error as string);
  }

  return false;
};

export const ensureCanAcceptSubmissionForOwner = async (ownerUserId: string) => {
  const res = await assertCanAcceptSubmissionForOwnerAction(ownerUserId);

  if (res?.success) return true;

  if (res?.error) {
    throw new Error(res?.error as string);
  }

  return false;
};


