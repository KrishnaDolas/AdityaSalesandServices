import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PublicSidebar from './components/PublicSidebar';
import AdminSidebar from './AdminPanel/Components/AdminSidebar';
import { AuthProvider, AuthContext } from './AdminPanel/Components/AuthContext';

// Import screens
import Animatedintro from './components/Animatedintro';
import Baramati from './components/baramati';
import Bhormap from './components/Bhormap';
import DaundMap from './components/DaundMap';
import IndapurMap from './components/IndapurMap';
import Khadakwasla from './components/Khadakwasla';
import Purandarmap from './components/Purandarmap';
import KaryakartaForm from './components/KaryakartaForm';
import SurveyForm from './components/SurveyForm';
import Login from './components/Login';
import Home from './AdminPanel/Components/Home';
import Baramatidetails from './AdminPanel/Components/Baramatidetails';
import Khadakwasladetails from './AdminPanel/Components/Khadakwasladetails';
import Daunddetails from './AdminPanel/Components/Daunddetails';
import Indapurdetails from './AdminPanel/Components/Indapurdetails';
import Purandardetails from './AdminPanel/Components/Purandardetails';
import Bhordetails from './AdminPanel/Components/Bhordetails';
import Surveyformdetails from './AdminPanel/Components/Surveyformdetails';
import Karyakartadetails from './AdminPanel/Components/Karyakartadetails';

const PublicDrawer = createDrawerNavigator();
const AdminDrawer = createDrawerNavigator();

const PublicDrawerNavigator: React.FC = () => (
  <PublicDrawer.Navigator drawerContent={props => <PublicSidebar {...props} />}>
    <PublicDrawer.Screen name="Animatedintro" component={Animatedintro} />
    <PublicDrawer.Screen name="Baramati" component={Baramati} />
    <PublicDrawer.Screen name="Bhormap" component={Bhormap} />
    <PublicDrawer.Screen name="DaundMap" component={DaundMap} />
    <PublicDrawer.Screen name="IndapurMap" component={IndapurMap} />
    <PublicDrawer.Screen name="Khadakwasla" component={Khadakwasla} />
    <PublicDrawer.Screen name="Purandarmap" component={Purandarmap} />
    <PublicDrawer.Screen name="KaryakartaForm" component={KaryakartaForm} />
    <PublicDrawer.Screen name="SurveyForm" component={SurveyForm} />
    <PublicDrawer.Screen name="Login" component={Login} />
  </PublicDrawer.Navigator>
);

const AdminDrawerNavigator: React.FC = () => (
  <AdminDrawer.Navigator drawerContent={props => <AdminSidebar {...props} />}>
    <AdminDrawer.Screen name="Home" component={Home} />
    <AdminDrawer.Screen name="Baramatidetails" component={Baramatidetails} />
    <AdminDrawer.Screen name="Khadakwasladetails" component={Khadakwasladetails} />
    <AdminDrawer.Screen name="Daunddetails" component={Daunddetails} />
    <AdminDrawer.Screen name="Indapurdetails" component={Indapurdetails} />
    <AdminDrawer.Screen name="Purandardetails" component={Purandardetails} />
    <AdminDrawer.Screen name="Bhordetails" component={Bhordetails} />
    <AdminDrawer.Screen name="Surveyformdetails" component={Surveyformdetails} />
    <AdminDrawer.Screen name="Karyakartadetails" component={Karyakartadetails} />
  </AdminDrawer.Navigator>
);

const App: React.FC = () => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <AuthProvider>
      <NavigationContainer>
        {loggedIn ? <AdminDrawerNavigator /> : <PublicDrawerNavigator />}
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
