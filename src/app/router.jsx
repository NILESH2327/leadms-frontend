import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { RoleRoute } from '../components/layout/RoleRoute';
import { useAuthStore } from '../store/authStore';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { AcceptInvitationPage } from '../pages/auth/AcceptInvitationPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';

// Dashboard Shell
import { DashboardShellPage } from '../pages/dashboard/DashboardShellPage';

// Feature Pages
import { LeadsPage } from '../pages/leads/LeadsPage';
import { TraderProductsPage } from '../pages/products/TraderProductsPage';
import { VendorProductsPage } from '../pages/products/VendorProductsPage';
import { LockedProductsPage } from '../pages/products/LockedProductsPage';
import { VendorProfilePage } from '../pages/vendor/VendorProfilePage';
import { TeamMembersPage } from '../pages/vendor/TeamMembersPage';

// Admin Suite Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminLeadsPage } from '../pages/admin/AdminLeadsPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';

// Error Pages
import { NotFoundPage } from '../pages/errors/NotFoundPage';
import { AccessDeniedPage } from '../pages/errors/AccessDeniedPage';

import { ROLES } from '../constants/roles';

// Smart switcher component for /products route based on user role
const ProductRouteSwitcher = () => {
  const { role } = useAuthStore();
  if (role === ROLES.TRADER) return <TraderProductsPage />;
  return <VendorProductsPage />;
};

export const router = createBrowserRouter([
  // Auth Public Routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/accept-invitation', element: <AcceptInvitationPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/confirm-email', element: <VerifyEmailPage /> },
    ],
  },

  // Protected Dashboard Routes
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <DashboardShellPage /> },

      // Feature Pages
      { path: '/leads', element: <LeadsPage /> },
      { path: '/products', element: <ProductRouteSwitcher /> },
      { path: '/products/locked', element: <LockedProductsPage /> },

      // Vendor Pages
      {
        path: '/vendor/profile',
        element: (
          <RoleRoute allowedRoles={[ROLES.VENDOR]}>
            <VendorProfilePage />
          </RoleRoute>
        ),
      },
      {
        path: '/vendor/team',
        element: (
          <RoleRoute allowedRoles={[ROLES.VENDOR]}>
            <TeamMembersPage />
          </RoleRoute>
        ),
      },

      // Admin Restricted Pages
      {
        path: '/admin',
        element: (
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
          </RoleRoute>
        ),
      },
      {
        path: '/admin/users',
        element: (
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminUsersPage />
          </RoleRoute>
        ),
      },
      {
        path: '/admin/leads',
        element: (
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLeadsPage />
          </RoleRoute>
        ),
      },
      {
        path: '/admin/analytics',
        element: (
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminAnalyticsPage />
          </RoleRoute>
        ),
      },

      { path: '/profile', element: <DashboardShellPage /> },
      { path: '/access-denied', element: <AccessDeniedPage /> },
    ],
  },

  // Fallback Catch All
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
