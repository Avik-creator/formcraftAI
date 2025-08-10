import React from 'react';
import { Loader2 } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useFormActionProperty } from '@/zustand/store';
import { useRouter } from 'next/navigation';
import AnimatedPromptTextarea from './AnimatedTextArea';
import { useBillingInfoQuery, useEnsureCanCreateForm } from '@/data-fetching/client/billing';

const useGeminiChat = () => {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch('/api/form/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (data?.content) {
        return data?.content;
      } else {
        throw new Error('Something went wrong');
      }
    },
  });
};

const examplePrompts = [
  'User registration form with email and password fields',
  'Product review form with rating and comment fields',
  'Contact form with name, email, and message fields',
  'Job application form with name, email, and resume fields',
  'Sales lead capture form with name, email, and company fields',
];

const BuildWithAI = () => {
  const { mutateAsync, isPending } = useGeminiChat();
  const [value, setValue] = React.useState('');
  const setFormConfig = useFormActionProperty('setFormConfig');
  const router = useRouter();
  const { data: billingInfo } = useBillingInfoQuery();
  const { mutateAsync: ensureCanCreate } = useEnsureCanCreateForm();

  const atFormLimit = Boolean(
    !billingInfo?.isPro &&
      (billingInfo?.usage?.formsCount ?? 0) >= (billingInfo?.limits?.maxForms ?? 0),
  );

  const handlePromptSubmit = async () => {
    const prompt = value;

    if (!prompt?.length) return toast.error('Please describe what you need');

    try {
      await ensureCanCreate();
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Upgrade to Pro for unlimited forms.';
      toast.error('Cannot generate form', { description });
      return;
    }

    mutateAsync(prompt, {
      onSuccess: (data) => {
        const response = data;

        if (response) {
          setFormConfig(response);
          toast.success('Form created successfully!', {
            style: { background: '#000', color: '#fff' },
          });
          setTimeout(() => router.push('/builder'), 1000);
        }
      },
      onError: () => {
        toast.error('Something went wrong');
      },
    });
  };

  return (
    <div className="w-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 sm:p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">Build with AI</h3>
        <p className="text-xs text-zinc-400">Describe what you need and we’ll generate a form for you.</p>
      </div>


      <FormField label="Description" id="ai-description" className="text-sm">
        <AnimatedPromptTextarea placeholders={examplePrompts} onValueChange={setValue} />
        <small className="text-zinc-500 text-xs">Tip: mention fields, validation rules, and layout preferences.</small>
      </FormField>

      <Button
        variant={'default'}
        className="flex items-center mt-4 w-full"
        onClick={handlePromptSubmit}
        disabled={isPending || atFormLimit}
      >
        {isPending ? (
          <>
            AI is working... <Loader2 className="ml-2 w-4 h-4 animate-spin" />
          </>
        ) : (
          <>Generate with AI</>
        )}
      </Button>
    </div>
  );
};

export default BuildWithAI;
