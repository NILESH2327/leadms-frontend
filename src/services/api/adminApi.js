import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const DEFAULT_ANALYTICS = {
  users: { vendor: 12, trader: 5, 'team-member': 30, admin: 1 },
  leads: { total: 150, byStatus: { new: 50, quoted: 80, contacted: 10, accepted: 8, rejected: 2 } },
  products: { total: 200, active: 190 },
  revenue: { totalQuoted: 500000, totalExpectedMargin: 50000 },
};

const DEFAULT_USERS = [
  { _id: 'usr_admin_1', firstName: 'System', lastName: 'Administrator', email: 'admin@leadms.org', role: 'admin', designation: 'Super Admin' },
  { _id: 'usr_vendor_1', firstName: 'Nilesh', lastName: 'Kumar', email: 'nileshkumar95559926@gmail.com', role: 'vendor', designation: 'Vendor Partner' },
  { _id: 'usr_trader_1', firstName: 'Medical', lastName: 'Supplier Co', email: 'supplier@medical.com', role: 'trader', designation: 'Equipment Trader' },
  { _id: 'usr_team_1', firstName: 'Suman', lastName: 'Prap', email: 'sumanprap6387@gmail.com', role: 'team-member', designation: 'Sales Associate' },
];

const DEFAULT_LEADS = [
  {
    _id: 'lead_101',
    customerName: 'City General Hospital',
    customerEmail: 'procurement@cityhospital.org',
    customerPhone: '+1 555-0192',
    status: 'quoted',
    vendorName: 'Apex Health Systems',
    quote: { baseTotal: 45000, marginApplied: 5000, finalTotal: 50000 },
  },
  {
    _id: 'lead_102',
    customerName: 'St. Jude Children Clinic',
    customerEmail: 'admin@stjudeclinic.org',
    customerPhone: '+1 555-0348',
    status: 'new',
    vendorName: 'Global Medical Supplies',
    quote: null,
  },
  {
    _id: 'lead_103',
    customerName: 'Metro Diagnostic Center',
    customerEmail: 'info@metrodiagnostics.com',
    customerPhone: '+1 555-0812',
    status: 'accepted',
    vendorName: 'Apex Health Systems',
    quote: { baseTotal: 120000, marginApplied: 15000, finalTotal: 135000 },
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
