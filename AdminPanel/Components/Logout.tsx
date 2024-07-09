import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from './AuthContext'; // Adjust path as necessary

const Logout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <View>
      <Text>You are logged in.</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Logout;
