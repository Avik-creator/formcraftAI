import CustomTooltip from '@/components/ui/custom-tooltip';
import { CirclePlus } from 'lucide-react';
import { SectionField } from './config';

interface FieldCardProps {
  icon: React.ReactNode | React.JSX.Element;
  name: string;
  description: string;
  type: string;
  featureTag?: string;
  onClick: (field: Partial<SectionField>) => void;
}

const FieldCard = ({ icon, name, description, type, onClick }: FieldCardProps) => {

  return (
    <div
      className="hover:transform-gpu hover:-translate-y-1 cursor-pointer flex flex-col gap-3 p-4 border border-zinc-800/50 rounded-lg hover:border-zinc-700/50 hover:bg-zinc-900/30 transition-all duration-300 mt-2 backdrop-blur-sm"
      onClick={() => onClick({ name, description, type })}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-semibold text-sm bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300">{name}</h3>
        </div>
        <CustomTooltip tooltip={`Click to Add a ${name}`} triggerClassName="ml-auto inline">
          <CirclePlus className=" w-4 h-4 text-zinc-400 hover:text-white transition-colors inline ml-auto" />
        </CustomTooltip>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default FieldCard;
