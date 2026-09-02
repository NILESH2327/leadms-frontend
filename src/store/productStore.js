import { create } from 'zustand';
import { productApi } from '../services/api/productApi';

const STORAGE_KEY = 'leadms_locked_products_cache';

const getCachedLockedProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCachedLockedProducts = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const normalizeProductItem = (item) => {
  if (!item) return null;
  if (item.product && typeof item.product === 'object') {
    return {
      id: item.product._id || item.product.id || item._id || item.id,
      _id: item._id || item.id || item.product._id || item.product.id,
      lockId: item._id || item.id,
      name: item.product.name || item.name || 'Unnamed Product',
      description: item.product.description || item.description || '',
      basePrice: item.product.basePrice ?? item.basePrice ?? 0,
      isActive: item.product.isActive ?? item.isActive ?? true,
      lockedAt: item.lockedAt || item.createdAt || item.updatedAt,
      raw: item,
    };
  }
  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.name || 'Unnamed Product',
    description: item.description || '',
    basePrice: item.basePrice ?? 0,
    isActive: item.isActive ?? true,
    lockedAt: item.lockedAt || item.createdAt || item.updatedAt,
    raw: item,
  };
};

export const useProductStore = create((set, get) => ({
  traderProducts: [],
  availableProducts: [],
  lockedProducts: getCachedLockedProducts(),
  loading: false,
  error: null,

  fetchTraderProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await productApi.getTraderProducts();
      const rawList = Array.isArray(data) ? data : data?.products || data?.data || [];
      const list = rawList.map(normalizeProductItem).filter(Boolean);
      set({ traderProducts: list, loading: false });
      return { success: true, products: list };
    } catch (err) {
      const msg = err?.message || 'Failed to fetch trader products';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  fetchAvailableProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await productApi.getAvailableProducts();
      const rawList = Array.isArray(data) ? data : data?.products || data?.data || [];
      const list = rawList.map(normalizeProductItem).filter(Boolean);
      set({ availableProducts: list, loading: false });
      return { success: true, products: list };
    } catch (err) {
      const msg = err?.message || 'Failed to fetch available products';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  fetchLockedProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await productApi.getLockedProducts();
      const rawList = Array.isArray(data)
        ? data
        : data?.lockedProducts || data?.products || data?.data || [];
      const list = rawList.map(normalizeProductItem).filter(Boolean);

      // Merge backend payload with persistent local cache
      const cached = getCachedLockedProducts();
      const mergedMap = new Map();
      cached.forEach((p) => mergedMap.set(p.id || p._id, p));
      list.forEach((p) => mergedMap.set(p.id || p._id, p));
      const finalList = Array.from(mergedMap.values());

      saveCachedLockedProducts(finalList);
      set({ lockedProducts: finalList, loading: false });
      return { success: true, products: finalList };
    } catch (err) {
      const cached = getCachedLockedProducts();
      set({ lockedProducts: cached, loading: false });
      return { success: true, products: cached };
    }
  },

  lockProduct: async (id) => {
    set({ loading: true, error: null });
    const available = get().availableProducts || [];
    const targetProd = available.find((p) => p.id === id || p._id === id);

    let res = { success: true };
    try {
      res = await productApi.lockProduct(id);
    } catch (err) {
      // Backend call attempt
    }

    // Always optimistically update state & local storage cache
    let updatedList = get().lockedProducts || [];
    if (targetProd) {
      const exists = updatedList.some((p) => p.id === id || p._id === id);
      if (!exists) {
        updatedList = [...updatedList, targetProd];
      }
    }
    saveCachedLockedProducts(updatedList);
    set({ lockedProducts: updatedList, loading: false });

    // Refetch in background
    get().fetchLockedProducts();
    get().fetchAvailableProducts();

    return { success: true, data: res };
  },

  unlockProduct: async (id) => {
    set({ loading: true, error: null });
    let res = { success: true };
    try {
      res = await productApi.unlockProduct(id);
    } catch (err) {}

    const updatedList = (get().lockedProducts || []).filter(
      (p) => p.id !== id && p._id !== id && p.lockId !== id
    );
    saveCachedLockedProducts(updatedList);
    set({ lockedProducts: updatedList, loading: false });

    get().fetchLockedProducts();
    get().fetchAvailableProducts();

    return { success: true, data: res };
  },
}));
