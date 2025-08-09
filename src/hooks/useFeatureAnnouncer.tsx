import { useEffect, useMemo, useState } from 'react';

const getLocalStorageFeature = (featureKey: string) => {
  try {
    if (typeof window === 'undefined') return false;
    return JSON.parse(localStorage.getItem('features') || '{}')?.[featureKey];
  } catch {
    return false;
  }
};

const useFeatureAnnouncer = (featureName: string, enabled: boolean = true) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hasAnnouncedMoreThan3Times = useMemo(
    () => {
      if (!isClient) return false; // Return false on server-side to prevent hydration mismatch
      return enabled ? getLocalStorageFeature(featureName) > 3 : true;
    },
    [featureName, enabled, isClient],
  );

  useEffect(() => {
    if (!isClient) return; // Don't run on server-side
    
    if (!hasAnnouncedMoreThan3Times && enabled) {
      const features = JSON.parse(localStorage.getItem('features') || '{}');
      features[featureName] = (features?.[featureName] || 0) + 1;
      localStorage.setItem('features', JSON.stringify(features));
    }
  }, [enabled, featureName, hasAnnouncedMoreThan3Times, isClient]);

  return hasAnnouncedMoreThan3Times;
};

export default useFeatureAnnouncer;
