'use client';

import { cn } from '@/lib/utils';
import type { CustomValidationType, FieldType, FormConfig } from '@/types/index';
import React, { useCallback, useEffect, useMemo } from 'react';
import FormContent from './FormContent';
import FormHeader from './FormHeader';
import { toast } from 'sonner';
import { FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import useFieldConditionalLogicCheckGeneric from '@/hooks/useFieldConditionalLogicCheck';
import useFormSubmissionId from '@/hooks/useFormSubmissionId';
import { useCreateFormSubmissionMutation } from '@/data-fetching/client/formSubmission';
import { useBillingInfoQuery } from '@/data-fetching/client/billing';

import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { useCreateActivityMutation } from '@/data-fetching/client/activity';
import useDynamicFontLoader from '@/hooks/useDynamicFontLoader';

export interface FormProps {
  formConfig: FormConfig;
}

type FormValueByPageMap = Record<string, Record<string, unknown>>;

const classes = cn(
  'flex relative z-20 flex-col gap-9 px-4 py-6 md:px-8 md:py-7 mx-auto my-auto',
  'w-[95%] md:w-[min(80%,890px)] transition-all duration-300',
  'border border-zinc-200/10 rounded-2xl backdrop-blur-sm',
  'hover:border-zinc-200/20 focus-within:border-zinc-200/20',
  'shadow-[0_0_30px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_35px_15px_rgba(0,0,0,0.35)]',
);

const Form = ({ formConfig: config }: FormProps) => {
  const [formValuesByPage, setFormValuesByPage] = React.useState<FormValueByPageMap>({});
  const [formConfig, setFormConfig] = React.useState(config);
  const [activePageId, setActivePageId] = React.useState(formConfig?.pages?.[0]);
  const [fieldEntities, setFieldEntities] = React.useState(config?.fieldEntities);

  const fontFamily = config?.styles?.fontFamily || "Poppins";

  const [isSubmissionSuccess, setIsSubmissionSuccess] = React.useState(false);

  const [fieldVisibilityMap, setFieldVisibiltyMap] = React.useState<Record<string, boolean>>({});
  const allFields = useMemo(() => Object.keys(formConfig?.fieldEntities || {}), [formConfig?.fieldEntities]);

  const formSubmissionId = useFormSubmissionId();

  const { mutateAsync: createFormSubmission, isPending: isSubmitting } = useCreateFormSubmissionMutation({
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Handle specific error cases
      if (errorMessage.includes('already submitted')) {
        toast.error('Form Already Submitted', {
          description: 'You have already submitted this form',
          duration: 4000,
        });
      } else if (errorMessage.includes('not published')) {
        toast.error('Form Not Available', {
          description: 'This form is not currently accepting submissions',
          duration: 4000,
        });
      } else if (errorMessage.includes('Monthly submission limit')) {
        toast.error('Submission Limit Reached', {
          description: 'The form owner has reached the monthly submission limit on the free plan. Please try again later or contact the owner.',
          duration: 5000,
        });
      } else if (errorMessage.includes('Form not found')) {
        toast.error('Form Not Found', {
          description: 'The form you are trying to submit does not exist',
          duration: 4000,
        });
      } else {
        toast.error('Submission Failed', {
          description: errorMessage,
          duration: 4000,
        });
      }
    },
  });

  const { mutateAsync: createActivity } = useCreateActivityMutation({});

  const router = useRouter();

  const currentPageNumber = useMemo(
    () => formConfig?.pages?.indexOf(activePageId) + 1,
    [activePageId, formConfig?.pages],
  );

  const { data: billingInfo } = useBillingInfoQuery();

  const handleFormSubmit = (data: FieldValues) => {
    const updatedState = { ...formValuesByPage, [activePageId]: data };

    const isLastPage = activePageId === formConfig?.pages?.[formConfig?.pages?.length - 1];

    setFormValuesByPage(updatedState);

    const formValueRecordsByName = Object.values(formValuesByPage);
    const values = formValueRecordsByName?.reduce((acc, curr) => {
      acc = { ...acc, ...curr };
      return acc;
    }, {});

    const newFormSubmission = {
      formId: config?.id,
      submissionType: 'anonymous',
      submittedBy: formSubmissionId || '',
      data: values,
      status: isLastPage ? 'completed' : 'pending',
    };

    if (isLastPage) {
      return createFormSubmission(newFormSubmission, {
        onSettled: (data) => {
          if (data?._id) {
            setIsSubmissionSuccess(true);
            createActivity({
              type: 'submission',
              formId: config?.id,
              formName: config?.name,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        },
      });
    }
    createFormSubmission(newFormSubmission);
  };

  const handleActivePageIdChange = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  const handleFieldVisibilityChange = useCallback((fieldId: string, isVisible: boolean) => {
    setFieldVisibiltyMap((prev) => ({ ...prev, [fieldId]: isVisible }));
  }, []);

  useEffect(() => {
    const fieldEntities = config?.fieldEntities;

    console.log(fieldEntities);

    const pages = config?.pages;

    const getFieldUpdateWithCorrectValidationType = (
      fieldId: string,
      fieldType: FieldType,
      validationType: CustomValidationType,
      validatorKey: string,
      valueToCheck?: string | boolean,
    ) => {
      const field = fieldEntities?.[fieldId];
      const fieldValidations =
        CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS] ?? CUSTOM_FIELD_VALIDATIONS.text;

      const validationMap = fieldValidations?.[validationType as keyof typeof fieldValidations];
      const customValidation = field?.validation?.custom?.[validatorKey];

      let validationFn: ((value: string) => boolean) | null = null;
      let args: unknown[] = [];

      if (validationType === 'withValue') {
        args = [customValidation?.value, customValidation?.message];
      }

      if (validationType === 'binary') {
        args = [customValidation?.message];

        // If the validation value is explicitly false (not required), return a function that always passes
        if (valueToCheck === 'false' || valueToCheck === false) {
          return {
            [validatorKey]: () => true,
          };
        }

        // For non-required validators, only validate if field has a value and field is not explicitly optional
        if (validatorKey !== 'required') {
          const isFieldRequired = field?.validation?.custom?.required?.value !== 'false' && field?.validation?.custom?.required?.value !== false;
          if (!isFieldRequired) {
            const validationFunctor = validationMap?.[validatorKey as keyof typeof validationMap] as (
              ...args: unknown[]
            ) => (value: string) => boolean;
            const actualValidator = validationFunctor?.(...args);
            return {
              [validatorKey]: (value: string) => !value || value.trim() === '' ? true : actualValidator?.(value) || true,
            };
          }
        }
      }

      const validationFunctor = validationMap?.[validatorKey as keyof typeof validationMap] as (
        ...args: unknown[]
      ) => (value: string) => boolean;

      validationFn = validationFunctor?.(...args);

      return {
        [validatorKey]: validationFn ?? (() => true),
      };
    };

    pages?.forEach((pageId) => {
      const fields = config?.pageEntities?.[pageId]?.fields;

      fields?.forEach((fieldId) => {
        const field = fieldEntities?.[fieldId];
        const fieldUpdates = {
          validation: {
            ...field?.validation,
            validate: {
              ...field?.validation?.validate,
            },
          },
        };

        Object.entries(field?.validation?.custom || {})?.forEach(([key, value]) => {
          const fieldType = field?.type as FieldType;
          const fieldValueToValidate = value?.value;

          fieldUpdates.validation.validate = {
            ...fieldUpdates.validation.validate,
            ...getFieldUpdateWithCorrectValidationType(fieldId, fieldType, value?.type, key, fieldValueToValidate),
          };
        });

        setFormConfig((prev) => {
          return {
            ...prev,
            fieldEntities: {
              ...prev?.fieldEntities,
              [fieldId]: {
                ...prev?.fieldEntities?.[fieldId],
                ...fieldUpdates,
              },
            },
          };
        });
      });
    });
  }, [config]);

  useFieldConditionalLogicCheckGeneric(allFields!, fieldEntities, handleFieldVisibilityChange);
  useDynamicFontLoader(fontFamily);

  if (isSubmissionSuccess) {
    return (
      <section
        className={cn(
          'm-auto relative z-20 text-center',
          'p-8 sm:p-10 rounded-2xl backdrop-blur-sm',
          'border border-zinc-200/10 shadow-[0_0_30px_10px_rgba(0,0,0,0.3)]',
          'animate-fadeIn'
        )}
        style={{ 
          backgroundColor: formConfig?.theme?.properties?.formBackgroundColor || '#000000',
          fontFamily 
        }}
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-green-500 animate-scaleIn" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        
        <h3 className="font-bold text-white text-2xl sm:text-4xl mb-3 animate-slideUp" style={{ animationDelay: '100ms' }}>
          Thank you!
        </h3>
        <p className="text-white/80 text-base sm:text-xl mb-8 animate-slideUp" style={{ animationDelay: '200ms' }}>
          Your form has been successfully submitted.
        </p>

        <Button 
          variant="default"
          onClick={() => router.replace('/')}
          className="animate-slideUp px-6 py-2 text-base transition-transform hover:scale-105"
          style={{ animationDelay: '300ms' }}
        >
          <svg 
            className="w-4 h-4 mr-2 -ml-1" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
          Return Home
        </Button>
      </section>
    );
  }

  return (
    <section
      className={classes}
      style={{
        backgroundColor: formConfig?.theme?.properties?.formBackgroundColor || '#000000',
        boxShadow: '1px 1px 20px 4px #130d18',
        borderRadius: 20,
        fontFamily,
        '--primary-text-color': formConfig?.theme?.properties?.primaryTextColor || '#ffffff',
        '--secondary-text-color': formConfig?.theme?.properties?.secondaryTextColor || '#d1c6d1',
        color: formConfig?.theme?.properties?.primaryTextColor || '#ffffff'
      } as React.CSSProperties}
    >
      {!billingInfo?.isPro && (
        <div className="flex items-center justify-center gap-2 -mt-3 mb-3 text-xs text-zinc-400/80 bg-zinc-800/30 py-2 px-3 rounded-full backdrop-blur-sm border border-zinc-700/20 hover:bg-zinc-800/40 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Free plan: up to 100 submissions/month
          <a 
            href="/pricing" 
            className="text-primary hover:text-primary/80 font-medium underline-offset-2 hover:underline transition-colors duration-200"
          >
            Upgrade to Pro
          </a>
        </div>
      )}
      <FormHeader formConfig={formConfig} currentPageNumber={currentPageNumber} />

      <FormContent
        key={activePageId} // should destroy and re-render when activePageId changes
        formConfig={formConfig}
        formValuesByPageMap={formValuesByPage}
        fieldVisibilityMap={fieldVisibilityMap}
        activePageId={activePageId}
        onActivePageIdChange={handleActivePageIdChange}
        onFormSubmit={handleFormSubmit}
        onPageFieldChange={setFieldEntities}
        onFormValueChange={setFormValuesByPage}
        isFormSubmitting={isSubmitting}
      />

      {/* <FormFooter /> */}
    </section>
  );
};

export default Form;
