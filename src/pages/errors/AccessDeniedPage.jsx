import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROLE_LABELS } from '../../constants/roles';

export const AccessDeniedPage = () => {
  const { role } = useAuthStore();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5 shadow-soft-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">403 — Access Denied</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2 mb-2">
        Your current account role (<strong className="text-slate-800 dark:text-slate-200 capitalize">{ROLE_LABELS[role] || role || 'User'}</strong>) does not have permission to view this view or feature.
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">
        If you believe this is an error, please contact your administrator.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Allowed Workspace
        </Button>
      </Link>
    </div>
  );
};
