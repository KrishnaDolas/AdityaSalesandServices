import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './Home';
import Login from '../../components/Login';
import CombinedSidebar from '../../components/CombinedSidebar';
import Animatedintro from '../../components/Animatedintro'; 
import Baramati from '../../components/baramati';
import Bhormap from '../../components/Bhormap';
import DaundMap from '../../components/DaundMap';
import IndapurMap from '../../components/IndapurMap';
import Khadakwasla from '../../components/Khadakwasla';
import Purandarmap from '../../components/Purandarmap';
import KaryakartaForm from '../../components/KaryakartaForm';
import SurveyForm from '../../components/SurveyForm';
import Baramatidetails from './Baramatidetails';
import Khadakwasladetails from './Khadakwasladetails';
import Daunddetails from './Daunddetails';
import Indapurdetails from './Indapurdetails';
import Purandardetails from './Purandardetails';
import Bhordetails from './Bhordetails';
import Surveyformdetails from './Surveyformdetails';
import Karyakartadetails from './Karyakartadetails';
import { AuthProvider } from './AuthContext'; // Adjust the path

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  return (
    <AuthProvider>
      <Drawer.Navigator initialRouteName="Animatedintro" drawerContent={(props) => <CombinedSidebar {...props} />}>
        <Drawer.Screen name="Animatedintro" component={Animatedintro} />
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Baramati" component={Baramati} />
        <Drawer.Screen name="Bhormap" component={Bhormap} />
        <Drawer.Screen name="DaundMap" component={DaundMap} />
        <Drawer.Screen name="IndapurMap" component={IndapurMap} />
        <Drawer.Screen name="Khadakwasla" component={Khadakwasla} />
        <Drawer.Screen name="Purandarmap" component={Purandarmap} />
        <Drawer.Screen name="KaryakartaForm" component={KaryakartaForm} />
        <Drawer.Screen name="SurveyForm" component={SurveyForm} />
        <Drawer.Screen name="Baramatidetails" component={Baramatidetails} />
        <Drawer.Screen name="Khadakwasladetails" component={Khadakwasladetails} />
        <Drawer.Screen name="Daunddetails" component={Daunddetails} />
        <Drawer.Screen name="Indapurdetails" component={Indapurdetails} />
        <Drawer.Screen name="Purandardetails" component={Purandardetails} />
        <Drawer.Screen name="Bhordetails" component={Bhordetails} />
        <Drawer.Screen name="Surveyformdetails" component={Surveyformdetails} />
        <Drawer.Screen name="Karyakartadetails" component={Karyakartadetails} />
      </Drawer.Navigator>
    </AuthProvider>
  );
};

export default DrawerNavigator;
