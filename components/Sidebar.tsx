import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';

const Sidebar: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/ncpLogo.png')} style={styles.logo} />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, styles.bold, styles.orange]}>N</Text>
          <Text style={[styles.title, styles.bold, styles.blue]}>C</Text>
          <Text style={[styles.title, styles.bold, styles.green]}>P</Text>
          <Text style={[styles.title, styles.bold, styles.black]}> CSM</Text>
        </View>
      </View>
      <DrawerItem label="Animatedintro" onPress={() => props.navigation.navigate('Animatedintro')} />
      <DrawerItem label="Baramati" onPress={() => props.navigation.navigate('Baramati')} />
      <DrawerItem label="Bhormap" onPress={() => props.navigation.navigate('Bhormap')} />
      <DrawerItem label="DaundMap" onPress={() => props.navigation.navigate('DaundMap')} />
      <DrawerItem label="IndapurMap" onPress={() => props.navigation.navigate('IndapurMap')} />
      <DrawerItem label="Khadakwasla" onPress={() => props.navigation.navigate('Khadakwasla')} />
      <DrawerItem label="Purandarmap" onPress={() => props.navigation.navigate('Purandarmap')} />
      <DrawerItem label="KaryakartaForm" onPress={() => props.navigation.navigate('KaryakartaForm')} />
      <DrawerItem label="SurveyForm" onPress={() => props.navigation.navigate('SurveyForm')} />
      <DrawerItem label="Login" onPress={() => props.navigation.navigate('Login')} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  orange: {
    color: 'orange',
  },
  blue: {
    color: 'blue',
  },
  green: {
    color: 'green',
  },
  black: {
    color: 'black',
  },
  separator: {
    marginVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default Sidebar;
