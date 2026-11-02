import type { AuthRequestDto, UserDto } from '../types/api';
import { apiClient } from './apiClient';

export const authService = {
  async login(credentials: AuthRequestDto): Promise<UserDto> {
    const response = await apiClient.post<UserDto>('/api/auth/login', credentials);
    return response.data;
  },

  async register(credentials: AuthRequestDto): Promise<UserDto> {
    const response = await apiClient.post<UserDto>('/api/auth/register', credentials);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/auth/logout');
    return response.data;
  },
};
