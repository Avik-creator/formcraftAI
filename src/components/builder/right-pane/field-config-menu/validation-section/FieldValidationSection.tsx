import FormConfigSection from '@/components/common/FormConfigSection';
import { CheckCircle } from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import {
  FieldExactLength,
  FieldStartsWith,
  FieldEndsWith,
  FieldMinLength,
  FieldMaxLength,
  FieldContains,
  FieldMatchesRegex,
  FieldNoWhitespace,
  FieldIsEmail,
  FieldIsURL,
  FieldIsNumeric,
  FieldIsAlpha,
  FieldNoSpecialCharacters,
  FieldRequired,
  DateFieldIsBefore,
  DateFieldIsAfter,
  DateFieldRestrictFutureDate,
  DateFieldRestrictPastDate,
  DateFieldRequired,
  CheckboxFieldRequired,
  CheckboxFieldMinCount,
  CheckboxFieldMaxCount,
  FieldIsValidPhoneNumber,
  RadioFieldEquals,
  CheckboxFieldContains,
  TextFieldEquals,
  DropdownFieldContains,
  FileUploadFieldRequired,
  FileUploadFieldMaxFileSize,
  FileUploadFieldMaxCount,
  FileUploadFieldMinCount,
} from './Fields';
import { Button } from '@/components/ui/button';
import { useSelectedFieldStore } from '@/zustand/store';

const FieldValidationSection = () => {
  const [showMore, setShowMore] = useState(false);
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);

  const fields = useMemo(() => {
    if (!selectedField) return [];

    const fieldComponents = [];

    switch (selectedField.type) {
      case 'text':
      case 'textarea':
        fieldComponents.push(
          FieldRequired,
          FieldExactLength,
          FieldMinLength,
          FieldMaxLength,
          TextFieldEquals,
          FieldStartsWith,
          FieldEndsWith,
          FieldContains,
          FieldMatchesRegex,
          FieldNoWhitespace,
          FieldIsValidPhoneNumber,
          FieldIsEmail,
          FieldIsURL,
          FieldIsNumeric,
          FieldIsAlpha,
          FieldNoSpecialCharacters,
        );
        break;
      case 'date':
        fieldComponents.push(
          DateFieldRequired,
          DateFieldRestrictPastDate,
          DateFieldRestrictFutureDate,
          DateFieldIsBefore,
          DateFieldIsAfter,
        );
        break;
      case 'radio':
        fieldComponents.push(FieldRequired, RadioFieldEquals);
        break;
      case 'checkbox':
        fieldComponents.push(
          CheckboxFieldRequired,
          CheckboxFieldMinCount,
          CheckboxFieldMaxCount,
          CheckboxFieldContains,
        );
        break;
      case 'dropdown':
        fieldComponents.push(
          CheckboxFieldRequired,
          CheckboxFieldMinCount,
          CheckboxFieldMaxCount,
          DropdownFieldContains,
        );
        break;
      case 'file':
        fieldComponents.push(
          FileUploadFieldRequired,
          FileUploadFieldMinCount,
          FileUploadFieldMaxCount,
          FileUploadFieldMaxFileSize,
        );
        break;
      default:
        break;
    }

    return fieldComponents;
  }, [selectedField]);

  const renderFields = () => {
    if (fields.length > 6) {
      return (
        <div className="space-y-3">
          {fields.slice(0, 4).map((Field, idx) => (
            <Field key={idx} />
          ))}
          {showMore && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              {fields.slice(4).map((Field, idx) => <Field key={idx} />)}
            </div>
          )}
          <div className="flex justify-center pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMore(!showMore)}
              className="bg-zinc-700/50 border-zinc-600/50 hover:bg-zinc-600/50 hover:border-zinc-500/50 text-zinc-200 hover:text-white transition-all duration-200"
            >
              {showMore ? 'Show less' : `Show ${fields.length - 4} more`}
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {fields.map((Field, idx) => <Field key={idx} />)}
      </div>
    );
  };

  if (!selectedField) return null;

  return (
    <FormConfigSection
      subtitle="Configure validation rules to ensure data quality"
      icon={<CheckCircle className="w-4 h-4 text-emerald-400" />}
      title="Field Validation"
      key={selectedField?.id}
    >
      {renderFields()}
    </FormConfigSection>
  );
};

export default memo(FieldValidationSection);
