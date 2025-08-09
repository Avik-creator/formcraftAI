'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Menu from '@/components/ui/kebabMenu';

import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { getAppOriginUrl } from '@/utils/functions';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface FormCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  submissions: number;
  lastModified: Date | string;
  isPreview?: boolean;
  onEdit?: (id: string, name: string) => void;
  onDelete?: (id: string, name: string) => void;
}

const FormCard = ({
  id,
  title,
  description,
  status,
  submissions,
  lastModified,
  isPreview,
  onEdit,
  onDelete,
}: FormCardProps) => {
  const formActions = [
    {
      label: 'Edit',
      onClick: () => onEdit?.(id, title),
    },
    {
      label: 'Delete',
      onClick: () => onDelete?.(id, title),
    },
  ];

  if (status === 'published') {
    formActions.push({
      label: 'Go to published form',
      onClick: () => {
        const formLink = `${getAppOriginUrl()}/form/${id}`;
        window.open(formLink, '_blank');
      },
    });
  }

  return (
    <>
      <Card
        className={cn(
          'group relative overflow-hidden backdrop-blur-sm bg-black/30 border border-zinc-800/50 shadow-lg',
          'hover:-translate-y-1 hover:border-zinc-700/50 hover:bg-zinc-900/40 hover:shadow-xl transition-all duration-300',
          {
            'cursor-pointer': !isPreview,
            'cursor-not-allowed animate-pulse': isPreview,
          },
        )}
      >
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center justify-between w-full gap-4">
            <h2
              className="text-base md:text-lg max-w-[90%] bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300 flex items-center group"
              onClick={() => onEdit?.(id, title)}
            >
              <Link prefetch href={`/builder`} className="inline-flex items-center">
                {title || 'Untitled Form'}
                <ArrowRight className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </h2>
            {!isPreview && <Menu items={formActions} />}
          </CardTitle>
          <CardDescription className="-mt-1 text-xs text-zinc-300 truncate">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            prefetch
            href={submissions > 0 ? `/dashboard/forms/${id}` : ''}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 rounded-md border transition-colors',
              'bg-zinc-800/30 border-zinc-700/40 hover:bg-zinc-800/50',
              'font-semibold'
            )}
          >
            <span className="font-bold text-2xl text-white">{submissions}</span>
            <span className="text-zinc-300">submissions</span>
            {submissions > 0 && (
              <ArrowRight className="w-4 h-4 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" aria-label="View Submissions" />
            )}
          </Link>
        </CardContent>
        <CardFooter className="flex items-center justify-between w-full gap-4 text-ellipsis">
          <p className="text-zinc-400 text-xs" title={new Date(lastModified ?? Date.now()).toLocaleString()}>
            Last modified: {formatDistanceToNow(new Date(lastModified ?? Date.now()))}
          </p>
          <FormStatusTag status={isPreview ? 'creating-new' : status} />
        </CardFooter>
      </Card>
    </>
  );
};

export default FormCard;

const FormStatusTag = ({ status }: { status: string }) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'bg-zinc-800/80 border border-zinc-700/50',
    },
    published: {
      label: 'Published',
      color: 'bg-green-900/70 border border-green-700/50',
    },
    'creating-new': {
      label: 'Creating...',
      color: 'bg-zinc-800/80 border border-zinc-700/50',
    },
  };

  return (
    <div
      className={`flex items-center gap-1 h-6 px-3 rounded-full backdrop-blur-sm ${
        statusConfig[status as keyof typeof statusConfig]?.color
      }`}
    >
      <span className="text-white font-normal text-xs flex items-center gap-1">
        {statusConfig[status as keyof typeof statusConfig].label}
        {status === 'creating-new' && <LoaderCircle className="w-4 h-4 inline animate-spin" />}
      </span>
    </div>
  );
};
