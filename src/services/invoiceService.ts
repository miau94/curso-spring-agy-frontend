import type { InvoiceDto } from '../types/api';
import { apiClient } from './apiClient';

export const invoiceService = {
  async getAll(customerId?: number): Promise<InvoiceDto[]> {
    const params = customerId ? { customerId } : undefined;
    const response = await apiClient.get<InvoiceDto[]>('/api/invoices', { params });
    return response.data;
  },

  async getById(id: number): Promise<InvoiceDto> {
    const response = await apiClient.get<InvoiceDto>(`/api/invoices/${id}`);
    return response.data;
  },

  async getByCustomerId(customerId: number): Promise<InvoiceDto[]> {
    const response = await apiClient.get<InvoiceDto[]>(`/api/invoices/customer/${customerId}`);
    return response.data;
  },

  async create(invoice: InvoiceDto): Promise<InvoiceDto> {
    const response = await apiClient.post<InvoiceDto>('/api/invoices', invoice);
    return response.data;
  },

  async update(id: number, invoice: InvoiceDto): Promise<InvoiceDto> {
    const response = await apiClient.put<InvoiceDto>(`/api/invoices/${id}`, invoice);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/invoices/${id}`);
  },
};
