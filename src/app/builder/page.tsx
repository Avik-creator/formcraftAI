import TopHeader from '@/components/common/TopHeader';
import SectionDisplay from '@/components/builder/SectionDisplay';
import { FormSectionDisplayProvider } from '@/hooks/useFormSectionDisplayProvider';

export const revalidate = Infinity;

const FormBuilderPage = async () => {
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
