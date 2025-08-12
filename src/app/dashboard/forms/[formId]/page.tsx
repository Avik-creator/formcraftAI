'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import CustomTooltip from '@/components/ui/custom-tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetFormSubmissionQuery } from '@/data-fetching/client/formSubmission';
import { useBillingInfoQuery } from '@/data-fetching/client/billing';
import { cn } from '@/lib/utils';
import { FieldEntity } from '@/types/index';
import { ReloadIcon } from '@radix-ui/react-icons';
import { formatDate } from 'date-fns';
import { SlashIcon, Download, Eye } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';

const convertToCSV = (
  submissions: any[],
  fieldEntities: Record<string, FieldEntity>,
  fieldIdsInOrder: string[]
) => {
  // Create headers
  const headers = ['Submission Date', ...fieldIdsInOrder.map(id => fieldEntities[id]?.label)];
  
  // Create rows
  const rows = submissions.map(submission => {
    const row = [formatDate(submission?.createdAt, 'dd MMM, yyyy')];
    
    fieldIdsInOrder.forEach(fieldId => {
      const field = fieldEntities[fieldId];
      const value = (submission?.data as Record<string, unknown>)[field?.name as string];
      
      // Format value based on field type
      let formattedValue = '';
      switch (field?.type) {
        case 'date':
          formattedValue = value ? formatDate(value as string, 'dd MMM, yyyy') : '';
          break;
        case 'checkbox':
        case 'dropdown':
          formattedValue = Array.isArray(value) ? value.join(', ') : String(value || '');
          break;
        // Removed file case
        default:
          formattedValue = String(value || '');
      }
      row.push(formattedValue);
    });
    
    return row;
  });
  
  // Combine headers and rows
  return [headers, ...rows]
    .map(row => 
      row.map(str => {
        // Escape quotes and wrap in quotes if contains comma or newline
        const escaped = String(str).replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped;
      }).join(',')
    )
    .join('\n');
};

const downloadCSV = (csvContent: string, filename: string) => {
  // Add BOM to ensure Excel recognizes UTF-8
  const BOM = '\ufeff';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const FieldRenderer = ({ field, value }: { field: FieldEntity; value: unknown }) => {
  switch (field?.type) {
    case 'date':
      return (
        <span className="text-sm text-zinc-300 font-medium">
          {formatDate(value as string, 'dd MMM, yyyy')}
        </span>
      );
    case 'checkbox':
    case 'dropdown':
      return (
        <div className="flex flex-wrap gap-1">
          {(value as unknown as string[])?.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-300 border border-zinc-700/50"
            >
              {item}
            </span>
          ))}
        </div>
      );

    case 'textarea':
      return (
        <CustomTooltip tooltip={value as string}>
          <span className="text-sm text-zinc-300 max-w-[200px] truncate block">
            {(value as string)?.slice(0, 50)}
            {(value as string)?.length > 50 && '...'}
          </span>
        </CustomTooltip>
      );

    // Removed file upload case

    default:
      return <span className="text-sm text-zinc-300">{value as string}</span>;
  }
};

