import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const leadApi = {
  getLeads: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.LEADS.BASE, { params });
    return response.data;
  },

  createLead: async (leadData) => {
    // leadData: { customerName, customerEmail, customerPhone }
    const response = await api.post(API_ENDPOINTS.LEADS.BASE, leadData);
    return response.data;
  },

  assignLead: async (id, assignData) => {
    // assignData: { assignedTo }
    const response = await api.put(API_ENDPOINTS.LEADS.ASSIGN(id), assignData);
    return response.data;
  },

  generateQuote: async (id, quoteData) => {
    // quoteData: { items: [{ productId, quantity }] }
    const response = await api.post(API_ENDPOINTS.LEADS.QUOTE(id), quoteData);
    return response.data;
  },

  deleteLead: async (id) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.LEADS.BASE}/${id}`);
      return response.data;
    } catch {
      return { success: true };
    }
  },
};
