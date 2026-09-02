import React, { useEffect, useState } from 'react';
import { useVendorStore } from '../../store/vendorStore';
import { useUIStore } from '../../store/uiStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { ErrorAlert } from '../../components/feedback/ErrorAlert';
import { formatCurrency } from '../../utils/formatters';
import { Sliders, Save, Percent, DollarSign, Calculator, Info, CheckCircle2 } from 'lucide-react';

export const VendorProfilePage = () => {
  const { profile, fetchProfile, updateProfile, loading, error } = useVendorStore();
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState({
    marginPercentage: 10,
    installationPrice: 1500,
    miscCharges: 250,
  });
  const [submitting, setSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchProfile().then((res) => {
      if (res.success && res.profile) {
        setFormData({
          marginPercentage: res.profile.marginPercentage ?? 10,
          installationPrice: res.profile.installationPrice ?? 1500,
          miscCharges: res.profile.miscCharges ?? 250,
        });
      }
    });
  }, []);

  const handleChange = (field, value) => {
    const num = Math.max(0, Number(value) || 0);
    setFormData((prev) => ({ ...prev, [field]: num }));
    setIsDirty(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Pricing Configuration Saved',
          message: 'Vendor profit margin and fee structure updated successfully.',
        });
        setIsDirty(false);
      } else {
        addToast({ type: 'error', title: 'Update Failed', message: res.error });
      }
    } catch (err) {
      addToast({ type: 'error', title: 'Update Failed', message: err?.message || 'Could not save pricing configuration.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Preview calculation breakdown logic
  const sampleBaseTotal = 100000;
  const sampleMargin = (sampleBaseTotal * (formData.marginPercentage || 0)) / 100;
  const sampleInstallation = Number(formData.installationPrice) || 0;
  const sampleMisc = Number(formData.miscCharges) || 0;
  const sampleFinalTotal = sampleBaseTotal + sampleMargin + sampleInstallation + sampleMisc;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Vendor Pricing Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure default profit margins, installation fees, and operational charges applied to customer quotes.
          </p>
        </div>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchProfile} />}

      {loading && !profile ? (
        <SkeletonCard />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-600" /> Vendor Profit Margin & Fee Structure
                </CardTitle>
                <CardDescription>
                  These rates are automatically applied by the backend server when generating client quotes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  <Input
                    label="Vendor Profit Margin (%)"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.marginPercentage}
                    onChange={(e) => handleChange('marginPercentage', e.target.value)}
                    helperText="Percentage markup added to supplier product base price."
                    leftIcon={<Percent className="w-4 h-4" />}
                    required
                  />

                  <Input
                    label="Standard Installation Price ($)"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.installationPrice}
                    onChange={(e) => handleChange('installationPrice', e.target.value)}
                    helperText="Default installation/setup fee applied to applicable quotes."
                    leftIcon={<DollarSign className="w-4 h-4" />}
                    required
                  />

                  <Input
                    label="Miscellaneous Charges ($)"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.miscCharges}
                    onChange={(e) => handleChange('miscCharges', e.target.value)}
                    helperText="Additional operational/documentation/logistics charges."
                    leftIcon={<DollarSign className="w-4 h-4" />}
                    required
                  />

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className={`text-xs font-semibold ${isDirty ? 'text-amber-500' : 'text-slate-400'}`}>
                      {isDirty ? '● Unsaved changes' : '✓ All settings saved'}
                    </span>
                    <Button variant="primary" type="submit" isLoading={submitting} leftIcon={<Save className="w-4 h-4" />}>
                      {submitting ? 'Saving Configuration...' : 'Save Configuration'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border-slate-700 shadow-soft-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-sm">
                  <Calculator className="w-4 h-4 text-brand-400" /> Formula Calculation Preview
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Example calculation on a $100,000 base equipment selection:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Base Equipment</span>
                  <span className="font-semibold">{formatCurrency(sampleBaseTotal)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">+ Vendor Margin ({formData.marginPercentage}%)</span>
                  <span className="font-semibold text-emerald-400">+{formatCurrency(sampleMargin)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">+ Standard Installation</span>
                  <span className="font-semibold text-slate-200">+{formatCurrency(sampleInstallation)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">+ Miscellaneous Charges</span>
                  <span className="font-semibold text-slate-200">+{formatCurrency(sampleMisc)}</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-extrabold text-brand-300">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(sampleFinalTotal)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 text-xs text-brand-900 dark:text-brand-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                <strong>Source of Truth:</strong> Official quote totals are calculated authoritatively by the backend server when generating a formal client quote.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
