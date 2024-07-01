// components/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import RadioButtonGroup, { RadioButton } from 'react-native-radio-buttons-group';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { login } from './authService'; // Adjust the path to your authService
import { RootStackParamList } from './types'; // Adjust the path to your App file

const Login: React.FC = () => {
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('Admin');
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
      const isAuthenticated = await login(adminName, password);
      if (isAuthenticated) {
        navigation.navigate('Home2');
      } else {
        Alert.alert('Login Failed', 'Invalid admin name or password');
      }
    } catch (error) {
      Alert.alert('Login Error', 'An error occurred during login. Please try again.');
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
      <Text style={styles.label}>Admin Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your admin name"
        value={adminName}
        onChangeText={setAdminName}
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
      <RadioButtonGroup
        containerStyle={styles.radioGroup}
        radioButtons={profileOptions}
        onPress={(radioButtonsArray: any) => {
          const selectedButton = radioButtonsArray.find((button: any) => button.selected);
          if (selectedButton) {
            handleProfileChange(selectedButton.value);
          }
        }}
        selectedId={profile}
      />
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
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Login;
