import { API_CONFIG } from '../config/apiConfig';
import type { InvoiceDto } from '../types/api';
import { apiClient } from './apiClient';

export const invoiceService = {
  async getAll(customerId?: number): Promise<InvoiceDto[]> {
    const params = customerId ? { customerId } : undefined;
    const response = await apiClient.get<InvoiceDto[]>(API_CONFIG.INVOICES, { params });
    return response.data;
  },

  async getById(id: number): Promise<InvoiceDto> {
    const response = await apiClient.get<InvoiceDto>(`${API_CONFIG.INVOICES}/${id}`);
    return response.data;
  },

  async getByCustomerId(customerId: number): Promise<InvoiceDto[]> {
    const response = await apiClient.get<InvoiceDto[]>(`${API_CONFIG.INVOICES}/customer/${customerId}`);
    return response.data;
  },

  async create(invoice: InvoiceDto): Promise<InvoiceDto> {
    const response = await apiClient.post<InvoiceDto>(API_CONFIG.INVOICES, invoice);
    return response.data;
  },

  async update(id: number, invoice: InvoiceDto): Promise<InvoiceDto> {
    const response = await apiClient.put<InvoiceDto>(`${API_CONFIG.INVOICES}/${id}`, invoice);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.INVOICES}/${id}`);
  },
};
