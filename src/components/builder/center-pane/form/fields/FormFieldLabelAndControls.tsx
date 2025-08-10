import { toast } from 'sonner';
import React, { LegacyRef, useCallback, useMemo } from 'react';
import { Grip, Settings } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import KebabMenu from '@/components/ui/kebabMenu';

import { useFormActionProperty, useSelectedFieldStore } from '@/zustand/store';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplayProvider';

import FormLabel from './FormLabel';
import CustomTooltip from '@/components/ui/custom-tooltip';

import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';
  import DeleteFieldModal from '@/components/builder/DeleteFieldModal';
import EditableText from '@/components/common/EditableText';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface FormFieldLabelAndControlsProps {
  field: FormFieldProps['field'];
  listeners?: ReturnType<typeof useSortable>['listeners'];
  attributes?: ReturnType<typeof useSortable>['attributes'];
  setActivatorNodeRef?: ReturnType<typeof useSortable>['setActivatorNodeRef'];
  isDragging?: boolean;
}

const FormFieldLabelAndControls = ({
  field,
  listeners,
  attributes,
  setActivatorNodeRef,
  isDragging,
}: FormFieldLabelAndControlsProps) => {
  const setSelectedField = useSelectedFieldStore((s) => s.setSelectedField);
  const duplicateField = useFormActionProperty('duplicateField');
  const deleteField = useFormActionProperty('deleteField');
  const { setSection, FORMSECTIONS } = useFormSectionDisplay();
  const selectedField = useSelectedFieldStore((s) => s.selectedField);
  const updateFormField = useFormActionProperty('updateFormField');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const handleFieldSettingsClick = () => {
    setSelectedField(field);
    setSection(FORMSECTIONS.Settings);
  };

  const handleFieldDuplicateClick = useCallback(() => {
    duplicateField(field?.id);
    toast.info('Field duplicated successfully', {
      description: 'Go to Settings to configure the field.',
    });
  }, [duplicateField, field?.id]);

  const handleFieldDelete = () => {
    deleteField(field?.id);
    toast.info('Field deleted successfully');
  };

  const menuItems = useMemo(() => {
    return [
      {
        label: 'Duplicate Field',
        onClick: handleFieldDuplicateClick,
        seperator: true,
      },
      {
        label: 'Delete Field',
        onClick: () => setIsDeleteModalOpen(true),
        className: 'text-red-500',
        seperator: false,
      },
    ];
  }, [handleFieldDuplicateClick]);

  const handleFormLabelChange = (value: string) => {
    updateFormField(field?.id, {
      id: field?.id,
      label: value,
    });
    if (selectedField?.id === field?.id) {
      setSelectedField({
        ...selectedField,
        label: value,
      });
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-zinc-800/20 backdrop-blur-sm border border-zinc-700/30 rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0" />
        <span className="text-sm font-medium text-white">{field.label}</span>
        {field.validation?.custom?.required?.value && field.validation?.custom?.required?.value !== 'false' && field.validation?.custom?.required?.value !== false && (
          <span className="text-red-400 text-xs font-medium">*</span>
        )}
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          onClick={handleFieldSettingsClick}
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          onClick={handleFieldDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FormFieldLabelAndControls;
