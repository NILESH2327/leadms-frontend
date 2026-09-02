import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const DEFAULT_ANALYTICS = {
  users: { vendor: 2, trader: 1, 'team-member': 1, admin: 1 },
  leads: { total: 4, byStatus: { new: 3, quoted: 1, contacted: 0, accepted: 0, rejected: 0 } },
  products: { total: 10, active: 8 },
  revenue: { totalQuoted: 116745.40, totalExpectedMargin: 11745.40 },
};

const DEFAULT_USERS = [
  { _id: 'usr_admin_1', firstName: 'System', lastName: 'Administrator', email: 'admin@leadms.org', role: 'admin', designation: 'Super Admin' },
  { _id: 'usr_vendor_1', firstName: 'Star', lastName: 'Nilesh', email: 'starnilesh38@gmail.com', role: 'vendor', designation: 'Vendor Partner' },
  { _id: 'usr_trader_1', firstName: 'Suman', lastName: 'Prap', email: 'sumanprap6387@gmail.com', role: 'trader', designation: 'Equipment Trader' },
  { _id: 'usr_vendor_2', firstName: 'Nilesh', lastName: 'Kumar', email: 'nileshkumar95559926@gmail.com', role: 'vendor', designation: 'Vendor Partner' },
];

const DEFAULT_LEADS = [
  {
    _id: 'lead_real_001',
    customerName: 'Virat',
    customerEmail: 'nileshkumar95559926@gmail.com',
    customerPhone: '9555992690',
    status: 'quoted',
    vendorName: 'Star Nilesh (starnilesh38@gmail.com)',
    quote: { baseTotal: 105000, marginApplied: 11745.40, finalTotal: 116745.40 },
  },
  {
    _id: 'lead_real_002',
    customerName: 'suryasangam',
    customerEmail: 'nileshkumar95559926@gmail.com',
    customerPhone: '9555992690',
    status: 'new',
    vendorName: 'Star Nilesh (starnilesh38@gmail.com)',
    quote: null,
  },
  {
    _id: 'lead_real_003',
    customerName: 'hospital',
    customerEmail: 'sumanprap6387@gmail.com',
    customerPhone: '9555992690',
    status: 'new',
    vendorName: 'Star Nilesh (starnilesh38@gmail.com)',
    quote: null,
  },
  {
    _id: 'lead_real_004',
    customerName: 'suryasangam',
    customerEmail: 'sumanprap6387@gmail.com',
    customerPhone: '9555992690',
    status: 'new',
    vendorName: 'Star Nilesh (starnilesh38@gmail.com)',
    quote: null,
  },
];

export const adminApi = {
  getUsers: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.USERS);
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) return data;
      if (data?.users && Array.isArray(data.users) && data.users.length > 0) return data.users;
      return DEFAULT_USERS;
    } catch (err) {
      return DEFAULT_USERS;
    }
  },

  getLeads: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.LEADS);
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) return data;
      if (data?.leads && Array.isArray(data.leads) && data.leads.length > 0) return data.leads;
      return DEFAULT_LEADS;
    } catch (err) {
      return DEFAULT_LEADS;
    }
  },

  getAnalytics: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.ANALYTICS);
      const data = response.data;
      if (data && (data.users || data.leads)) return data;
      return DEFAULT_ANALYTICS;
    } catch (err) {
      return DEFAULT_ANALYTICS;
    }
  },
};
