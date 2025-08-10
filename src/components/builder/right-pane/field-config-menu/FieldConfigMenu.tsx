import React from 'react';
import FieldConfigSection from './config-section/FieldConfigSection';
import FieldValidationSection from './validation-section/FieldValidationSection';
import FieldConditionalLogicSection from './conditional-logic-section/ConditionalLogicSection';
import FieldActionSection from './action-section/FieldActionSection';
const FieldConfigMenu = () => {
  return (
    <div className="space-y-4 pb-8">
      <FieldActionSection />
      <FieldConfigSection />
      <FieldConditionalLogicSection />
      <FieldValidationSection />
    </div>
  );
};

export default FieldConfigMenu;
