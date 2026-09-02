import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../store/productStore';
import { useUIStore } from '../../store/uiStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorAlert } from '../../components/feedback/ErrorAlert';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { productApi } from '../../services/api/productApi';
import { Plus, Package, Edit, Trash2, Search, Filter, Calendar } from 'lucide-react';

export const TraderProductsPage = () => {
  const { traderProducts, fetchTraderProducts, loading, error } = useProductStore();
  const { addToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTraderProducts();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ name: '', description: '', basePrice: '', isActive: true });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      description: prod.description || '',
      basePrice: prod.basePrice !== undefined ? String(prod.basePrice) : '',
      isActive: prod.isActive ?? true,
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errors.name = 'Product name is required';
    }

    if (formData.basePrice === '' || formData.basePrice === null || formData.basePrice === undefined) {
      errors.basePrice = 'Base price is required';
    } else {
      const priceNum = Number(formData.basePrice);
      if (isNaN(priceNum)) {
        errors.basePrice = 'Base price must be a valid number';
      } else if (priceNum < 0) {
        errors.basePrice = 'Base price cannot be negative';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!validateForm() || submitting) return;

    setSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      description: (formData.description || '').trim(),
      basePrice: Number(formData.basePrice),
      isActive: Boolean(formData.isActive),
    };

    try {
      if (editingProduct) {
        const prodId = editingProduct.id || editingProduct._id;
        await productApi.updateTraderProduct(prodId, payload);
        addToast({ type: 'success', title: 'Product Updated', message: 'Product updated successfully.' });
      } else {
        await productApi.createTraderProduct(payload);
        addToast({ type: 'success', title: 'Product Created', message: 'Product created successfully.' });
      }
      setIsCreateModalOpen(false);
      setEditingProduct(null);
      await fetchTraderProducts();
    } catch (err) {
      addToast({
        type: 'error',
        title: editingProduct ? 'Update Failed' : 'Creation Failed',
        message: err?.message || 'Unable to save product. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct || submitting) return;
    const prodId = deletingProduct.id || deletingProduct._id;
    setSubmitting(true);

    try {
      await productApi.deleteTraderProduct(prodId);
      addToast({ type: 'success', title: 'Product Deleted', message: 'Product deleted successfully.' });
      setDeletingProduct(null);
      await fetchTraderProducts();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err?.message || 'Unable to delete product. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter products by search query and status filter
  const filteredProducts = traderProducts.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isProdActive = p.isActive !== false;
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = isProdActive;
    if (statusFilter === 'inactive') matchesStatus = !isProdActive;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            My Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your product catalog, pricing, and availability.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
          Add Product
        </Button>
      </div>

      {/* Filter & Search Controls */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus-ring"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Status:</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {['all', 'active', 'inactive'].map((key) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                    statusFilter === key
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-soft-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message Alert with Retry */}
      {error && (
        <ErrorAlert
          title="Unable to load products."
          message={typeof error === 'string' ? error : error?.message || 'A network error occurred while fetching products.'}
          onRetry={fetchTraderProducts}
        />
      )}

      {/* Main Products Listing */}
      {loading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Create your first product to start building your catalog."
          actionLabel="Add Product"
          onAction={handleOpenCreate}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const id = product.id || product._id;
                  const isActive = product.isActive !== false;
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                        {product.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-500 dark:text-slate-400">
                        {product.description || '—'}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(product.basePrice)}
                      </TableCell>
                      <TableCell>
                        {isActive ? (
                          <Badge variant="success" dot>Active</Badge>
                        ) : (
                          <Badge variant="neutral" dot>Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {formatDate(product.createdAt || product.createdDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(product)}
                            title="Edit product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingProduct(product)}
                            className="text-rose-600 hover:text-rose-700 dark:hover:text-rose-400"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Stacked Card View (No Horizontal Overflow) */}
          <div className="md:hidden space-y-4">
            {filteredProducts.map((product) => {
              const id = product.id || product._id;
              const isActive = product.isActive !== false;
              return (
                <Card key={id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{product.name}</h3>
                    {isActive ? (
                      <Badge variant="success" dot>Active</Badge>
                    ) : (
                      <Badge variant="neutral" dot>Inactive</Badge>
                    )}
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
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEdit(product)}>
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingProduct(product)}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isCreateModalOpen || !!editingProduct}
        onClose={() => {
          if (!submitting) {
            setIsCreateModalOpen(false);
            setEditingProduct(null);
          }
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        description="Provide details, specifications, and base pricing for vendor discovery."
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="e.g. Solar Panel 450W High Efficiency"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide technical specifications, dimensions, or warranty details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus-ring"
            />
          </div>

          <Input
            label="Base Price ($)"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 24999"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            error={formErrors.basePrice}
            required
          />

          <div className="pt-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Availability Status
            </label>
            <label className="inline-flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 w-full">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {formData.isActive ? 'Active (Visible to Vendors)' : 'Inactive (Hidden)'}
                </span>
                <span className="text-[10px] text-slate-400">
                  Active products appear in the Vendor Marketplace for locking.
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              type="button"
              disabled={submitting}
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={submitting}>
              {submitting ? (editingProduct ? 'Saving...' : 'Creating...') : editingProduct ? 'Save Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => {
          if (!submitting) setDeletingProduct(null);
        }}
        title="Delete product?"
        description="Are you sure you want to delete this product? This action cannot be undone."
      >
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200 text-xs font-semibold mb-4">
          Product: {deletingProduct?.name}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" disabled={submitting} onClick={() => setDeletingProduct(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct} isLoading={submitting}>
            {submitting ? 'Deleting...' : 'Delete Product'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
