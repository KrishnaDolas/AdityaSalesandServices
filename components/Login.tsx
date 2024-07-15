import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, Linking } from 'react-native';

const Login: React.FC = () => {
  const handleSignIn = () => {
    Linking.openURL('https://www.adityasalesandservices.in/#/adminLogin');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/ncpLogo.png')} style={styles.logo} />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, styles.bold, styles.orange]}>N</Text>
        <Text style={[styles.title, styles.bold, styles.blue]}>C</Text>
        <Text style={[styles.title, styles.bold, styles.green]}>P</Text>
        <Text style={[styles.title, styles.bold, styles.black]}> CSM</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 42,
  },
  bold: {
    fontWeight: 'bold',
  },
  orange: {
    color: '#FF8C00',
  },
  blue: {
    color: '#0000FF',
  },
  green: {
    color: '#008000',
  },
  black: {
    color: '#000',
  },
  button: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
