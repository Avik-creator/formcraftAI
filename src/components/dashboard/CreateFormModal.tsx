import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateFormMutation } from '@/data-fetching/client/form';
import { useFormActionProperty } from '@/zustand/store';
import { LayoutTemplate, PuzzleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { NewFeatureBadge } from '@/components/common/FeatureReleaseBadge';
import useFeatureAnnouncer from '@/hooks/useFeatureAnnouncer';
import BuildWithAI from './BuildWithAI';
import { useEffect, useState } from 'react';

interface CreateFormModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const CreateFormModal = ({ open, setOpen, className }: CreateFormModalProps) => {
  const router = useRouter();
  const setFormConfig = useFormActionProperty('setFormConfig');
  const hasAnnouncedNewFormFeature = useFeatureAnnouncer('new-form-generation-capability');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mutate = useCreateFormMutation({
    onMutate: () => {
      setOpen(false);
      const toastId = toast.loading('Creating form...');
      return toastId as string;
    },
    onSuccess: (data, context) => {
      toast.dismiss(context as string);
      if (data?.id) {
        setFormConfig(data);
        toast.success('Form created successfully!', {
          style: { background: '#000', color: '#fff' },
        });
        setTimeout(() => router.push('/builder'), 1000);
      }
    },
  });

  const handleWithTemplateOption = () => {
    setOpen(false);
    router.push('/dashboard/templates');
  };

  const handleBuildFromScratch = () => {
    mutate(void null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <div className="flex gap-2 items-center">
          {mounted && !hasAnnouncedNewFormFeature && <NewFeatureBadge />}
          <Button variant="default" size={'sm'}>
            Create a new form
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-xl max-w-[95dvw] sm:max-w-[520px] p-5 backdrop-blur-sm bg-zinc-950/90 border border-zinc-800/60 shadow-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base font-semibold text-white">Create a form</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <BuildWithAI />
          <Button className="w-full justify-start gap-2" onClick={handleBuildFromScratch}>
            <PuzzleIcon className="w-4 h-4" /> Build from scratch
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-2" onClick={handleWithTemplateOption}>
            <LayoutTemplate className="w-4 h-4" /> Start with a template
          </Button>
        </div>

        <DialogFooter className="pt-3">
          <DialogClose asChild>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormModal;
