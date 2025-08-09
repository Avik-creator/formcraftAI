import React from 'react';
import FormHeaderContent from './FormHeader';
import SortableFormFieldContainer, { FormFieldsProps } from './SortableFormFieldContainer';
import { useFormProperty } from '@/zustand/store';

const FormContent = (props: FormFieldsProps) => {
  const { pageId } = props;
  const activePage = useFormProperty('pageEntities')?.[pageId];

  if (!activePage) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-8 shadow-xl">
        <FormHeaderContent pageId={pageId} />
        <SortableFormFieldContainer {...props} />
      </div>
    </div>
  );
};

export default FormContent;
