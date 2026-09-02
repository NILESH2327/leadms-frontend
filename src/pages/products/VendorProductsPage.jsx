import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../store/productStore';
import { useUIStore } from '../../store/uiStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorAlert } from '../../components/feedback/ErrorAlert';
import { formatCurrency } from '../../utils/formatters';
import { Search, Lock, Unlock, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VendorProductsPage = () => {
  const { availableProducts, lockedProducts, fetchAvailableProducts, fetchLockedProducts, lockProduct, unlockProduct, loading, error } = useProductStore();
  const { addToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAvailableProducts();
    fetchLockedProducts();
  }, []);

  const isLockedByMe = (prodId) => {
    return lockedProducts.some((p) => p.id === prodId || p._id === prodId || p.lockId === prodId);
  };

  const handleToggleLock = async (product) => {
    const prodId = product.id || product._id;
    if (actionLoading) return;

    const currentlyLocked = isLockedByMe(prodId);
    setActionLoading(prodId);

    try {
      if (currentlyLocked) {
        const res = await unlockProduct(prodId);
        if (res.success) {
          addToast({ type: 'info', title: 'Product Unlocked', message: `${product.name} unlocked.` });
        } else {
          addToast({ type: 'error', title: 'Unlock Failed', message: res.error });
        }
      } else {
        const res = await lockProduct(prodId);
        if (res.success) {
          addToast({
            type: 'success',
            title: 'Product Locked for Quotes',
            message: `${product.name} locked successfully. Available on Locked Products page.`,
          });
        } else {
          addToast({ type: 'error', title: 'Lock Failed', message: res.error });
        }
      }
    } catch (err) {
      addToast({ type: 'error', title: 'Action Failed', message: err?.message || 'Could not update lock status.' });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredProducts = availableProducts.filter((p) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Products Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse active supplier products and lock items to your vendor catalog for formal quote generation.
          </p>
        </div>

        <Link to="/products/locked">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View Locked Products ({lockedProducts.length})
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
              placeholder="Search available equipment by name or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus-ring"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Showing {filteredProducts.length} of {availableProducts.length} products
          </span>
        </CardContent>
      </Card>

      {error && <ErrorAlert message={error} onRetry={fetchAvailableProducts} />}

      {/* Products Grid */}
      {loading && availableProducts.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No available products found"
          description="Check back later or adjust your search query."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const prodId = product.id || product._id;
            const locked = isLockedByMe(prodId);
            const isProcessing = actionLoading === prodId;

            return (
              <Card key={prodId} className="flex flex-col justify-between hover:border-brand-500/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    {locked ? (
                      <Badge variant="brand" dot>Locked</Badge>
                    ) : (
                      <Badge variant="neutral">Available</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 mt-1">
                    {product.description || 'No description available for this supplier product.'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Supplier Base Price</span>
                    <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                      {formatCurrency(product.basePrice)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    variant={locked ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full justify-center"
                    leftIcon={locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    onClick={() => handleToggleLock(product)}
                    isLoading={isProcessing}
                    disabled={actionLoading !== null && !isProcessing}
                  >
                    {isProcessing ? 'Processing...' : locked ? 'Unlock Product' : 'Lock Product for Quotes'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
