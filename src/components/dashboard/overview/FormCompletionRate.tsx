import { BarChartIcon } from 'lucide-react';
import InfoCard from '@/components/dashboard/overview/InfoCard';
import FormCompletionRateBarChart from '@/components/dashboard/overview/FormCompletionRateBarChart';
import { getCompletionRateByFormAction } from '@/backend/actions/analytics';

const FormCompletionRate = async () => {
  const res = await getCompletionRateByFormAction();

  if (!res?.data) return null;

  return (
    <InfoCard
      className="col-span-full md:col-span-6 max-h-[400px] border border-zinc-700"
      title={'Completion Rate By Form'}
      icon={BarChartIcon}
      contentClassName="p-0"
      description={'Showing data for all time.'}
      renderData={() => <FormCompletionRateBarChart chartData={res?.data} />}
    />
  );
};

export default FormCompletionRate;
