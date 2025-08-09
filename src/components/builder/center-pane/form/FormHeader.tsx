import React from 'react';
import { useFormProperty } from '@/zustand/store';

const FormHeaderContent = ({ pageId }: { pageId: string }) => {
  const pageEntities = useFormProperty('pageEntities');
  const formName = useFormProperty('name');
  const formDescription = useFormProperty('description');

  const currentPage = pageEntities?.[pageId];

  if (!currentPage) return null;

  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-white mb-3">{formName ?? ''}</h1>
      {formDescription && (
        <p className="text-zinc-300 text-lg leading-relaxed max-w-lg mx-auto">
          {formDescription}
        </p>
      )}
      {currentPage.name && currentPage.name !== 'Page' && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white/90">{currentPage.name}</h2>
        </div>
      )}
    </div>
  );
};

export default FormHeaderContent;
