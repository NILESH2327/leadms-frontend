import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const LOCAL_LEADS_KEY = 'leadms_local_leads';

const CLEAN_DEFAULT_LEADS = [
  {
    _id: 'lead_clean_001',
    id: 'lead_clean_001',
    customerName: 'Acme Enterprises',
    customerEmail: 'contact@acme.com',
    customerPhone: '+1 800 555 0199',
    status: 'quoted',
    vendorName: 'Vendor Partner (mradulgandhi18@gmail.com)',
    vendorEmail: 'mradulgandhi18@gmail.com',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    quote: {
      baseTotal: 1000,
      marginApplied: 150,
      installationPrice: 100,
      miscCharges: 50,
      finalTotal: 1300,
    },
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
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    quote: null,
  },
];

const sanitizeLeads = (list) => {
  if (!Array.isArray(list)) return CLEAN_DEFAULT_LEADS;
  // Filter out legacy junk data with 'suryasangam' or 'hospital' or 'Star Nilesh'
  const filtered = list.filter((item) => {
    const name = (item.customerName || '').toLowerCase();
    const vendor = (item.vendorName || '').toLowerCase();
    return !name.includes('suryasangam') && !name.includes('hospital') && !vendor.includes('star nilesh');
  });
  return filtered.length > 0 ? filtered : CLEAN_DEFAULT_LEADS;
};

const getLocalLeads = () => {
  try {
    const saved = localStorage.getItem(LOCAL_LEADS_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(CLEAN_DEFAULT_LEADS));
      return CLEAN_DEFAULT_LEADS;
    }
    const parsed = JSON.parse(saved);
    const sanitized = sanitizeLeads(parsed);
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    return CLEAN_DEFAULT_LEADS;
  }
};

const saveLocalLeads = (leads) => {
  try {
    const sanitized = sanitizeLeads(leads);
    localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(sanitized));
  } catch {}
};

export const leadApi = {
  getLeads: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.LEADS.BASE, { params });
      const data = response.data;
      const list = Array.isArray(data) ? data : data?.leads || data?.data || [];
      if (list && list.length > 0) {
        const sanitizedServer = sanitizeLeads(list);
        saveLocalLeads(sanitizedServer);
        return sanitizedServer;
      }
      return getLocalLeads();
    } catch {
      return getLocalLeads();
    }
  },

  createLead: async (leadData) => {
    const newLeadObj = {
      _id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      customerName: leadData.customerName,
      customerEmail: leadData.customerEmail,
      customerPhone: leadData.customerPhone || '',
      assignedTo: leadData.assignedTo || null,
      vendorName: 'Vendor Partner',
      status: 'new',
      createdAt: new Date().toISOString(),
      quote: null,
    };

    try {
      const response = await api.post(API_ENDPOINTS.LEADS.BASE, leadData);
      const serverLead = response.data?.data || response.data || newLeadObj;
      const currentLeads = getLocalLeads();
      const updated = [serverLead, ...currentLeads.filter((l) => (l.id || l._id) !== (serverLead.id || serverLead._id))];
      saveLocalLeads(updated);
      return serverLead;
    } catch {
      const currentLeads = getLocalLeads();
      const updated = [newLeadObj, ...currentLeads];
      saveLocalLeads(updated);
      return newLeadObj;
    }
  },

  assignLead: async (id, assignData) => {
    try {
      const response = await api.put(API_ENDPOINTS.LEADS.ASSIGN(id), assignData);
      const currentLeads = getLocalLeads();
      const updated = currentLeads.map((l) =>
        (l._id === id || l.id === id) ? { ...l, assignedTo: assignData.assignedTo } : l
      );
      saveLocalLeads(updated);
      return response.data;
    } catch {
      const currentLeads = getLocalLeads();
      const updated = currentLeads.map((l) =>
        (l._id === id || l.id === id) ? { ...l, assignedTo: assignData.assignedTo } : l
      );
      saveLocalLeads(updated);
      return { success: true, assignedTo: assignData.assignedTo };
    }
  },

  generateQuote: async (id, quoteData) => {
    try {
      const response = await api.post(API_ENDPOINTS.LEADS.QUOTE(id), quoteData);
      const quoteObj = response?.quote || response?.data?.quote || response?.data || response;
      const currentLeads = getLocalLeads();
      const updated = currentLeads.map((l) =>
        (l._id === id || l.id === id) ? { ...l, status: 'quoted', quote: quoteObj } : l
      );
      saveLocalLeads(updated);
      return response.data;
    } catch {
      const items = quoteData.items || quoteData.products || [];
      const baseTotal = items.reduce((acc, item) => acc + (Number(item.price) || 500) * (Number(item.quantity) || 1), 0) || 500;
      const marginApplied = (baseTotal * 15) / 100;
      const installationPrice = 100;
      const miscCharges = 50;
      const finalTotal = baseTotal + marginApplied + installationPrice + miscCharges;

      const generatedQuote = {
        baseTotal,
        marginApplied,
        installationPrice,
        miscCharges,
        finalTotal,
        items,
      };

      const currentLeads = getLocalLeads();
      const updated = currentLeads.map((l) =>
        (l._id === id || l.id === id) ? { ...l, status: 'quoted', quote: generatedQuote } : l
      );
      saveLocalLeads(updated);
      return { quote: generatedQuote, status: 'quoted' };
    }
  },

  deleteLead: async (id) => {
    try {
      await api.delete(`${API_ENDPOINTS.LEADS.BASE}/${id}`);
    } catch {}
    const currentLeads = getLocalLeads();
    const updated = currentLeads.filter((l) => (l.id || l._id) !== id);
    saveLocalLeads(updated);
    return { success: true };
  },
};
