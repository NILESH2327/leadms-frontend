import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api/adminApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { ErrorAlert } from '../../components/feedback/ErrorAlert';
import { formatCurrency } from '../../utils/formatters';
import { Users, FileText, Package, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getAnalytics();
      setAnalytics(data?.data || data);
    } catch (err) {
      setError(err?.message || 'Failed to load system analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const usersObj = analytics?.users || {};
  const totalUsers = typeof usersObj === 'number'
    ? usersObj
    : Object.values(usersObj).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);

  const totalLeads = analytics?.leads?.total ?? analytics?.totalLeads ?? 0;
  const totalProducts = analytics?.products?.total ?? analytics?.totalProducts ?? 0;
  const totalRevenue = analytics?.revenue?.totalQuoted ?? analytics?.totalRevenue ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Admin Console Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise system monitoring, multi-tenant statistics, and user role distribution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand" dot>Live System Data</Badge>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={loadAnalytics} />}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-brand-500/50 transition-colors">
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Total Registered Users</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalUsers}</h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Active Tenants
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-brand-500/50 transition-colors">
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Total Leads Created</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalLeads}</h3>
                <span className="text-[10px] text-brand-600 font-medium">All Platform Vendors</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-brand-500/50 transition-colors">
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Total Listed Products</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalProducts}</h3>
                <span className="text-[10px] text-slate-400 font-medium">Traders & Suppliers</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-brand-500/50 transition-colors">
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium">Total Quoted Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(totalRevenue)}
                </h3>
                <span className="text-[10px] text-emerald-600 font-semibold">Generated Proposals</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" /> Platform Users Directory
            </CardTitle>
            <CardDescription>Inspect all admins, vendors, traders, and team members.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link to="/admin/users">
              <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> System Leads Monitoring
            </CardTitle>
            <CardDescription>View all leads across all vendor organizations.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link to="/admin/leads">
              <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Leads
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> System Analytics & Charts
            </CardTitle>
            <CardDescription>Visual distribution breakdown of system data.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Detailed Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
