import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProductStore } from '../../store/productStore';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { AdminDashboardPage } from '../admin/AdminDashboardPage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Users,
  FileText,
  Package,
  Sliders,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardShellPage = () => {
  const { user, role } = useAuthStore();
  const { traderProducts, fetchTraderProducts, loading: traderLoading } = useProductStore();

  useEffect(() => {
    if (role === ROLES.TRADER) {
      fetchTraderProducts();
    }
  }, [role]);

  // If Admin role, directly render the Admin Console Overview Page
  if (role === ROLES.ADMIN) {
    return <AdminDashboardPage />;
  }

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'User';

  // Calculate real metrics for Trader role
  const totalProducts = traderProducts.length;
  const activeProducts = traderProducts.filter((p) => p.isActive !== false).length;
  const inactiveProducts = totalProducts - activeProducts;
  const recentTraderProducts = traderProducts.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-800 p-6 sm:p-8 text-white shadow-soft-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md bg-white/10 text-white border-white/20">
                {ROLE_LABELS[role] || role} Workspace
              </span>
              <span className="text-xs text-brand-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-xs sm:text-sm text-brand-100/90 max-w-xl">
              LeadMS platform foundation is active. Access role-restricted controls, manage products, configure margins, and track analytics from your dashboard.
            </p>
          </div>
          {role === ROLES.TRADER && (
            <div className="flex items-center gap-2 shrink-0">
              <Link to="/products">
                <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Add Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Trader Role Real Product Dashboard Metrics */}
      {role === ROLES.TRADER && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="hover:border-brand-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Total Products</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {traderLoading ? '...' : totalProducts}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Listed in catalog</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-brand-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Active Products</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {traderLoading ? '...' : activeProducts}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Visible to Vendors
                  </span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-brand-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Inactive Products</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {traderLoading ? '...' : inactiveProducts}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Hidden from Marketplace</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trader Quick Action Controls */}
          <div className="flex items-center gap-3">
            <Link to="/products">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Add Product
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                View My Products
              </Button>
            </Link>
          </div>

          {/* Recent Products Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Products</CardTitle>
                <CardDescription>Recently added equipment items in your supplier catalog</CardDescription>
              </div>
              <Link to="/products">
                <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {traderLoading ? (
                <SkeletonTable rows={3} cols={4} />
              ) : recentTraderProducts.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No products yet"
                  description="Create your first product to start building your catalog."
                  actionLabel="Add Product"
                  onAction={() => window.location.href = '/products'}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Base Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTraderProducts.map((prod) => {
                      const pId = prod.id || prod._id;
                      const isActive = prod.isActive !== false;
                      return (
                        <TableRow key={pId}>
                          <TableCell className="font-bold text-slate-900 dark:text-slate-100">{prod.name}</TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(prod.basePrice)}
                          </TableCell>
                          <TableCell>
                            {isActive ? (
                              <Badge variant="success" dot>Active</Badge>
                            ) : (
                              <Badge variant="neutral" dot>Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-slate-400">
                            {formatDate(prod.createdAt || prod.createdDate)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Non-Trader Role Overview Cards */}
      {role !== ROLES.TRADER && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" /> Leads Management
              </CardTitle>
              <CardDescription>
                {role === ROLES.VENDOR ? 'Track, assign, and quote incoming customer leads.' : 'View leads assigned to your account.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/leads">
                <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Go to Leads
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-600" /> Products Marketplace
              </CardTitle>
              <CardDescription>Browse available products & lock items for quoting.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to="/products">
                <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Explore Products
                </Button>
              </Link>
            </CardContent>
          </Card>

          {role === ROLES.VENDOR && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-600" /> Pricing Configuration
                </CardTitle>
                <CardDescription>Set vendor margin %, installation fees & misc charges for quotes.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/vendor/profile">
                  <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                    Configure Pricing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
