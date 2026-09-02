import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api/authApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err?.message || 'Failed to send password reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-soft-lg text-center">
        <div className="w-12 h-12 bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Check your inbox</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          If an account exists for <strong className="text-slate-800 dark:text-slate-200">{email}</strong>, you will receive password reset instructions.
        </p>
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <Link to="/login">
            <Button variant="outline" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
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
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Forgot Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your email and we'll send you instructions to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-xs font-medium text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link to="/login" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};
