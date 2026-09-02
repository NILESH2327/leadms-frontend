import { create } from 'zustand';
import { leadApi } from '../services/api/leadApi';

export const useLeadStore = create((set) => ({
  leads: [],
  selectedLead: null,
  loading: false,
  error: null,
  filterStatus: 'all',
  searchQuery: '',

  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),

  fetchLeads: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await leadApi.getLeads(params);
      const leadsList = Array.isArray(data) ? data : data?.leads || data?.data || [];
      set({ leads: leadsList, loading: false });
      return { success: true, leads: leadsList };
    } catch (err) {
      const msg = err?.message || 'Failed to load leads';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  createLead: async (leadData) => {
    set({ loading: true, error: null });
    try {
      const newLead = await leadApi.createLead(leadData);
      const created = newLead?.data || newLead;
      set((state) => ({
        leads: [created, ...state.leads],
        loading: false,
      }));
      return { success: true, lead: created };
    } catch (err) {
      const msg = err?.message || 'Failed to create lead';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  assignLead: async (id, assignData) => {
    set({ loading: true, error: null });
    try {
      const updated = await leadApi.assignLead(id, assignData);
      const leadObj = updated?.data || updated;
      set((state) => ({
        leads: state.leads.map((l) => (l.id === id || l._id === id ? { ...l, ...leadObj } : l)),
        loading: false,
      }));
      return { success: true, lead: leadObj };
    } catch (err) {
      const msg = err?.message || 'Failed to assign lead';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  generateQuote: async (id, quoteData) => {
    set({ loading: true, error: null });
    try {
      const response = await leadApi.generateQuote(id, quoteData);
      const extractedQuote = response?.quote || response?.data?.quote || response?.data || response;
      const updatedStatus = response?.lead?.status || response?.status || 'quoted';

      set((state) => ({
        leads: state.leads.map((l) =>
          l.id === id || l._id === id
            ? { ...l, quote: extractedQuote, status: updatedStatus }
            : l
        ),
        loading: false,
      }));
      return { success: true, quote: extractedQuote };
    } catch (err) {
      const msg = err?.message || 'Failed to generate quote';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  deleteLead: async (id) => {
    try {
      await leadApi.deleteLead(id);
    } catch {}
    set((state) => ({
      leads: state.leads.filter((l) => (l.id || l._id) !== id),
    }));
    return { success: true };
  },
}));
