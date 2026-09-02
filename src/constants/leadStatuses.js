export const LEAD_STATUSES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUOTED: 'quoted',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const LEAD_STATUS_CONFIG = {
  [LEAD_STATUSES.NEW]: {
    label: 'New',
    style: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  [LEAD_STATUSES.CONTACTED]: {
    label: 'Contacted',
    style: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  [LEAD_STATUSES.QUOTED]: {
    label: 'Quoted',
    style: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
  },
  [LEAD_STATUSES.ACCEPTED]: {
    label: 'Accepted',
    style: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  [LEAD_STATUSES.REJECTED]: {
    label: 'Rejected',
    style: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500',
  },
};
