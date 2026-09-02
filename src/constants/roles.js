export const ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  TRADER: 'trader',
  TEAM_MEMBER: 'team-member',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.VENDOR]: 'Vendor Partner',
  [ROLES.TRADER]: 'Trader / Supplier',
  [ROLES.TEAM_MEMBER]: 'Team Member',
};

export const ROLE_BADGE_STYLES = {
  [ROLES.ADMIN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  [ROLES.VENDOR]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  [ROLES.TRADER]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  [ROLES.TEAM_MEMBER]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
};
