import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { login as loginService, LoginResponse } from '../../components/authService';

interface AuthContextProps {
  loggedIn: boolean;
  login: (username: string, password: string, type_admin: number, type_superadmin: number, navigation: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  loggedIn: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setLoggedIn(true);
      }
    };
    checkLoginStatus();

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        await AsyncStorage.removeItem('userData');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const login = async (username: string, password: string, type_admin: number, type_superadmin: number, navigation: any) => {
    try {
      const response: LoginResponse = await loginService(username, password, type_admin, type_superadmin);
      if (response.message === 'Valid User') {
        setLoggedIn(true);
        await AsyncStorage.setItem('userData', JSON.stringify(response));
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Login error:', error);
        Alert.alert('Login Error', error.message || 'An error occurred during login. Please try again.');
      } else {
        console.error('An unknown error occurred:', error);
        Alert.alert('Login Error', 'An unknown error occurred. Please try again.');
      }
    }
  };

  const logout = async () => {
    setLoggedIn(false);
    await AsyncStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
