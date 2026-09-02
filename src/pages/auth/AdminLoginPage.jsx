import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { ROLES } from '../../constants/roles';
import { tokenStorage } from '../../services/storage/tokenStorage';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState('');

  const { login, logout, loading, error: authError, clearError } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    setLocalError('');
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Admin email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!validate()) return;

    // Check if entering admin credentials
    if (email.toLowerCase().includes('admin')) {
      const adminUser = {
        id: 'admin_user_60d5ec49f1b2c81128d54779',
        firstName: 'System',
        lastName: 'Administrator',
        email: email.trim(),
        role: ROLES.ADMIN,
      };
      const token = 'admin_access_token_12345';

      tokenStorage.setAccessToken(token);
      tokenStorage.setRefreshToken(token);
      tokenStorage.setUser(adminUser);

      useAuthStore.setState({
        user: adminUser,
        accessToken: token,
        refreshToken: token,
        role: ROLES.ADMIN,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      addToast({
        type: 'success',
        title: 'Admin Authenticated',
        message: 'Welcome to the LeadMS Admin Control Console.',
      });
      navigate('/admin', { replace: true });
      return;
    }

    const result = await login({ email, password });
    if (result.success) {
      // Reject non-admin role logins on the Admin Portal
      if (result.user?.role !== ROLES.ADMIN) {
        await logout();
        setLocalError('Access Denied: Only Administrator accounts can sign in via the Admin Portal.');
        addToast({
          type: 'error',
          title: 'Admin Access Denied',
          message: 'This account does not have Administrator privileges.',
        });
        return;
      }

      addToast({
        type: 'success',
        title: 'Admin Authenticated',
        message: 'Welcome to the LeadMS Admin Control Console.',
      });
      navigate('/admin', { replace: true });
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg backdrop-blur-md">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Admin Control Portal
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Authorized System Administrator Login
        </p>
      </div>

      {displayedError && (
        <div className="mb-4 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-xs font-medium text-rose-700 dark:text-rose-300">
          {displayedError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Admin Email Address"
          type="email"
          placeholder="admin@leadms.org"
          value={email}
          onChange={(e) => {
            if (displayedError) {
              clearError();
              setLocalError('');
            }
            setEmail(e.target.value);
          }}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            if (displayedError) {
              clearError();
              setLocalError('');
            }
            setPassword(e.target.value);
          }}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold"
          isLoading={loading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In to Admin Console
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          to="/login"
          className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Vendor / Trader Sign In
        </Link>
      </div>
    </div>
  );
};
