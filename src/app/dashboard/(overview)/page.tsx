import Overview from '@/components/dashboard/overview/Overview';

export const revalidate = 20;

export default async function OverviewPage() {
  return <Overview />;
}
