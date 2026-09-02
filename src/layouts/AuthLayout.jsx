import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { ToastContainer } from '../components/ui/Toast';
import { Sun, Moon } from 'lucide-react';

export const AuthLayout = () => {
  const { theme, toggleTheme } = useUIStore();

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 transition-colors overflow-x-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Auth Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <Link to="/login" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-soft-sm group-hover:scale-105 transition-transform">
            L
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight">
            Lead<span className="text-brand-600">MS</span>
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-soft-xs"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} LeadMS CRM. Enterprise Grade Lead & Vendor Management.
      </footer>

      <ToastContainer />
    </div>
  );
};
