import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CombinedSidebar from './components/CombinedSidebar'; // Adjust the path if necessary
import Animatedintro from './components/Animatedintro'; // Adjust the path if necessary
import Baramati from './components/baramati'; // Adjust the path if necessary
import Bhormap from './components/Bhormap'; // Adjust the path if necessary
import DaundMap from './components/DaundMap'; // Adjust the path if necessary
import IndapurMap from './components/IndapurMap'; // Adjust the path if necessary
import Khadakwasla from './components/Khadakwasla'; // Adjust the path if necessary
import Purandarmap from './components/Purandarmap'; // Adjust the path if necessary
import KaryakartaForm from './components/KaryakartaForm'; // Adjust the path if necessary
import SurveyForm from './components/SurveyForm'; // Adjust the path if necessary
import Login from './components/Login'; // Adjust the path if necessary

const Drawer = createDrawerNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <CombinedSidebar {...props} />}>
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
