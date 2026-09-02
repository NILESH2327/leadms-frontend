import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useLeadStore } from '../../store/leadStore';
import { useProductStore } from '../../store/productStore';
import { ROLE_LABELS, ROLE_BADGE_STYLES } from '../../constants/roles';
import { getInitials, formatCurrency } from '../../utils/formatters';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Search,
  FileText,
  Package,
  Users,
  X,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const { user, role, logout } = useAuthStore();
  const { theme, toggleTheme, toggleSidebar, toggleMobileSidebar } = useUIStore();
  const { leads } = useLeadStore();
  const { traderProducts, availableProducts, lockedProducts } = useProductStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState({ leads: [], products: [] });

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Debounced search logic across loaded workspace data
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ leads: [], products: [] });
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase().trim();

      // Search leads
      const matchingLeads = (leads || [])
        .filter(
          (l) =>
            (l.customerName || '').toLowerCase().includes(q) ||
            (l.customerEmail || '').toLowerCase().includes(q)
        )
        .slice(0, 4);

      // Search products (trader, available, locked)
      const allProds = [...traderProducts, ...availableProducts, ...lockedProducts];
      const uniqueProdsMap = new Map();
      allProds.forEach((p) => {
        const id = p.id || p._id;
        if (id && !uniqueProdsMap.has(id)) {
          uniqueProdsMap.set(id, p);
        }
      });

      const matchingProducts = Array.from(uniqueProdsMap.values())
        .filter(
          (p) =>
            (p.name || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
        )
        .slice(0, 4);

      setSearchResults({ leads: matchingLeads, products: matchingProducts });
      setSearchOpen(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, leads, traderProducts, availableProducts, lockedProducts]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleResultClick = (targetPath) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(targetPath);
  };

  const hasResults = searchResults.leads.length > 0 || searchResults.products.length > 0;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left section: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle Mobile Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle Desktop Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">LeadMS /</span>
          <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 capitalize">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center section: Global Search Bar */}
      <div className="hidden md:flex items-center max-w-sm w-full relative" ref={searchRef}>
        <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search leads, products, users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.trim() && hasResults) setSearchOpen(true);
          }}
          className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-brand-500 rounded-full transition-all focus:outline-none dark:text-slate-200"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchOpen(false);
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Global Search Results Dropdown Panel */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft-lg py-2 z-50 animate-fade-in max-h-96 overflow-y-auto">
            {!hasResults ? (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">
                No matching leads or products found.
              </div>
            ) : (
              <>
                {searchResults.leads.length > 0 && (
                  <div className="py-1">
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-brand-500" /> Leads
                    </div>
                    {searchResults.leads.map((lead) => (
                      <button
                        key={lead.id || lead._id}
                        onClick={() => handleResultClick('/leads')}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-xs"
                      >
                        <div className="truncate">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{lead.customerName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{lead.customerEmail}</p>
                        </div>
                        <span className="text-[10px] text-brand-600 font-bold capitalize ml-2">{lead.status || 'New'}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.products.length > 0 && (
                  <div className="py-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Package className="w-3 h-3 text-blue-500" /> Products
                    </div>
                    {searchResults.products.map((prod) => (
                      <button
                        key={prod.id || prod._id}
                        onClick={() => handleResultClick('/products')}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between text-xs"
                      >
                        <div className="truncate">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{prod.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{prod.description || 'Medical Equipment'}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 ml-2">
                          {formatCurrency(prod.basePrice)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right section: Actions & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
          >
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-soft-sm">
              {getInitials(user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'U')}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                {ROLE_LABELS[role] || role || 'User'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-lg py-2 z-50 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user?.email}
                </p>
                <div className="mt-1">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_BADGE_STYLES[role] || ''}`}>
                    {ROLE_LABELS[role] || role}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-slate-400" /> Profile & Settings
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
