'use client';

import React from 'react';

import { Button } from '../ui/button';
import { useFormActionProperty, useFormConfigStore, useFormProperty } from '@/zustand/store';
import { useUser } from '@clerk/nextjs';
import { Check, Copy, Lock, Share, X } from 'lucide-react';
import { usePublishFormMutation } from '@/data-fetching/client/form';
import { generateId } from '@/lib/utils';
import { getAppOriginUrl } from '@/utils/functions';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import LeftPaneBreadCrumbs from '@/components/builder/left-pane/BreadCrumbs';
import useCopyInfo from '@/hooks/useCopyInfo';
import CustomTooltip from '@/components/ui/custom-tooltip';
import { useCreateActivityMutation } from '@/data-fetching/client/activity';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/builder', label: 'Builder' },
];

const TopHeader = () => {
  const { user } = useUser();
  const setFormConfig = useFormActionProperty('setFormConfig');

  const formLink = `${getAppOriginUrl()}/form/${useFormProperty('id')}`;
  const { handleCopy, hasCopied } = useCopyInfo();

  const [isPublishedFormModalOpen, setIsPublishedFormModalOpen] = React.useState(false);

  const formConfig = useFormConfigStore((state) => state.formConfig);
  const createdBy = formConfig?.createdBy;
  const formId = formConfig?.id;

  const isTemplate = createdBy === 'SYSTEM';

  const { mutateAsync, isPending } = usePublishFormMutation();

  const { mutateAsync: createActivity } = useCreateActivityMutation({});
  const handleUseTemplate = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = formConfig;

    setFormConfig({
      ...rest,
      id: generateId(),
      createdBy: user?.id || 'SYSTEM',
      status: 'draft',
    });
  };

  const handleFormPublishUnPublish = async (id: string) => {
    createActivity({
      formId: id,
      formName: formConfig?.name,
      type: formConfig?.status === 'published' ? 'unpublished' : 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (formConfig?.status === 'published') {
      setFormConfig({
        ...formConfig,
        status: 'draft',
      });

      toast.success('Form marked as draft!', {
        description: "You can publish it again when you're ready.",
      });

      return;
    }

    await mutateAsync(
      { id },
      {
        onSettled(data, error) {
          if (error) {
            toast.error('Something went wrong, please try again.');
          }
          if (data) {
            setIsPublishedFormModalOpen(true);
            setFormConfig({
              ...formConfig,
              status: data?.status,
            });
          }
        },
      },
    );
  };

  return (
    <>
      <header className="w-full z-[9999999] px-4 pt-4 bg-[#0c0a0a]">
        <div className="flex justify-between items-center gap-2">
          <LeftPaneBreadCrumbs links={links} />
          {isTemplate ? (
            <Button size="sm" variant="default" onClick={handleUseTemplate}>
              Use template
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {formConfig?.status === 'published' && (
                <CustomTooltip tooltip={'Copy form link'}>
                  <Button size="icon" variant="secondary" type="button" onClick={() => handleCopy(formLink)}>
                    {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CustomTooltip>
              )}
              <Button
                size="sm"
                variant="default"
                type="button"
                className="flex items-center"
                onClick={() => handleFormPublishUnPublish(formId as string)}
                disabled={isPending}
              >
                {formConfig?.status === 'draft' ? (
                  <Share className="mr-2 h-4 w-4" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {formConfig?.status === 'draft' ? 'Publish' : 'Mark as draft'}
              </Button>
            </div>
          )}
        </div>
      </header>

      <PublishedFormModal open={isPublishedFormModalOpen} setOpen={setIsPublishedFormModalOpen} />
    </>
  );
};

export default TopHeader;

const PublishedFormModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const formLink = `${getAppOriginUrl()}/form/${useFormProperty("id")}`
  const { handleCopy, hasCopied } = useCopyInfo()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black/60 backdrop-blur-xl border border-zinc-700/60 rounded-xl shadow-2xl ring-1 ring-white/10 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">
            Form published successfully!
            <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all duration-200 rounded-lg"
          onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          </DialogTitle>
          <DialogDescription className="text-zinc-300/90">You can now start accepting submissions.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              className="flex-1 bg-zinc-900/80 border-zinc-600/60 text-white placeholder:text-zinc-400 ring-1 ring-white/5 focus:ring-white/20 focus:border-zinc-500 transition-all duration-200"
              readOnly
              value={formLink}
            />
            <Button
              variant={"default"}
              size={"sm"}
              className="shrink-0 bg-white text-black hover:bg-zinc-200 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              onClick={() => handleCopy(formLink, () => toast.error("Failed to copy"))}
            >
              {hasCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {hasCopied ? "Copied" : "Copy link"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
