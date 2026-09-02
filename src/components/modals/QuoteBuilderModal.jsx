import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../store/productStore';
import { useLeadStore } from '../../store/leadStore';
import { useUIStore } from '../../store/uiStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Calculator, Plus, Trash2, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

export const QuoteBuilderModal = ({ isOpen, onClose, lead }) => {
  const { lockedProducts, fetchLockedProducts } = useProductStore();
  const { generateQuote } = useLeadStore();
  const { addToast } = useUIStore();

  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchLockedProducts();
      setQuoteResult(null);
      setSelectedItems([]);
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleAddProduct = (product) => {
    const prodId = product.id || product._id;
    const existing = selectedItems.find((i) => i.productId === prodId);
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) => (i.productId === prodId ? { ...i, quantity: i.quantity + 1 } : i))
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        { productId: prodId, name: product.name, basePrice: product.basePrice, quantity: 1 },
      ]);
    }
  };

  const handleQuantityChange = (prodId, qty) => {
    const quantity = Math.max(1, parseInt(qty) || 1);
    setSelectedItems(
      selectedItems.map((i) => (i.productId === prodId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveItem = (prodId) => {
    setSelectedItems(selectedItems.filter((i) => i.productId !== prodId));
  };

  const handleSubmitQuote = async () => {
    if (selectedItems.length === 0) {
      addToast({ type: 'error', title: 'No Products Selected', message: 'Please select at least one product for the quote.' });
      return;
    }

    const leadId = lead.id || lead._id;
    
    // Format request payload strictly matching backend contract POST /api/leads/:id/quote
    const productsArray = selectedItems.map((i) => ({
      productId: i.productId,
      quantity: Number(i.quantity) || 1,
    }));

    const payload = {
      products: productsArray,
    };

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await generateQuote(leadId, payload);
      if (res.success) {
        setQuoteResult(res.quote || res.lead?.quote || res.data);
        addToast({
          type: 'success',
          title: 'Quote Generated',
          message: 'Authoritative backend quote breakdown produced successfully.',
        });
      } else {
        const userFriendlyErr = res.error?.includes('not iterable')
          ? 'Unable to process selected products array. Please verify your product selections.'
          : res.error || 'Server returned error calculating quote.';
        setErrorMessage(userFriendlyErr);
        addToast({ type: 'error', title: 'Quote Calculation Failed', message: userFriendlyErr });
      }
    } catch (err) {
      const msg = err?.message?.includes('not iterable')
        ? 'Payload shape mismatch with server controller. Retrying...'
        : err?.message || 'Failed to calculate quote.';
      setErrorMessage(msg);
      addToast({ type: 'error', title: 'Quote Error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Generate Quote — ${lead?.customerName || 'Lead'}`}
      description="Select locked organization products to calculate the final authoritative client quote."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {quoteResult ? (
          /* Backend Authoritative Calculation Display */
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Quote Issued & Saved to Backend</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                  The backend has computed margins, fees, and final grand total for {lead?.customerName}.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 space-y-3 text-xs sm:text-sm">
              <h5 className="font-bold text-slate-900 dark:text-slate-100 border-b pb-2">Quote Cost Breakdown</h5>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Base Equipment Total</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrency(quoteResult.baseTotal ?? quoteResult.basePrice ?? 0)}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Vendor Margin Applied</span>
                <span className="font-semibold text-emerald-600">
                  +{formatCurrency(quoteResult.marginApplied ?? quoteResult.margin ?? 0)}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Installation Fee</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  +{formatCurrency(quoteResult.installationPrice ?? quoteResult.installation ?? 0)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b pb-2">
                <span className="text-slate-500">Miscellaneous Charges</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  +{formatCurrency(quoteResult.miscCharges ?? quoteResult.misc ?? 0)}
                </span>
              </div>

              <div className="flex justify-between pt-2 text-base font-extrabold text-brand-600 dark:text-brand-400">
                <span>Final Client Quote Total</span>
                <span>{formatCurrency(quoteResult.finalTotal ?? quoteResult.total ?? 0)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="primary" onClick={onClose}>
                Done & Close
              </Button>
            </div>
          </div>
        ) : (
          /* Selection & Builder Form */
          <div className="space-y-5">
            {/* Locked Products Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-brand-600" /> Select Locked Products
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border rounded-xl border-slate-200 dark:border-slate-800">
                {lockedProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3 col-span-2">
                    No locked products available. Please lock products from the Marketplace first.
                  </p>
                ) : (
                  lockedProducts.map((p) => {
                    const prodId = p.id || p._id;
                    const isSelected = selectedItems.some((i) => i.productId === prodId);
                    return (
                      <button
                        key={prodId}
                        type="button"
                        onClick={() => handleAddProduct(p)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate">
                          <p className="font-bold truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{formatCurrency(p.basePrice)}</p>
                        </div>
                        <Plus className="w-4 h-4 shrink-0 text-brand-600" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Items Table */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Selected Items ({selectedItems.length})
              </label>
              {selectedItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  Click on locked products above to add them to this quote.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs"
                    >
                      <span className="font-semibold text-slate-900 dark:text-slate-100 flex-1 truncate">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                          className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 text-center font-bold text-slate-900 dark:text-slate-100 focus-ring"
                        />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 w-24 text-right">
                        {formatCurrency(item.basePrice * item.quantity)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitQuote}
                isLoading={loading}
                disabled={selectedItems.length === 0}
                leftIcon={<Calculator className="w-4 h-4" />}
              >
                Calculate & Submit Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
