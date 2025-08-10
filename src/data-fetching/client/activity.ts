import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createNewActivity } from '@/data-fetching/functions/activity';

import type { ActivityModelType } from '@/backend/models/activity';

export const useCreateActivityMutation = ({
  onMutate,
  onSuccess,
  onError,
}: {
  onMutate?: () => string;
  onSuccess?: (data: ActivityModelType | undefined, context: string) => void;
  onError?: (error: unknown) => void;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createNewActivity,
    onMutate,
    onSuccess: (data, _, context) => {
      onSuccess?.(data as ActivityModelType, context as string);
    },
    onError: (error, vars, context) => {
      toast.error('Failed to log activity', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 3000,
      });
      onError?.(error);
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
