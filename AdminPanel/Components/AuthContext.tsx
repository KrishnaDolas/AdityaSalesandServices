// d:/LearnReactNative/CliProjects/ASDF/AdminPanel/Components/AuthContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  setLoggedIn: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
