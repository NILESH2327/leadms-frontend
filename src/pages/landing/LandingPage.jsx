import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import {
  Building2,
  Store,
  Users,
  ShieldCheck,
  Calculator,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Lock,
  Sun,
  Moon,
  Zap,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, user, role } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();

  // Interactive Quote Calculator State Demo for Landing Page
  const [basePrice, setBasePrice] = useState(500);
  const [quantity, setQuantity] = useState(2);
  const [marginPct, setMarginPct] = useState(15);
  const [installation, setInstallation] = useState(100);
  const [misc, setMisc] = useState(50);

  const baseTotal = basePrice * quantity;
  const marginAmount = (baseTotal * marginPct) / 100;
  const finalTotal = baseTotal + marginAmount + Number(installation) + Number(misc);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand-400 fill-brand-400/20" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                LeadMS
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full">
                B2B CRM
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roles" className="hover:text-white transition-colors">Role Architecture</a>
            <a href="#calculator" className="hover:text-white transition-colors">Quoting Engine</a>
            <a href="#track-b" className="hover:text-white transition-colors">API Docs & Track B</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Glow Background Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800/80 mb-8 backdrop-blur-md shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-semibold bg-gradient-to-r from-brand-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              LeadMS Platform — Track B Full API Integration Enabled
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]"
          >
            Multi-Tier B2B Sales & <br />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Automated Quoting Platform
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Seamlessly bridge suppliers, distributor agencies, and field sales reps.
            Manage master product catalogs, lock vendor margins, delegate leads, and build precise price quotes in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-xl shadow-brand-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-3"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl font-semibold text-base bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all flex items-center gap-2"
            >
              Sign In to Portal
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-900">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-2xl font-bold text-white">4 Roles</div>
              <div className="text-xs text-slate-400 mt-1">Trader, Vendor, Team, Admin</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-2xl font-bold text-emerald-400">100% Real-Time</div>
              <div className="text-xs text-slate-400 mt-1">Live Backend Integration</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-2xl font-bold text-brand-400">Single Device</div>
              <div className="text-xs text-slate-400 mt-1">JWT & Session Lock</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-2xl font-bold text-indigo-400">Auto Quoting</div>
              <div className="text-xs text-slate-400 mt-1">Margin + Fees Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Architecture Section */}
      <section id="roles" className="py-24 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">System Hierarchy</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Designed for Every Tier of Sales</p>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              LeadMS organizes complex multi-vendor ecosystems into clean, role-scoped workflows with strict security permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Role 1: Trader */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                Supplier
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Trader</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Top-level product suppliers. Create master product catalog, set base prices, and toggle item availability.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Master product catalog</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Base price control</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Active status toggles</li>
              </ul>
            </div>

            {/* Role 2: Vendor */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
                Distributor Agency
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Vendor</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Sales agencies. Lock products to catalog, configure custom margins & installation fees, invite team reps.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-400" /> Catalog product locking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-400" /> Custom margin % & fee profile</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-400" /> Invite team members via email</li>
              </ul>
            </div>

            {/* Role 3: Team Member */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                Sales Rep
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Team Member</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Field sales representatives tied to a specific Vendor. Access locked products, capture customer leads, generate quotes.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Vendor-locked catalog access</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Auto-assigned lead generation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Instant price quotes calculation</li>
              </ul>
            </div>

            {/* Role 4: Admin */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Super Admin
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Administrator</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                System operator overseeing platform health. Full access to system analytics, user distribution, and revenue.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Platform analytics overview</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Registered user management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> System-wide lead monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quoting Engine Demo */}
      <section id="calculator" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                Live Pricing Math Engine
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Automated Multi-Layer Pricing Calculation
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                When a quote is created for a lead, LeadMS automatically applies the Vendor's specific margin percentage and additional fees on top of the Trader's base price.
              </p>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
                <div className="text-slate-500">// Quoting Engine Formula</div>
                <div>Base Total = ∑(Base Price × Quantity)</div>
                <div>Margin Applied = Base Total × (Margin % / 100)</div>
                <div className="text-emerald-400 font-bold">
                  Final Total = Base Total + Margin + Installation + Misc
                </div>
              </div>
            </div>

            {/* Interactive Calculator Card */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-400" />
                  Try Live Calculator Demo
                </h3>
                <span className="text-xs text-slate-400">Track B Quoting Logic</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">Product Base Price ($)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">Vendor Margin (%)</label>
                  <input
                    type="number"
                    value={marginPct}
                    onChange={(e) => setMarginPct(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">Installation Price ($)</label>
                  <input
                    type="number"
                    value={installation}
                    onChange={(e) => setInstallation(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Total ({quantity} × ${basePrice})</span>
                  <span className="font-semibold text-white">${baseTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Vendor Margin ({marginPct}%)</span>
                  <span className="font-semibold text-emerald-400">+${marginAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fixed Installation Fee</span>
                  <span className="font-semibold text-slate-200">+${Number(installation).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Misc Charges</span>
                  <span className="font-semibold text-slate-200">+${Number(misc).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-sm text-white">Final Quote Total</span>
                  <span className="text-2xl font-extrabold text-brand-400">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Core Capabilities</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Everything Required for B2B Growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Single Device Session Lock</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict single-session security utilizing long-lived refresh tokens. Logging in from a new device automatically invalidates existing active sessions.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Product Catalog Locking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vendors curate their sales catalog by locking specific Trader products, granting their team reps immediate access to quote customers.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Real-Time Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Super Admins access platform-wide KPIs, monitoring total user counts, active products, lead pipeline stages, and total expected revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Explore LeadMS?</h2>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all"
            >
              Register Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/admin/login"
              className="px-6 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-sm border border-amber-500/20 transition-all"
            >
              Admin Portal
            </Link>
          </div>
          <p className="text-xs text-slate-500 pt-8 border-t border-slate-900">
            LeadMS CRM Platform — Track B Full Frontend Integration & Phase 1 Base Pages.
          </p>
        </div>
      </footer>
    </div>
  );
};
