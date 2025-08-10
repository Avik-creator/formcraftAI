import { toast } from 'sonner';

export const handleNetworkError = (error: unknown) => {
  if (error instanceof Error) {
    // Check for common network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      toast.error('Network Error', {
        description: 'Please check your internet connection and try again',
        duration: 5000,
      });
      return;
    }

    // Check for timeout errors
    if (error.message.includes('timeout')) {
      toast.error('Request Timeout', {
        description: 'The request took too long. Please try again',
        duration: 4000,
      });
      return;
    }

    // Check for server errors
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      toast.error('Server Error', {
        description: 'Something went wrong on our end. Please try again later',
        duration: 4000,
      });
      return;
    }

    // Check for authentication errors
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      toast.error('Authentication Error', {
        description: 'Please sign in again to continue',
        duration: 4000,
      });
      return;
    }

    // Check for permission errors
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      toast.error('Permission Denied', {
        description: 'You do not have permission to perform this action',
        duration: 4000,
      });
      return;
    }

    // Generic error
    toast.error('Error', {
      description: error.message,
      duration: 4000,
    });
  } else {
    toast.error('Unknown Error', {
      description: 'An unexpected error occurred',
      duration: 4000,
    });
  }
};

export const showSuccessToast = (title: string, description?: string) => {
  toast.success(title, {
    description,
    duration: 3000,
  });
};

export const showInfoToast = (title: string, description?: string) => {
  toast.info(title, {
    description,
    duration: 3000,
  });
};

export const showWarningToast = (title: string, description?: string) => {
  toast.warning(title, {
    description,
    duration: 4000,
  });
};