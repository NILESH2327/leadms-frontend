import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Lock,
  BarChart3,
  Sliders,
  LogOut,
  X,
} from 'lucide-react';

export const Sidebar = () => {
  const { role, logout } = useAuthStore();
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Build role-specific navigation menu items
  const getNavItems = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
          { label: 'Manage Users', path: '/admin/users', icon: Users },
          { label: 'All Leads', path: '/admin/leads', icon: FileText },
          { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        ];

      case ROLES.VENDOR:
        return [
          { label: 'Vendor Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Leads & Quotes', path: '/leads', icon: FileText },
          { label: 'Products Catalog', path: '/products', icon: Package },
          { label: 'Locked Products', path: '/products/locked', icon: Lock },
          { label: 'Pricing Configuration', path: '/vendor/profile', icon: Sliders },
          { label: 'Team Members', path: '/vendor/team', icon: Users },
        ];

      case ROLES.TRADER:
        return [
          { label: 'Trader Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'My Products', path: '/products', icon: Package },
        ];

      case ROLES.TEAM_MEMBER:
        return [
          { label: 'Team Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Assigned Leads', path: '/leads', icon: FileText },
          { label: 'Locked Products', path: '/products/locked', icon: Lock },
        ];

      default:
        return [
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        ];
    }
  };

  const navItems = getNavItems();

  const renderNavLinks = (isMobile = false) => (
    <div className="flex flex-col gap-1.5 px-3 py-4 flex-1">
      <div className={cn('px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1', sidebarCollapsed && !isMobile && 'sr-only')}>
        Navigation
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        // Use exact matching for /products, /dashboard, and /admin to prevent double active highlights
        const isExact = item.path === '/dashboard' || item.path === '/admin' || item.path === '/products';
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={isExact}
            onClick={() => isMobile && setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                isActive
                  ? 'bg-brand-600 text-white shadow-soft-sm shadow-brand-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100',
                sidebarCollapsed && !isMobile && 'justify-center px-0 py-3'
              )
            }
            title={sidebarCollapsed && !isMobile ? item.label : undefined}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {(!sidebarCollapsed || isMobile) && <span className="truncate">{item.label}</span>}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 select-none',
          sidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo / Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200/80 dark:border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-black text-base shadow-soft-sm shrink-0">
            L
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                Lead<span className="text-brand-600">MS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Enterprise CRM</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        {renderNavLinks(false)}

        {/* Sidebar Footer / Sign Out */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors',
              sidebarCollapsed && 'justify-center px-0'
            )}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-white dark:bg-slate-900 h-full shadow-soft-lg flex flex-col z-10 animate-fade-in border-r border-slate-200 dark:border-slate-800">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-black text-base shadow-soft-sm">
                  L
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  Lead<span className="text-brand-600">MS</span>
                </span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNavLinks(true)}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
