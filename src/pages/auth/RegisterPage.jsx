import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, Store, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { ROLES } from '../../constants/roles';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ROLES.VENDOR, // Default role choice between vendor & trader
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, loading, error: authError, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, []);

  const handleChange = (e) => {
    if (authError) clearError();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register(formData);
    if (result.success) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Check your email</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          We have sent a verification link to <strong className="text-slate-800 dark:text-slate-200">{formData.email}</strong>. Please confirm your email address to complete registration.
        </p>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link to="/login" className="block">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg backdrop-blur-md">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Join LeadMS to streamline your CRM, leads, and products.
        </p>
      </div>

      {authError && (
        <div className="mb-4 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-xs font-medium text-rose-700 dark:text-rose-300">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Choice Cards */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Select Account Role *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: ROLES.VENDOR }))}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                formData.role === ROLES.VENDOR
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <Store className="w-4 h-4 text-brand-600" /> Vendor Partner
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Lock products, manage leads, configure margins & quote clients.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: ROLES.TRADER }))}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                formData.role === ROLES.TRADER
                  ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                <Building2 className="w-4 h-4 text-blue-600" /> Trader / Supplier
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                List products, set base prices, manage availability for vendors.
              </p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            leftIcon={<User className="w-4 h-4" />}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Minimum 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={loading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
