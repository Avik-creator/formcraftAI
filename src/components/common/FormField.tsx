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
  const classes = cn('flex flex-col gap-2.5 p-3 bg-zinc-800/20 border border-zinc-700/40 rounded-lg hover:border-zinc-600/60 transition-colors', className);
  return (
    <Label className={classes} htmlFor={id}>
      <span
        className={cn(
          'font-semibold text-sm flex items-center tracking-tight text-zinc-100',
          helperText ? '' : 'mb-0.5',
        )}
      >
        {label}
        {required && <sup className="top-[-0.1em] ml-1 font-bold text-red-400 text-xs">*</sup>}
        {renderLabelExtraContent?.()}
      </span>
      {helperText && (
        <p className="text-xs text-zinc-400 font-medium -mt-1 mb-1 leading-relaxed">
          {helperText}
        </p>
      )}
      {children}
    </Label>
  );
};

export default FormField;
