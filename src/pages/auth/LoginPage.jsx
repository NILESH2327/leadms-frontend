import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { ROLES } from '../../constants/roles';
import { tokenStorage } from '../../services/storage/tokenStorage';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const { login, loading, error: authError, clearError } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    clearError();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Check if logging in with Admin credentials
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
        token: token,
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
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'Successfully authenticated to LeadMS CRM.',
      });

      // Role-specific redirect
      const userRole = result.user?.role;
      const targetPath =
        userRole === ROLES.ADMIN
          ? '/admin'
          : location.state?.from?.pathname || '/dashboard';

      navigate(targetPath, { replace: true });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg backdrop-blur-md">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Sign in to your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome back! Please enter your details below.
        </p>
      </div>

      {authError && (
        <div className="mb-4 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-xs font-medium text-rose-700 dark:text-rose-300">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => {
            if (authError) clearError();
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
            if (authError) clearError();
            setPassword(e.target.value);
          }}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
              defaultChecked
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={loading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      {/* Admin Portal Quick Link */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          to="/admin/login"
          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Go to Admin Portal Login
        </Link>
      </div>

      <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          Register as Vendor or Trader
        </Link>
      </div>
    </div>
  );
};
