# LeadMS — Enterprise Lead Management System (Frontend)

LeadMS is a premium, modern, responsive CRM frontend designed for managing leads, products, quote generation, vendor pricing configurations, and administrative analytics.

---

## 🚀 Project Overview

- **Frontend Only**: Standalone React application built with Vite, Tailwind CSS, Zustand, and Lucide React.
- **Backend Integration**: Communicates via HTTP REST APIs with the external backend endpoint: `https://leadcrmintern-ss-v1.vercel.app/api`.
- **Role-Based Access Control**: Tailored workspaces and protected routes for 4 roles: `admin`, `vendor`, `trader`, and `team-member`.

---

## 🛠️ Tech Stack

- **Core**: React 18, Vite 5, JavaScript (ESNext)
- **Routing**: React Router DOM v6
- **API Client**: Axios with centralized interceptors & token refresh queueing
- **State Management**: Zustand v4 with persistent storage helpers
- **Styling**: Tailwind CSS v3 with HSL design tokens, custom shadows, and dark mode support
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=https://leadcrmintern-ss-v1.vercel.app/api
```

---

## 💻 Local Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🛡️ User Roles & Features

| Role | Allowed Access & Capability |
| :--- | :--- |
| **`admin`** | Access Admin Overview, User Directory, System Leads, and Analytics KPIs. |
| **`vendor`** | Vendor Dashboard, Lead & Quote Management, Product Locking, Pricing Margin Configuration (`marginPercentage`, `installationPrice`, `miscCharges`), Team Member Invitations. |
| **`trader`** | Trader Dashboard, Product Catalog Management (Create, Edit, Delete, Activate/Deactivate base prices). |
| **`team-member`** | Team Dashboard, Assigned Lead Management, Access to Vendor's Locked Products for Quote Generation. |

---

## 🏗️ Architecture Overview

- **`src/app/`**: App root entry, provider setup, and central router with auth and role guards.
- **`src/services/api/`**: Centralized Axios client (`axios.js`) with automatic `Authorization: Bearer <token>` attachment, 401 token refresh queueing, and normalized error responses. Modular API services (`authApi.js`, `leadApi.js`, `productApi.js`, `vendorApi.js`, `adminApi.js`).
- **`src/store/`**: Lightweight Zustand stores for auth, UI theme/toasts, leads, products, and vendor profile state.
- **`src/components/ui/`**: Reusable design primitives (Button, Input, Card, Badge, Modal, Skeleton, Toast, Table).
- **`src/components/layout/`**: Header with profile menu, dynamic responsive Sidebar with desktop collapse & mobile slide-out drawer, `ProtectedRoute`, and `RoleRoute`.

---

## 🚀 Deployment Instructions

1. Configure environment variable `VITE_API_BASE_URL` in your deployment platform (e.g., Vercel, Netlify, Cloudflare Pages).
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Configure SPA fallback redirect rule (`/*` -> `/index.html`).
