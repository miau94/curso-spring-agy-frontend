import { create } from 'zustand';
import { invoiceService } from '../services/invoiceService';
import type { InvoiceDto, InvoiceStatus } from '../types/api';

interface InvoiceState {
  invoices: InvoiceDto[];
  loading: boolean;
  searchQuery: string;
  statusFilter: InvoiceStatus | 'ALL';
  customerFilter: number | 'ALL';
  currentPage: number;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: InvoiceStatus | 'ALL') => void;
  setCustomerFilter: (customerId: number | 'ALL') => void;
  setCurrentPage: (page: number) => void;
  fetchInvoices: () => Promise<InvoiceDto[]>;
  createInvoice: (payload: InvoiceDto) => Promise<InvoiceDto>;
  updateInvoice: (id: number, payload: InvoiceDto) => Promise<InvoiceDto>;
  deleteInvoice: (id: number) => Promise<void>;
}

let inflightInvoicesPromise: Promise<InvoiceDto[]> | null = null;

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  loading: false,
  searchQuery: '',
  statusFilter: 'ALL',
  customerFilter: 'ALL',
  currentPage: 1,

  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, currentPage: 1 }),
  setCustomerFilter: (customerFilter) => set({ customerFilter, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  fetchInvoices: async () => {
    if (inflightInvoicesPromise) {
      return inflightInvoicesPromise;
    }

    set({ loading: true });
    inflightInvoicesPromise = invoiceService
      .getAll()
      .then((data) => {
        set({ invoices: data });
        return data;
      })
      .finally(() => {
        inflightInvoicesPromise = null;
        set({ loading: false });
      });

    return inflightInvoicesPromise;
  },

  createInvoice: async (payload) => {
    const created = await invoiceService.create(payload);
    set((state) => ({ invoices: [created, ...state.invoices] }));
    return created;
  },

  updateInvoice: async (id, payload) => {
    const updated = await invoiceService.update(id, payload);
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === updated.id ? updated : inv)),
    }));
    return updated;
  },

  deleteInvoice: async (id) => {
    await invoiceService.remove(id);
    set((state) => ({
      invoices: state.invoices.filter((inv) => inv.id !== id),
    }));
  },
}));
