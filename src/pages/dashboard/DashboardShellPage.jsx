import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProductStore } from '../../store/productStore';
import { useLeadStore } from '../../store/leadStore';
import { useVendorStore } from '../../store/vendorStore';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { AdminDashboardPage } from '../admin/AdminDashboardPage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonTable, SkeletonCard } from '../../components/ui/Skeleton';
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
  Lock,
  DollarSign,
  Calculator,
  Tag,
  ChevronRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardShellPage = () => {
  const { user, role } = useAuthStore();
  const navigate = useNavigate();

  const { traderProducts, lockedProducts, fetchTraderProducts, fetchLockedProducts, loading: productLoading } = useProductStore();
  const { leads, fetchLeads, loading: leadLoading } = useLeadStore();
  const { profile, fetchProfile } = useVendorStore();

  useEffect(() => {
    if (role === ROLES.TRADER) {
      fetchTraderProducts();
    } else if (role === ROLES.VENDOR || role === ROLES.TEAM_MEMBER) {
      fetchLockedProducts();
      fetchLeads();
      if (role === ROLES.VENDOR) {
        fetchProfile();
      }
    }
  }, [role]);

  // If Admin role, directly render the Admin Console Overview Page
  if (role === ROLES.ADMIN) {
    return <AdminDashboardPage />;
  }

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || 'User';

  // Metrics for Trader role
  const totalTraderProducts = traderProducts.length;
  const activeTraderProducts = traderProducts.filter((p) => p.isActive !== false).length;
  const inactiveTraderProducts = totalTraderProducts - activeTraderProducts;
  const recentTraderProducts = traderProducts.slice(0, 5);

  // Metrics for Vendor / Team Member roles
  const assignedLeads = leads; // Server handles role filtering
  const newLeads = assignedLeads.filter((l) => (l.status || 'new').toLowerCase() === 'new').length;
  const contactedLeads = assignedLeads.filter((l) => (l.status || '').toLowerCase() === 'contacted').length;
  const quotedLeads = assignedLeads.filter((l) => (l.status || '').toLowerCase() === 'quoted' || l.quote).length;
  const acceptedLeads = assignedLeads.filter((l) => (l.status || '').toLowerCase() === 'accepted').length;

  const totalQuotedValue = assignedLeads.reduce((acc, lead) => {
    return acc + (lead.quote?.finalTotal || lead.quote?.total || 0);
  }, 0);

  const recentLeads = assignedLeads.slice(0, 5);
  const recentLockedProducts = lockedProducts.slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-soft-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold border backdrop-blur-md bg-white/10 text-white border-white/20 uppercase tracking-wider">
                {ROLE_LABELS[role] || role} Dashboard
              </span>
              <span className="text-xs text-brand-100 flex items-center gap-1 bg-white/5 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Authenticated Session
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-xs sm:text-sm text-brand-100/90 max-w-xl leading-relaxed">
              {role === ROLES.TEAM_MEMBER
                ? 'View customer leads assigned to you, access vendor-locked products, and generate custom price quotes instantly.'
                : role === ROLES.VENDOR
                ? 'Manage your sales catalog, invite team reps, configure quoting margins, and delegate customer leads.'
                : 'Manage supplier products, toggle availability, and set base prices for vendors across LeadMS.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {(role === ROLES.VENDOR || role === ROLES.TEAM_MEMBER) && (
              <>
                <Link to="/leads">
                  <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    New Lead
                  </Button>
                </Link>
                <Link to="/products/locked">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    leftIcon={<Lock className="w-4 h-4 text-emerald-300" />}
                  >
                    Locked Catalog ({lockedProducts.length})
                  </Button>
                </Link>
              </>
            )}
            {role === ROLES.TRADER && (
              <Link to="/products">
                <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Add Product
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ================= VENDOR & TEAM MEMBER DASHBOARD VIEW ================= */}
      {(role === ROLES.VENDOR || role === ROLES.TEAM_MEMBER) && (
        <div className="space-y-8">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Assigned Leads */}
            <Card className="hover:border-brand-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Assigned Leads</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {leadLoading ? '...' : assignedLeads.length}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="text-brand-600 font-semibold">{newLeads} new</span> • <span>{quotedLeads} quoted</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            {/* Metric 2: Vendor Locked Products */}
            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Locked Catalog Products</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {productLoading ? '...' : lockedProducts.length}
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Ready for Quoting
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            {/* Metric 3: Quoted Leads & Revenue */}
            <Card className="hover:border-indigo-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Total Quoted Value</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {formatCurrency(totalQuotedValue)}
                  </h3>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    {quotedLeads} quotes generated
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            {/* Metric 4: Pricing Profile Rules */}
            <Card className="hover:border-purple-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Vendor Profit Margin</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {profile?.marginPercentage !== undefined ? `${profile.marginPercentage}%` : '15%'}
                  </h3>
                  <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
                    <Calculator className="w-3 h-3" /> Formula Active
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assigned Leads Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" />
                  Assigned Customer Leads
                </CardTitle>
                <CardDescription>
                  Customer inquiries assigned to your sales workspace
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/leads">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                    View All ({assignedLeads.length})
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {leadLoading ? (
                <SkeletonTable rows={4} cols={5} />
              ) : recentLeads.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No assigned leads found"
                  description="Create a new lead or ask your vendor administrator to delegate leads to your profile."
                  actionLabel="Create First Lead"
                  onAction={() => navigate('/leads')}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Quote Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLeads.map((lead) => {
                      const lId = lead.id || lead._id;
                      const status = (lead.status || 'new').toLowerCase();

                      let statusBadge = <Badge variant="info">New</Badge>;
                      if (status === 'contacted') statusBadge = <Badge variant="warning">Contacted</Badge>;
                      if (status === 'quoted') statusBadge = <Badge variant="brand">Quoted</Badge>;
                      if (status === 'accepted') statusBadge = <Badge variant="success">Accepted</Badge>;
                      if (status === 'rejected') statusBadge = <Badge variant="danger">Rejected</Badge>;

                      return (
                        <TableRow key={lId}>
                          <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                            {lead.customerName}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {lead.customerEmail}
                            </div>
                            {lead.customerPhone && (
                              <div className="text-[11px] text-slate-400">{lead.customerPhone}</div>
                            )}
                          </TableCell>
                          <TableCell>{statusBadge}</TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                            {lead.quote?.finalTotal
                              ? formatCurrency(lead.quote.finalTotal)
                              : lead.quote?.total
                              ? formatCurrency(lead.quote.total)
                              : '—'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to="/leads">
                              <Button variant="primary" size="xs" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                                {lead.quote ? 'View Quote' : 'Generate Quote'}
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Vendor Locked Products Grid Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  Vendor Locked Catalog
                </CardTitle>
                <CardDescription>
                  Products locked by your vendor agency available for quoting
                </CardDescription>
              </div>
              <Link to="/products/locked">
                <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  View All Locked ({lockedProducts.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              {productLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : recentLockedProducts.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No locked products in catalog"
                  description="Lock active supplier products from the marketplace to build custom price quotes."
                  actionLabel="Browse Marketplace"
                  onAction={() => navigate('/products')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentLockedProducts.map((prod) => {
                    const pId = prod.id || prod._id;
                    return (
                      <div
                        key={pId}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-emerald-500/50 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                            {prod.name}
                          </h4>
                          <Badge variant="success" size="sm">Locked</Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {prod.description || 'No description available for this locked product.'}
                        </p>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Supplier Base</span>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100">
                            {formatCurrency(prod.basePrice)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ================= TRADER DASHBOARD VIEW ================= */}
      {role === ROLES.TRADER && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="hover:border-brand-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Total Products</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {productLoading ? '...' : totalTraderProducts}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Listed in supplier catalog</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-emerald-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Active Products</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {productLoading ? '...' : activeTraderProducts}
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

            <Card className="hover:border-slate-500/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Inactive Products</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    {productLoading ? '...' : inactiveTraderProducts}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Hidden from Marketplace</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/products">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Add Product
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                Manage Supplier Catalog
              </Button>
            </Link>
          </div>

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
              {productLoading ? (
                <SkeletonTable rows={3} cols={4} />
              ) : recentTraderProducts.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No products yet"
                  description="Create your first product to start building your catalog."
                  actionLabel="Add Product"
                  onAction={() => navigate('/products')}
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
    </div>
  );
};
