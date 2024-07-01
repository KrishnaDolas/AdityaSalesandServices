import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from './components/Sidebar'; // Import your Sidebar component
import Animatedintro from './components/Animatedintro'; // Adjust the path to your Animatedintro component
import Baramati from './components/baramati'; // Adjust the path to your Baramati component
import Bhormap from './components/Bhormap'; // Adjust the path to your Bhormap component
import DaundMap from './components/DaundMap'; // Adjust the path to your DaundMap component
import IndapurMap from './components/IndapurMap'; // Adjust the path to your IndapurMap component
import Khadakwasla from './components/Khadakwasla'; // Adjust the path to your Khadakwasla component
import Purandarmap from './components/Purandarmap'; // Adjust the path to your Purandarmap component
import KaryakartaForm from './components/KaryakartaForm'; // Adjust the path to your KaryakartaForm component
import SurveyForm from './components/SurveyForm'; // Adjust the path to your SurveyForm component
import Login from './components/Login'; // Adjust the path to your SurveyForm component


const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
        <Drawer.Screen name="Animatedintro" component={Animatedintro} />
        <Drawer.Screen name="Baramati" component={Baramati} />
        <Drawer.Screen name="Bhormap" component={Bhormap} />
        <Drawer.Screen name="DaundMap" component={DaundMap} />
        <Drawer.Screen name="IndapurMap" component={IndapurMap} />
        <Drawer.Screen name="Khadakwasla" component={Khadakwasla} />
        <Drawer.Screen name="Purandarmap" component={Purandarmap} />
        <Drawer.Screen name="KaryakartaForm" component={KaryakartaForm} />
        <Drawer.Screen name="SurveyForm" component={SurveyForm} />
        <Drawer.Screen name="Login" component={Login} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
