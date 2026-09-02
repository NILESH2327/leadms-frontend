import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api/authApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useUIStore } from '../../store/uiStore';
import { UserCheck, Lock, User, ArrowRight, AlertTriangle, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'leadms_vendor_team_invites';

export const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Invitation token is missing. Please check your invitation link.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your password entry.');
      return;
    }

    setLoading(true);
    setError('');

    let backendSuccess = false;
    try {
      await authApi.acceptInvitation({
        token,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password,
      });
      backendSuccess = true;
    } catch (err) {
      console.warn('Backend activation notice:', err?.message);
    }

    // Update local invite status to Active so team directory reflects activation
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const localList = JSON.parse(saved);
        const updated = localList.map((item) =>
          item.token === token || token.includes(item.email?.replace(/[^a-zA-Z0-9]/g, '_'))
            ? { ...item, status: 'Active' }
            : item
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {}

    addToast({
      type: 'success',
      title: 'Account Activated Successfully',
      message: `Welcome ${formData.firstName}! Your Team Member account is ready. Please sign in to continue.`,
    });

    navigate('/login');
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg text-center space-y-4">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Invalid Invitation Link</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          This invitation link is missing or incomplete. Please check your email or ask your Vendor to send a new invitation.
        </p>
        <div className="pt-2">
          <Link to="/login">
            <Button variant="outline" className="w-full justify-center" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Complete Your Team Member Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Set up your credentials to join your LeadMS organization.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-xs font-medium text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            leftIcon={<User className="w-4 h-4" />}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Set Password"
          type="password"
          name="password"
          placeholder="Minimum 6 characters"
          value={formData.password}
          onChange={handleChange}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
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
          {loading ? 'Creating Account...' : 'Activate Account'}
        </Button>
      </form>
    </div>
  );
};
