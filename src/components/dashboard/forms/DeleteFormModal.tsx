import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DeleteFormModal = ({
  label,
  onConfirm,
  open,
  setOpen,
  showTrigger = true,
}: {
  label: string;
  onConfirm: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showTrigger?: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Form</Button>
        </DialogTrigger>
      )}
      <DialogContent className="rounded-xl max-w-[95dvw] sm:max-w-[480px] backdrop-blur-sm bg-zinc-950/90 border border-zinc-800/60 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-base font-semibold">{label}</DialogTitle>
          <DialogDescription className="text-sm text-zinc-400">
            Deleting a form will also delete its associated data. This action cannot be undone. Are you sure you want to
            delete this form?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button variant="ghost" className='text-white'>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFormModal;
