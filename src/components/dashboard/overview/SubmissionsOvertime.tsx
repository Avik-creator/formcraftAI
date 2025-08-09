import { LineChartIcon } from 'lucide-react';
import InfoCard from './InfoCard';
import { SubmissionsOvertimeLineChart } from './SubmissionsOvertimeLineChart';
import { getFormSubmissionRateOverTimeAction } from '@/backend/actions/analytics';

const SubmissionsOvertime = async () => {
  const res = await getFormSubmissionRateOverTimeAction();

  

  return (
    <InfoCard
      className="col-span-full md:[grid-column:7/14] max-h-[420px]"
      title={'Submissions Over Time'}
      icon={LineChartIcon}
      contentClassName="p-3"
      description={'Monthly submissions (past 12 months)'}
      renderData={() => <SubmissionsOvertimeLineChart chartData={res?.data || []} />}
    />
  );
};

export default SubmissionsOvertime;
