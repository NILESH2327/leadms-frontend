import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../store/productStore';
import { useUIStore } from '../../store/uiStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorAlert } from '../../components/feedback/ErrorAlert';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../constants/roles';
import { Lock, Unlock, Search, ShoppingBag, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LockedProductsPage = () => {
  const { role } = useAuthStore();
  const { lockedProducts, fetchLockedProducts, unlockProduct, loading, error } = useProductStore();
  const { addToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [unlockingId, setUnlockingId] = useState(null);

  useEffect(() => {
    fetchLockedProducts();
  }, []);

  const isTeamMember = role === ROLES.TEAM_MEMBER;

  const handleUnlock = async (product) => {
    const prodId = product.id || product._id;
    setUnlockingId(prodId);
    try {
      const res = await unlockProduct(prodId);
      if (res.success) {
        addToast({ type: 'info', title: 'Product Unlocked', message: `${product.name} removed from locked catalog.` });
      } else {
        addToast({ type: 'error', title: 'Unlock Failed', message: res.error });
      }
    } catch (err) {
      addToast({ type: 'error', title: 'Unlock Failed', message: err?.message || 'Could not unlock product.' });
    } finally {
      setUnlockingId(null);
    }
  };

  const filteredProducts = lockedProducts.filter((p) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Marketplace Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Vendor Locked Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Equipment items locked by your organization ready for client quote proposal generation.
          </p>
        </div>

        <Link to="/products">
          <Button variant="primary" size="sm" leftIcon={<ShoppingBag className="w-4 h-4" />}>
            Marketplace Catalog
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search locked items by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus-ring"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Total Locked: {lockedProducts.length} Items
          </span>
        </CardContent>
      </Card>

      {error && <ErrorAlert message={error} onRetry={fetchLockedProducts} />}

      {loading && lockedProducts.length === 0 ? (
        <SkeletonTable rows={4} cols={4} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Lock}
          title="No locked products"
          description="Your vendor organization has not locked any products for quotes yet. Browse the Marketplace to lock equipment."
          actionLabel="Browse Marketplace"
          onAction={() => window.location.href = '/products'}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name & Description</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Lock Status</TableHead>
                  <TableHead>Lock Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const id = product.id || product._id;
                  const isProcessing = unlockingId === id;
                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{product.name}</span>
                          <span className="text-xs text-slate-400 truncate max-w-md">
                            {product.description || 'No detailed specs provided.'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-extrabold text-slate-900 dark:text-slate-100">
                        {formatCurrency(product.basePrice)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="brand" dot>Locked for Quotes</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {formatDate(product.lockedAt || product.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Unlock className="w-3.5 h-3.5" />}
                          onClick={() => handleUnlock(product)}
                          isLoading={isProcessing}
                        >
                          {isProcessing ? 'Unlocking...' : 'Unlock'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="md:hidden space-y-4">
            {filteredProducts.map((product) => {
              const id = product.id || product._id;
              const isProcessing = unlockingId === id;
              return (
                <Card key={id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{product.name}</h3>
                    <Badge variant="brand" dot>Locked</Badge>
                  </div>

                  {product.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Base Price</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {formatCurrency(product.basePrice)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Unlock className="w-3.5 h-3.5" />}
                      onClick={() => handleUnlock(product)}
                      isLoading={isProcessing}
                    >
                      {isProcessing ? 'Unlocking...' : 'Unlock'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
