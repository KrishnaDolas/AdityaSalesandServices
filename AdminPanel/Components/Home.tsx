// screens/Home.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenProps } from '../../components/types'; // Adjust path as per your structure

const Home: React.FC<ScreenProps<'Home'>> = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
