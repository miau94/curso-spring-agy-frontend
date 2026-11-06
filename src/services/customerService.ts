import { API_CONFIG } from '../config/apiConfig';
import type { CustomerDto } from '../types/api';
import { apiClient } from './apiClient';

export const customerService = {
  async getAll(): Promise<CustomerDto[]> {
    const response = await apiClient.get<CustomerDto[]>(API_CONFIG.CUSTOMERS);
    return response.data;
  },

  async getById(id: number): Promise<CustomerDto> {
    const response = await apiClient.get<CustomerDto>(`${API_CONFIG.CUSTOMERS}/${id}`);
    return response.data;
  },

  async create(customer: CustomerDto): Promise<CustomerDto> {
    const response = await apiClient.post<CustomerDto>(API_CONFIG.CUSTOMERS, customer);
    return response.data;
  },

  async update(id: number, customer: CustomerDto): Promise<CustomerDto> {
    const response = await apiClient.put<CustomerDto>(`${API_CONFIG.CUSTOMERS}/${id}`, customer);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.CUSTOMERS}/${id}`);
  },
};
