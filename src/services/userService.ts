import { API_CONFIG } from '../config/apiConfig';
import type { UserDto, UserRequestDto } from '../types/api';
import { apiClient } from './apiClient';

export const userService = {
  async getAll(): Promise<UserDto[]> {
    const response = await apiClient.get<UserDto[]>(API_CONFIG.USERS);
    return response.data;
  },

  async getById(id: number): Promise<UserDto> {
    const response = await apiClient.get<UserDto>(`${API_CONFIG.USERS}/${id}`);
    return response.data;
  },

  async create(user: UserRequestDto): Promise<UserDto> {
    const response = await apiClient.post<UserDto>(API_CONFIG.USERS, user);
    return response.data;
  },

  async update(id: number, user: UserRequestDto): Promise<UserDto> {
    const response = await apiClient.put<UserDto>(`${API_CONFIG.USERS}/${id}`, user);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.USERS}/${id}`);
  },
};
