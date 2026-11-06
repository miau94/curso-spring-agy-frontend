import { API_CONFIG } from '../config/apiConfig';
import type { AuthRequestDto, UserDto } from '../types/api';
import { apiClient } from './apiClient';

export const authService = {
  async login(credentials: AuthRequestDto): Promise<UserDto> {
    const response = await apiClient.post<UserDto>(`${API_CONFIG.AUTH}/login`, credentials);
    return response.data;
  },

  async register(credentials: AuthRequestDto): Promise<UserDto> {
    const response = await apiClient.post<UserDto>(`${API_CONFIG.AUTH}/register`, credentials);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(`${API_CONFIG.AUTH}/logout`);
    return response.data;
  },
};
