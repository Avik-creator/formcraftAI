import Overview from '@/components/dashboard/overview/Overview';

export const revalidate = 20;

export default async function OverviewPage() {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <Overview />
      </div>
    </div>
  );
}
