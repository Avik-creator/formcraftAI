import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  ensureCanAcceptSubmissionForOwner,
  ensureCanCreateForm,
  fetchBillingInfo,
  fetchUserPlan,
  fetchUserUsage,
} from '@/data-fetching/functions/billing';

export const useUserPlanQuery = () =>
  useQuery({
    queryKey: ['billing', 'plan'],
    queryFn: fetchUserPlan,
    staleTime: 60 * 1000,
  });

export const useUserUsageQuery = () =>
  useQuery({
    queryKey: ['billing', 'usage', 'self'],
    queryFn: () => fetchUserUsage(),
    staleTime: 30 * 1000,
  });

export const useBillingInfoQuery = () =>
  useQuery({
    queryKey: ['billing', 'info'],
    queryFn: fetchBillingInfo,
    staleTime: 30 * 1000,
  });

export const useEnsureCanCreateForm = () =>
  useMutation({
    mutationKey: ['billing', 'ensure-can-create-form'],
    mutationFn: ensureCanCreateForm,
    onError: (error) => {
      toast.error('Cannot create form', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    },
  });

export const useEnsureCanAcceptSubmissionForOwner = () =>
  useMutation({
    mutationKey: ['billing', 'ensure-can-accept-submission-for-owner'],
    mutationFn: ensureCanAcceptSubmissionForOwner,
    onError: (error) => {
      toast.error('Cannot accept submission', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    },
  });


