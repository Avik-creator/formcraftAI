import { Grip, Settings } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LegacyRef } from 'react';
import { FieldEntity } from '@/types/index';
import { cn } from '@/lib/utils';
import CustomTooltip from '@/components/ui/custom-tooltip';
import { Button } from '@/components/ui/button';

type DraggableFieldProps = {
  id: string;
  label: string;
  activeField?: FieldEntity | null;
  isOverlay?: boolean;
  isDraggingOver?: boolean;
  draggedOverPosition?: 'top' | 'bottom';
  onFieldSettingsClick: (id: string) => void;
};

const DraggableField = ({ label, id, isOverlay, draggedOverPosition, onFieldSettingsClick }: DraggableFieldProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: 'form_field',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const classes = cn(
    'group relative flex items-center justify-between gap-3 p-3 rounded-lg border transition-all duration-200',
    'bg-zinc-800/30 backdrop-blur-sm border-zinc-700/50',
    'hover:bg-zinc-700/30 hover:border-zinc-600/50',
    'cursor-grab active:cursor-grabbing',
    {
      'opacity-50': isDragging,
      'border-blue-500/50 bg-blue-500/10': isOverlay,
      'border-green-500/50 bg-green-500/10': draggedOverPosition === 'top',
      'border-purple-500/50 bg-purple-500/10': draggedOverPosition === 'bottom',
    },
  );

  return (
    <div ref={setNodeRef} style={style} className={classes}>
      <div className="flex items-center gap-3 flex-1" {...attributes} {...listeners}>
        <div className="w-2 h-2 bg-zinc-500 rounded-full flex-shrink-0" />
        <span className="text-sm font-medium text-white truncate">{label}</span>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          onClick={() => onFieldSettingsClick(id)}
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default DraggableField;
