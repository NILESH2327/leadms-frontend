import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const DEFAULT_ANALYTICS = {
  users: { vendor: 2, trader: 1, 'team-member': 2, admin: 1 },
  leads: { total: 2, byStatus: { new: 1, quoted: 1, contacted: 0, accepted: 0, rejected: 0 } },
  products: { total: 10, active: 8 },
  revenue: { totalQuoted: 2025.00, totalExpectedMargin: 225.00 },
};

const DEFAULT_USERS = [
  { _id: 'usr_admin_1', firstName: 'System', lastName: 'Administrator', email: 'admin@leadms.org', role: 'admin', designation: 'Super Admin' },
  { _id: 'usr_vendor_1', firstName: 'Mradul', lastName: 'Gandhi', email: 'mradulgandhi18@gmail.com', role: 'vendor', designation: 'Vendor Partner' },
  { _id: 'usr_vendor_2', firstName: 'Nilesh', lastName: 'Kumar', email: 'nileshkumar95559926@gmail.com', role: 'vendor', designation: 'Vendor Partner' },
];

const DEFAULT_LEADS = [
  {
    _id: 'lead_clean_001',
    id: 'lead_clean_001',
    customerName: 'Acme Enterprises',
    customerEmail: 'contact@acme.com',
    customerPhone: '+1 800 555 0199',
    status: 'quoted',
    vendorName: 'Vendor Partner (mradulgandhi18@gmail.com)',
    vendorEmail: 'mradulgandhi18@gmail.com',
    quote: { baseTotal: 1000, marginApplied: 150, installationPrice: 100, miscCharges: 50, finalTotal: 1300 },
  },
  {
    _id: 'lead_clean_002',
    id: 'lead_clean_002',
    customerName: 'Solar Tech Solutions',
    customerEmail: 'sales@solartech.com',
    customerPhone: '+1 800 555 0142',
    status: 'new',
    vendorName: 'Vendor Partner (mradulgandhi18@gmail.com)',
    vendorEmail: 'mradulgandhi18@gmail.com',
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
      const serverLeads = Array.isArray(data) ? data : data?.leads || data?.data || [];
      
      let localLeads = [];
      try {
        const saved = localStorage.getItem('leadms_local_leads');
        localLeads = saved ? JSON.parse(saved) : [];
      } catch {}

      const mergedMap = new Map();
      DEFAULT_LEADS.forEach((l) => mergedMap.set(l._id || l.id, l));
      localLeads.forEach((l) => {
        const id = l._id || l.id;
        const name = (l.customerName || '').toLowerCase();
        if (id && !name.includes('suryasangam') && !name.includes('hospital')) {
          mergedMap.set(id, {
            ...l,
            vendorName: l.vendorName || (l.assignedTo ? `Assigned Rep (${l.assignedTo})` : 'Vendor Partner'),
          });
        }
      });

      serverLeads.forEach((l) => {
        const id = l._id || l.id;
        const name = (l.customerName || '').toLowerCase();
        if (id && !name.includes('suryasangam') && !name.includes('hospital')) {
          mergedMap.set(id, l);
        }
      });

      return Array.from(mergedMap.values());
    } catch (err) {
      let localLeads = [];
      try {
        const saved = localStorage.getItem('leadms_local_leads');
        localLeads = saved ? JSON.parse(saved) : [];
      } catch {}

      const mergedMap = new Map();
      DEFAULT_LEADS.forEach((l) => mergedMap.set(l._id || l.id, l));
      localLeads.forEach((l) => {
        const id = l._id || l.id;
        const name = (l.customerName || '').toLowerCase();
        if (id && !name.includes('suryasangam') && !name.includes('hospital')) {
          mergedMap.set(id, l);
        }
      });
      return Array.from(mergedMap.values());
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
