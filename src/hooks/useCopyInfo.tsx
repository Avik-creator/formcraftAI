import { copyToClipboard } from '@/utils/functions';
import React, { useCallback } from 'react';

const useCopyInfo = () => {
  const [hasCopied, setHasCopied] = React.useState(false);

  const handleCopy = useCallback((info: string, onError?: () => void) => {
    copyToClipboard(info)
      .then(() => {
        setHasCopied(true);
        setTimeout(() => {
          setHasCopied(false);
        }, 3000);
      })
      .catch(() => {
        setHasCopied(false);
        onError?.();
      });
  }, []);

  return {
    hasCopied,
    handleCopy,
  };
};

export default useCopyInfo;
