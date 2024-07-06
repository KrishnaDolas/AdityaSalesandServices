import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { login, LoginResponse } from './authService'; // Adjust the path to your authService
import { RootStackParamList } from './types'; // Adjust the path to your types file

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('Admin'); // Default profile selection
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const profileOptions = [
    { id: '1', label: 'Admin', value: 'Admin' },
    { id: '2', label: 'Super Admin', value: 'Super Admin' },
  ];

  const handleProfileChange = (value: string) => {
    setProfile(value);
  };

  const handleSignIn = async () => {
    try {
      const type_admin = profile === 'Admin' ? 1 : 0;
      const type_superadmin = profile === 'Super Admin' ? 1 : 0;
  
      const payload = {
        username,
        password,
        type_admin,
        type_superadmin,
      };
  
      console.log('Login payload:', payload);
  
      const response: LoginResponse = await login(username, password, type_admin, type_superadmin);
      console.log('Login response:', response);
  
      if (response.success) {
        if (profile === 'Admin') {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Animatedintro');
        }
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid username or password');
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

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/ncpLogo.png')} style={styles.logo} />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, styles.bold, styles.orange]}>N</Text>
        <Text style={[styles.title, styles.bold, styles.blue]}>C</Text>
        <Text style={[styles.title, styles.bold, styles.green]}>P</Text>
        <Text style={[styles.title, styles.bold, styles.black]}> CSM</Text>
      </View>
      <Text style={styles.signInText}>Sign In</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.eyeIcon}>
          <AntDesign name="eyeo" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Select Profile :</Text>
      <View style={styles.radioGroup}>
        {profileOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.radioButton,
              profile === option.value && styles.radioButtonSelected,
            ]}
            onPress={() => handleProfileChange(option.value)}
          >
            <Text style={styles.radioButtonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
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
  signInText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  forgotPasswordText: {
    color: '#00f',
    textAlign: 'right',
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  radioButtonText: {
    fontSize: 16,
    color: '#333',
  },
  radioButtonSelected: {
    backgroundColor: '#ccc',
  },
  button: {
    backgroundColor: '#00f',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
