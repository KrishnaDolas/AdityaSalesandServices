import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './AdminPanel/Components/AuthContext';
import DrawerNavigator from './AdminPanel/Components/DrawerNavigator'; // Adjust the path if necessary

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
