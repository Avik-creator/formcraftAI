import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { GenericProps } from '@/types/common';

interface FormFieldProps extends GenericProps {
  label: string;
  id: string;
  required?: boolean;
  renderLabelExtraContent?: () => React.ReactNode;
  helperText?: string;
}

const FormField = ({
  label,
  id,
  children,
  className,
  required,
  helperText,
  renderLabelExtraContent,
}: FormFieldProps) => {
  const classes = cn('flex flex-col gap-2 my-2', className);
  return (
    <Label className={classes} htmlFor={id}>
      <span
        className={cn(
          'font-semibold text-[14px] sm:text-[15px] flex items-center tracking-tight text-zinc-200',
          helperText ? '' : 'mb-1',
        )}
      >
        {label}
        {required && <sup className="top-[-0.1em] ml-[1px] font-bold text-red-500 text-sm">*</sup>}
        {renderLabelExtraContent?.()}
      </span>
      {helperText && <p className="-mt-0.5 text-xs text-zinc-400 font-medium mb-1">{helperText}</p>}
      {children}
    </Label>
  );
};

export default FormField;
