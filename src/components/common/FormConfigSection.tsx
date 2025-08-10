import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FormSectionProps extends GenericProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const FormConfigSection = ({ className, icon, subtitle, title, children }: FormSectionProps) => {
  const classes = cn('flex flex-col gap-4 pt-2', className);

  return (
    <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 mb-4 shadow-lg backdrop-blur-sm">
      <Accordion type="single" collapsible defaultValue={title}>
        <AccordionItem value={title} className="border-none">
          <AccordionTrigger className="hover:no-underline py-2 px-0">
            <div className="flex flex-col items-start w-full">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                  {icon}
                </div>
                <h3 className="font-bold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-300">
                  {title}
                </h3>
              </div>
              {subtitle && (
                <p className="text-xs font-medium text-zinc-400 mt-1 ml-10 text-left">
                  {subtitle}
                </p>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className={classes}>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FormConfigSection;
