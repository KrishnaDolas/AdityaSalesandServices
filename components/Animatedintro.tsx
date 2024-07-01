// Animatedintro.js

import React from 'react';
import { StyleSheet, View,ScrollView } from 'react-native';
import Slider from './Slider'; // Assuming Slider component is properly implemented
import Home from './Home'; // Assuming Home component is properly implemented
import Footer from './Footer';

const Animatedintro = () => {
  return (
    <ScrollView>
    <View style={styles.wrapper}>
      <View style={styles.sliderContainer}>
        <Slider />
      </View>
      <View style={styles.homeContainer}>
        <Home />
      </View>
      <View>
        <Footer />
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff', // Optional: Add background color if needed
  },
  sliderContainer: {
    flex: 1, // Adjust the flex value as needed
  },
  homeContainer: {
    flex: 2, // Adjust the flex value as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Animatedintro;