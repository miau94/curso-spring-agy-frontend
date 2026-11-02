import type { UserDto, UserRequestDto } from '../types/api';
import { apiClient } from './apiClient';

export const userService = {
  async getAll(): Promise<UserDto[]> {
    const response = await apiClient.get<UserDto[]>('/api/users');
    return response.data;
  },

  async getById(id: number): Promise<UserDto> {
    const response = await apiClient.get<UserDto>(`/api/users/${id}`);
    return response.data;
  },

  async create(user: UserRequestDto): Promise<UserDto> {
    const response = await apiClient.post<UserDto>('/api/users', user);
    return response.data;
  },

  async update(id: number, user: UserRequestDto): Promise<UserDto> {
    const response = await apiClient.put<UserDto>(`/api/users/${id}`, user);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/api/users/${id}`);
  },
};
