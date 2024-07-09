import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';

const AdminSidebar: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/ncpLogo.png')} style={styles.logo} />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, styles.bold, styles.orange]}>N</Text>
          <Text style={[styles.title, styles.bold, styles.blue]}>C</Text>
          <Text style={[styles.title, styles.bold, styles.green]}>P</Text>
          <Text style={[styles.title, styles.bold, styles.black]}> CSM</Text>
        </View>
      </View>
      <DrawerItem label="Home" onPress={() => props.navigation.navigate('Home')} />
      <DrawerItem label="Baramatidetails" onPress={() => props.navigation.navigate('Baramatidetails')} />
      <DrawerItem label="Khadakwasladetails" onPress={() => props.navigation.navigate('Khadakwasladetails')} />
      <DrawerItem label="Daunddetails" onPress={() => props.navigation.navigate('Daunddetails')} />
      <DrawerItem label="Indapurdetails" onPress={() => props.navigation.navigate('Indapurdetails')} />
      <DrawerItem label="Purandardetails" onPress={() => props.navigation.navigate('Purandardetails')} />
      <DrawerItem label="Bhordetails" onPress={() => props.navigation.navigate('Bhordetails')} />
      <DrawerItem label="Surveyformdetails" onPress={() => props.navigation.navigate('Surveyformdetails')} />
      <DrawerItem label="Karyakartadetails" onPress={() => props.navigation.navigate('Karyakartadetails')} />
      <DrawerItem
        label="Logout"
        onPress={() => {
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}
      />
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
});

export default AdminSidebar;
