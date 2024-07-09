import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Animatedintro: undefined;
  Baramati: undefined;
  Bhormap: undefined;
  DaundMap: undefined;
  IndapurMap: undefined;
  Khadakwasla: undefined;
  Purandarmap: undefined;
  KaryakartaForm: undefined;
  SurveyForm: undefined;
  Login: undefined;
  Home: undefined;
  Baramatidetails: undefined;
  Khadakwasladetails: undefined;
  Daunddetails: undefined;
  Indapurdetails: undefined;
  Purandardetails: undefined;
  Bhordetails: undefined;
  Surveyformdetails: undefined;
  Karyakartadetails: undefined;
};

type ParamListBase = RootStackParamList;

export type HomeScreenProps = {
  navigation: DrawerNavigationProp<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
};

export type ScreenComponentType<ParamList extends ParamListBase, RouteName extends keyof ParamList> = React.ComponentType<{
  navigation: DrawerNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
}>;
