import axios from 'axios';
import { API_URL } from './Config'; // Ensure the config file has the correct API_URL

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: any; // Add this to include user information if needed
}

export async function login(username: string, password: string, type_admin: number, type_superadmin: number): Promise<LoginResponse> {
  const payload = {
    username,
    password,
    type_admin,
    type_superadmin,
  };

  console.log('Login payload:', payload);

  try {
    const response = await axios.post(`${API_URL}/adminlogin/`, payload);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Server response:', error.response.data);
        throw new Error(`HTTP error! Status: ${error.response.status}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('Network request failed: No response received');
      } else {
        console.error('Axios error:', error.message);
        throw new Error(`Axios error: ${error.message}`);
      }
    } else if (error instanceof Error) {
      console.error('General error:', error.message);
      throw new Error(`Network request failed: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
      throw new Error('An unknown error occurred');
    }
  }
}
