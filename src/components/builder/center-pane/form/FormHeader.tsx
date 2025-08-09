import React from 'react';
import EditableText from '@/components/common/EditableText';
import { useFormActionProperty, useFormProperty, useFormConfigStore } from '@/zustand/store';

const FormHeaderContent = ({ pageId }: { pageId: string }) => {
  const formConfig = useFormConfigStore((s: any) => s.formConfig);
  const pageEntities = useFormProperty('pageEntities');

  const currentPage = pageEntities?.[pageId];

  if (!formConfig || !currentPage) return null;

  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-white mb-3">{formConfig.name}</h1>
      {formConfig.description && (
        <p className="text-zinc-300 text-lg leading-relaxed max-w-lg mx-auto">
          {formConfig.description}
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
