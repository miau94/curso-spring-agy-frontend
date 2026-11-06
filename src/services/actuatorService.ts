import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

export interface ActuatorHealthResponse {
  status: 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN';
}

export const actuatorService = {
  async getHealth(): Promise<ActuatorHealthResponse> {
    const response = await apiClient.get<ActuatorHealthResponse>(`${API_CONFIG.ACTUATOR}/health`);
    return response.data;
  },
};
