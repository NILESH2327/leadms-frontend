import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => (
  <div
    className={cn('animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80', className)}
    {...props}
  />
);

export const SkeletonCard = () => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 bg-white dark:bg-slate-900">
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-12 rounded-full" />
    </div>
    <Skeleton className="h-8 w-2/3" />
    <div className="space-y-2 pt-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-4 space-y-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);
