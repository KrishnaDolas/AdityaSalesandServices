import axios from 'axios';
import { API_URL } from './Config';

export interface LoginResponse {
  success: boolean;
  message: string;
  admin_type?: string;
  admin_ID?: number;
}

export async function login(username: string, password: string, type_admin: number, type_superadmin: number): Promise<LoginResponse> {
  const payload = { username, password, type_admin, type_superadmin };

  try {
    const response = await axios.post(`${API_URL}/adminlogin/`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`HTTP error! Status: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Network request failed: No response received');
      } else {
        throw new Error(`Axios error: ${error.message}`);
      }
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
