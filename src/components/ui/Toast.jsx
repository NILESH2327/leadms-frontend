import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/90 dark:bg-emerald-950/80',
    error: 'border-rose-200 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/80',
    warning: 'border-amber-200 dark:border-amber-900/50 bg-amber-50/90 dark:bg-amber-950/80',
    info: 'border-brand-200 dark:border-brand-900/50 bg-brand-50/90 dark:bg-brand-950/80',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-soft-lg backdrop-blur-md ${borders[toast.type] || borders.info}`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 text-xs sm:text-sm">
              {toast.title && <h4 className="font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h4>}
              {toast.message && <p className="text-slate-600 dark:text-slate-300 mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
