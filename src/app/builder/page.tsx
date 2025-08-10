import TopHeader from '@/components/common/TopHeader';
import SectionDisplay from '@/components/builder/SectionDisplay';
import { FormSectionDisplayProvider } from '@/hooks/useFormSectionDisplayProvider';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getBillingInfoAction } from '@/backend/actions/billing';

export const revalidate = 0;

const FormBuilderPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in?redirect_url=/builder');
  }

  const billingRes = await getBillingInfoAction();
  const billingInfo = billingRes?.success ? billingRes.data : undefined;
  const maxForms = billingInfo?.limits?.maxForms;
  const currentForms = billingInfo?.usage?.formsCount ?? 0;
  const atFormLimit = Boolean(!billingInfo?.isPro && typeof maxForms === 'number' && currentForms >= maxForms);


  if (atFormLimit) {
    redirect('/pricing');
  }


  return (
    <FormSectionDisplayProvider>
      <>
        <TopHeader />
        <SectionDisplay />
      </>
    </FormSectionDisplayProvider>
  );
};

export default FormBuilderPage;
