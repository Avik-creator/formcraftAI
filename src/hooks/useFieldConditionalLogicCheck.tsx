import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { FieldEntity } from '@/types/index';
import { useEffect } from 'react';

const useFieldConditionalLogicCheckGeneric = (
  fields: string[],
  fieldEntities: Record<string, FieldEntity> | null,
  onFieldVisibilityChange: (fieldId: string, isVisible: boolean) => void,
) => {
  useEffect(() => {
    if (!fieldEntities || !fields?.length) return;

    fields?.forEach((fieldId) => {
      const field = fieldEntities?.[fieldId] as FieldEntity;

      

      if (field?.conditionalLogic) {
        // conditional logic validation

        const { showWhen, operator } = field.conditionalLogic || {};
        const conditions: boolean[] = [];

        showWhen?.forEach((condition) => {
          const conditionOperator = condition?.operator;
          const conditionValue = condition?.value;
          const conditionFieldId = condition?.fieldId;
          const operatorType = condition?.operatorType;
          const fieldType = fieldEntities?.[conditionFieldId]?.type;
          const conditionalFieldValue = fieldEntities?.[conditionFieldId]?.value as string;

          const validationMap =
            CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS] ??
            CUSTOM_FIELD_VALIDATIONS.text;
          const availableFieldValidations = validationMap?.[operatorType as keyof typeof validationMap];

          const functor = availableFieldValidations?.[conditionOperator as keyof typeof availableFieldValidations] as (
            v: unknown,
          ) => (val: string) => boolean;
          const validationFn = functor ? functor?.(conditionValue) : () => true;

          const isValid = validationFn(conditionalFieldValue);

          conditions.push(isValid === true);
        });

        if (operator === 'OR') {
          const isAnyConditionTrue = conditions.some((c) => c);
          onFieldVisibilityChange(fieldId, isAnyConditionTrue);
          return;
        }

        if (operator === 'AND') {
          const isAllConditionTrue = conditions.every((c) => c);
          onFieldVisibilityChange(fieldId, isAllConditionTrue);
          return;
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, fieldEntities]);

  return null;
};

export default useFieldConditionalLogicCheckGeneric;
