import { create } from 'zustand';
import { customerService } from '../services/customerService';
import type { CustomerDto } from '../types/api';

interface CustomerState {
  customers: CustomerDto[];
  loading: boolean;
  searchQuery: string;
  viewMode: 'table' | 'cards';
  currentPage: number;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'table' | 'cards') => void;
  setCurrentPage: (page: number) => void;
  fetchCustomers: () => Promise<CustomerDto[]>;
  createCustomer: (payload: CustomerDto) => Promise<CustomerDto>;
  updateCustomer: (id: number, payload: CustomerDto) => Promise<CustomerDto>;
  deleteCustomer: (id: number) => Promise<void>;
}

// Deduplicación de peticiones concurrentes (client-swr-dedup)
let inflightCustomersPromise: Promise<CustomerDto[]> | null = null;

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: false,
  searchQuery: '',
  viewMode: 'table',
  currentPage: 1,

  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setViewMode: (viewMode) => set({ viewMode }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchCustomers: async () => {
    if (inflightCustomersPromise) {
      return inflightCustomersPromise;
    }

    set({ loading: true });
    inflightCustomersPromise = customerService
      .getAll()
      .then((data) => {
        set({ customers: data });
        return data;
      })
      .finally(() => {
        inflightCustomersPromise = null;
        set({ loading: false });
      });

    return inflightCustomersPromise;
  },

  createCustomer: async (payload) => {
    const created = await customerService.create(payload);
    set((state) => ({ customers: [created, ...state.customers] }));
    return created;
  },

  updateCustomer: async (id, payload) => {
    const updated = await customerService.update(id, payload);
    set((state) => ({
      customers: state.customers.map((c) => (c.id === updated.id ? updated : c)),
    }));
    return updated;
  },

  deleteCustomer: async (id) => {
    await customerService.remove(id);
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    }));
  },
}));