export default function TableDemo() {
  const params = useParams();
  const formId = params.formId as string;

  const { data, isLoading, isFetching, refetch } = useGetFormSubmissionQuery(formId);
  const { data: billingInfo } = useBillingInfoQuery();

  const fieldEntites = data?.formConfig?.fieldEntities;
  const fieldIdsInOrder = useMemo(
    () => data?.formConfig?.pages?.flatMap((p) => data?.formConfig?.pageEntities[p]?.fields),
    [data],
  );

  const renderTableColumnHeaders = () => {
    return (
      <>
        <TableHead className="w-16 text-white font-semibold text-sm">#</TableHead>
        <TableHead className="min-w-[180px] text-white font-semibold text-sm">Date of Submission</TableHead>
        {fieldIdsInOrder?.map((fieldId) => {
          const field = fieldEntites?.[fieldId];
          return (
            <TableHead key={fieldId} className="min-w-[200px] text-white font-semibold text-sm">
              {field?.label}
            </TableHead>
          );
        })}
      </>
    );
  };

  const submissions = data?.submissions;

  const renderTableRows = () => {
    return submissions?.map((submission, index) => {
      return (
        <TableRow key={`${submission?.createdAt?.toString()}-${index}`}>
          <TableCell className="font-medium text-zinc-400">{index + 1}</TableCell>
          <TableCell>
            <span className="text-sm text-zinc-300 font-medium">
              {formatDate(submission?.createdAt, 'dd MMM, yyyy')}
            </span>
          </TableCell>
          {fieldIdsInOrder?.map((fieldId) => {
            const field = fieldEntites?.[fieldId];
            const rec = submission?.data as unknown as Record<string, unknown>;
            return (
              <TableCell key={`${submission?.createdAt?.toString()}-${fieldId}`}>
                <FieldRenderer field={field!} value={rec?.[field?.name as string]} />
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Breadcrumb>
          <BreadcrumbList className="gap-1 sm:gap-1">
            <BreadcrumbItem>
              <Link href="/dashboard/forms" className="text-zinc-400 hover:text-white transition-colors">
                Forms
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="text-zinc-600" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Submissions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <header className="flex justify-between gap-4 flex-wrap items-center">
        {isLoading ? (
          <Skeleton className="h-10 w-[300px]" />
        ) : (
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-2xl sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300 tracking-tight">
              {data?.formConfig?.name}
            </h3>
            <p className="text-zinc-400 text-sm">
              {submissions?.length || 0} submission{submissions?.length !== 1 ? 's' : ''} received
            </p>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Button 
            className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 text-white" 
            disabled={isLoading || isFetching} 
            onClick={() => refetch()}
          >
            <ReloadIcon className={cn('h-4 w-4', isLoading || (isFetching && 'animate-spin'))} />
            <span>Refresh</span>
          </Button>

          <Button
            className="flex items-center gap-2 bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 border border-emerald-700/30"
            disabled={isLoading || !submissions?.length}
            onClick={() => {
              if (!billingInfo?.isPro) {
                toast.error('Pro Plan Required', {
                  description: 'Upgrade to Pro to download submissions as CSV.',
                  action: {
                    label: 'Upgrade',
                    onClick: () => window.location.href = '/pricing'
                  }
                });
                return;
              }
              
              if (!submissions?.length || !fieldEntites || !fieldIdsInOrder?.length) return;
              
              const csvContent = convertToCSV(submissions, fieldEntites, fieldIdsInOrder);
              const filename = `${data?.formConfig?.name || 'form'}-submissions-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
              downloadCSV(csvContent, filename);
            }}
          >
            <Download className="h-4 w-4" />
            <span>{billingInfo?.isPro ? 'Download CSV' : 'Download CSV (Pro)'}</span>
          </Button>
        </div>
      </header>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl overflow-hidden shadow-xl">
          <Table>
            <TableCaption className="sr-only">A list of recent submissions</TableCaption>
            <TableHeader>
              <TableRow className="border-b-2 border-zinc-600/50 bg-zinc-800/40 hover:bg-zinc-800/50 transition-colors">
                {renderTableColumnHeaders()}
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(fieldIdsInOrder?.length || 0) + 2} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-zinc-500" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-zinc-300 mb-1">No submissions yet</h3>
                        <p className="text-zinc-500 text-sm">When people submit your form, their responses will appear here.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                renderTableRows()
              )}
            </TableBody>
            {submissions && submissions.length > 0 && (
              <TableFooter>
                <TableRow className="border-t-2 border-zinc-600/50 bg-zinc-800/40 hover:bg-zinc-800/50 transition-colors">
                  <TableCell colSpan={(fieldIdsInOrder?.length || 0) + 1} className="text-white font-semibold text-sm">
                    Total Submissions
                  </TableCell>
                  <TableCell className="text-2xl font-bold text-white">
                    {submissions?.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      )}
    </div>
  );
}

const TableSkeleton = () => {
  const columnCount = 6;
  const rowCount = 8;

  return (
    <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-xl overflow-hidden shadow-xl">
      <Table>
        <TableCaption className="sr-only">Loading submissions...</TableCaption>
        <TableHeader>
          <TableRow className="border-b-2 border-zinc-600/50 bg-zinc-800/40">
            {Array(columnCount)
              .fill(0)
              .map((_, index) => (
                <TableHead key={`header-${index}`} className="min-w-[150px]">
                  <Skeleton className="h-6 w-24" />
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(rowCount)
            .fill(0)
            .map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {Array(columnCount)
                  .fill(0)
                  .map((_, colIndex) => (
                    <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow className="border-t-2 border-zinc-600/50 bg-zinc-800/40">
            <TableCell colSpan={columnCount - 1} className="text-white font-semibold text-sm">
              <Skeleton className="h-6 w-40" />
            </TableCell>
            <TableCell className="text-2xl font-bold">
              <Skeleton className="h-8 w-8" />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
