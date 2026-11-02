import type { CustomerDto } from '../types/api';
import { apiClient } from './apiClient';

export const customerService = {
  async getAll(): Promise<CustomerDto[]> {
    const response = await apiClient.get<CustomerDto[]>('/api/customers');
    return response.data;
  },

  async getById(id: number): Promise<CustomerDto> {
    const response = await apiClient.get<CustomerDto>(`/api/customers/${id}`);
    return response.data;
  },

  async create(customer: CustomerDto): Promise<CustomerDto> {
    const response = await apiClient.post<CustomerDto>('/api/customers', customer);
    return response.data;
  },

  async update(id: number, customer: CustomerDto): Promise<CustomerDto> {
    const response = await apiClient.put<CustomerDto>(`/api/customers/${id}`, customer);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/customers/${id}`);
  },
};
