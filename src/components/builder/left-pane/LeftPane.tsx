import React from 'react';

import Header from './Header';
import FormInfoSection from './form-info/FormInfo';
import FormStructureSection from './form-structure/FormStructure';
import FormCustomizationSection from './form-customization/FormCustomization';

import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';


const LeftPane = ({ className }: GenericProps) => {
  const classes = cn(
    'h-full flex bg-black/40 backdrop-blur-sm flex-col gap-4 p-6 pt-4 max-h-screen overflow-auto',
    'border-r border-zinc-800/50 shadow-lg',
    className,
  );

  return (
    <div className={classes}>
      <Header />
      <FormInfoSection />

      <FormCustomizationSection />
      <FormStructureSection />
    </div>
  );
};

export default LeftPane;
