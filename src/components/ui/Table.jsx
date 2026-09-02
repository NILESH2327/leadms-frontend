import React from 'react';
import { cn } from '../../utils/cn';

export const Table = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft-sm">
    <table className={cn('w-full text-left text-sm border-collapse', className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ className, children, ...props }) => (
  <thead className={cn('bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none', className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ className, children, ...props }) => (
  <tbody className={cn('divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300', className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ className, children, ...props }) => (
  <tr className={cn('hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors', className)} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ className, children, ...props }) => (
  <th className={cn('py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300', className)} {...props}>
    {children}
  </th>
);

export const TableCell = ({ className, children, ...props }) => (
  <td className={cn('py-3.5 px-4 align-middle text-xs sm:text-sm', className)} {...props}>
    {children}
  </td>
);
