import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Button,
  Text as RNText,
  Platform,
} from "react-native";
import Svg, { Image as SvgImage, Path, SvgXml } from "react-native-svg";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";


const base64Image1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4QAAAJYCAYAAAA6xSjbAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACEdJREFUeNrswTEBAAAAwqD1T20LL6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBnAgwA+bgAAVOBAIsAAAAASUVORK5CYII='; // Your base64 image here



const logos = {
  Shivsena: require('../assets/images/shivsenaLogo.png'),
    Congress: require('../assets/images/congressLogo.png'),
    BJP: require('../assets/images/bjpLogo.png'),
    NCP: require('../assets/images/ncpLogo.png'),
    Default: require('../assets/images/defaultLogo.jpg'),
};

interface VillageData {
  id: number;
  villagename: string;
  totalvoters: number;
  malevoters: number;
  femalevoters: number;
  othervoters: number;
  votingpercentage: number;
  rulingparty: string;
  reason: string;
  hindu: number;
  muslim: number;
  buddhist: number;
  // Add other properties based on your API response
}

interface SvgInfo {
  id: number;
  votingpercentage: number;
  rulingparty: string;
  // Add other properties based on your API response
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'IndapurMap'>;

const Bhormap = () => {
  const [visible, setVisible] = useState(false);
  const [villageData, setVillageData] = useState<VillageData | null>(null);
  const [svgInfo, setSvgInfo] = useState<SvgInfo[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const initializeData = async () => {
      const storedSvgInfo = await AsyncStorage.getItem('svgInfo');
      if (storedSvgInfo) {
        setSvgInfo(JSON.parse(storedSvgInfo));
      } else {
        fetchSvgInfo();
      }
    };

    initializeData();
  }, []);

  const fetchSvgInfo = async () => {
    try {
      const response = await fetch(`http://baramatiapi.beatsacademy.in/allbhordata/`);
      const data = await response.json();
      setSvgInfo(data.all_data);
      await AsyncStorage.setItem('svgInfo', JSON.stringify(data.all_data));
    } catch (error) {
      console.error('Error fetching SVG info:', error);
    }
  };

  const fetchVillageData = async (villageId: number) => {
    try {
      const response = await fetch(`http://baramatiapi.beatsacademy.in/bhorvillagedetails/${villageId}/`);
      const data = await response.json();
      if (!data || !data.village_data) {
        console.error('Received invalid data from server:', data);
        return;
      }
      setVillageData(data.village_data);
      setVisible(true);
    } catch (error) {
      console.error('Error fetching village data:', error);
    }
  };

  const open = async (villageId: number) => {
    await fetchVillageData(villageId);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  const getColor = (villageId: number) => {
    const village = svgInfo.find(item => item.id === villageId);
    if (village) {
      const votingPercentage = village.votingpercentage;
      if (votingPercentage >= 0 && votingPercentage < 25) {
        return 'red';
      } else if (votingPercentage >= 25 && votingPercentage < 50) {
        return 'orange';
      } else if (votingPercentage >= 50 && votingPercentage < 75) {
        return 'yellow';
      } else {
        return 'green';
      }
    }
    return 'grey';
  };

  const getVillageLogo = (villageId: number): any => {
    const village = svgInfo.find(item => item.id === villageId);
    if (village) {
      const rulingParty = village.rulingparty;
      switch (rulingParty) {
        case 'Shivsena':
          return logos.Shivsena;
        case 'Congress':
          return logos.Congress;
        case 'BJP':
          return logos.BJP;
        case 'NCP':
          return logos.NCP;
        default:
          return logos.Default;
      }
    }
    return logos.Default;
  };

  const navigateToVillageDetails = () => {
    if (villageData) {
      close();
      navigation.navigate('VillageDetails', { id: villageData.id });
    } else {
      console.error('Village data is null');
    }
  };

  const svgText = `
    <svg height="1946" width="2347">
      <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 348.2718 277.7917)" font-size="5" fill="black">
        Gunanad
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 339.9749 278.9096)" font-size="5" fill="black">
        <tspan x="0" y="0">Vathar</tspan>
        <tspan x="0" y="3.4">Hinge</tspan>
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 351.4019 261.1201)" font-size="5" fill="black">
        Taprewadi
    </text>
    <text transform="matrix(1 0 0 1 339.2 266.33)" font-size="5" fill="black">
        Navi
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 346.8761 256.4604)" font-size="5" fill="black">
        Penjalwadi
    </text>
    <text transform="matrix(1 0 0 1 328.1599 247.2404)" font-size="5" fill="black">
        Bhongavali
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 328.8766 271.7702)" font-size="5" fill="black">
        Rajapur
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 321.0749 277.7912)" font-size="5" fill="black">
        Bhambawade
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 319.53 267.8706)" font-size="5" fill="black">
        Pande
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 319.8971 248.5479)" font-size="5" fill="black">
        Savardate
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 308.7866 235.0199)" font-size="5" fill="black">
        Wagajwadi
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 304.0996 259.3397)" font-size="5" fill="black">
        Pande
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 314.1457 244.4297)" font-size="5" fill="black">
        Sarole
    </text>
    <text transform="matrix(1 0 0 1 282.01 261.1201)" font-size="5" fill="black">
        Ingawali
    </text>
    <text transform="matrix(1 0 0 1 283.3546 252.3495)" font-size="5" fill="black">
        <tspan x="0" y="0">Alande</tspan>
        <tspan x="0" y="2.75">alandewadi</tspan>
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 298.7399 245.4651)" font-size="5" fill="black">
        Dhangavadi
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 297.3296 234.2503)" font-size="5" fill="black">
        Kapoorval
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 294.9401 241.8219)" font-size="5" fill="black">
        Nigade
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 288.6559 235.5605)" font-size="5" fill="black">
        Harichandri
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 293.0848 235.0201)" font-size="5" fill="black">
        Divale
    </text>
    <text transform="matrix(1 0 0 1 282.0105 244.9184)" font-size="5" fill="black">
        Mohari kh
    </text>
    <text transform="matrix(1 0 0 1 307.8039 235.2361)" font-size="5" fill="black">
        Mohari kh
    </text>
    <text transform="matrix(1 0 0 1 291.4897 222.295)" font-size="5" fill="black">
        Kethkawane
    </text>
    <text transform="matrix(1 0 0 1 270.0751 254.3304)" font-size="5" fill="black">
        Sangamner
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 282.4594 235.5603)" font-size="5" fill="black">
        Umbre
    </text>
     <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 314.1457 244.4297)" font-size="5" fill="black">
        Sarole
    </text>
    <text transform="matrix(1 0 0 1 282.01 261.1201)" font-size="5" fill="black">
        Ingawali
    </text>
    <text transform="matrix(1 0 0 1 283.3546 252.3495)" font-size="5" fill="black">
        <tspan x="0" y="0">Alande</tspan>
        <tspan x="0" y="2.75">alandewadi</tspan>
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 298.7399 245.4651)" font-size="5" fill="black">
        Dhangavadi
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 297.3296 234.2503)" font-size="5" fill="black">
        Kapoorval
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 294.9401 241.8219)" font-size="5" fill="black">
        Nigade
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 288.6559 235.5605)" font-size="5" fill="black">
        Harichandri
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 293.0848 235.0201)" font-size="5" fill="black">
        Divale
    </text>
    <text transform="matrix(1 0 0 1 282.0105 244.9184)" font-size="5" fill="black">
        Mohari kh
    </text>
    <text transform="matrix(1 0 0 1 307.8039 235.2361)" font-size="5" fill="black">
        Mohari kh
    </text>
    <text transform="matrix(1 0 0 1 291.4897 222.295)" font-size="5" fill="black">
        Kethkawane
    </text>
    <text transform="matrix(1 0 0 1 270.0751 254.3304)" font-size="5" fill="black">
        Sangamner
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 282.4594 235.5603)" font-size="5" fill="black">
        Umbre
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 276.7838 247.9238)" font-size="5" fill="black">
        Kasurdi GM
    </text>
    <text transform="matrix(1 0 0 1 264.3877 241.2998)" font-size="5" fill="black">
        Mohari Bk
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 286.4496 224.9904)" font-size="5" fill="black">
        Kamthadi
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 290.6895 212.0794)" font-size="5" fill="black">
        Karandi Kp
    </text>
    <text transform="matrix(1 0 0 1 285.0657 195.37)" font-size="5" fill="black">
        Kambare
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 282.7669 213.0309)" font-size="5" fill="black">
        Degaon
    </text>
    <text transform="matrix(0.0949 -0.9955 0.9955 0.0949 280.0431 213.676)" font-size="5" fill="black">
        Naygaon
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 272.7759 214.0357)" font-size="5" fill="black">
        Kelawade
    </text>
    <text transform="matrix(1 0 0 1 274.9897 218.7698)" font-size="5" fill="black">
        Nasarapur
    </text>
    <text transform="matrix(1 0 0 1 274.9898 223.5906)" font-size="5" fill="black">
        Malegaon
    </text>
    <text transform="matrix(1 0 0 1 273.6499 231.6941)" font-size="5" fill="black">
        Khadaki
    </text>
    <text transform="matrix(1 0 0 1 270.1346 226.5779)" font-size="5" fill="black">
        Sangvi kh
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 276.1052 196.2095)" font-size="5" fill="black">
        Varve Kh
    </text>
    <text transform="matrix(1 0 0 1 266.6909 188.2957)" font-size="5" fill="black">
        Shivare
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 314.1457 244.4297)" font-size="5" fill="black">
        Sarole
    </text>
    <text transform="matrix(1 0 0 1 282.01 261.1201)" font-size="5" fill="black">
        Ingawali
    </text>
    <text transform="matrix(1 0 0 1 283.3546 252.3495)" font-size="5" fill="black">
        <tspan x="0" y="0">Alande</tspan>
        <tspan x="0" y="2.75">alandewadi</tspan>
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 298.7399 245.4651)" font-size="5" fill="black">
        Dhangavadi
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 297.3296 234.2503)" font-size="5" fill="black">
        Kapoorval
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 294.9401 241.8219)" font-size="5" fill="black">
        Nigade
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 288.6559 235.5605)" font-size="5" fill="black">
        Harichandri
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 293.0848 235.0201)" font-size="5" fill="black">
        Divale
    </text>
    <text transform="matrix(1 0 0 1 282.0105 244.9184)" font-size="5" fill="black">
        Mohari kh
    </text>
    <text transform="matrix(1 0 0 1 307.8039 235.2361)" font-size="5" fill="black">
        Mohari kh
    </text>
    <text transform="matrix(1 0 0 1 291.4897 222.295)" font-size="5" fill="black">
        Kethkawane
    </text>
    <text transform="matrix(1 0 0 1 270.0751 254.3304)" font-size="5" fill="black">
        Sangamner
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 282.4594 235.5603)" font-size="5" fill="black">
        Umbre
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 276.7838 247.9238)" font-size="5" fill="black">
        Kasurdi GM
    </text>
    <text transform="matrix(1 0 0 1 264.3877 241.2998)" font-size="5" fill="black">
        Mohari Bk
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 286.4496 224.9904)" font-size="5" fill="black">
        Kamthadi
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 290.6895 212.0794)" font-size="5" fill="black">
        Karandi Kp
    </text>
    <text transform="matrix(1 0 0 1 285.0657 195.37)" font-size="5" fill="black">
        Kambare
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 282.7669 213.0309)" font-size="5" fill="black">
        Degaon
    </text>
    <text transform="matrix(0.0949 -0.9955 0.9955 0.0949 280.0431 213.676)" font-size="5" fill="black">
        Naygaon
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 272.7759 214.0357)" font-size="5" fill="black">
        Kelawade
    </text>
    <text transform="matrix(1 0 0 1 274.9897 218.7698)" font-size="5" fill="black">
        Nasarapur
    </text>
    <text transform="matrix(1 0 0 1 274.9898 223.5906)" font-size="5" fill="black">
        Malegaon
    </text>
    <text transform="matrix(1 0 0 1 273.6499 231.6941)" font-size="5" fill="black">
        Khadaki
    </text>
    <text transform="matrix(1 0 0 1 270.1346 226.5779)" font-size="5" fill="black">
        Sangvi kh
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 276.1052 196.2095)" font-size="5" fill="black">
        Varve Kh
    </text>
    <text transform="matrix(1 0 0 1 266.6909 188.2957)" font-size="5" fill="black">
        Shivare
    </text>
    <text transform="matrix(1 0 0 1 266.8091 178.025)" font-size="5" fill="black">
        Kasurdi Kb
    </text>
    <text transform="matrix(1 0 0 1 267.7491 170.4383)" font-size="5" fill="black">
        Velu
    </text>
    <text transform="matrix(1 0 0 1 260.6496 155.1684)" font-size="5" fill="black">
        Shindewadi
    </text>
    <text transform="matrix(1 0 0 1 256.2901 162.2952)" font-size="5" fill="black">
        Sasewadi
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 269.0498 201.6199)" font-size="5" fill="black">
        <tspan x="0" y="0">Varve</tspan>
        <tspan x="0" y="2.7">Bk</tspan>
    </text>
    <text transform="matrix(1 0 0 1 269.0502 278.9095)" font-size="5" fill="black">
        Vadgaonda
    </text>
    <text transform="matrix(1 0 0 1 266.9798 285.7243)" font-size="5" fill="black">
        Utroli
    </text>
    <text transform="matrix(1 0 0 1 260.23 292.8514)" font-size="5" fill="black">
        Khanapur
    </text>
    <text transform="matrix(1 0 0 1 263.4602 300.8156)" font-size="5" fill="black">
        Grayele
    </text>
    <text transform="matrix(1 0 0 1 260.3574 308.6116)" font-size="5" fill="black">
        Nere
    </text>
     <text transform="matrix(1 0 0 1 260.0999 315.8864)" font-size="5" fill="black">
        Balawad
    </text>
    <text transform="matrix(1 0 0 1 257.6021 323.9958)" font-size="5" fill="black">
        Ambade
    </text>
    <text transform="matrix(1 0 0 1 249.37 315.8863)" font-size="5" fill="black">
        Pale
    </text>
    <text transform="matrix(0.1991 -0.98 0.98 0.1991 253.9246 327.3322)" font-size="5" fill="black">
        Varodi Bk
    </text>
    <text transform="matrix(0.1991 -0.98 0.98 0.1991 250.96 328.4133)" font-size="5" fill="black">
        Varodi Dm
    </text>
    <text transform="matrix(0.1991 -0.98 0.98 0.1991 245.7601 326.2512)" font-size="5" fill="black">
        Varodi Kh
    </text>
    <text transform="matrix(1 0 0 1 237.2018 313.7682)" font-size="5" fill="black">
        Karnawad
    </text>
    <text transform="matrix(1 0 0 1 232.1278 317.5304)" font-size="5" fill="black">
        Vaveghar
    </text>
    <text transform="matrix(0.0591 -0.9983 0.9983 0.0591 237.0789 325.4144)" font-size="5" fill="black">
        Rawadi
    </text>
    <text transform="matrix(0.1991 -0.98 0.98 0.1991 240.9727 325.4148)" font-size="5" fill="black">
        Chikhalgaon
    </text>
    <text transform="matrix(1 0 0 1 227.0786 327.282)" font-size="5" fill="black">
        Vadhumbi
    </text>
    <text transform="matrix(1 0 0 1 217.0347 326.7468)" font-size="5" fill="black">
        Tileghar
    </text>
    <text transform="matrix(1 0 0 1 251.7307 185.1261)" font-size="5" fill="black">
        Ranje
    </text>
    <text transform="matrix(1 0 0 1 255.5715 193.5098)" font-size="5" fill="black">
        Khopi
    </text>
    <text transform="matrix(1 0 0 1 243.355 190.8982)" font-size="5" fill="black">
        Kusgaon
    </text>
    <text transform="matrix(1 0 0 1 260.6492 201.6198)" font-size="5" fill="black">
        Kanjale
    </text>
    <text transform="matrix(1 0 0 1 241.9382 200.2077)" font-size="5" fill="black">
        Parawadi
    </text>
    <text transform="matrix(0.0949 -0.9955 0.9955 0.0949 254.7641 211.1539)" font-size="5" fill="black">
        Kurungavadi
    </text>
    <text transform="matrix(0.2031 -0.9792 0.9792 0.2031 249.9213 212.0797)" font-size="5" fill="black">
        Sonawadi bk
    </text>
    <text transform="matrix(1 0 0 1 260.1099 208.0046)" font-size="5" fill="black">
        Salawade
    </text>
    <text transform="matrix(1 0 0 1 257.1004 215.8073)" font-size="5" fill="black">
        Jambhali
    </text>
    <text transform="matrix(1 0 0 1 265.5948 221.9167)" font-size="5" fill="black">
        Virwadi
    </text>
    <text transform="matrix(1 0 0 1 244.0002 226.0499)" font-size="5" fill="black">
        Sarpala
    </text>
    <text transform="matrix(1 0 0 1 244.0837 217.1696)" font-size="5" fill="black">
        Sangvi
    </text>
    <text transform="matrix(1 0 0 1 250.96 218.9148)" font-size="5" fill="black">
        Kolawadi
    </text>
    <text transform="matrix(1 0 0 1 232.8997 226.89)" font-size="5" fill="black">
        Sonde
    </text>
    <text transform="matrix(1 0 0 1 234.452 214.3952)" font-size="5" fill="black">
        Ambavane
    </text>
    <text transform="matrix(0.2086 -0.978 0.978 0.2086 239.229 208.8744)" font-size="5" fill="black">
        Boravale
    </text>
    <text transform="matrix(1 0 0 1 227.4898 208.0042)" font-size="5" fill="black">
        Mangdari
    </text>
    <text transform="matrix(1 0 0 1 230.3646 202.6813)" font-size="5" fill="black">
        Nigde Bk
    </text>
    <text transform="matrix(1 0 0 1 226.6196 193.9)" font-size="5" fill="black">
        Vangani
    </text>
    <text transform="matrix(1 0 0 1 220.005 187.7792)" font-size="5" fill="black">
        <tspan x="0" y="0">Wanganichi</tspan>
        <tspan x="0" y="1.79">wadi</tspan>
    </text>
    <text transform="matrix(0.2086 -0.978 0.978 0.2086 222.8793 203.8793)" font-size="5" fill="black">
        Katavadi
    </text>
    <text transform="matrix(0.2086 -0.978 0.978 0.2086 216.2582 200.5551)" font-size="5" fill="black">
        kolwadi
    </text>
     <text transform="matrix(1 0 0 1 210.2197 205.8097)" font-size="5" fill="black">
        Khambavadi
    </text>
    <text transform="matrix(1 0 0 1 213.9997 213.0312)" font-size="5" fill="black">
        Margasani
    </text>
    <text transform="matrix(0.2086 -0.978 0.978 0.2086 229.8651 216.0704)" font-size="5" fill="black">
        Karanjavane
    </text>
    <text transform="matrix(0.2086 -0.978 0.978 0.2086 230.2299 227.8238)" font-size="5" fill="black">
        Sonde Mathana
    </text>
    <text transform="matrix(0.2086 -0.978 0.978 0.2086 226.6199 226.5778)" font-size="5" fill="black">
        Vadgaon
    </text>
    <text transform="matrix(0.2086 -0.978 0.978 0.2086 222.4201 226.8902)" font-size="5" fill="black">
        Zanje
    </text>
    <text transform="matrix(0.2086 -0.978 0.978 0.2086 217.899 227.4201)" font-size="5" fill="black">
        Kodavadi
    </text>
    <text transform="matrix(1 0 0 1 208.6392 229.4451)" font-size="5" fill="black">
        <tspan x="0" y="0">Asni</tspan>
        <tspan x="0" y="1.85">Darnguda</tspan>
    </text>
    <text transform="matrix(1 0 0 1 260.8438 234.2505)" font-size="5" fill="black">
        <tspan x="0" y="0">Hatwe</tspan>
        <tspan x="0" y="2.39">Bk</tspan>
    </text>
    <text transform="matrix(0.6493 -0.7606 0.7606 0.6493 256.2901 234.273)" font-size="5" fill="black">
        Hatwe Kh
    </text>
    <text transform="matrix(0.7304 -0.683 0.683 0.7304 249.5421 234.7908)" font-size="5" fill="black">
        Tambhad
    </text>
    <text transform="matrix(1 0 0 1 227.4898 314.1521)" font-size="5" fill="black">
        Mhakoshi
    </text>
    <text transform="matrix(1 0 0 1 224.4898 308.0535)" font-size="5" fill="black">
        Ambawade
    </text>
    <text transform="matrix(1 0 0 1 235.9 306.7058)" font-size="5" fill="black">
        Nazare
    </text>
    <text transform="matrix(1 0 0 1 247.6908 308.74)" font-size="5" fill="black">
        Palsoshi
    </text>
    <text transform="matrix(1 0 0 1 245.3202 303.64)" font-size="5" fill="black">
        Dhawadi
    </text>
    <text transform="matrix(1 0 0 1 244.0003 299.075)" font-size="5" fill="black">
        Bazarwadi
    </text>
     <text transform="matrix(1 0 0 1 257.6021 297.4378)" font-size="5" fill="black">
        Nilkant
    </text>
    <text transform="matrix(1 0 0 1 247.285 293.546)" font-size="5" fill="black">
        Hatnoshi
    </text>
    <text transform="matrix(1 0 0 1 261.0797 274.5602)" font-size="5" fill="black">
        Bhor
    </text>
    <text transform="matrix(1 0 0 1 249.9213 276.9939)" font-size="5" fill="black">
        Venawadi
    </text>
    <text transform="matrix(1 0 0 1 243.3896 284.8565)" font-size="5" fill="black">
        Bhabvadi
    </text>
    <text transform="matrix(1 0 0 1 269.4087 270.22)" font-size="5" fill="black">
        Bhatghar
    </text>
    <text transform="matrix(1 0 0 1 266.8089 266.8683)" font-size="5" fill="black">
        Sangvi Hm Yewali
    </text>
    <text transform="matrix(1 0 0 1 253.45 266.8679)" font-size="5" fill="black">
        Bholawade
    </text>
    <text transform="matrix(1 0 0 1 249.9292 260.0131)" font-size="5" fill="black">
        Basarapur
    </text>
    <text transform="matrix(0.4164 -0.9092 0.9092 0.4164 263.999 253.9871)" font-size="5" fill="black">
        Narhe
    </text>
    <text transform="matrix(0.338 -0.738 0.9092 0.4164 258.02 253.4707)" font-size="5" fill="black">
        Bramhanagar
    </text>
    <text transform="matrix(1 0 0 1 249.37 247.62)" font-size="5" fill="black">
        Harnas
    </text>
    <text transform="matrix(1 0 0 1 244.9899 239.32)" font-size="5" fill="black">
        Majgao
    </text>
    <text transform="matrix(0.7134 -0.7008 0.7008 0.7134 242.6398 260.0135)" font-size="5" fill="black">
        Bare Bk
    </text>
    <text transform="matrix(0.7134 -0.7008 0.7008 0.7134 239.8104 258.2684)" font-size="5" fill="black">
        Mhalawadi
    </text>
    <text transform="matrix(1 0 0 1 235.2603 239.9705)" font-size="5" fill="black">
        Jogwadi
    </text>
    <text transform="matrix(0.5559 -0.8313 0.8313 0.5559 235.8106 257.1993)" font-size="5" fill="black">
        Karnawadi
    </text>
    <text transform="matrix(1 0 0 1 228.07 253.1)" font-size="5" fill="black">
        Pasure
    </text>
    <text transform="matrix(1 0 0 1 228.6033 234.2503)" font-size="5" fill="black">
        <tspan x="0" y="0">Tate</tspan>
        <tspan x="0" y="1.98">Masivali</tspan>
    </text>
    <text transform="matrix(1 0 0 1 244.5496 265.335)" font-size="5" fill="black">
        Kiwat
    </text>
    <text transform="matrix(1 0 0 1 243.86 271.0964)" font-size="5" fill="black">
        Pombardi
    </text>
    <text transform="matrix(1 0 0 1 240.5485 274.0961)" font-size="5" fill="black">
        <tspan x="0" y="0">Shirvali</tspan>
        <tspan x="0" y="1.59">T</tspan>
        <tspan x="0" y="3.18">Bhor</tspan>
    </text>
    <text transform="matrix(1 0 0 1 235.8996 280.4865)" font-size="5" fill="black">
        Ambeghar
    </text>
    <text transform="matrix(1 0 0 1 236.2298 264.3198)" font-size="5" fill="black">
        Gavadi
    </text>
    <text transform="matrix(1 0 0 1 233.2401 272.4503)" font-size="5" fill="black">
        Nand
    </text>
    <text transform="matrix(1 0 0 1 231.1923 262.57)" font-size="5" fill="black">
        Shind
    </text>
    <text transform="matrix(1 0 0 1 227.7548 277.0157)" font-size="5" fill="black">
        Pisaware
    </text>
    <text transform="matrix(0.0972 -0.9953 0.9953 0.0972 226.3801 270.0296)" font-size="5" fill="black">
        Mahude Bk
    </text>
    <text transform="matrix(1 0 0 1 239.473 288.1701)" font-size="5" fill="black">
        <tspan x="0" y="0">Chikhlawadi</tspan>
        <tspan x="0" y="1.76">Bk</tspan>
    </text>
    <text transform="matrix(1 0 0 1 232.5462 291.6659)" font-size="5" fill="black">
        Natambi
    </text>
    <text transform="matrix(1 0 0 1 231.0192 296.0366)" font-size="5" fill="black">
        <tspan x="0" y="0">Karanje</tspan>
        <tspan x="0" y="2.04">Chakahlwade</tspan>
    </text>
    <text transform="matrix(1 0 0 1 215.9803 290.3545)" font-size="5" fill="black">
        Nandgaon
    </text>
    <text transform="matrix(1 0 0 1 224.4901 281.7078)" font-size="5" fill="black">
        Vathar Hm
    </text>
    <text transform="matrix(1 0 0 1 219.1194 283.1801)" font-size="5" fill="black">
        Apti
    </text>
    <text transform="matrix(0.0972 -0.9953 0.9953 0.0972 221.7101 267.8705)" font-size="5" fill="black">
        Bramhanagar Hm
    </text>
    <text transform="matrix(1 0 0 1 211.325 270.9596)" font-size="5" fill="black">
        <tspan x="0" y="0">Mahude</tspan>
        <tspan x="0" y="2.36">Kh</tspan>
    </text>
    <text transform="matrix(1 0 0 1 206.723 260.8496)" font-size="5" fill="black">
        Jayatpad
    </text>
    <text transform="matrix(1 0 0 1 209.4719 249.5801)" font-size="5" fill="black">
        Velvand
    </text>
    <text transform="matrix(1 0 0 1 220.55 246.1004)" font-size="5" fill="black">
        Rajghar
    </text>
    <text transform="matrix(1 0 0 1 225.2061 241.7399)" font-size="5" fill="black">
        Vakambe
    </text>
    <text transform="matrix(0.38 -0.925 0.925 0.38 223.1089 238.9776)" font-size="5" fill="black">
        Karandi Kb
    </text>
    <text transform="matrix(1 0 0 1 213.9997 235.3204)" font-size="5" fill="black">
        Vadhane
    </text>
    <text transform="matrix(1 0 0 1 223.1086 296.037)" font-size="5" fill="black">
        <tspan x="0" y="0">Sangvi</tspan>
        <tspan x="0" y="2.04">T</tspan>
        <tspan x="0" y="4.08">Bhor</tspan>
    </text>
    <text transform="matrix(1 0 0 1 214.1265 300.1648)" font-size="5" fill="black">
        Angsule
    </text>
    <text transform="matrix(1 0 0 1 211.325 295.11)" font-size="5" fill="black">
        Bhavekhal
    </text>
    <text transform="matrix(1 0 0 1 215.0318 307.8098)" font-size="5" fill="black">
        kari
    </text>
    <text transform="matrix(1 0 0 1 206.723 320.775)" font-size="5" fill="black">
        <tspan x="0" y="0">Korle</tspan>
        <tspan x="0" y="2.51">Shivnagri</tspan>
    </text>
    <text transform="matrix(1 0 0 1 188.4304 320.7753)" font-size="5" fill="black">
        Rayareshwar
    </text>
    <text transform="matrix(1 0 0 1 205.3997 310.1176)" font-size="5" fill="black">
        Rayri
    </text>
    <text transform="matrix(1 0 0 1 195.6939 311.5476)" font-size="5" fill="black">
        Dhapkeghar
    </text>
    <text transform="matrix(1 0 0 1 201.08 302.61)" font-size="5" fill="black">
        Bhambatmal
    </text>
    <text transform="matrix(1 0 0 1 206.04 298.5252)" font-size="5" fill="black">
        Salav
    </text>
    <text transform="matrix(0.5559 -0.8312 0.8312 0.5559 210.2197 288.8087)" font-size="5" fill="black">
        Karangaon
    </text>
    <text transform="matrix(1 0 0 1 203.0184 279.382)" font-size="5" fill="black">
        <tspan x="0" y="0">Mhasar</tspan>
        <tspan x="0" y="2.43">Kh</tspan>
    </text>
    <text transform="matrix(1 0 0 1 202.9751 195.6756)" font-size="5" fill="black">
        Vinzar
    </text>
    <text transform="matrix(1 0 0 1 208.4458 210.08)" font-size="5" fill="black">
        Askavadi
    </text>
    <text transform="matrix(1 0 0 1 208.4741 217.1696)" font-size="5" fill="black">
        Bhaginghar
    </text>
    <text transform="matrix(0.6929 -0.721 0.721 0.6929 205.9099 225.4788)" font-size="5" fill="black">
        <tspan x="0" y="0">Asni</tspan>
        <tspan x="0" y="1.85">Manjai</tspan>
    </text>
    <text transform="matrix(1 0 0 1 203.7905 238.3943)" font-size="5" fill="black">
        Kambre Bk
    </text>
    <text transform="matrix(1 0 0 1 197.0507 251.5045)" font-size="5" fill="black">
        Pangari
    </text>
    <text transform="matrix(1 0 0 1 192.5371 265.3348)" font-size="5" fill="black">
        Dehen
    </text>
    <text transform="matrix(1 0 0 1 190.4603 277.791)" font-size="5" fill="black">
        <tspan x="0" y="0">Mhasar</tspan>
        <tspan x="0" y="2.82">Bk</tspan>
    </text>
    <text transform="matrix(1 0 0 1 198.8734 287.526)" font-size="5" fill="black">
        Deoghar
    </text>
    <text transform="matrix(1 0 0 1 186.4049 294.8889)" font-size="5" fill="black">
        Hordoshi
    </text>
    <text transform="matrix(1 0 0 1 184.4108 287.701)" font-size="5" fill="black">
        Khondri
    </text>
    <text transform="matrix(1 0 0 1 185.2329 309.6667)" font-size="5" fill="black">
        Parhar kh
    </text>
    <text transform="matrix(0.8931 -0.4498 0.4498 0.8931 185.0691 304.614)" font-size="5" fill="black">
        Parhar Bk
    </text>
    <text transform="matrix(1 0 0 1 182.5256 299.6188)" font-size="5" fill="black">
        Mazeri
    </text>
    <text transform="matrix(1 0 0 1 175.4132 321.2386)" font-size="5" fill="black">
        Gudhe
    </text>
    <text transform="matrix(1 0 0 1 166.0899 315.8863)" font-size="5" fill="black">
        <tspan x="0" y="0">Kudli</tspan>
        <tspan x="0" y="2.61">Kh</tspan>
    </text>
    <text transform="matrix(1 0 0 1 171.8694 302.6106)" font-size="5" fill="black">
        <tspan x="0" y="0">Shirvali</tspan>
        <tspan x="0" y="2.61">Kh</tspan>
    </text>
    <text transform="matrix(1 0 0 1 159.4383 308.4895)" font-size="5" fill="black">
        Durgadi
    </text>
      <text transform="matrix(1 0 0 1 150.9323 300.2501)" font-size="5" fill="black">
        Shirgaon
    </text>
    <text transform="matrix(1 0 0 1 167.073 294.7396)" font-size="5" fill="black">
        Varvand
    </text>
    <text transform="matrix(0.5098 -0.8603 0.8603 0.5098 178.4064 288.1703)" class="st1 st63">
        Dhamonshi
    </text>
    <text transform="matrix(1 0 0 1 167.0816 284.8568)" font-size="5" fill="black">
        Shilimb
    </text>
    <text transform="matrix(1 0 0 1 151.7691 288.5061)" font-size="5" fill="black">
        Ashimpi
    </text>
    <text transform="matrix(1 0 0 1 166.0901 275.7751)" font-size="5" fill="black">
        Kund
    </text>
    <text transform="matrix(1 0 0 1 176.3052 278.2839)" font-size="5" fill="black">
        Rajwadi
    </text>
    <text transform="matrix(1 0 0 1 173.3424 261.3396)" font-size="5" fill="black">
        Salungan
    </text>
    <text transform="matrix(1 0 0 1 184.219 266.2751)" font-size="5" fill="black">
        Kondgaon
    </text>
    <text transform="matrix(1 0 0 1 189.8495 254.9988)" font-size="5" fill="black">
        Nanvale
    </text>
    <text transform="matrix(1 0 0 1 187.5647 243.7901)" font-size="5" fill="black">
        Male
    </text>
    <text transform="matrix(1 0 0 1 196.8599 240.2385)" font-size="5" fill="black">
        Kurunji
    </text>
    <text transform="matrix(1 0 0 1 185.15 230.8211)" cfont-size="5" fill="black">
        Gunjanvane
    </text>
    <text transform="matrix(1 0 0 1 203.2612 216.275)" font-size="5" fill="black">
        Chimodi
    </text>
    <text transform="matrix(1 0 0 1 201.6509 211.8621)" font-size="5" fill="black">
        Sakhar
    </text>
    <text transform="matrix(1 0 0 1 193.3999 213.3318)" font-size="5" fill="black">
        Meravane
    </text>
    <text transform="matrix(1 0 0 1 190.4599 208.9901)" font-size="5" fill="black">
        Kondhavali
    </text>
    <text transform="matrix(1 0 0 1 181.9654 211.4398)" font-size="5" fill="black">
        Vajeghar Kd
    </text>
    <text transform="matrix(1 0 0 1 186.4047 213.3847)" font-size="5" fill="black">
        Lavhi bk
    </text>
    <text transform="matrix(1 0 0 1 180.6016 218.1052)" font-size="5" fill="black">
        Vajeghar Bk
    </text>
    <text transform="matrix(1 0 0 1 178.4064 245.71)" font-size="5" fill="black">
        Dere
    </text>
    <text transform="matrix(0.8169 -0.5767 0.5767 0.8169 170.7797 243.2158)" font-size="5" fill="black">
        Bhutonde
    </text>
    <text transform="matrix(1 0 0 1 158.3079 249.6057)" font-size="5" fill="black">
        Kumble
    </text>
    <text transform="matrix(1 0 0 1 164.1398 235.2362)" font-size="5" fill="black">
        Gruhini
    </text>
    <text transform="matrix(1 0 0 1 160.4216 214.801)" font-size="5" fill="black">
        Vaje Ghera Bk
    </text>
    <text transform="matrix(1 0 0 1 193.4003 197.5127)" font-size="5" fill="black">
        Malavali
    </text>
    <text transform="matrix(0.6119 -0.7909 0.7909 0.6119 190.5124 194.2201)" font-size="5" fill="black">
        Lashirgaon
    </text>
    <text transform="matrix(0.6119 -0.7909 0.7909 0.6119 186.9509 208.0042)" font-size="5" fill="black">
        Vanjale
    </text>
    <text transform="matrix(0.6119 -0.7909 0.7909 0.6119 182.526 207.2093)" font-size="5" fill="black">
        Khariv
    </text>
    <text transform="matrix(0.6119 -0.7909 0.7909 0.6119 183.7617 194.3819)" font-size="5" fill="black">
        Dapode
    </text>
    <text transform="matrix(1 0 0 1 172.2652 188.5037)" font-size="5" fill="black">
        Pabe
    </text>
    <text transform="matrix(1 0 0 1 170.5395 201.1)" font-size="5" fill="black">
        Hirpodi
    </text>
    <text transform="matrix(1 0 0 1 169.19 204.3396)">
        <tspan x="0" y="0" font-size="5" fill="black">Velhe</tspan>
        <tspan x="0" y="1.99" font-size="5" fill="black">kd</tspan>
    </text>
    <text transform="matrix(1 0 0 1 161.825 203.1609)" font-size="5" fill="black">
        Velhe
    </text>
    <text transform="matrix(1 0 0 1 162.4659 189.8661)" font-size="5" fill="black">
        Dhanep
    </text>
    <text transform="matrix(1 0 0 1 156.9598 224.3046)" font-size="5" fill="black">
        Metpilavare
    </text>
    <text transform="matrix(1 0 0 1 153.1612 234.1785)" font-size="5" fill="black">
        Balwad
    </text>
    <text transform="matrix(1 0 0 1 149.1902 247.6201)" font-size="5" fill="black">
        Nigde Kd
    </text>
    <text transform="matrix(1 0 0 1 135.856 245.2204)" font-size="5" fill="black">
        Kelad
    </text>
    <text transform="matrix(1 0 0 1 135.0229 254.3301)" font-size="5" fill="black">
        karnawadi
    </text>
    <text transform="matrix(0.3996 -0.9167 0.9167 0.3996 147.7798 237.5444)" font-size="5" fill="black">
        Shenwad
    </text>
    <text transform="matrix(0.3996 -0.9167 0.9167 0.3996 141.6306 235.6196)" font-size="5" fill="black">
        Pasali
    </text>
    <text transform="matrix(1 0 0 1 127.53 242.4698)" font-size="5" fill="black">
        Bhondi
    </text>
    <text transform="matrix(1 0 0 1 115.0166 231.8054)" font-size="5" fill="black">
        Singapur
    </text>
    <text transform="matrix(1 0 0 1 137.75 217.1696)" font-size="5" fill="black">
        Kolambi
    </text>
    <text transform="matrix(1 0 0 1 120.4405 218.7888)" font-size="5" fill="black">
        Harpud
    </text>
    <text transform="matrix(1 0 0 1 128.62 225.1844)" font-size="5" fill="black">
        Varoti Bk
    </text>
    <text transform="matrix(1 0 0 1 121.8413 203.6736)" font-size="5" fill="black">
        Ghisar
    </text>
    <text transform="matrix(1 0 0 1 134.0386 204.56)" font-size="5" fill="black">
        Nivi
    </text>
    <text transform="matrix(1 0 0 1 145.4923 211.1537)" font-size="5" fill="black">
        Charhatwadi
    </text>
    <text transform="matrix(1 0 0 1 143.0161 203.9607)" font-size="5" fill="black">
        Kanand
    </text>
    <text transform="matrix(1 0 0 1 152.3556 202.9508)">
        <tspan x="0" y="0" font-size="5" fill="black">Bhatti</tspan>
        <tspan x="0" y="1.71" font-size="5" fill="black">wagadara</tspan>
    </text>
    <text transform="matrix(1 0 0 1 155.3891 189.8661)" font-size="5" fill="black">
        Vihir
    </text>
    <text transform="matrix(1 0 0 1 142.4699 191.6846)" font-size="5" fill="black">
        Antroli
    </text>
    <text transform="matrix(1 0 0 1 209.5869 39.7256)" font-size="5" fill="black">
      Tathwade
    </text>
    <text transform="matrix(1 0 0 1 193.3033 49.3586)" font-size="5" fill="black">
      Marunji
    </text>
    <text transform="matrix(1 0 0 1 196.8274 37.986)" font-size="5" fill="black">
      Jambe
    </text>
    <text transform="matrix(1 0 0 1 184.9282 34.8303)" font-size="5" fill="black">
      Dattawadi
    </text>
    <text transform="matrix(1 0 0 1 185.0796 39.7256)" font-size="5" fill="black">
      Nere
    </text>
    <text transform="matrix(1 0 0 1 175.4675 47.4391)" font-size="5" fill="black">
      Kasarsai
    </text>
    <text transform="matrix(1 0 0 1 166.1451 63.3707)" font-size="5" fill="black">
      Rihe
    </text>
    <text transform="matrix(1 0 0 1 176.8672 60.0759)" font-size="5" fill="black">
      Materewadi
    </text>
    <text transform="matrix(0.6399 0 0 1 171.8628 70.3913)" font-size="5" fill="black">
      Godambewadi
    </text>
    <text transform="matrix(1 0 0 1 187.8969 61.7008)" font-size="5" fill="black">
      Bhoirwadi
    </text>
    <text transform="matrix(1 0 0 1 202.9011 60.0757)" font-size="5" fill="black">
      Hinjavadi
    </text>
    <text transform="matrix(1 0 0 1 210.3147 69.0782)" font-size="5" fill="black">
      Mahalunge
    </text>
     <text transform="matrix(1 0 0 1 198.6077 65.4657)" font-size="5" fill="black">
      Man
    </text>
    <text transform="matrix(1 0 0 1 200.2261 77.2819)" font-size="5" fill="black">
      Nande
    </text>
    <text transform="matrix(1 0 0 1 189.3156 72.2507)"  font-size="5" fill="black">
      Chande
    </text>
    <text transform="matrix(1 0 0 1 183.7539 66.8457)" font-size="5" fill="black">
      Dhumalwadi
    </text>
    <text transform="matrix(1 0 0 1 210.4131 76.238)"  font-size="5" fill="black">
      Sus
    </text>
    <text transform="matrix(1 0 0 1 197.3371 85.4907)"  font-size="5" fill="black">
      Lavale
    </text>
    <text transform="matrix(1 0 0 1 215.2933 90.225)"  font-size="5" fill="black">
      Bavdhan Bk.
    </text>
    <text transform="matrix(1 0 0 1 213.0218 103.7706)"  font-size="5" fill="black">
      Bhugaon
    </text>
    <text transform="matrix(1 0 0 1 204.6188 100.3007)"  font-size="5" fill="black">
      Angrewadi
    </text>
    <text transform="matrix(1 0 0 1 198.6075 102.7007)"  font-size="5" fill="black">
      Bhukum
    </text>
    <text transform="matrix(1 0 0 1 188.0256 107.9508)"  font-size="5" fill="black">
      Pirangut
    </text>
    <text transform="matrix(1 0 0 1 196.3908 116.4807)"  font-size="5" fill="black">
      Khatpewadi
    </text>
    <text transform="matrix(1 0 0 1 187.8973 113.0907)"  font-size="5" fill="black">
      Mukaiwadi
    </text>
    <text transform="matrix(1 0 0 1 183.7539 118.8357)"  font-size="5" fill="black">
      Botarwadi
    </text>
    <text transform="matrix(1 0 0 1 175.4671 122.7675)"  font-size="5" fill="black">
      Uravade
    </text>
    <text transform="matrix(1 0 0 1 171.0356 128.2092)"  font-size="5" fill="black">
      Bharekarwadi
    </text>
    <text transform="matrix(1 0 0 1 165.2072 131.5555)"  font-size="5" fill="black">
      Morewadi
    </text>
    <text transform="matrix(1.0273 0 0 1 158.1638 122.7678)" font-size="5" fill="black">
      Mutha
    </text>
    <text transform="matrix(1 0 0 1 158.8572 114.4707)" font-size="5" fill="black">
      Ambegaon
    </text>
    <text transform="matrix(1 0 0 1 169.7923 114.0939)" font-size="5" fill="black">
      Marnewadi
    </text>
    <text transform="matrix(1 0 0 1 184.4375 142.4348)"  font-size="5" fill="black">
      Kalavadi
    </text>
    <text transform="matrix(1 0 0 1 170.7572 149.4109)"  font-size="5" fill="black">
      Davaje
    </text>
    <text transform="matrix(1 0 0 1 160.9553 144.1306)"  font-size="5" fill="black">
      Kondhur
    </text>
    <text transform="matrix(1 0 0 1 156.5188 138.0763)"  font-size="5" fill="black">
      Jatede
    </text>
    <text transform="matrix(1 0 0 1 149.7871 137.2878)" font-size="5" fill="black">
      Malegaon
    </text>
    <text transform="matrix(1 0 0 1 144.0977 133.4034)" font-size="5" fill="black">
      Wanjale
    </text>
    <text transform="matrix(1 0 0 1 137.1144 137.723)"  font-size="5" fill="black">
      Valunde
    </text>
    <text transform="matrix(1 0 0 1 125.3472 141.57)" font-size="5" fill="black">
      Bhode
    </text>
    <text transform="matrix(1 0 0 1 160.6224 152.9856)"  font-size="5" fill="black">
      Kuran Bk
    </text>
    <text transform="matrix(1 0 0 1 146.8397 147.5235)"  font-size="5" fill="black">
      Varasgaon
    </text>
    <text transform="matrix(1 0 0 1 139.1144 147.9098)"  font-size="5" fill="black">
      Saiv Bk
    </text>
    <text transform="matrix(1 0 0 1 130.2172 147.9853)"  font-size="5" fill="black">
      Mose Bk
    </text>
    <text transform="matrix(1 0 0 1 120.608 157.5697)"  font-size="5" fill="black">
      Palase
    </text>
    <text transform="matrix(1 0 0 1 112.3638 157.2944)"  font-size="5" fill="black">
      Admal
    </text>
    <text transform="matrix(1 0 0 1 104.2675 146.8402)"  font-size="5" fill="black">
      Dasave
    </text>
    <text transform="matrix(1 0 0 1 112.364 136.4732)"  font-size="5" fill="black">
      Temghar
    </text>
    <text transform="matrix(1 0 0 1 97.7323 131.1309)"  font-size="5" fill="black">
      Vegre
    </text>
    <text transform="matrix(1 0 0 1 115.5722 120.1973)"  font-size="5" fill="black">
      Lavharde
    </text>
    <text transform="matrix(1 0 0 1 126.0169 126.2806)"  font-size="5" fill="black">
      Kolavade
    </text>
    <text transform="matrix(1 0 0 1 137.1231 122.4812)" font-size="5" fill="black">
      Kharavade
    </text>
     <text transform="matrix(1 0 0 1 147.3644 124.7114)"  font-size="5" fill="black">
      Andgaon
    </text>
    <text transform="matrix(1 0 0 1 145.3407 119.1273)"  font-size="5" fill="black">
      Attalwadi
    </text>
    <text transform="matrix(1 0 0 1 147.7573 113.9499)" font-size="5" fill="black">
      Belawade
    </text>
    <text transform="matrix(1 0 0 1 136.7329 115.8105)"  font-size="5" fill="black">
      Khachare
    </text>
    <text transform="matrix(1 0 0 1 125.0787 110.5355)"  font-size="5" fill="black">
      Jamgaon
    </text>
    <text transform="matrix(1 0 0 1 126.0168 106.4307)"  font-size="5" fill="black">
      Mandede
    </text>
    <text transform="matrix(1 0 0 1 111.5103 112.6892)" font-size="5" fill="black">
      Dattawadi
    </text>
    <text transform="matrix(1 0 0 1 96.8412 119.5038)"  font-size="5" fill="black">
      Ekole
    </text>
    <text transform="matrix(1 0 0 1 85.7075 127.427)" font-size="5" fill="black">
      Dhokalwadi
    </text>
    <text transform="matrix(1 0 0 1 74.7735 130.8671)"  font-size="5" fill="black">
      Warak
    </text>
    <text transform="matrix(1 0 0 1 60.6428 125.5931)"  font-size="5" fill="black">
      Adharwadi
    </text>
    <text transform="matrix(1 0 0 1 61.3134 112.1094)"  font-size="5" fill="black">
      Nive
    </text>
    <text transform="matrix(1 0 0 1 80.3673 110.9257)" font-size="5" fill="black">
      Waghwadi
    </text>
    <text transform="matrix(1 0 0 1 89.4303 113.0905)"  font-size="5" fill="black">
      Vadgaon
    </text>
    <text transform="matrix(1 0 0 1 88.8644 101.5355)"  font-size="5" fill="black">
      Tata Talav
    </text>
    <text transform="matrix(1 0 0 1 73.2001 106.7008)"  font-size="5" fill="black">
      Vandre
    </text>
    <text transform="matrix(1 0 0 1 61.4815 96.5173)"  font-size="5" fill="black">
      Pimpri
    </text>
    <text transform="matrix(1 0 0 1 49.2647 94.468)" font-size="5" fill="black">
      Adgaon
    </text>
    <text transform="matrix(1 0 0 1 39.9295 100.7964)"  font-size="5" fill="black">
      Ghutake
    </text>
    <text transform="matrix(1 0 0 1 20.4273 82.9108)"  font-size="5" fill="black">
      Tail Bailla
    </text>
    <text transform="matrix(1 0 0 1 36.4029 82.0609)"  font-size="5" fill="black">
      Bhambarale
    </text>
    <text transform="matrix(1 0 0 1 45.5073 74.2709)"  font-size="5" fill="black">
      Bharpe Bk
    </text>
    <text transform="matrix(1 0 0 1 21.627 67.7009)"  font-size="5" fill="black">
      Saltar
    </text>
    <text transform="matrix(1 0 0 1 30.2281 64.8391)" font-size="5" fill="black">
      Majegaon
    </text>
    <text transform="matrix(1 0 0 1 31.5835 54.5002)" font-size="5" fill="black">
      Ambavane
    </text>
    <text transform="matrix(1 0 0 1 44.4822 39.3107)"  font-size="5" fill="black">
      Devghar
    </text>
    <text transform="matrix(1 0 0 1 54.975 47.6365)"  font-size="5" fill="black">
      Visaghar
    </text>
    <text transform="matrix(0.8957 -0.4446 0.4446 0.8957 59.9937 55.4811)"  font-size="5" fill="black">
      Kolawali
    </text>
    <text transform="matrix(1 0 0 1 62.4647 63.3412)"  font-size="5" fill="black">
      Pomgaon
    </text>
    <text transform="matrix(0.3391 -0.9407 0.9407 0.3391 52.9318 65.677)" font-size="5" fill="black">
      Kumbheri
    </text>
    <text transform="matrix(1 0 0 1 78.9851 64.8393)"  font-size="5" fill="black">
      Shirvali
    </text>
    <text transform="matrix(1 0 0 1 85.7075 70.7007)"  font-size="5" fill="black">
      Chandvai
    </text>
    <text transform="matrix(1 0 0 1 76.1782 73.9496)"  font-size="5" fill="black">
      Shedani
    </text>
    <text transform="matrix(1 0 0 1 100.4782 60.6296)"  font-size="5" fill="black">
      Hadashi
    </text>
    <text transform="matrix(1 0 0 1 105.0049 54.7907)"  font-size="5" fill="black">
      Shindewadi
    </text>
    <text transform="matrix(1 0 0 1 111.1204 44.3494)"  font-size="5" fill="black">
      Kashig
    </text>
    <text transform="matrix(1 0 0 1 120.2825 49.0653)"  font-size="5" fill="black">
      Andhale
    </text>
    <text transform="matrix(1 0 0 1 88.8644 79.7007)"  font-size="5" fill="black">
      Nandivali
    </text>
    <text transform="matrix(1 0 0 1 96.8412 73.1092)"  font-size="5" fill="black">
      Walen
    </text>
    <text transform="matrix(1 0 0 1 107.0575 69.5709)" font-size="5" fill="black" >
  Kolwan
</text>
<text transform="matrix(1 0 0 1 101.2255 83.3809)" font-size="5" fill="black" >
  Valne
</text>
<text transform="matrix(1 0 0 1 106.1226 75.9892)" font-size="5" fill="black" >
  Dongargoan
</text>
<text transform="matrix(1 0 0 1 113.7461 59.0604)" font-size="5" fill="black" >
  Bhalgudi
</text>
<text transform="matrix(1 0 0 1 129.6672 52.0277)" font-size="5" fill="black">
  Katarkhad
</text>
<text transform="matrix(1 0 0 1 114.7186 68.0014)" font-size="5" fill="black">
  Sathesai
</text>
<text transform="matrix(1 0 0 1 120.9471 61.9002)" font-size="5" fill="black" >
  Nandgaon
</text>
<text transform="matrix(0.3362 -0.9418 0.9418 0.3362 131.1774 70.7011)" font-size="5" fill="black">
  Chikhalgaon
</text>
<text transform="matrix(0.4772 -0.8788 0.8788 0.4772 140.2566 59.8309)" font-size="5" fill="black">
  Khamboli
</text>
<text transform="matrix(0.4772 -0.8788 0.8788 0.4772 148.7689 59.0603)" font-size="5" fill="black">
  Pimpaloli
</text>
<text transform="matrix(0.4772 -0.8788 0.8788 0.4772 143.8977 65.6775)" font-size="5" fill="black">
  Jawal
</text>
<text transform="matrix(0.4772 -0.8788 0.8788 0.4772 153.0753 63.8232)" font-size="5" fill="black">
  Padalghar
</text>
<text transform="matrix(0.3362 -0.9418 0.9418 0.3362 124.5922 77.7714)" font-size="5" fill="black">
  Hotale
</text>
<text transform="matrix(1 0 0 1 128.9593 78.9509)" font-size="5" fill="black">
  Nanegaon
</text>
<text transform="matrix(1 0 0 1 136.8802 73.1092)" font-size="5" fill="black">
  Kule
</text>
<text transform="matrix(1 0 0 1 142.3973 75.2957)" font-size="5" fill="black">
  Dakhane
</text>
<text transform="matrix(1 0 0 1 146.467 71.334)" font-size="5" fill="black">
  Kemasewade
</text>
<text transform="matrix(0.4772 -0.8788 0.8788 0.4772 157.6231 74.8561)" font-size="5" fill="black">
  Karmoli
</text>
<text transform="matrix(1 0 0 1 149.0294 80.232)" font-size="5" fill="black">
  Chale
</text>
<text transform="matrix(1 0 0 1 157.4392 82.2888)" font-size="5" fill="black">
  Mugavade
</text>
<text transform="matrix(1 0 0 1 163.0479 76.3371)" font-size="5" fill="black">
  Ghotavade
</text>
<text transform="matrix(1 0 0 1 168.5497 83.8807)" font-size="5" fill="black">
  Bhegadewadi
</text>
<text transform="matrix(1 0 0 1 183.159 70.9416)">
  <tspan x="0" y="0" font-size="5" fill="black">Amale</tspan>
  <tspan x="0" y="1.89" font-size="5" fill="black">wadi</tspan>
</text>
<text transform="matrix(1 0 0 1 187.6011 81.3772)" font-size="5" fill="black">
  Mulkhed
</text>
<text transform="matrix(1 0 0 1 113.4531 93.2937)" font-size="5" fill="black">
  Sambhave
</text>
<text transform="matrix(1 0 0 1 110.1072 99.6307)" font-size="5" fill="black">
  Male
</text>
<text transform="matrix(0.1053 -0.9944 0.9944 0.1053 108.5543 109.4706)" font-size="5" fill="black">
  Mulshi Kh
</text>
<text transform="matrix(1 0 0 1 116.0655 85.675)" font-size="5" fill="black">
  Bhadas Bk
</text>
<text transform="matrix(1 0 0 1 127.0925 81.8585)" font-size="5" fill="black">
  Asade
</text>
<text transform="matrix(1 0 0 1 128.628 84.841)" font-size="5" fill="black">
  Khubawali
</text>
<text transform="matrix(1 0 0 1 129.6671 89.5213)" font-size="5" fill="black">
  Akole
</text>
<text transform="matrix(1 0 0 1 123.9272 98.7709)" font-size="5" fill="black">
  Shere
</text>
<text transform="matrix(1 0 0 1 132.788 97.0507)" font-size="5" fill="black">
  Kalamshet
</text>
<text transform="matrix(1 0 0 1 141.9174 89.9106)" font-size="5" fill="black">
  Ravade
</text>
<text transform="matrix(1 0 0 1 142.0365 97.8808)" font-size="5" fill="black">
  Kondhawale
</text>
<text transform="matrix(1 0 0 1 136.9007 104.2257)" font-size="5" fill="black">
  Andeshe
</text>
<text transform="matrix(1 0 0 1 146.4673 106.0116)" font-size="5" fill="black">
  Chinchvad
</text>
<text transform="matrix(1 0 0 1 153.4751 94.468)" font-size="5" fill="black">
  Paud
</text>
<text transform="matrix(1 0 0 1 160.4132 91.8406)" font-size="5" fill="black">
  Darawali
</text>
<text transform="matrix(1 0 0 1 170.1909 90.7874)" font-size="5" fill="black">
  Ambarwate
</text>
<text transform="matrix(1 0 0 1 179.5933 90.0549)" font-size="5" fill="black">
  Bhare
</text>
<text transform="matrix(1 0 0 1 174.5571 100.3008)">
  <tspan x="0" y="0" font-size="5" fill="black">Kasar</tspan>
  <tspan x="0" y="2.89" font-size="5" fill="black">Amboli</tspan>
</text>
<text transform="matrix(0.5901 -0.8073 0.8073 0.5901 164.6619 106.4496)" font-size="5" fill="black">
  Shindewadi
</text>
<text transform="matrix(1 0 0 1 154.3537 104.2258)" font-size="5" fill="black">
  Vithalwadi
</text>
<text transform="matrix(1 0 0 1 160.4131 96.5174)">
  <tspan x="0" y="0" font-size="5" fill="black">Surve</tspan>
  <tspan x="0" y="1.96" font-size="5" fill="black">wadi</tspan>
</text>
<text transform="matrix(1 0 0 1 61.8959 143.0938)" font-size="5" fill="black">
  Tamhini Bk
</text>
<text transform="matrix(1 0 0 1 70.2778 159.6548)" font-size="5" fill="black">
  Dhamanohal
</text>
<text transform="matrix(1 0 0 1 83.0558 147.7007)" font-size="5" fill="black">
  Mugaon
</text>
<text transform="matrix(1 0 0 1 96.2118 151.8292)" font-size="5" fill="black">
  Bhoini
</text>
<text transform="matrix(1 0 0 1 83.1838 169.9492)" font-size="5" fill="black">
  Gadale
</text>
<text transform="matrix(1 0 0 1 95.9876 163.9107)" font-size="5" fill="black">
  Sakhari
</text>
<text transform="matrix(1 0 0 1 80.2573 181.6759)" font-size="5" fill="black">
  Dapsare
</text>
<text transform="matrix(1 0 0 1 104.8099 169.5217)" font-size="5" fill="black">
  Tav
</text>
<text transform="matrix(1 0 0 1 126.2807 164.0821)" font-size="5" fill="black">
  Mose Kh
</text>
<text transform="matrix(1 0 0 1 135.7479 160.3624)" font-size="5" fill="black">
  Saiv kh
</text>
<text transform="matrix(1 0 0 1 146.4672 161.7505)" font-size="5" fill="black">
  Panshet
</text>
<text transform="matrix(1 0 0 1 70.9962 190.3683)" font-size="5" fill="black">
  Ghol
</text>
<text transform="matrix(1 0 0 1 82.3336 192.3371)" font-size="5" fill="black">
  Tekpole
</text>
<text transform="matrix(1 0 0 1 98.9029 205.7908)" font-size="5" fill="black">
  Khanu
</text>
<text transform="matrix(1 0 0 1 99.3975 194.4865)" font-size="5" fill="black">
  Mangaon
</text>
<text transform="matrix(1 0 0 1 97.2241 186.258)" font-size="5" fill="black">
  Ghodkhal
</text>
<text transform="matrix(1 0 0 1 104.2675 178.8257)" font-size="5" fill="black">
  Kasedi
</text>
<text transform="matrix(1 0 0 1 111.51 178.1311)" font-size="5" fill="black">
  Bhalwadi
</text>
<text transform="matrix(1 0 0 1 111.5103 191.1497)" font-size="5" fill="black">
  Pole
</text>
<text transform="matrix(1 0 0 1 126.6852 183.4657)" font-size="5" fill="black">
  Shirkoli
</text>
<text transform="matrix(1 0 0 1 126.4086 171.2009)" font-size="5" fill="black">
  Ambegaon Kd
</text>
<text transform="matrix(1 0 0 1 119.4275 177.0556)" font-size="5" fill="black">
  Koshimghar
</text>
<text transform="matrix(1 0 0 1 135.3534 175.1188)" font-size="5" fill="black">
  Ambegaon Bk
</text>
<text transform="matrix(1 0 0 1 146.0402 171.2008)" font-size="5" fill="black">
  Vadghar
</text>
<text transform="matrix(1 0 0 1 154.7058 175.1184)" font-size="5" fill="black">
  Kadave
</text>
<text transform="matrix(1 0 0 1 150.6273 165.512)" font-size="5" fill="black">
  Kuran Kd
</text>
<text transform="matrix(1 0 0 1 165.6206 161.0623)" font-size="5" fill="black">
  Ranawadi
</text>
<text transform="matrix(1 0 0 1 171.6929 165.7802)" font-size="5" fill="black">
  Rule
</text>
<text transform="matrix(1 0 0 1 171.6773 171.3132)" font-size="5" fill="black">
  Tidakiwadi
</text>
<text transform="matrix(0.3851 -0.9229 0.9229 0.3851 184.9625 163.376)" font-size="5" fill="black">
  Osade
</text>
<text transform="matrix(0.3851 -0.9229 0.9229 0.3851 188.8277 164.4375)" font-size="5" fill="black">
  Nigde Mose
</text>
<text transform="matrix(1 0 0 1 180.5754 170.3362)" font-size="5" fill="black">
  Ambed
</text>
<text transform="matrix(1 0 0 1 194.9324 169.1773)" font-size="5" fill="black">
  Kondgaon
</text>
<text transform="matrix(1 0 0 1 191.0376 178.2551)" font-size="5" fill="black">
  Ranjane
</text>
<text transform="matrix(1 0 0 1 182.5748 177.6014)" font-size="5" fill="black">
  Khamgaon
</text>
    </svg>
  `;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Svg width={Dimensions.get('window').width} height={Dimensions.get('window').height}>

      <Svg viewBox="0 0 375.84 590.44" width="100%" height="100%">
      <SvgImage
          href={base64Image2}
          width="1544" height="1452"
          preserveAspectRatio="xMidYMid meet"
          transform="matrix(0.24 0 0 0.24 1.68 0)"
        />
      </Svg>

    
    
      <Svg width="100%" height="100%">
        <SvgImage
          href={base64Image1}
          width="1280" height="1293"
          preserveAspectRatio="xMidYMid meet"
          transform="matrix(0.24 0 0 0.24 3.84 36.24)"
        />
      </Svg>

      <Path
      id="penjalwadi"
      fill={getColor(313)}
      onPress={() => open(313)}
      d="M348.05,248.88h-0.25l-2.85,4.25l-2.9,1.32l-2.85,1.62v2.77l0.51,2.28l0.9,0.99l2.74-1.88
        l2.11-0.22l6.74-6.26C350.46,251.5,348.5,249.07,348.05,248.88z"
    />
    <Path
      id="navi"
      fill={getColor(312)}
      onPress={() => open(312)}
      d="M348.33,264.35l-1.95-2.7l-0.92-1.64l-2.11,0.22l-2.74,1.88l-0.9-0.99l-0.51-2.28l-1.02-0.26
        l-2.17,1.96l-0.08,2.89l-1.02,2.34l-0.22,1.02l1.02,3.83l1.33,1.15l3.85-0.53l0.32-1.56c0,0,1.18-0.48,1.76-1.03
        c0.57-0.54,1.82,0.61,1.82,0.61l2.74,2.36l1.69-3.12l1.03-3.36L348.33,264.35z"
    />
     <Path
      id="taprewadi"
      fill={getColor(314)}
      onPress={() => open(314)}
      d="M355.23,258.15l-4.98,6.99l-1.92-0.79l-1.95-2.7l-0.92-1.64l6.74-6.26c1.57,2.02,2.96,3.89,2.96,3.89S355.19,257.84,355.23,258.15z"
    />
    <Path
      id="gunand"
      fill={getColor(315)}
      onPress={() => open(315)}
      d="M357.5,274.45c0.13,0.09-2.98,2.6-2.98,2.6l-1.74,1.36h-6.64l-0.84-0.59l0.96-1.98l1.27-4.22l1.69-3.12l1.03-3.36l4.98-6.99c0.12,0.95,0.36,2.95,0.23,3.11c-0.17,0.21-1.92,1.75-1.92,1.75l-0.97,2.93c0,0-0.09,2.26,0.29,2.21c0.39-0.04,0.68,2.6,0.68,2.6c1.41,1.36,3.96,1.45,3.96,1.45S357.37,274.37,357.5,274.45z"
    />
    <Path
      id="vathar_hinge"
      fill={getColor(316)}
      onPress={() => open(316)}
      d="M347.53,271.62l-1.27,4.22l-0.96,1.98l-3.76-2.6l-2.97-2.13l-1.53-1.32l3.85-0.53l0.32-1.56c0,0,1.18-0.48,1.76-1.03c0.57-0.54,1.82,0.61,1.82,0.61L347.53,271.62z"
    />
    <Path
      id="bhongawali"
      fill={getColor(276)}
      onPress={() => open(276)}
      d="M341.69,240.98l-4.91-2.61l-4.85-1.98l-4.28-3.51l-4.15-2.49l-1.21,4.91l-3.26,5.56l1.98,4.72l1.15,2.36l2.62,1.98v2.43c0,0,1.48,0.08,3.38,0.7c2.77,0.9,6.45,2.93,7.85,7.49l2.17-1.96l1.02,0.26v-2.77l2.85-1.62l2.9-1.32l2.85-4.25L341.69,240.98z"
    />
    <Path
      id="bhambawade"
      fill={getColor(310)}
      onPress={() => open(310)}
      d="M324.78,252.35v0.7l-0.03,7.21l-0.1,3.48l-0.67,1.4l3.52,1.19v-4.22l0.51-3.96l0.15-5.1C326.26,252.43,324.78,252.35,324.78,252.35z"
    />
     <Path
      id="pande"
      fill={getColor(308)}
      onPress={() => open(308)}
      d="M317.57,256.46l-0.2,1.69l0.26,2.62l3.03,2.81l3.32,1.56l0.67-1.4l0.1-3.48l0.03-7.21C321.4,252.77,317.57,256.46,317.57,256.46z"
    />
    <Path
      id="savardare"
      fill={getColor(277)}
      onPress={() => open(277)}
      d="M322.16,247.94l-1.15-2.36l-1.98-4.72l-1.02,1.4l-0.96,3.21l-1.27,3.05v5.23l1.79,2.71c0,0,3.83-3.69,7.21-3.41v-3.13L322.16,247.94z"
    />
    <Path
      id="sarole"
      fill={getColor(309)}
      onPress={() => open(309)}
      d="M317.37,224.58l-1.59,3.19l-2.81,6.38l-1.66,5.37l-0.27,0.55l-1.9,3.85l1.08,1.55l0.82,2.86l-0.56,1.85l-1.34,4.4l8.49,6.19l-0.26-2.62l0.2-1.69l-1.79-2.71v-5.23l1.27-3.05l0.96-3.21l1.02-1.4l3.26-5.56l1.21-4.91L317.37,224.58z"
    />
    <Path
      id="kenjal"
      fill={getColor(278)}
      onPress={() => open(278)}
      d="M308.69,248.88l-4.59-0.55l-0.51,1.53l-0.58,1.47l-1.21,1.72l-0.7,2.45l-0.26,2.65l-0.25,0.43l2.1-0.43l3.7-3.57l0.9-0.45l1.85,0.45l1.34-4.4L308.69,248.88z"
    />
    <Path
      id="kikvi"
      fill={getColor(275)}
      onPress={() => open(275)}
      d="M309.14,243.92l1.9-3.85l-7.84-0.36l-1.08,2.97l-1.53,4.11l1.21,0.26l2.3,1.28l4.59,0.55l1.79,1.3l0.56-1.85l-0.82-2.86L309.14,243.92z"
    />
    <Path
      id="wagajwadi"
      fill={getColor(267)}
      onPress={() => open(267)}
      d="M314.05,219.98l-2.29,1.35l-4.02,3.7l-1.41,2.55l-0.8,2.81l-1.31,0.76v4.92l-1.02,3.64l7.84,0.36l0.27-0.55l1.66-5.37l2.81-6.38l1.59-3.19L314.05,219.98z"
    />
    <Path
      id="morawali"
      fill={getColor(279)}
      onPress={() => open(279)}
      d="M301.8,247.05l-1.21-0.26l-1.79,0.64l-2.94,1.92l-0.64,0.51v2.81l1.03,2.42l1.08,3.06l0.58,0.43h2.68l0.25-0.43l0.26-2.65l0.7-2.45l1.21-1.72l0.58-1.47l0.51-1.53L301.8,247.05z"
    />
    <Path
      id="dhangavadi"
      fill={getColor(274)}
      onPress={() => open(274)}
      d="M301.93,230.39v-1.02l-2.81-0.58l-0.38,3.19v6.07l-1.15,2.02l-1.79,2.61l-2.04,1.75l0.44,2.81l1.02,2.62l0.64-0.51l2.94-1.92l1.79-0.64l1.53-4.11l1.08-2.97l1.02-3.64v-4.92L301.93,230.39z"
    />
    <Path
      id="kapoorval"
      fill={getColor(266)}
      onPress={() => open(266)}
      d="M296.44,231.09l-1.6,1.79l3.9,5.17v-6.07l0.38-3.19L296.44,231.09z"
    />
    <Path
      id="nigade"
      fill={getColor(268)}
      onPress={() => open(268)}
      d="M294.84,232.88l-1.72,2.81l-1.02,3.06l-0.96,2.55l2.62,3.13l2.04-1.75l1.79-2.61l1.15-2.02L294.84,232.88z"
    />
    <Path
      id="divale"
      fill={getColor(265)}
      onPress={() => open(265)}
      d="M298.99,227.2l-2.01,0.79l-3.22-0.54l-0.9,1.6l-0.32,1.34l-0.89,1.21l-0.51,2.17l-0.45,3.07l-0.64,1.53l-0.51,0.95l1.6,1.98l0.96-2.55l1.02-3.06l1.72-2.81l1.6-1.79l2.68-2.3L298.99,227.2z"
    />
    <Path
      id="harichandri"
      fill={getColor(264)}
      onPress={() => open(264)}
      d="M290.69,225.15l-0.76,2.3l-0.39,1.34l-1.78,0.32l-0.39,3.26l0.39,2.61l-0.39,3.68l2.17,0.66l0.51-0.95l0.64-1.53l0.45-3.07l0.51-2.17l0.89-1.21l0.32-1.34l0.9-1.6L290.69,225.15z"
    />
    <Path
      id="kethkawane"
      fill={getColor(246)}
      onPress={() => open(246)}
      d="M299.66,219.28l-3.09-0.83l-1.73-0.89l-2.04-0.96l-1.09,1.6l-1.02,6.95l3.07,2.3l3.22,0.54l2.01-0.79l1.6-3.32l0.89-3.13L299.66,219.28z"
    />
    <Path
      id="kamthadi"
      fill={getColor(247)}
      onPress={() => open(247)}
      d="M289.54,215.39l-4.46,3.83l-2.62,2.92l-1.85,2.06l0.83,1.85l1.15,1.15l4.11,0.25l0.67,0.54l0.39,1.12l1.78-0.32l0.39-1.34l0.76-2.3l1.02-6.95l1.09-1.6L289.54,215.39z"
    />
    <Path
      id="umbre"
      fill={getColor(263)}
      onPress={() => open(263)}
      d="M287.76,229.11l-0.39-1.12l-0.67-0.54l-4.11-0.25l-1.15-1.15l-0.51,2.74l-0.32,2.24l-1.41,3.22l-0.25,1.31l3.06,2.49l1.98,0.89l3.38-0.28l0.39-3.68l-0.39-2.61L287.76,229.11z"
    />
    <Path
      id="kadkai"
      fill={getColor(376)}
      onPress={() => open(376)}
      d="M280.61,224.2l-2.17,3l-1.92,0.44h-3.13l-0.89,1.47v3.39l2.36,1.46l2.43,1.28l1.66,0.32l0.25-1.31l1.41-3.22l0.32-2.24l0.51-2.74L280.61,224.2z"
    />
    <Path
      id="malegoan"
      fill={getColor(248)}
      onPress={() => open(248)}
      d="M278.95,219.67l-3.32,2.47l-1.98-0.5l0.32,2.05l2.55,3.95l1.92-0.44l2.17-3l1.85-2.06L278.95,219.67z"
    />
    <Path
      id="nasarapur"
      fill={getColor(245)}
      onPress={() => open(245)}
      d="M287.76,214.56h-3.71l-2.07,0.5l-1.37,0.33h-1.15l-1.85,1.21h-4.85l-1.34,0.77l2.23,4.27
		l1.98,0.5l3.32-2.47l3.51,2.47l2.62-2.92l4.46-3.83L287.76,214.56z"
    />
    <Path
      id="alandewadi"
      fill={getColor(281)}
      onPress={() => open(281)}
      d="M295.22,252.67v-2.81l-1.02-2.62l-0.83,0.32h-3.38l-2.23,0.51l-2.24,0.26h-2.55l-1.92,0.51
		l-1.46-0.51h-2.94l0.32,1.53l0.64,2.83l0.89,3.23l17.75-0.83L295.22,252.67z"
    />
    <Path
      id="ingawali"
      fill={getColor(307)}
      onPress={() => open(307)}
      d="M296.25,255.09l-17.75,0.83l-0.06,1.79l0.76,0.44l1.28,2.62l0.96,3.32l1.02,3.06h0.9l1.72-1.02
		l2.29-2.68l2.62-1.85l2.3-0.32l1.02-0.51l2.43-1.27l1.59-1.35L296.25,255.09z"
    />
    <Path
      id="mohari_kh."
      fill={getColor(269)}
      onPress={() => open(269)}
      d="M293.76,244.43l-2.62-3.13l-1.6-1.98l-2.17-0.66l-3.38,0.28l-1.98-0.89l0.45,1.27v1.66
		l-1.02,1.03l-0.83,1.59l-1.02,1.34l-0.64,2.3l0.64,1.09l1.46,0.51l1.92-0.51h2.55l2.24-0.26l2.23-0.51h3.38l0.83-0.32
		L293.76,244.43z"
    />
    <Path
      id="kasurdi_gm"
      fill={getColor(270)}
      onPress={() => open(270)}
      d="M282.01,238.05l-1.98,0.32l-3.06,2.23l-2.17,1.6l-1.53,1.24l-2.62,2.52l-1.02,1.66l1.79-0.38
		v1.09h8.17l-0.64-1.09l0.64-2.3l1.02-1.34l0.83-1.59l1.02-1.03v-1.66L282.01,238.05z"
    />
    <Path
      id="mohari_bk"
      fill={getColor(271)}
      onPress={() => open(271)}
      d="M278.95,235.56l-1.66-0.32l-2.43-1.28l-2.36-1.46l-2.49,3.06l-2.17,1.47l-2.49,1.02l-2.42,2.3
		l-1.09,2.33l-0.38,0.51l1.15,1.24l0.7,1.15h2.68l0.99,0.96l1.12,0.7l1.53,0.38l1.02-1.66l2.62-2.52l1.53-1.24l2.17-1.6l3.06-2.23
		l1.98-0.32L278.95,235.56z"
    />
    <Path
      id="bramhanghar"
      fill={getColor(272)}
      onPress={() => open(272)}
      d="M262.61,244.43l-1.15-1.24l-0.29,0.37l-2.2,2.79l-2.04,3.25l-1.28,1.53l0.26,2.33l-0.26,1.63
		l1.72,0.83l3.07-1.59l2.87-8.75L262.61,244.43z"
    />
    <Path
      id="narhe"
      fill={getColor(273)}
      onPress={() => open(273)}
      d="M268.1,247.24l-1.12-0.7l-0.99-0.96h-2.68l-2.87,8.75l0.64,0.31l-0.77,1.28l0.57,1.28l1.73-0.45
		v-1.34l1.15,0.51l0.25,1.28h0.7v-1.28h0.83l1.15,1.28l0.9-1.02l1.15-3.83l0.89-4.73L268.1,247.24z"
    />
    <Path
      id="sangamner"
      fill={getColor(282)}
      onPress={() => open(282)}
      d="M277.61,252.69l-0.64-2.83l-0.32-1.53h-5.23v-1.09l-1.79,0.38l-0.89,4.73l-1.15,3.83l-0.9,1.02
		v1.38l1.6,0.34l1.85,2.2l1.28,0.67h2.23l3.32-3.64l1.47-0.44l0.06-1.79L277.61,252.69z"
    />
    <Path
      id="vadgoandal"
      fill={getColor(345)}
      onPress={() => open(345)}
      d="M279.71,275.26l-2.04-2.04l-2.62-4.92l-1.53-2.23l-2.17-2.11l2.24-0.57l-2.17-1.6l-2.43,0.45
		l-0.83,0.57l1.63,2.81l0.86,0.66l1.94,1.51l0.87,1.98l-1.41,1.02l-2.42,1.66l-2.94-2.55l1.28,2.94l-1.28,3.38h1.41l-0.26,4.21
		l1.09,1.47l4.53,0.25h2.59l1.24-0.63l3.83,1.66l1.79-2.68L279.71,275.26z"
    />
    <Path
  id="utroli"
  fill={getColor(346)}
  onPress={() => open(346)}
  d="M277.29,281.52l-1.24,0.63h-2.59l-4.53-0.25l-1.09-1.47l0.26-4.21h-1.41l-2.81,1.91l-0.95,3.13
		l-2.17,2.87l-0.71,1.79h2.88l2.04,1.21h3.45l5.87,0.58l2.68-0.9l4.15-3.63L277.29,281.52z"
/>

<Path
  id="bhor"
  fill={getColor(344)}
  onPress={() => open(344)}
  d="M266.69,269.9l-0.95,0.13l-2.43-1.47h-1.09l-3.51-1.41l-1.14,1.86l1.53,2.1l0.38,5.11l-2.59,3.83
		l-0.47,3.13l-2.68,3.06l6.31-0.32l0.71-1.79l2.17-2.87l0.95-3.13l2.81-1.91l1.28-3.38L266.69,269.9z"
/>

<Path
  id="shindewadi"
  fill={getColor(65)}
  onPress={() => open(65)}
  d="M272.5,153.97c0,0-1.4,1.57-2.79,2.75c-1.4,1.16-1.53,2.56-1.53,2.56s-0.97,4.6-1.17,6.93
		l-3.94-0.01c0.04-0.1,0.07-0.2,0.11-0.3c0.68-1.94,0-4.96,0-4.96s-1.93-3.82-2.96-4.72c-1.04-0.9-1.04-3.56-1.04-3.56
		c1.6-0.58,3.19-0.98,3.19-0.98s4.95-0.68,8.65-0.41C274.7,151.54,272.5,153.97,272.5,153.97z"
/>

<Path
  id="sasewadi"
  fill={getColor(377)}
  onPress={() => open(377)}
  d="M263.18,165.9c-0.04,0.1-0.07,0.2-0.11,0.3c-0.62,1.7-1.13,2.33-1.13,2.33l-0.51-0.43
		c0,0-3.33-2.34-5.94-5.4c-2.61-3.06-0.36-6.93,0.49-8.28c0.4-0.63,1.81-1.26,3.2-1.76c0,0,0,2.66,1.04,3.56
		c1.03,0.9,2.96,4.72,2.96,4.72S263.86,163.96,263.18,165.9z"
/>

<Path
  id="jambhali"
  fill={getColor(243)}
  onPress={() => open(243)}
  d="M265.87,211.99c-0.84-0.96-2.58-1.32-3.69-1.92c-1.11-0.6-3.48-0.72-3.48-0.72l-0.26,0.94
		l-2.28,2.47l-0.83,1.85c0,0-0.07,0.01-0.19,0.04l-0.31,1.87l-0.99,1.32l-0.36,1.26l-0.23,1.53c0.06,0.04,0.13,0.08,0.2,0.12
		c1.62,0.99,3.99,2.28,4.98,2.46c0.37,0.07,0.99,0.11,1.68,0.19c1.03,0.13,2.22,0.35,2.99,0.91c0.01,0,0.01,0,0.01,0
		c0.1,0.06,0.19,0.14,0.27,0.22c0.14,0.14,0.3,0.3,0.46,0.46l-0.11-0.12c0,0,0.43-1.07,0.46-1.21c0.03-0.15,0.87-0.75,0.81-2.31
		s-0.63-3.27,0.87-5.61c1.31-2.05,1.68-2.36,1.76-2.41C266.87,212.96,266.32,212.5,265.87,211.99z"
/>

<Path
  id="sangvi_kh"
  fill={getColor(249)}
  onPress={() => open(249)}
  d="M273.97,223.69l-0.24-1.55l-1.99,0.78c0,0-1.94,2.3-2.69,3.92c-0.68,1.47-0.62,2.05-0.6,2.15
		c0,0.01,0,0.01,0,0.01c0.96,0.4,2.09,1.56,2.09,1.56l1.96,1.94v-3.39l0.89-1.47h3.13L273.97,223.69z"
/>

<Path
  id="virwadi"
  fill={getColor(244)}
  onPress={() => open(244)}
  d="M273.65,221.64l-2.23-4.27c0,0-1.32-3.31-1.32-3.34c-0.82-0.13-1.49-0.3-2.06-0.52l-0.16-0.07
		c-0.09-0.03-0.17-0.07-0.25-0.11c-0.08,0.05-0.45,0.36-1.76,2.41c-1.5,2.34-0.93,4.05-0.87,5.61s-0.78,2.16-0.81,2.31
		c-0.03,0.14-0.46,1.21-0.46,1.21l0.11,0.12l0.28,0.29c0.38,0.39,0.78,0.82,1.12,1.2c0.01,0,0.01,0,0.01,0
		c0.59,0.65,1.04,1.16,1.04,1.16s0.72,1.1,1.73,1.23c0.14,0.02,0.28,0.06,0.43,0.12c-0.02-0.1-0.08-0.68,0.6-2.15
		c0.75-1.62,2.69-3.92,2.69-3.92l1.99-0.78L273.65,221.64z"
/>
<Path
  id="kolawadi"
  fill={getColor(224)}
  onPress={() => open(224)}
  d="M251.62,215.29c-0.24,0.03-0.43,0.04-0.6,0.04l-0.28,2.15l-0.47,2.61c0.62,0,1.05,0,1.05,0
		s0.47-0.3,1.93,0.54l0.23-1.53l0.36-1.26l0.99-1.32l0.31-1.87C254.52,214.78,252.5,215.19,251.62,215.29z"
/>
<Path
  id="sangvi_bk"
  fill={getColor(218)}
  onPress={() => open(218)}
  d="M249.73,214.77c-0.58-0.45-0.36-1.77-0.36-1.77s-3.49,0-3.55,0s-2.96-0.24-3.05-0.24
		c0.02,0.25,0.03,0.4,0.03,0.4l0.45,2.97c0,0,0.39,1.65-0.33,2.16c-0.24,0.17-0.3,0.33-0.28,0.48c0.03,0.29,0.43,0.51,0.43,0.51
		s1.14,0.81,2.64,0.81h4.56l0.47-2.61l0.28-2.15C250.44,215.32,250.18,215.12,249.73,214.77z"
/>
<Path
  id="sonawadi"
  fill={getColor(219)}
  onPress={() => open(219)}
  d="M251.62,201.62h-1.39l-0.23,0.32l-0.33,2.46l-0.78,1.8c0,0-0.42,2.67-0.66,3.99
		s-1.74,0.9-1.74,0.9h-3.85c0.06,0.68,0.1,1.29,0.13,1.67c0.09,0,2.99,0.24,3.05,0.24s3.55,0,3.55,0c2.21,0.16,2.86-4.65,2.86-4.65
		s0.47-4,0.67-5.3C253.11,201.76,251.62,201.62,251.62,201.62z"
/>
<Path
  id="parawadi"
  fill={getColor(195)}
  onPress={() => open(195)}
  d="M252.88,193.9l-4.26,0.81c0,0-2.91,0.09-3.06,0.16c-0.15,0.07-4.99,0-4.99,0l0.31,1.4
		l-0.15,5.97l0.03,2.22c0,0,1.26,1.83,1.53,3.48c0.13,0.8,0.25,2.07,0.35,3.15h3.85c0,0,1.5,0.42,1.74-0.9s0.66-3.99,0.66-3.99
		l0.78-1.8l0.33-2.46l0.23-0.32l1.3-1.8c0,0,0.54-1.33,1.03-2.47l0.5-1.14L252.88,193.9z"
/>
<Path
  id="kusgaon"
  fill={getColor(173)}
  onPress={() => open(173)}
  d="M247.8,180.97c0,0-1.58,0.81-2.08,1.62c-0.49,0.81-3.46,3.06-3.64,3.11
		c-0.18,0.04-2.85,1.39-2.85,1.39l0.15,3.12l0.18,0.54l0.3,0.93l0.71,3.19c0,0,4.84,0.07,4.99,0c0.15-0.07,3.06-0.16,3.06-0.16
		l4.26-0.81c0,0,0.34-0.97,1.78-2.05c0.38-0.28,0.97-0.74,1.63-1.27L247.8,180.97z"
/>
<Path
  id="ranje"
  fill={getColor(172)}
  onPress={() => open(172)}
  d="M260.65,187.08c0,0-2.48,2.02-4.36,3.5l-8.49-9.61c0,0,8.08,0.21,9.34,0.24
		c1.26,0.03,2.04,1.63,2.04,1.63S260.02,185.29,260.65,187.08z"
/>
<Path
  id="khopi"
  fill={getColor(196)}
  onPress={() => open(196)}
  d="M263.91,192.82l-6.89,4.92c-0.15-1.29-2.34-1.53-2.34-1.53h-1.62l-0.18-2.31
		c0,0,0.34-0.97,1.78-2.05c1.44-1.07,5.99-4.77,5.99-4.77c0.16,0.42,0.29,0.8,0.4,1.11c0.09,0.26,0.22,0.43,0.38,0.54l0.57,1.93
		L263.91,192.82z"
/>
<Path
  id="velu"
  fill={getColor(170)}
  onPress={() => open(170)}
  d="M275.29,171.48l-2.39,1.43h-2.6l-0.86-0.4c0,0-3.73-0.1-3.8-0.26l0.1,0.24
		c-0.56-1.27-1.7-2.23-1.7-2.23l-2.1-1.73c0,0,0.51-0.63,1.13-2.33l3.94,0.01c-0.04,0.5-0.05,0.9,0,1.12
		c0.27,1.27,1.44-0.81,1.44-0.81s0.9-2.83,1.75-1.48c0.86,1.35,4.46,2.65,4.64,2.65C274.99,167.69,275.22,170.49,275.29,171.48z"
/>
<Path
  id="kasurdi_kb"
  fill={getColor(171)}
  onPress={() => open(171)}
  d="M301.84,196.18l-2.7,5.28c0,0-4.62,6.6-6.06,10.08c-1.44,3.48-0.28,5.06-0.28,5.06l-3.26-1.21
		l-1.78-0.83c0.17-1.21-0.38-2.27-1.79-2.93c-1.41-0.66-0.75-2.43-0.75-2.43s1.24-3.27,1.91-5.43c0.13-0.41,0.23-0.77,0.31-1.07
		c0.48-1.89,2.57-1.9,2.61-1.9l3.33-0.69l2.01-0.93l3.81-2.31l2.4-1.5C301.78,195.84,301.84,196.18,301.84,196.18z"
        />
<Path
  id="shivare"
  fill={getColor(197)}
  onPress={() => open(197)}
  d="M280.98,183.58c0,0-1.6,0.27-3.17,2.57c-1.58,2.29-2.57,4.13-2.57,4.13s-1.07,1.95-2.9,3.12
		c-0.29,0.18-0.6,0.35-0.92,0.48c-2.39,1-4.73,2.76-4.73,2.76c-0.71-1.94-2.14-3.1-2.14-3.1l-0.64-0.72l-1.91-2.16l-0.57-1.93
		c0.82,0.6,2.32-0.56,2.32-0.56s2.99-3.3,4.34-4.44s1.14-2.37,1.11-3.12l1.56,0.9c0,0,3.9,1.14,5.55,0l1.01-0.72h0.01
		c0.85,0.85,1.92,0.97,2.55,1.23C280.47,182.27,280.8,182.96,280.98,183.58z"
        />
<Path
  id="varve_kh"
  fill={getColor(198)}
  onPress={() => open(198)}
  d="M286.15,186.58c0,0-1.23,1.23-1.53,1.77c-0.3,0.54-1.98,4.29-3,5.46
		c-1.02,1.17-3.6,5.79-3.6,5.79v0.69l-3.03,1.59l-0.99-2.94l-1.66-0.99l-0.41-1.31l0.41-3.24c1.83-1.17,2.9-3.12,2.9-3.12
		s0.99-1.84,2.57-4.13c1.57-2.3,3.17-2.57,3.17-2.57c0.18,0.59,0.22,1.1,0.22,1.1s3.42,0.88,4.74,1.78
		C286.01,186.5,286.07,186.54,286.15,186.58z"
/>
<Path
  id="kambare"
  fill={getColor(199)}
  onPress={() => open(199)}
  d="M301.6,195.36v0.01l-2.4,1.5l-3.81,2.31l-2.01,0.93l-3.33,0.69c-0.04,0-2.13,0.01-2.61,1.9
		c-0.08,0.3-0.18,0.66-0.31,1.07c0,0-5.24-0.03-6.02,0c-0.78,0.03-1.44-0.24-1.44-0.24l-1.65-1.17v-2.76c0,0,2.58-4.62,3.6-5.79
		c1.02-1.17,2.7-4.92,3-5.46c0.3-0.54,1.53-1.77,1.53-1.77c1.37,0.72,3.91,0.13,5.85-0.78c2.04-0.96,3.42,0.78,3.78,1.86
		c0.36,1.08,2.76,4.92,4.26,5.76C300.9,193.9,301.36,194.73,301.6,195.36z"
/>
<Path
  id="karandi_kb"
  fill={getColor(222)}
  onPress={() => open(222)}
  d="M301.84,196.18l-2.7,5.28c0,0-4.62,6.6-6.06,10.08c-1.44,3.48-0.28,5.06-0.28,5.06l-3.26-1.21
		l-1.78-0.83c0.17-1.21-0.38-2.27-1.79-2.93c-1.41-0.66-0.75-2.43-0.75-2.43s1.24-3.27,1.91-5.43c0.13-0.41,0.23-0.77,0.31-1.07
		c0.48-1.89,2.57-1.9,2.61-1.9l3.33-0.69l2.01-0.93l3.81-2.31l2.4-1.5C301.78,195.84,301.84,196.18,301.84,196.18z"
/>
<Path
  id="naygaon"
  fill={getColor(221)}
  onPress={() => open(221)}
  d="M301.84,196.18l-2.7,5.28c0,0-4.62,6.6-6.06,10.08c-1.44,3.48-0.28,5.06-0.28,5.06l-3.26-1.21
		l-1.78-0.83c0.17-1.21-0.38-2.27-1.79-2.93c-1.41-0.66-0.75-2.43-0.75-2.43s1.24-3.27,1.91-5.43c0.13-0.41,0.23-0.77,0.31-1.07
		c0.48-1.89,2.57-1.9,2.61-1.9l3.33-0.69l2.01-0.93l3.81-2.31l2.4-1.5C301.78,195.84,301.84,196.18,301.84,196.18z"
/>
<Path
  id="degaon"
  fill={getColor(223)}
  onPress={() => open(223)}
  d="M287.76,214.56h-3.71l-2.07,0.5c-1.33-1.25-0.54-3.13,0.15-5.8c0.69-2.67-1.23-3.6-1.23-3.6
    l0.21-1.89c0.78-0.03,6.02,0,6.02,0c-0.67,2.16-1.91,5.43-1.91,5.43s-0.66,1.77,0.75,2.43
    C287.38,212.29,287.93,213.35,287.76,214.56z"
/>
<Path
  id="kurungavadi"
  fill={getColor(203)}
  onPress={() => open(203)}
  d="M258.79,205.06c-0.27,1.71-0.09,4.29-0.09,4.29l-0.26,0.94l-2.28,2.47l-0.83,1.85
    c0,0-0.07,0.01-0.19,0.04c-0.62,0.13-2.64,0.54-3.52,0.64c-0.24,0.03-0.43,0.04-0.6,0.04c-0.58-0.01-0.84-0.21-1.29-0.56
    c-0.58-0.45-0.36-1.77-0.36-1.77c2.21,0.16,2.86-4.65,2.86-4.65s0.47-4,0.67-5.3c0.21-1.29-1.28-1.43-1.28-1.43h-1.39l1.3-1.8
    c0,0,0.54-1.33,1.03-2.47l0.5-1.14h1.62c0,0,2.19,0.24,2.34,1.53c0.15,1.29-0.66,0.51,0.39,2.25c1.05,1.74,1.38,2.64,1.38,2.64
    S259.06,203.35,258.79,205.06z"
/>
<Path
  id="kelawade"
  fill={getColor(220)}
  onPress={() => open(220)}
  d="M279.46,215.39l-1.85,1.21h-4.85l-1.34,0.77c0,0-1.32-3.31-1.32-3.34
    c0.06,0.12,0.03-1.77,0-2.88c-0.03-1.11-0.84-2.04-0.84-2.04v-3.69l-0.21-0.31l5.94-3.23l3.03-1.59v2.07c0,0-0.48,1.47,0,2.52
    s-0.21,2.64-0.21,2.64l0.24,4.56L279.46,215.39z"
/>
<Path
  id="varve_bk"
  fill={getColor(20)}
  onPress={() => open(20)}
  d="M274.99,201.88l-5.94,3.23l-1.17-1.7c0,0-0.45-2.88-0.87-5.55c-0.07-0.44-0.18-0.84-0.32-1.22
    c0,0,2.34-1.76,4.73-2.76c0.32-0.13,0.63-0.3,0.92-0.48l-0.41,3.24l0.41,1.31l1.66,0.99L274.99,201.88z"
/>
<Path
  id="salawade"
  fill={getColor(202)}
  onPress={() => open(202)}
  d="M270.1,214.03c-1.02-0.16-1.82-0.39-2.47-0.7c-0.76-0.37-1.31-0.83-1.76-1.34
    c-0.84-0.96-2.58-1.32-3.69-1.92c-1.11-0.6-3.48-0.72-3.48-0.72s-0.18-2.58,0.09-4.29l2.16,0.05c0,0,1.47,0.94,2.67,0.91
    c1.2-0.03,3.42,0,3.42,0l2.01-0.91l0.21,0.31v3.69c0,0,0.81,0.93,0.84,2.04C270.13,212.26,270.16,214.15,270.1,214.03z"
/>
<Path
  id="kanjale"
  fill={getColor(201)}
  onPress={() => open(201)}
  d="M269.05,205.11l-2.01,0.91c0,0-2.22-0.03-3.42,0c-1.2,0.03-2.67-0.91-2.67-0.91l-2.16-0.05
    c0.27-1.71,0-2.43,0-2.43s-0.33-0.9-1.38-2.64c-1.05-1.74-0.24-0.96-0.39-2.25l6.89-4.92l0.64,0.72c0,0,1.43,1.16,2.14,3.1
    c0.14,0.38,0.25,0.78,0.32,1.22c0.42,2.67,0.87,5.55,0.87,5.55L269.05,205.11z"
/>
<Path
  id="vanjale"
  fill={getColor(208)}
  onPress={() => open(208)}
  d="M195.05,204.48c0,0-0.92,0.83-1.23,1.23c-0.32,0.4-0.95,0.3-0.95,0.3s-2.07-0.2-2.97-0.29
    c-0.9-0.09-0.92,0.63-0.92,0.63v4.15l-3.24-0.14h-0.01c-0.09-0.12-0.27-0.23-0.58-0.28l0.53-2.62l-0.18-2.22
    c0,0,0.54-0.03,1.23-0.3c0.69-0.27,0.93-1.56,0.93-1.56l0.2-1.67L195.05,204.48z"
/>
<Path
  id="lashirgaon"
  fill={getColor(188)}
  onPress={() => open(188)}
  d="M199.03,187.33l-0.58-0.1c0,0-1.07,2.41-2.41,2.53c-1.34,0.12-1.5,0.23-1.5,0.23
    s-0.23,0.13-0.79,0.32s-1.55-1.14-1.55-1.14l0.65-1.86l0.83-0.53c0,0-0.4-0.57-0.47-1.66c-0.07-1.09-0.93-0.88-0.93-0.88l-1.33,0.08
    l0.8-2.23l-1.33-0.33c0,0,0.13-0.92-0.47-0.93c-0.6-0.01-0.2-0.85-0.13-1.47c0.07-0.63-0.33-0.6,0.53-1.2
    c0.87-0.6,1.6-1.8,2.53-1.67c0.93,0.13,0.93,0.13,1.6-1.2s1.4-0.27,1.4-0.27s0.73,1.47,1.33,1.53c0.6,0.07,1.93,1.47,1.93,1.47
    l1.4-0.27l1.6,1.4c0,0,0.53,0.2,1.27-0.13c0.73-0.33,1.07,1.2,1.07,1.2l1.33,0.2c0,0,0.67,1.07,1.07,1.67
    c0.4,0.6,1.4,0.73,1.93,0.93c0.53,0.2,2.13-0.4,2.13-0.4l-0.13,2.27c0,0,0.4,1.13-0.67,1.47c-1.07,0.33-0.53,1.4-0.53,1.4
    s-0.07,1.13-0.67,1.47c-0.6,0.33-0.87,1.4-1.47,2.33c-0.6,0.93-1.13,1.67-1.13,1.67l0.27,1.53c0,0,0.33,0.33,0.33,0.87
    c0,0.53-0.87,1.6-0.87,1.6s-0.93-0.33-1.33,0.33c-0.4,0.67-1.13,1.93-1.67,2.2C201.5,187.87,200.23,187.43,199.03,187.33z"
/>
<Path
  id="hatwe_bk"
  fill={getColor(261)}
  onPress={() => open(261)}
  d="M270.54,230.56c0,0-1.13-1.16-2.09-1.56c0,0,0,0,0-0.01c-0.15-0.06-0.29-0.1-0.43-0.12
		c-1.01-0.13-1.73-1.23-1.73-1.23s-0.45-0.51-1.04-1.16c0,0,0,0-0.01,0c-0.2,0.05-2.46,0.62-3.4,1.78c-1,1.22-4.14,5.45-4.14,5.45
		l-2.56,2.96l-2.12-2.94c-0.11,0.06-0.22,0.15-0.32,0.25c-0.86,0.85-1.48,2.12-1.48,2.12l-0.43,0.57c0.65,0.25,1.29,0.53,1.91,0.87
		c0.66,0.35,1.29,0.76,1.83,1.24c3.21,2.82,4.32,3.39,4.32,3.39l2.32,1.39l0.29-0.37l0.38-0.51l1.09-2.33l2.42-2.3l2.49-1.02
		l2.17-1.47l2.49-3.06L270.54,230.56z"
/>
<Path
  id="tambhad"
  fill={getColor(259)}
  onPress={() => open(259)}
  d="M260.11,223.4l-1.47,1.94c0,0-4.32,2.76-8.64,4.54c-4.32,1.78-9.1,1.91-9.1,1.91l0.7,0.58
		l2.1,1.74l0.85,0.67v0.01l0.68,0.54c0,0,2.77,0.29,5.56,1.34l0.43-0.57c0,0,0.62-1.27,1.48-2.12c0.1-0.1,0.21-0.19,0.32-0.25
		c0.83-0.56,1.84-0.38,1.84-0.38l2.34-3.28l2.91-3.2c0,0,2.78-2.56,2.99-2.56C262.33,223.75,261.14,223.53,260.11,223.4z"
/>
<Path
  id="sarpala"
  fill={getColor(250)}
  onPress={() => open(250)}
  d="M258.43,223.21c-0.99-0.18-3.36-1.47-4.98-2.46c-0.07-0.04-0.14-0.08-0.2-0.12
		c-1.46-0.84-1.93-0.54-1.93-0.54s-0.43,0-1.05,0h-4.56c-1.5,0-2.64-0.81-2.64-0.81s-0.4-0.22-0.43-0.51l-1.04-0.08l-1.68,1.76
		l-0.9,3.45l-0.27,2.82l0.4,4.31l1.08,0.2l0.67,0.56c0,0,4.78-0.13,9.1-1.91c4.32-1.78,8.64-4.54,8.64-4.54l1.47-1.94
		C259.42,223.32,258.8,223.28,258.43,223.21z"
/>
<Path
  id="sonde"
  fill={getColor(242)}
  onPress={() => open(242)}
  d="M236.5,217.66c-1.08-0.53-2.4,0-2.4,0l-0.9,1.86l-0.72,2.4l-0.12,1.74l-0.18,1.33l-1.02,1.49
		l-1.02,1.8l-0.12,1.6h1.58l2.54,0.33l-0.22-2.61l0.72-1.53l1.68-3.79l1.97-3.99C237.74,218.15,237.05,217.93,236.5,217.66z
		 M239.92,220.45l1.68-1.76l-2.37-0.19c0,0-0.4-0.08-0.94-0.21l-1.97,3.99l-1.68,3.79l-0.72,1.53l0.22,2.61l1.96,0.26l3.05,0.56
		l-0.4-4.31l0.27-2.82L239.92,220.45z"
/>
<Path
  id="mathana"
  fill={getColor(242)}
  onPress={() => open(242)}
  d="M231.34,217.79l-0.66,1.67l-1.26,2.4c0,0-0.66,2.04-0.42,3s-0.06,2.22-0.36,3.06l-0.57,1.96h1.95
		l0.12-1.6l1.02-1.8l1.02-1.49l0.18-1.33l0.12-1.74l0.72-2.4l0.9-1.86C234.1,217.66,232.79,217.96,231.34,217.79z"
/>
<Path
  id="vadgaon"
  fill={getColor(79)}
  onPress={() => open(79)}
  d="M230.5,217.64c-1.74-0.44-2.1,0.32-2.1,0.32l-0.33,0.14l-0.93,0.4l-2.25-0.4v3.86l-0.5,3.69
		l-0.75,4.56l0.44-0.05l2.65-0.28h1.34l0.57-1.96c0.3-0.84,0.6-2.1,0.36-3.06s0.42-3,0.42-3l1.26-2.4l0.66-1.67
		C231.06,217.76,230.78,217.71,230.5,217.64z"
/>
<Path
  id="kodavadi"
  fill={getColor(240)}
  onPress={() => open(240)}
  d="M222.42,217.66l-3.42-0.64l-3.47-0.95l-1.03,1.31v4.63l0.35,0.6l0.45,0.77v3.83l0.43,1.1
		l-0.11,3.72l4.82-1.47l-0.15-1.94l0.33-1.93l0.31-2.39l-0.31-2.25l0.35-1.96L222.42,217.66z"
/>
<Path
  id="zanje"
  fill={getColor(241)}
  onPress={() => open(241)}
  d="M222.42,217.66l-1.45,2.43l-0.35,1.96l0.31,2.25l-0.31,2.39l-0.33,1.93l0.15,1.94l3.2-0.35
		l0.75-4.56l0.5-3.69v-3.86L222.42,217.66z"
/>
<Path
  id="asni_manjai"
  fill={getColor(238)}
  onPress={() => open(238)}
  d="M212.7,218.77l-2.52,0.49l-2.1,1.19l-1.01,0.57l-1.17,1.26l-1.35,1.44l-1.71,3.46l-1.19,5.54
		v3.35l3.57-0.87l-0.52,0.12v-1.31l0.57-1.59l1.56-1.86l2.34-2.85l0.15-1.64l2.22-2.53l0.57-0.81l2.39-0.72v-3.06L212.7,218.77z"
/>
<Path
      id="asni_manjai"
      fill={getColor(238)}
      onPress={() => open(238)}
      d="M212.7,218.77l-2.52,0.49l-2.1,1.19l-1.01,0.57l-1.17,1.26l-1.35,1.44l-1.71,3.46l-1.19,5.54
        v3.35l3.57-0.87l-0.52,0.12v-1.31l0.57-1.59l1.56-1.86l2.34-2.85l0.15-1.64l2.22-2.53l0.57-0.81l2.39-0.72v-3.06L212.7,218.77z"
    />
    <Path
      id="gunjanvane"
      fill={getColor(230)}
      onPress={() => open(230)}
      d="M204.86,220.75c0,0-2.47-2.97-2.65-4.96c-0.06-0.64,0.22-1.07,0.61-1.33
        c-1.5-0.63-3.11-0.12-3.11-0.12l-2.1,0.09l-0.15,2.97c0,0,0.45,0.85,1.08,1.5c0.63,0.66,0.36,1.06,0.36,1.06l-1.82,1.67l-2.07,0.72
        c0,0-0.52,0.09-1.19,0.21c-0.91,0.16-2.08,0.37-2.6,0.47c-0.92,0.18-0.75,0.38-0.89,1.38c-0.13,1.01-0.73,0.35-0.73,0.35
        s-0.81-1.02-1.14-1.76c-0.03-0.06-0.06-0.11-0.08-0.15c-0.05-0.07-0.1-0.12-0.15-0.15c-0.27-0.16-0.61,0.3-1.14,0.65
        c-0.67,0.45-3.21-0.32-3.21-0.32l-0.84-1.02l-0.24,1.14c0,0-0.66,1.02-1.38,0.45c-0.72-0.57-1.38-0.3-1.41,0.33
        c-0.03,0.63,0.48,1.17,0.48,1.17l-0.09,1.17c0,0-1.05,1.08-1.47,0c-0.42-1.08-0.3-2.55-1.32-1.38c-1.02,1.17-3.81,5.16-3.81,5.16
        l0.93,1.35l1.62,1.47l1.07,0.84l1.06,0.84c0,0,1.35,0.78,1.44,0.75c0.05-0.02,0.92,0.17,1.61,0.32c0.47,0.1,0.85,0.19,0.85,0.19
        l2.7,0.63l2.73,0.96c0,0,2.79,0.87,2.88,0.87c0.09,0,2.55,0.24,2.55,0.24h1.9l1.72-0.57l4.36-1.76l0.43-0.1v-3.36l1.19-5.54
        l1.71-3.46l1.35-1.44L204.86,220.75z"
    />
    <Path
      id="vajeghar_bk"
      fill={getColor(211)}
      onPress={() => open(211)}
      d="M188.2,222.68v-1.42l-0.34-0.57l-0.9-1.38l-0.24-1.38v-2.14l-0.02-0.01h-0.01
        c-0.01,0-0.01,0-0.02-0.01l-0.07-0.02c-0.33-0.1-0.77-0.45-0.77-0.45s-3.2,0.16-3.29,0.14c-0.08-0.02-1.5-5.73-1.5-5.73h-3.13
        l-1.2-0.65l-0.24-0.13l-2.01,0.06c0,0-0.39,0.15-0.42,0.72c-0.03,0.57,0,1.41,0,1.41l1.47,0.18l1.44,0.93c0,0,2.04,1.17,2.76,4.05
        c0.72,2.88,1.23,3.81,2.31,4.56c1.08,0.75,1.02,1.17,1.02,1.17l0.84,1.02c0,0,2.54,0.77,3.21,0.32c0.53-0.35,0.87-0.81,1.14-0.65
        L188.2,222.68z"
    />
    <Path
      id="lavhi_bk"
      fill={getColor(378)}
      onPress={() => open(378)}
      d="M193.82,222.56c-0.91,0.16-2.08,0.37-2.6,0.47c-0.92,0.18-0.75,0.38-0.89,1.38
        c-0.13,1.01-0.73,0.35-0.73,0.35s-0.81-1.02-1.14-1.76c-0.03-0.06-0.06-0.11-0.08-0.15c-0.05-0.07-0.1-0.12-0.15-0.15l-0.03-0.02
        v-1.42l-0.34-0.57l-0.9-1.38l-0.24-1.38v-2.14l-0.05-0.02c0.26,0.07,0.42-0.07,0.11-0.78c-0.7-1.6-0.95-4.12-0.95-4.12
        s0.11-0.28-0.09-0.51l3.24,0.14l0.22,0.01l2.75,0.09l0.55,0.19v4.62l0.2,3.21L193.82,222.56z"
    />
    <Path
      id="vajeghar_kd"
      fill={getColor(213)}
      onPress={() => open(213)}
      d="M186.78,214.99c-0.7-1.6-0.95-4.12-0.95-4.12s0.11-0.28-0.09-0.51h-0.01
		c-0.09-0.12-0.27-0.23-0.58-0.28c-0.92-0.15-3.52-0.37-3.52-0.37h-0.59c0,0,1.42,5.71,1.5,5.73c0.09,0.02,3.29-0.14,3.29-0.14
		s0.44,0.35,0.77,0.45l0.07,0.02c0.01,0.01,0.01,0.01,0.02,0.01h0.01C186.94,215.83,187.08,215.67,186.78,214.99z"
        />
<Path
      id="khariv"
      fill={getColor(209)}
      onPress={() => open(209)}
      d="M182.9,201.71l-0.85,0.5h-2.21l0.32,1.8l0.9,2.88l0.57,2.82c0,0,2.6,0.22,3.52,0.37l0.53-2.62
        l-0.18-2.22c0,0,0.54-0.03,1.23-0.3c0.69-0.27,0.93-1.56,0.93-1.56l0.2-1.67H182.9z"
    />
    <Path
      id="vinzar"
      fill={getColor(206)}
      onPress={() => open(206)}
      d="M212.96,191.95c0,0-1.08,2.05-0.11,3.78c0.97,1.73,0.05,5.17,0.05,5.17s-0.59,0.55-1.24,1.12
        c-0.28,0.23-0.57,0.48-0.83,0.68c-0.88,0.68-2.88,2.08-2.95,3.67c-0.07,1.6-0.09,4.51-0.09,4.51l-1.17-0.24c0,0-1.29-1.2-1.38-1.23
        c-0.09-0.03-2.45,0-2.45,0l-1.5-0.92l-0.88-0.33l-0.15-0.06l-0.55-0.94l-1.1-1.15l0.21-0.86v-2.64l1.29-1.71l0.15-2.19
        c0,0-0.3-1.8-0.89-3.75c-0.6-1.95-0.22-3.15-0.22-3.15l-0.12-4.38l0.67-1.2c0.63,1.16,2.02,0.58,2.18,0.63
        c0.18,0.06,6.09-0.06,6.09-0.06s2.91,0.15,5.04-0.27c2.13-0.42,3.64-0.65,3.64-0.65l0.83,2c-0.25-0.01-0.53,0.07-0.78,0.34
        C215.98,188.89,212.96,191.95,212.96,191.95z"
    />
    <Path
      id="wanganichi_wadi"
      fill={getColor(174)}
      onPress={() => open(174)}
      d="M229.16,186.18l-2.97,2.39l-2.33,2.83l-0.91,2.1l-1.3-2.25l-3.33-3.13
        c0,0-0.38-0.32-0.84-0.34l-0.83-2C216.65,185.78,224.3,186.08,229.16,186.18z"
    />
    <Path
      id="vangani"
      fill={getColor(192)}
      onPress={() => open(192)}
      d="M239.56,190.75l-2.56,2.76l-0.36,0.39l-2.44,3.04l-1.28,0.34l0.23,1.94c0,0,0.47,0.78-0.54,0.96
        s-2.61,0.41-2.61,0.41s-1.08-0.07-1.38,0.74c-0.29,0.81-2.76,2.43-2.76,2.43l-1.03,0.12l0.38-1.13l0.55-1.99
        c0,0,0.39-1.5-0.18-2.88c-0.57-1.38-1.89-3.1-1.89-3.1l-0.74-1.27v-0.01l0.91-2.1l2.33-2.83l2.97-2.39
        c1.67,0.03,3.01,0.04,3.6,0.01c2.3-0.13,6.47,0.9,6.47,0.9l0.15,3.12L239.56,190.75z"
    />
    <Path
      id="hatwe_kh"
      fill={getColor(26)}
      onPress={() => open(26)}
      d="M265.24,226.48c-0.2,0.05-2.46,0.62-3.4,1.78c-1,1.22-4.14,5.45-4.14,5.45l-2.56,2.96
        l-2.12-2.94c0.83-0.56,1.84-0.38,1.84-0.38l2.34-3.28l2.91-3.2c0,0,2.78-2.56,2.99-2.56c0.01,0,0.01,0,0.01,0
        c0.1,0.06,0.19,0.14,0.27,0.22c0.14,0.14,0.3,0.3,0.46,0.46l0.28,0.29C264.5,225.67,264.9,226.1,265.24,226.48z"
    />
    <Path
      id="malavali"
      fill={getColor(189)}
      onPress={() => open(189)}
      d="M200.26,198.61l-0.15,2.19l-1.29,1.71v2.64l-0.21,0.86c0,0-0.38,0-1.28-0.79
		c-0.45-0.39-1.02-0.58-1.48-0.66l-0.97-2.54c0,0-0.82-2.02-1.85-4.58c-1.03-2.56,0.54-4.68,0.54-4.68l5.46-5.43l0.12,4.38
		c0,0-0.38,1.2,0.22,3.15C199.96,196.81,200.26,198.61,200.26,198.61z"
    />
    <Path
      id="kolvadi"
      fill={getColor(190)}
      onPress={() => open(190)}
      d="M220.84,200.68c-0.14,1.53-0.22,4.18-0.22,4.18l-0.33,0.95l-0.39-0.19l-4.24-2.08l-2.88-1.22
		l-1.12-0.3c0.65-0.57,1.24-1.12,1.24-1.12s0.92-3.44-0.05-5.17c-0.97-1.73,0.11-3.78,0.11-3.78s3.02-3.06,3.74-3.83
		c0.25-0.27,0.53-0.35,0.78-0.34c0.46,0.02,0.84,0.34,0.84,0.34l0.83,0.79c0,0-1.28,0.92-1.06,2.86c0.23,1.93,2.2,6.07,2.2,6.07
		S220.97,199.15,220.84,200.68z"
    />
    <Path
      id="katavadi"
      fill={getColor(191)}
      onPress={() => open(191)}
      d="M225.76,200.76l-0.55,1.99l-0.38,1.13l-1.95,3.58c-0.62-0.66-1.16-0.95-1.16-0.95l-1.24-0.61
		l-0.19-0.09l0.33-0.95c0,0,0.08-2.65,0.22-4.18c0.13-1.53-0.55-2.84-0.55-2.84s-1.97-4.14-2.2-6.07c-0.22-1.94,1.06-2.86,1.06-2.86
		l0.18,0.16l2.32,2.18l1.3,2.25v0.01l0.74,1.27c0,0,1.32,1.72,1.89,3.1C226.15,199.26,225.76,200.76,225.76,200.76z"
    />
    <Path
      id="mangdari"
      fill={getColor(204)}
      onPress={() => open(204)}
      d="M233.62,204.13l-1.24,4.62l-0.87,3.22l-3.44-1.39l-0.23-0.22l-0.73-0.71v-3.64l0.48-1.23
		l1.86-0.5l3.45-0.24C232.9,204.04,233.19,204.08,233.62,204.13z"
    />
    <Path
      id="chimodi"
      fill={getColor(229)}
      onPress={() => open(229)}
      d="M210.22,213.82c0,0-0.78,0.72-1.63,1.8c-0.85,1.08-0.8,2.43-0.8,2.43l0.29,2.4l-1.01,0.57
		l-1.17,1.26l-1.04-1.53c0,0-2.47-2.97-2.65-4.96c-0.06-0.64,0.22-1.07,0.61-1.33c0.85-0.63,2.28-0.64,2.36-0.64H210.22z"
    />
    <Path
      id="bhaginghar"
      fill={getColor(228)}
      onPress={() => open(228)}
      d="M215.53,216.07l-1.03,1.31v1.57l-1.8-0.18l-2.52,0.49l-2.1,1.19l-0.29-2.4
		c0,0-0.05-1.35,0.8-2.43c0.85-1.08,1.63-1.8,1.63-1.8h1.89L215.53,216.07z"
    />
    <Path
      id="nigade_1_"
      fill={getColor(268)}
      onPress={() => open(268)}
      d="M238.75,202.02l-0.24,1.21l-0.45,0.81c0,0-0.15,1.02-1.35,0.66c-0.8-0.24-2.23-0.45-3.09-0.57
		c-0.43-0.05-0.72-0.09-0.72-0.09l-3.45,0.24l-1.86,0.5l-0.48,1.23v3.64l0.73,0.71l-2.21,2.38c-0.51-1.03-1.02-2.14-1.35-3.02
		c-0.37-1-0.91-1.75-1.4-2.26l1.95-3.58l1.03-0.12c0,0,2.47-1.62,2.76-2.43c0.3-0.81,1.38-0.74,1.38-0.74s1.6-0.23,2.61-0.41
		s0.54-0.96,0.54-0.96l-0.23-1.94l1.28-0.34l2.44-3.04l0.36-0.39l0.34,3c0,0,0.72,1.56,0.96,1.8S238.75,202.02,238.75,202.02z"
    />
    <Path
      id="ambavane"
      fill={getColor(225)}
      onPress={() => open(225)}
      d="M242.92,218.29c-0.24,0.17-0.3,0.33-0.28,0.48l-1.04-0.08l-2.37-0.19c0,0-0.4-0.08-0.94-0.21
		c-0.55-0.14-1.24-0.36-1.79-0.63c-1.08-0.53-2.4,0-2.4,0l-0.25-4.26l-1.85-1.23l-0.49-0.2l0.87-3.22l10.26,2.34
		c0.06,0.68,0.1,1.29,0.13,1.67c0.02,0.25,0.03,0.4,0.03,0.4l0.45,2.97C243.25,216.13,243.64,217.78,242.92,218.29z"
    />
    <Path
      id="boravale"
      fill={getColor(194)}
      onPress={() => open(194)}
      d="M242.64,211.09l-10.26-2.34l1.24-4.62c0.86,0.12,2.29,0.33,3.09,0.57
		c1.2,0.36,1.35-0.66,1.35-0.66l0.45-0.81l0.24-1.21c0,0-0.21-3.47-0.45-3.71s-0.96-1.8-0.96-1.8l-0.34-3l2.56-2.76l0.3,0.93
		l0.71,3.19l0.31,1.4l-0.15,5.97l0.03,2.22c0,0,1.26,1.83,1.53,3.48C242.42,208.74,242.54,210.01,242.64,211.09z"
    />
    <Path
      id="karanjanvane"
      fill={getColor(226)}
      onPress={() => open(226)}
      d="M234.1,217.66c0,0-1.31,0.3-2.76,0.13c-0.28-0.03-0.56-0.08-0.84-0.15
		c-1.74-0.44-2.1,0.32-2.1,0.32l-0.33,0.14l-0.84-2.27c0,0-0.79-1.45-1.6-3.09l2.21-2.38l0.23,0.22l3.44,1.39l0.49,0.2l1.85,1.23
		L234.1,217.66z"
    />
    <Path
      id="askavadi"
      fill={getColor(216)}
      onPress={() => open(216)}
      d="M214,208.81l-0.69,1.25l-1.2,1.84l-0.17,1.8l-0.82-0.56l-3.33-2.26c0,0,0.02-2.91,0.09-4.51
		c0.01-0.27,0.08-0.54,0.2-0.8L214,208.81z"
    />
    <Path
      id="khambavadi"
      fill={getColor(205)}
      onPress={() => open(205)}
      d="M220.29,205.81l-1.64,1.53c0,0-1.98,0.66-2.07,0.66c-0.09,0-2.58,0.81-2.58,0.81l-5.92-3.24
		c0.53-1.25,2.02-2.31,2.75-2.87c0.26-0.2,0.55-0.45,0.83-0.68l1.12,0.3l2.88,1.22L220.29,205.81z"
    />
    <Path
      id="kondhavali"
      fill={getColor(207)}
      onPress={() => open(207)}
      d="M200.26,209.71c0.15,0.99-0.55,1.73-0.55,1.73l-5.91-0.21l-1.3-0.44l-0.55-0.19l-2.75-0.09
		l-0.22-0.01v-4.15c0,0,0.02-0.72,0.92-0.63c0.9,0.09,2.97,0.29,2.97,0.29s0.63,0.1,0.95-0.3c0.31-0.4,1.23-1.23,1.23-1.23
		s0.35-0.01,0.8,0.08c0.46,0.08,1.03,0.27,1.48,0.66c0.9,0.79,1.28,0.79,1.28,0.79l1.1,1.15l0.55,0.94l0.15,0.06l-0.15,0.34
		C200.26,208.5,200.11,208.72,200.26,209.71z"
    />
    <Path
      id="meravane"
      fill={getColor(214)}
      onPress={() => open(214)}
      d="M197.61,214.43l-0.15,2.97c0,0,0.45,0.85,1.08,1.5c0.63,0.66,0.36,1.06,0.36,1.06l-1.82,1.67
		l-2.07,0.72c0,0-0.52,0.09-1.19,0.21l-1.12-3.94l-0.2-3.21v-4.62l1.3,0.44l5.91,0.21v2.9L197.61,214.43z"
    />
    <Path
      id="sakhar"
      fill={getColor(215)}
      onPress={() => open(215)}
      d="M212.11,213.82h-6.93c-0.08,0-1.51,0.01-2.36,0.64c-1.5-0.63-3.11-0.12-3.11-0.12v-2.9
		c0,0,0.7-0.74,0.55-1.73c-0.15-0.99,0-1.21,0-1.21l0.15-0.34l0.88,0.33l1.5,0.92c0,0,2.36-0.03,2.45,0
		c0.09,0.03,1.38,1.23,1.38,1.23l1.17,0.24l3.33,2.26l0.82,0.56L212.11,213.82z"
    />
    <Path
      id="margasani"
      fill={getColor(217)}
      onPress={() => open(217)}
      d="M228.07,218.1l-0.93,0.4l-2.25-0.4l-2.47-0.44l-3.42-0.64l-3.47-0.95l-3.42-2.25l-0.17-0.12
		l0.17-1.8l1.2-1.84l0.69-1.25c0,0,2.49-0.81,2.58-0.81c0.09,0,2.07-0.66,2.07-0.66l1.64-1.53l0.19,0.09l1.24,0.61
		c0,0,0.54,0.29,1.16,0.95c0.49,0.51,1.03,1.26,1.4,2.26c0.33,0.88,0.84,1.99,1.35,3.02c0.81,1.64,1.6,3.09,1.6,3.09L228.07,218.1z"
    />
    <Path
      id="bhabvadi"
      fill={getColor(343)}
      onPress={() => open(343)}
      d="M253.1,284.6l-0.98-1.48l-1.72-0.76l-0.36-1.22l-1.26-1.04c0,0-0.11-0.21-0.34-0.4
		c-0.33-0.29-0.91-0.54-1.72,0c-0.15,0.1-0.31,0.19-0.48,0.29c-1.4,0.79-3.44,1.47-3.44,1.47s-0.16,0.2-0.35,0.52h-0.01
		c-0.6,0.97-1.61,3.05,0.36,3.66c2.61,0.81,3.96,0.6,3.96,0.6l0.93,0.62l1.19,1.03l1.75-1.14l2.73,2.79l0.38,0.02v-3.32L253.1,284.6z"
    />
    <Path
      fill={getColor(361)}
      onPress={() => open(361)}
      id="dhawadi"
      d="M257.58,301.8l-2.57-1.43l-12.15-0.17c0.04,0.07,0.08,0.15,0.14,0.22
		c0.61,0.74,1.24,4.59,1.24,4.59s0.05,0.32,0.18,0.8c0,0,3.24-0.67,5.07-0.73c1.83-0.06,4.56,0,4.56,0s0.88,0.91,1.4,2.21
		c0,0,0,0,0.01,0c0.12-0.06,2.08-0.94,2.12-2.01C257.63,304.18,257.58,301.8,257.58,301.8z"
    />
    <Path
      id="palsoshi"
      fill={getColor(369)}
      onPress={() => open(369)}
      d="M255.82,308.74c-0.05-0.51-0.18-1-0.36-1.45c-0.01,0-0.01,0-0.01,0c-0.52-1.3-1.4-2.21-1.4-2.21
		s-2.73-0.06-4.56,0c-1.83,0.06-5.07,0.73-5.07,0.73c0.27,1,0.87,2.7,1.98,3.57c0.67,0.52,0.87,1.22,0.87,1.86l2.03-0.2l1.58,0.2
		l1.73,0.7l3.25,0.23c0.02-0.22,0.03-0.49,0.03-0.78C255.91,310.62,255.9,309.66,255.82,308.74z"
    />
    <Path
      id="pale"
      fill={getColor(368)}
      onPress={() => open(368)}
      d="M255.82,312.94c0,0,0.02-0.3,0.04-0.77l-3.25-0.23l-1.73-0.7l-1.58-0.2l-2.03,0.2
		c0,0.06,0,0.12-0.01,0.17c-0.04,0.86-0.41,1.57-0.41,1.57l0.02,3.22c0,0,0.9,0.85,0.05,1.64c-0.86,0.78-1.6,1.17-1.6,1.17
		s3.44,0.38,3.51,0.38c0.05,0,1.59,0.09,2.54,0.14c0.44,0.02,0.75,0.04,0.75,0.04l0.86-0.31l0.69-0.25l1.92,0.85
		c0.04-0.9,0.08-1.55,0.08-1.55l0.82-1.82l0.11-0.25L255.82,312.94z"
    />
     <Path
      id="varodi_dm"
      fill={getColor(374)}
      onPress={() => open(374)}
      d="M252.98,322.04l-1.14,2.79l0.14,1.62l0.43,2.29c-2.38,0.41-5.3-0.42-6.65-0.88v-0.01l0.35-0.97
		c0,0,0.27-0.47,0.56-1.57c0.29-1.11,1.64-2.14,1.64-2.14l2.66-1.69l0.4-1.95c0.44,0.02,0.75,0.04,0.75,0.04l0.86-0.31V322.04z"
    />
    <Path
      id="varodi_kh"
      fill={getColor(373)}
      onPress={() => open(373)}
      d="M248.83,319.39c-0.07,0-3.51-0.38-3.51-0.38l-0.27,1.53c0,0-2.79,2.32-2.93,3.62
		c-0.13,1.3-0.15,2.93-0.15,2.93l3.03,0.49c0,0,0.28,0.12,0.76,0.27l0.35-0.97c0,0,0.27-0.47,0.56-1.57
		c0.29-1.11,1.64-2.14,1.64-2.14l2.66-1.69l0.4-1.95C250.42,319.48,248.88,319.39,248.83,319.39z"
    />
    <Path
      id="varodi_bk"
      fill={getColor(372)}
      onPress={() => open(372)}
      d="M257.14,326.33c-0.66-0.06-1.38,0.22-2.14,1.09c-0.65,0.75-1.57,1.15-2.59,1.32l-0.43-2.29
		l-0.14-1.62l1.14-2.79v-2.78l0.69-0.25l1.92,0.85c-0.04,1.36-0.05,3.29,0.17,4.36c0.36,1.77,0.7,1.89,0.7,1.89L257.14,326.33z"
    />
    <Path
      id="ambade"
      fill={getColor(375)}
      onPress={() => open(375)}
      d="M266.34,321.48c-0.29,0.77-0.51,1.71-0.54,2.81c-0.1,3.31-3.83,4.28-3.83,4.28l-1.83,0.28
		c0,0-1.25-2.36-2.97-2.51l-0.03-0.01l-0.68-0.22c0,0-0.34-0.12-0.7-1.89c-0.22-1.07-0.21-3-0.17-4.36c0.04-0.9,0.08-1.55,0.08-1.55
		l0.82-1.82l2.51,0.63l2.52,1.32L266.34,321.48z"
    />
    <Path
      id="khanapur"
      fill={getColor(347)}
      onPress={() => open(347)}
      d="M265.01,287.91l-0.04-0.78l-2.04-1.21h-2.88l-6.31,0.32v3.32l2.86,0.13c0,0,1.71,0.15,2.22,2.91
		c0.33,1.8,0.83,3.65,1.13,4.72h0.01c0.05,0.19,0.1,0.35,0.14,0.48c0,0,3.88-0.97,4.24-0.97s5.91-0.19,5.91-0.19l0.19,0.3
		C268.05,292.9,265.01,287.91,265.01,287.91z"
    />
    <Path
      id="gokwadi"
      fill={getColor(360)}
      onPress={() => open(360)}
      d="M270.59,297.2c-0.02-0.04-0.04-0.07-0.06-0.11l-0.09-0.15l-0.19-0.3c0,0-5.55,0.19-5.91,0.19
		s-4.24,0.97-4.24,0.97l0.13,0.44v4.02l6.89,3.14l1.93,0.56c0.09-0.19,0.21-0.38,0.34-0.54C270.25,304.38,272.99,301.3,270.59,297.2
		z"
    />
    <Path
      id="nere"
      fill={getColor(370)}
      onPress={() => open(370)}
      d="M269.05,305.96c-0.5,1.02-0.49,2.29-0.49,2.29l-0.09,4.06c0,0-2.11-0.42-2.25-0.42
		c-0.15,0-1.49,0.2-1.58,0.28c-0.09,0.09-1.96,0-1.96,0l-2.72-0.92l-4.07,0.14c0.02-0.77,0.01-1.73-0.07-2.65
		c-0.05-0.51-0.18-1-0.36-1.45c0.12-0.06,2.08-0.94,2.12-2.01c0.05-1.1,0-3.48,0-3.48l0.81,0.14l1.84,0.32l6.89,3.14L269.05,305.96z"
    />
    <Path
      id="balawadi"
      fill={getColor(371)}
      onPress={() => open(371)}
      d="M268.47,312.31l-0.12,5.03l-0.6,1.76c0,0-0.83,0.84-1.41,2.38l-4.82-3.04l-2.52-1.32l-2.51-0.63
		l0.11-0.25l-0.78-3.3c0,0,0.02-0.3,0.04-0.77c0.02-0.22,0.03-0.49,0.03-0.78l4.07-0.14l2.72,0.92c0,0,1.87,0.09,1.96,0
		c0.09-0.08,1.43-0.28,1.58-0.28C266.36,311.89,268.47,312.31,268.47,312.31z"
    />
    <Path
      id="nilkant"
      fill={getColor(379)}
      onPress={() => open(379)}
      d="M260.23,298.24v4.02l-1.84-0.32l-0.29-0.49c0,0-0.12-0.96-0.33-1.65s-0.69-0.57-1.77-0.81
		c-0.78-0.17-0.59-0.84-0.42-1.19c0.06-0.13,0.12-0.22,0.12-0.22l0.78-0.94l-0.36-0.56l2.7-3.48c0.33,1.8,0.83,3.65,1.13,4.72h0.01
		c0.05,0.19,0.1,0.35,0.14,0.48L260.23,298.24z"
    />
    <Path
      fill={getColor(380)}
      onPress={() => open(380)}
      id="hatnoshi"
      d="M258.82,292.6c-0.51-2.76-2.22-2.91-2.22-2.91l-2.86-0.13l-0.38-0.02l-2.73-2.79l-1.75,1.14
		l-0.92,1.26c0,0-2.52,2.46-3.66,3.45c-0.8,0.7-0.93,1.66-0.93,2.16c0,0.22,0.02,0.35,0.02,0.35h5.38l2.16,0.88l2.61,1.28l2.04,0.53
		c0.06-0.13,0.12-0.22,0.12-0.22l0.78-0.94l-0.36-0.56L258.82,292.6z"
    />
     <Path
      id="bazarwadi"
      fill={getColor(359)}
      onPress={() => open(359)}
      d="M258.1,301.45c0,0-0.12-0.96-0.33-1.65s-0.69-0.57-1.77-0.81c-0.78-0.17-0.59-0.84-0.42-1.19
		l-2.04-0.53l-2.61-1.28l-2.16-0.88h-5.38l-0.02,1.15c0,0-0.15,1.83-0.66,2.82c-0.51,0.99,0.15,1.12,0.15,1.12l12.15,0.17l2.57,1.43
		l0.81,0.14L258.1,301.45z"
    />
    <Path
      id="venawadi"
      fill={getColor(320)}
      onPress={() => open(320)}
      d="M259.1,271.11l-1.53-2.1l-1.2,0.07l-0.9,0.45c0,0-2.97,0.09-3.13,0.04
		c-0.24-0.07-0.47-0.12-0.69-0.16l-1.56,1.97c0,0-1.26,1.98-1.44,3.86c-0.18,1.89-0.21,4.46-0.21,4.46c0.23,0.19,0.34,0.4,0.34,0.4
		l1.26,1.04l0.36,1.22l1.72,0.76l0.98,1.48l0.64,1.64l2.68-3.06l0.47-3.13l2.59-3.83L259.1,271.11z"
    />
    <Path
      id="pombardi"
      fill={getColor(321)}
      onPress={() => open(321)}
      d="M247.16,268.79c-0.43-0.19-0.87-0.23-1.29-0.18c-0.07,0.01-0.14,0.02-0.21,0.04
		c-0.37,0.06-0.72,0.2-1.04,0.36c-0.15,0.08-0.3,0.16-0.43,0.24c-0.16,0.1-0.31,0.21-0.44,0.31c-0.48,0.35-0.77,0.66-0.77,0.66
		l-0.67,0.74l1.09,0.91c0,0,0.69,0.45,1.86,1.5c1.17,1.05,0.75,2.46,0.75,2.46l0.23,4.16c0.17-0.1,0.33-0.19,0.48-0.29
		c0.81-0.54,1.39-0.29,1.72,0c0,0,0.03-2.57,0.21-4.46c0.18-1.88,1.44-3.86,1.44-3.86l1.56-1.97
		C249.98,269.11,248.94,269.56,247.16,268.79z"
    />
    <Path
      id="shitvali_T_bhor"
      fill={getColor(322)}
      onPress={() => open(322)}
      d="M246.01,275.83c0,0,0.42-1.41-0.75-2.46c-1.17-1.05-1.86-1.5-1.86-1.5l-1.09-0.91
		l-1.48,1.63l-1.79,1.97l5.23,3.07l1.97,2.36L246.01,275.83z"
    />
    <Path
      id="ambenagar"
      fill={getColor(323)}
      onPress={() => open(323)}
      d="M244.27,277.63l-5.23-3.07l-3.2,3.52c0,0-0.2,0.27-0.56,0.74c-0.64,0.84-1.77,2.33-3.06,4.01
		v1.11c0,0,0.03,0.87,1.06,1.68c0.31,0.24,0.54,0.31,0.71,0.28c0.03,0.01,0.07,0,0.09-0.02c0.02-0.01,0.04-0.02,0.06-0.03l0.01-0.01
		c0.12-0.06,0.19-0.19,0.23-0.3c0.06-0.13,0.07-0.24,0.07-0.24s1.04-1.24,1.82-2.11c0.79-0.88,2.93-1.21,2.93-1.21h3.25
		c0.19-0.32,0.35-0.52,0.35-0.52s2.04-0.68,3.44-1.47L244.27,277.63z"
    />
    <Path
      id="natambi"
      fill={getColor(340)}
      onPress={() => open(340)}
      d="M241.36,294.61l-0.51-2.33l-4.8-5.89l-1.93-0.52l0.02-0.02c-0.18,0.11-0.45,0.09-0.86-0.23
		c-1.03-0.81-1.06-1.68-1.06-1.68v-1.11c-1.06,1.4-2.23,2.93-3.32,4.33l4.33,5.95c0,0-0.24,1.59,2.58,1.65s6.39,0,6.39,0h1.17
		L241.36,294.61z"
    />
    <Path
      id="chikhlawadi"
      fill={getColor(341)}
      onPress={() => open(341)}
      d="M248.88,287.89l-0.92,1.26c0,0-2.52,2.46-3.66,3.45c-0.6,0.53-0.83,1.21-0.9,1.72l-0.03,0.44
		l-2.01-0.15l-0.51-2.33l-4.8-5.89l-1.93-0.52l0.02-0.02c0.12-0.06,0.2-0.19,0.24-0.31c0.06-0.13,0.07-0.24,0.07-0.24
		s1.04-1.24,1.82-2.11c0.79-0.88,2.93-1.21,2.93-1.21h3.24c-0.6,0.97-1.61,3.05,0.36,3.66c2.61,0.81,3.96,0.6,3.96,0.6l0.93,0.62
		L248.88,287.89z"
    />
    <Path
      id="kari"
      fill={getColor(349)}
      onPress={() => open(349)}
      d="M220.5,303.06h-1.91l-2.77-0.16l-1.74-0.5c-0.1,0.3-0.32,0.49-0.32,0.49s-1,0.97-1.9,1.87
		c-0.39,0.39-0.48,0.7-0.44,0.92c0.03,0.3,0.26,0.44,0.26,0.44s1.28,3.73,2.28,5.21c0.49,0.75,0.45,1.39,0.29,1.85
		c0,0,1.1,1.28,3.8,0c2.7-1.28,4.27-3.04,4.27-3.04l0.84-1.19c0,0,0.21-0.17,0.45-0.25l0.25-1.55l1.41-3.51L220.5,303.06z"
    />
    <Path
      id="karanje_chikahalwade"
      fill={getColor(339)}
      onPress={() => open(339)}
      d="M243.37,296.26l0.02-1.15c0,0-0.02-0.13-0.02-0.35h-1.17c0,0-3.57,0.06-6.39,0
		s-2.58-1.65-2.58-1.65l-4.33-5.95c-1.57,2.03-2.96,3.79-3.66,4.58l-0.13,0.15l-0.11,0.12c0,0.08,0.02,1.35,1.24,1.82
		c1.26,0.48,2.91,1.5,3.03,3.3s0.18,2.19,0.18,2.19l0.14,0.59l-0.07-0.05c0.22,0.18,0.23,0.34,0.23,0.34s0.47,0.47,0.97,0.55v0.01
		c0.1,0.02,0.19,0.02,0.29,0c0.59-0.11,1.62,0.07,2.05,0.56c0.42,0.5,2.76,1.08,5.17,0.54s4.63-1.66,4.63-1.66s-0.66-0.13-0.15-1.12
		C243.22,298.09,243.37,296.26,243.37,296.26z"
    />
    <Path
      id="sangvi_T_bhor"
      fill={getColor(338)}
      onPress={() => open(338)}
      d="M229.45,299.32c0,0-0.06-0.39-0.18-2.19s-1.77-2.82-3.03-3.3
		c-1.22-0.47-1.24-1.74-1.24-1.82c-0.65,0.68-1.76,0.86-2.79,0.84l-0.45-0.01v3.94l0.43,1.66l1.06,1.47l1.01,1.68l1.43,1.02
		l0.87-2.14c0,0,0.74-1.19,1.95-0.99c0.46,0.08,0.75,0.2,0.93,0.32l0.08,0.06l0.07,0.05L229.45,299.32z"
    />
    <Path
      id="angsule"
      fill={getColor(336)}
      onPress={() => open(336)}
      d="M224.26,301.59l-1.01-1.68l-1.06-1.47l-0.43-1.66v-3.94l0.45,0.01
		c-1.33-0.02-2.54-0.35-2.54-0.35l-0.89-0.41l-0.08,1.21c0,0-0.11,1.73-1.16,2.66c-1.05,0.93-1.9,0.69-2.97,0.74
		c-1.06,0.04-1.84,0.46-1.84,0.46l-1.73,0.88l0.62,1.75c0,0,0.15,0.17,0.49,0.46h0.01c0.29,0.25,0.73,0.58,1.33,0.95
		c0.7,0.43,0.74,0.88,0.63,1.2l1.74,0.5l2.77,0.16h1.91l4.77,0.58l0.42-1.03L224.26,301.59z"
    />
    <Path
      id="chikhalgaon"
      fill={getColor(366)}
      onPress={() => open(366)}
      d="M240.09,328.15l-0.28,0.16l-1.69,0.95c0,0-0.09,0.04-0.26,0.12c0,0-3.22-6.24-3.85-6.87
		c-0.63-0.63-1-2.49-1-2.49s0.2-1.05-0.11-1.68l2.37,0.06c0,0,0.96,0.11,2.07,0.19l0.17,0.01l0.35,0.03L240.09,328.15z"
    />
    <Path
      id="rawadi"
      fill={getColor(195)}
      onPress={() => open(195)}
      d="M245.32,319.01l-0.27,1.53c0,0-2.79,2.32-2.93,3.62c-0.13,1.3-0.15,2.93-0.15,2.93l-1.88,1.06
		l-2.23-9.52l-0.35-0.03c0.39,0.03,0.79,0.06,1.18,0.07c1.53,0.06,2.04-0.93,2.04-0.93l2.55,0.51L245.32,319.01z"
    />
    <Path
      id="vadtumbi"
      fill={getColor(364)}
      onPress={() => open(364)}
      d="M237.86,329.38c-0.93,0.41-4.18,1.71-7.48,1.56c-1.05-0.05-2.27-0.05-3.48-0.02l-0.6-5.8
		l-0.61-4.35l1.9-5.29c0,0,2.01,1.4,3.48,2.05c0.44,0.19,0.83,0.32,1.11,0.33c0.37,0.01,0.59,0.21,0.72,0.48
		c0.31,0.63,0.11,1.68,0.11,1.68s0.37,1.86,1,2.49C234.64,323.14,237.86,329.38,237.86,329.38z"
    />
    <Path
      id="titeghar"
      fill={getColor(365)}
      onPress={() => open(365)}
      d="M225.69,320.77l1.9-5.29c0,0-0.25-1.06-1.22-1.73c-0.96-0.66-1.82-3.49-2.02-4.55
		c-0.04-0.23-0.13-0.38-0.23-0.46c-0.01,0-0.01,0-0.01,0c-0.31-0.04-0.5-0.04-0.5-0.04c-0.24,0.08-0.45,0.25-0.45,0.25l-0.84,1.19
		c0,0-1.57,1.76-4.27,3.04c-2.7,1.28-3.8,0-3.8,0c-0.15,0.45-0.43,0.72-0.43,0.72l-2.02,1.12l-0.12,0.28l-0.15,0.35l0.73,1.73
		c0,0,0.75,0.99,1.99,1.35c1.25,0.36,2.78,0.72,2.78,0.72s2.94,1.08,1.02,4.05l-1.38,0.87l-1.74,1.53c0.6,0.55,0.71,1.5,1.41,2.85
		c1.2,2.31,4.02,2.49,4.02,2.49s3.26-0.26,6.54-0.32l-0.6-5.8L225.69,320.77z"
    />
    <Path
      id="shivnagri"
      fill={getColor(354)}
      onPress={() => open(354)}
      d="M217.03,319.45c0,0-1.53-0.36-2.78-0.72c-1.24-0.36-1.99-1.35-1.99-1.35l-0.73-1.73l-0.21,0.48
		l-3.86,1.55c-6,2.58-7.02,6.2-7.02,6.2s1.44,0.76,3.06,1.06s5.82,0.36,9,0.36c1.32,0,2,0.19,2.43,0.6l1.74-1.53l1.38-0.87
		C219.97,320.53,217.03,319.45,217.03,319.45z"
    />
    <Path
      id="bhavekhal"
      fill={getColor(337)}
      onPress={() => open(337)}
      d="M216.09,290.85l-2.28,0.16l-1.38,0.51l-1.05-0.37l-2.6-0.14l0.18,1.22l2.04,5.81l1.73-0.88
		c0,0,0.78-0.42,1.84-0.46c1.07-0.05,1.92,0.19,2.97-0.74c1.05-0.93,1.16-2.66,1.16-2.66l0.08-1.21L216.09,290.85z"
    />
    <Path
      id="veveghar"
      fill={getColor(363)}
      onPress={() => open(363)}
      d="M240.73,317.74c0,0-0.51,0.99-2.04,0.93c-1.53-0.06-3.42-0.27-3.42-0.27l-2.37-0.06
		c-0.13-0.27-0.35-0.47-0.72-0.48c-0.28-0.01-0.67-0.14-1.11-0.33l1.02-2.22l0.9-1.86l0.05-0.35l2.32,1.61l0.93,0.94l2.37,0.17
		L240.73,317.74z"
    />
    <Path
      id="nazare"
      fill={getColor(357)}
      onPress={() => open(357)}
      d="M247.27,311.24c0,0.06,0,0.12-0.01,0.17l-1.94-0.16l-1.38,0.46l-4.05,0.12l-4.5-0.39l-1.77-0.36
		l-1.08-4.47l-0.51-2.82l-0.48-1.85l-0.83-1.18c0.1,0.02,0.19,0.02,0.29,0c0.59-0.11,1.62,0.07,2.05,0.56
		c0.42,0.5,2.76,1.08,5.17,0.54s4.63-1.66,4.63-1.66c0.04,0.07,0.08,0.15,0.14,0.22c0.61,0.74,1.24,4.59,1.24,4.59
		s0.05,0.32,0.18,0.8c0.27,1,0.87,2.7,1.98,3.57C247.07,309.9,247.27,310.6,247.27,311.24z"
    />
    <Path
      id="ambawade"
      fill={getColor(356)}
      onPress={() => open(356)}
      d="M233.62,311.08l-0.39,0.48l-0.08,0.6h-1.82c0,0-2.93,0.12-3.74-1.64
		c-0.61-1.31-2.54-1.68-3.47-1.78c-0.01,0-0.01,0-0.01,0c-0.14-0.11-0.33-0.1-0.5-0.04l0.25-1.55l1.41-3.51l0.42-1.03l0.87-2.14
		c0,0,0.74-1.19,1.95-0.99c1.22,0.2,1.24,0.72,1.24,0.72s0.47,0.47,0.97,0.55v0.01l0.83,1.18l0.48,1.85l0.51,2.82L233.62,311.08z"
    />
    <Path
      id="mhakoshi"
      fill={getColor(355)}
      onPress={() => open(355)}
      d="M233.15,312.16l-0.11,0.94l-0.05,0.35l-0.9,1.86l-1.02,2.22c-1.47-0.65-3.48-2.05-3.48-2.05
		s-0.25-1.06-1.22-1.73c-0.96-0.66-1.82-3.49-2.02-4.55c-0.04-0.23-0.13-0.38-0.23-0.46c0.93,0.1,2.86,0.47,3.47,1.78
		c0.81,1.76,3.74,1.64,3.74,1.64H233.15z"
    />
    <Path
      id="karnawad"
      fill={getColor(362)}
      onPress={() => open(362)}
      d="M246.92,317.84c-0.86,0.78-1.6,1.17-1.6,1.17l-2.04-0.76l-2.55-0.51l-2.07-1.92l-2.37-0.17
		l-0.93-0.94l-2.32-1.61l0.11-0.94l0.08-0.6l0.39-0.48l1.77,0.36l4.5,0.39l4.05-0.12l1.38-0.46l1.94,0.16
		c-0.04,0.86-0.41,1.57-0.41,1.57l0.02,3.22C246.87,316.2,247.77,317.05,246.92,317.84z"
    />
    <Path
      id="pisaware"
      fill={getColor(299)}
      onPress={() => open(299)}
      d="M237.82,273.52l-3.7-0.06c0,0-1.67-0.75-2.33-1.26c-0.12-0.1-0.24-0.15-0.36-0.18
		c-0.53-0.14-0.99,0.24-0.99,0.24l-2.18,0.24l-2.7-0.22l0.23,1.34l0.59,1.76l-1.49,1.22h-0.17l0.14,0.6l0.5,1.06
		c0,0,0.42,1.65,3.48,1.26c3.06-0.39,4.95-0.52,4.95-0.52l1.49-0.18c0.36-0.47,0.56-0.74,0.56-0.74l3.2-3.52L237.82,273.52z"
    />
    <Path
      id="vathar_hm"
      fill={getColor(298)}
      onPress={() => open(298)}
      d="M233.79,279c0,0-1.89,0.13-4.95,0.52c-3.06,0.39-3.48-1.26-3.48-1.26l-0.5-1.06l-0.14-0.6
		l-2.26,0.04l0.75,2.49l0.54,2.85v3.45l-0.14,2.74c1.21-0.28,2.18-1.27,2.18-1.27s2.76-3.09,3.48-3.84
		c0.72-0.75,1.74-0.45,1.74-0.45l1.21,0.22c1.29-1.68,2.42-3.17,3.06-4.01L233.79,279z"
    />
    <Path
      id="apti"
      fill={getColor(297)}
      onPress={() => open(297)}
      d="M223.21,279.13l-0.75-2.49l-2.36-0.42l-0.16,0.93l-2.04,2.22c0,0-1.29,2.27-0.54,3.46
		s1.25,3.17,1.25,3.17l0.13,1.16h0.39c0,0,1.65,0.64,3.33,1.03c0.39,0.09,0.78,0.07,1.15-0.02l0.14-2.74v-3.45L223.21,279.13z"
    />
    <Path
      id="karangaon"
      fill={getColor(287)}
      onPress={() => open(287)}
      d="M219.94,277.15l0.16-0.93l-0.66-0.12l-7.74-0.14l-1.89,0.5l-0.1-0.02l0.1,0.58l1.4,0.32
		c0,0,2.72,1.32,1.91,3.46s-1.44,3.24-1.44,3.24l-1.57,1.22l-2.57,0.09l0.63,1.98l0.7,2.3l4.32-1.26l1.8-0.72l2.55-0.49h1.2
		l-0.13-1.16c0,0-0.5-1.98-1.25-3.17s0.54-3.46,0.54-3.46L219.94,277.15z"
    />
    <Path
      id="mhasar_bk"
      fill={getColor(289)}
      onPress={() => open(289)}
      d="M199.69,278.44l-1.13-4.12l-0.85-4.79l-3.45,1.59l-1.43,0.41l-0.67,0.19l-3.09,2.76l-1.94,2.65
		l-2.05,0.09v1.01l0.84,1.29l2.19,1.92l1.32,1.26l2.1,1.92c0,0,1.68,0.67,1.83,0.73c0.15,0.05,1.11,0.35,1.11,0.35l1.84-1.95
		c0,0,1.17-1.39,1.63-2.34c0.45-0.95,1.84-0.63,1.84-0.63h0.81L199.69,278.44z"
    />
    <Path
      id="rajiwadi"
      fill={getColor(291)}
      onPress={() => open(291)}
      d="M184.46,277.25l-3.06-1.44l-2.26-0.25l-1.86-1.02c0,0-2.01-2.34-2.22-3.93
		c-0.07-0.55-0.26-1.11-0.48-1.6c-0.4-0.92-0.9-1.6-0.9-1.6s-1.31,0.19-2.78,0.67l-0.09,0.03l-0.25,0.1v3.27l1.26,1.14v1.7
		l1.74,2.26l2.14,1.65l2.03,0.57l1.93,0.9l4.1,0.32l1.32-1.79v-1.01L184.46,277.25z"
    />
    <Path
      id="kund"
      fill={getColor(178)}
      onPress={() => open(178)}
      d="M175.7,278.23l-0.67,1.42l-4.32-1.69l-1.08-0.66l-1.35-0.45l-1.26-0.21l-2.85,0.09l-1.35-0.6
		l-0.37-0.97l0.25-0.14c0,0,4.68,0.22,4.18-3.15c-0.28-1.92,1.95-3.09,3.93-3.76l-0.25,0.1v3.27l1.26,1.14v1.7l1.74,2.26
		L175.7,278.23z"
    />
    <Path
      id="shirgaon"
      fill={getColor(188)}
      onPress={() => open(188)}
      d="M166.39,293.68v4.5l-2.28,0.61c0,0-1.17,0.09-1.86-0.31c-0.69-0.39-1.8-1.33-1.89,0.31
		c-0.09,1.64,0,4.13,0,4.13l-0.18,1.17l-3.42,0.59l-1.89,0.67l-1.42,0.9h-0.01c-0.07-0.01-0.14-0.02-0.22-0.03
		c-3.3-0.36-5.64-1.32-4.56-5.28c0.85-3.11,0.33-4.7-1.15-6.2l2.29-1.24l2.13-0.9l2.7-0.33l3.42-0.87c0.57,0.07,1.92,0.27,1.92,0.27
		l2.4-1.35l0.99-0.54l1.2-0.21v0.84L166.39,293.68z"
    />
    <Path
      id="ashimpi"
      fill={getColor(293)}
      onPress={() => open(293)}
      d="M166.71,284.71c0.01,0.13,0,0.27-0.02,0.42c-0.3,1.83-0.6,2.88-0.6,2.88l-1.53,1.56l-1.2,0.21
		l-0.99,0.54l-2.4,1.35c0,0-1.35-0.2-1.92-0.27c-0.13-0.02-0.22-0.03-0.24-0.03c-0.12,0-1.05-0.75-1.05-0.75s-0.12-1.29-0.9-1.98
		c-0.78-0.69,0-1.38,0-1.38l0.3-1.56v-1.98l-0.3-1.64c0.91-0.73,1.63-1.51,2.19-2.24l1.23,2.65c0,0,0.12,0.66,2.31,0.51
		c2.19-0.15,3.21-0.15,3.21-0.15S166.65,283.23,166.71,284.71z M157.81,291.37c-0.12,0-1.05-0.75-1.05-0.75s-0.12-1.29-0.9-1.98
		c-0.78-0.69,0-1.38,0-1.38l0.3-1.56v-1.98l-0.3-1.64c-3.02,2.43-3.24-1.3-3.28-3.28c-0.05-1.98-2.93-0.86-2.93-0.86l-4.05,9.86
		c0,0-2.04,3.72,0.48,5.7c0.54,0.43,1.02,0.83,1.43,1.24l2.29-1.24l2.13-0.9l2.7-0.33l3.42-0.87
		C157.92,291.38,157.83,291.37,157.81,291.37z"
    />
    <Path
      id="durgad"
      fill={getColor(331)}
      onPress={() => open(331)}
      d="M172.15,307.24l-0.15,0.57l-6.78,2.91c0,0-1.95,0.72-3.27,2.19c-1.32,1.47-3.39,2.67-3.39,2.67
		l-2.78,1.79c-0.54-0.44-0.82-0.71-0.82-0.71l-1.8-1.98c0,0-0.84-3.12,0.54-4.38c1.35-1.23,2.75-3.6-0.25-4.05l1.42-0.9l1.89-0.67
		l3.42-0.59l2.84-1.13l4.18-0.63l2.34,0.5v1.26l1.29,1.8L172.15,307.24z"
    />
    <Path
      id="mazeri"
      fill={getColor(333)}
      onPress={() => open(333)}
      d="M194.95,297.39l-3.02,2.29l-4.21,1.74l-2.88,0.98l-1.94,1.6l-1.39-2.07l-1.45-0.45l-1.5-2.25
		c0,0-0.63-1.21-0.63-1.27c0-0.06-0.07-1.34-0.07-1.34l0.99-0.36l6.23,0.13l0.7,0.32v0.01l1.44,0.66l5.63-0.07l1.87-0.41
		L194.95,297.39z"
    />
    <Path
      id="rayareshwar"
      fill={getColor(351)}
      onPress={() => open(351)}
      d="M211.68,315.3l-0.15,0.35l-0.21,0.48l-3.86,1.55c-6,2.58-7.02,6.2-7.02,6.2
		s-4.14-2.18-7.92-0.86c-3.78,1.32-12.66,5.94-12.66,5.94s-3,3.66-6.24,0c-0.7-0.8-1.27-1.5-1.78-2.12v-0.01l0.67-3.03l0.12-0.38
		l1.84,1.35c0,0,2.88,1.05,4.47,1.28c0.9,0.13,1.81-0.04,2.44-0.22c0.51-0.14,0.83-0.28,0.83-0.28l1.55-2.29l4.14-5.4l0.53-0.51
		l4.33-4.17c0,0,0.15-0.21,0.42-0.67l2.01,0.4h2.95l0.2,2.52l1.53,2.34l0.14,1.55c0.8-0.1,1.67-0.24,2.29-0.43
		c1.48-0.45,1.4-2.65,1.4-2.65l-0.34-3.73L211.68,315.3z"
    />
    <Path
      id="kudli_kh"
      fill={getColor(353)}
      onPress={() => open(353)}
      d="M176.68,313.59l-1.53,3.55l-0.33,2.7l-1.65,1.8l-0.54,1.78l-0.12,0.38l-0.67,3.03
		c-1.57-1.92-2.62-3.14-5.71-4.3c0,0,1.07-1.67,1.64-2.3s0.69-2.37,0.69-2.37s0.06-3,0-4.47c-0.06-1.47,3.21-4.38,3.21-4.38
		l0.33-1.2l0.15-0.57c0,0,1.71-0.36,2.07,1.75c0.36,2.12,0,3.06,0.99,3.61L176.68,313.59z M165.22,310.72c0,0-1.95,0.72-3.27,2.19
		c-1.32,1.47-3.39,2.67-3.39,2.67l-2.78,1.79c1.38,1.12,4.44,3.31,8.6,4.57c0.65,0.2,1.23,0.39,1.75,0.59c0,0,1.07-1.67,1.64-2.3
		s0.69-2.37,0.69-2.37s0.06-3,0-4.47c-0.06-1.47,3.21-4.38,3.21-4.38l0.33-1.2L165.22,310.72z"
    />
    <Path id="mhasar_kh" fill={getColor(288)} onPress={() => open(288)} d="M211.21,277.34l-1.4-0.32l-0.1-0.58l-1.79-0.3l-3.6-3.33c0,0-2.83-2.25-4.09-3.15c-0.83-0.59-1.66-0.46-2.13-0.3l-0.05,0.02c-0.16,0.05-0.27,0.11-0.32,0.14l-0.02,0.01l0.85,4.79l1.13,4.12l0.9,2.34l0.99,1.63l2.84,0.89l2.14,0.96l0.98,1.09l2.57-0.09l1.57-1.22c0,0,0.63-1.1,1.44-3.24S211.21,277.34,211.21,277.34z" />
    <Path
      id="nandgaon"
      fill={getColor(324)}
      onPress={() => open(324)}
      d="M232.22,282.83c-1.06,1.4-2.23,2.93-3.32,4.33c-1.57,2.03-2.96,3.79-3.66,4.58l-0.13,0.15
        l-0.11,0.12c-0.65,0.68-1.76,0.86-2.79,0.84c-1.33-0.02-2.54-0.35-2.54-0.35l-0.89-0.41l-2.69-1.24l-2.28,0.16l-1.38,0.51
        l-1.05-0.37l-2.6-0.14l0.09-1.38l4.32-1.26l1.8-0.72l2.55-0.49h1.59c0,0,1.65,0.64,3.33,1.03c0.39,0.09,0.78,0.07,1.15-0.02
        c1.21-0.28,2.18-1.27,2.18-1.27s2.76-3.09,3.48-3.84c0.72-0.75,1.74-0.45,1.74-0.45L232.22,282.83z"
    />
    <Path
      id="deoghar"
      fill={getColor(295)}
      onPress={() => open(295)}
      d="M208.87,289.63l-0.09,1.38c0,0-2.26,1.67-2.31,1.67c-0.04,0-1.54,0.73-1.54,0.73l-1.12,0.11
        l-0.59,0.06l-1.32,0.25l-1.96,0.67l-0.49-1.67c0,0-0.78-1.64-1.53-3.56c-0.75-1.92-2.76-1.74-2.76-1.74l-0.36-0.75l-0.33-1.08
        l1.84-1.95c0,0,1.17-1.39,1.63-2.34c0.45-0.95,1.84-0.63,1.84-0.63h0.81l0.99,1.63l2.84,0.89l2.14,0.96l0.98,1.09l0.63,1.98
        L208.87,289.63z"
    />
    <Path
      id="hirdoshi"
      fill={getColor(327)}
      onPress={() => open(327)}
      d="M199.94,294.5l-1.33,0.86l-3.18,1.38l-0.71,0.16l-1.87,0.41l-5.63,0.07l-1.44-0.66v-2.53
        l-1.21-1.89l-0.7-2.17l1.6-0.71l1.26-0.22l2.92,0.22l2.48,0.04l2.34-1.09l0.69-0.84c0,0,2.01-0.18,2.76,1.74
        c0.75,1.92,1.53,3.56,1.53,3.56L199.94,294.5z M184.57,292.3l-0.7-2.17l-0.33-1.03v-2.02l-0.21-2.16l-0.43-0.9l-2.16,2.34
        c0,0-2.11,2.2-2.16,4.63c-0.04,2.43,0,4.01,0,4.01l0.27,1.26l6.23,0.13l0.7,0.32v-2.52L184.57,292.3z"
    />
    <Path
      id="dhamonshi"
      fill={getColor(328)}
      onPress={() => open(328)}
      d="M183.76,280.02v1.39l-0.86,1.53v1.08l-2.16,2.34c0,0-2.11,2.2-2.16,4.63
        c-0.04,2.43,0,4.01,0,4.01l0.27,1.26l-0.99,0.36l-1.98-0.23l0.88-0.99l-1.01-1.21l-0.16-2.95c0,0,0.41-0.56-0.02-0.83
        c-0.43-0.27-0.09-0.99-0.09-0.99l0.58-0.59c0,0,0.54-1.07,1.4-3.51c0.86-2.43-1.49-4.99-1.49-4.99l-0.94-0.68l0.67-1.42l2.03,0.57
        l1.93,0.9L183.76,280.02z"
    />
    <Path
      id="varvand"
      fill={getColor(329)}
      onPress={() => open(329)}
      d="M176.76,295.4l-0.88,0.99l-1.48,0.9l-3.33,0.47c0,0-3.45,0.21-3.54,0.24
        c-0.09,0.03-1.14,0.18-1.14,0.18v-4.5l-1.83-3.27v-0.84l1.53-1.56l1.44,0.3l0.6,0.69h1.98l2.19,1.53l3.27-0.12
        c0.43,0.27,0.02,0.83,0.02,0.83l0.16,2.95L176.76,295.4z"
    />
    <Path
      id="shilimb"
      fill={getColor(292)}
      onPress={() => open(292)}
      d="M175.03,279.65l-0.72,0.8l-2.46,1.95l-1.59,0.96l-1.08,0.66l-1.59,0.69h-0.88
        c-0.06-1.48-1.91-1.86-1.91-1.86s-1.02,0-3.21,0.15c-2.19,0.15-2.31-0.51-2.31-0.51l-1.23-2.65c1.31-1.7,1.77-3.16,1.77-3.16
        l2.63-1.52l0.37,0.97l1.35,0.6l2.85-0.09l1.26,0.21l1.35,0.45l1.08,0.66L175.03,279.65z M175.97,280.33l-0.94-0.68l-0.72,0.8
        l-2.46,1.95l-1.59,0.96l-1.08,0.66l-1.59,0.69h-0.88c0.01,0.13,0,0.27-0.02,0.42c-0.3,1.83-0.6,2.88-0.6,2.88l1.44,0.3l0.6,0.69
        h1.98l2.19,1.53l3.27-0.12c-0.43-0.27-0.09-0.99-0.09-0.99l0.58-0.59c0,0,0.54-1.07,1.4-3.51
        C178.32,282.89,175.97,280.33,175.97,280.33z"
    />
    <Path
      id="nandgaon"
      fill={getColor(324)}
      onPress={() => open(324)}
      d="M232.22,282.83c-1.06,1.4-2.23,2.93-3.32,4.33c-1.57,2.03-2.96,3.79-3.66,4.58l-0.13,0.15
        l-0.11,0.12c-0.65,0.68-1.76,0.86-2.79,0.84c-1.33-0.02-2.54-0.35-2.54-0.35l-0.89-0.41l-2.69-1.24l-2.28,0.16l-1.38,0.51
        l-1.05-0.37l-2.6-0.14l0.09-1.38l4.32-1.26l1.8-0.72l2.55-0.49h1.59c0,0,1.65,0.64,3.33,1.03c0.39,0.09,0.78,0.07,1.15-0.02
        c1.21-0.28,2.18-1.27,2.18-1.27s2.76-3.09,3.48-3.84c0.72-0.75,1.74-0.45,1.74-0.45L232.22,282.83z"
    />
    <Path
      id="deoghar"
      fill={getColor(295)}
      onPress={() => open(295)}
      d="M208.87,289.63l-0.09,1.38c0,0-2.26,1.67-2.31,1.67c-0.04,0-1.54,0.73-1.54,0.73l-1.12,0.11
        l-0.59,0.06l-1.32,0.25l-1.96,0.67l-0.49-1.67c0,0-0.78-1.64-1.53-3.56c-0.75-1.92-2.76-1.74-2.76-1.74l-0.36-0.75l-0.33-1.08
        l1.84-1.95c0,0,1.17-1.39,1.63-2.34c0.45-0.95,1.84-0.63,1.84-0.63h0.81l0.99,1.63l2.84,0.89l2.14,0.96l0.98,1.09l0.63,1.98
        L208.87,289.63z"
    />
    <Path
      id="hirdoshi"
      fill={getColor(327)}
      onPress={() => open(327)}
      d="M199.94,294.5l-1.33,0.86l-3.18,1.38l-0.71,0.16l-1.87,0.41l-5.63,0.07l-1.44-0.66v-2.53
        l-1.21-1.89l-0.7-2.17l1.6-0.71l1.26-0.22l2.92,0.22l2.48,0.04l2.34-1.09l0.69-0.84c0,0,2.01-0.18,2.76,1.74
        c0.75,1.92,1.53,3.56,1.53,3.56L199.94,294.5z M184.57,292.3l-0.7-2.17l-0.33-1.03v-2.02l-0.21-2.16l-0.43-0.9l-2.16,2.34
        c0,0-2.11,2.2-2.16,4.63c-0.04,2.43,0,4.01,0,4.01l0.27,1.26l6.23,0.13l0.7,0.32v-2.52L184.57,292.3z"
    />
    <Path
      id="dhamonshi"
      fill={getColor(328)}
      onPress={() => open(328)}
      d="M183.76,280.02v1.39l-0.86,1.53v1.08l-2.16,2.34c0,0-2.11,2.2-2.16,4.63
        c-0.04,2.43,0,4.01,0,4.01l0.27,1.26l-0.99,0.36l-1.98-0.23l0.88-0.99l-1.01-1.21l-0.16-2.95c0,0,0.41-0.56-0.02-0.83
        c-0.43-0.27-0.09-0.99-0.09-0.99l0.58-0.59c0,0,0.54-1.07,1.4-3.51c0.86-2.43-1.49-4.99-1.49-4.99l-0.94-0.68l0.67-1.42l2.03,0.57
        l1.93,0.9L183.76,280.02z"
    />
    <Path
      id="varvand"
      fill={getColor(329)}
      onPress={() => open(329)}
      d="M176.76,295.4l-0.88,0.99l-1.48,0.9l-3.33,0.47c0,0-3.45,0.21-3.54,0.24
        c-0.09,0.03-1.14,0.18-1.14,0.18v-4.5l-1.83-3.27v-0.84l1.53-1.56l1.44,0.3l0.6,0.69h1.98l2.19,1.53l3.27-0.12
        c0.43,0.27,0.02,0.83,0.02,0.83l0.16,2.95L176.76,295.4z"
    />
    <Path
      id="shilimb"
      fill={getColor(292)}
      onPress={() => open(292)}
      d="M175.03,279.65l-0.72,0.8l-2.46,1.95l-1.59,0.96l-1.08,0.66l-1.59,0.69h-0.88
        c-0.06-1.48-1.91-1.86-1.91-1.86s-1.02,0-3.21,0.15c-2.19,0.15-2.31-0.51-2.31-0.51l-1.23-2.65c1.31-1.7,1.77-3.16,1.77-3.16
        l2.63-1.52l0.37,0.97l1.35,0.6l2.85-0.09l1.26,0.21l1.35,0.45l1.08,0.66L175.03,279.65z M175.97,280.33l-0.94-0.68l-0.72,0.8
        l-2.46,1.95l-1.59,0.96l-1.08,0.66l-1.59,0.69h-0.88c0.01,0.13,0,0.27-0.02,0.42c-0.3,1.83-0.6,2.88-0.6,2.88l1.44,0.3l0.6,0.69
        h1.98l2.19,1.53l3.27-0.12c-0.43-0.27-0.09-0.99-0.09-0.99l0.58-0.59c0,0,0.54-1.07,1.4-3.51
        C178.32,282.89,175.97,280.33,175.97,280.33z"
    />
    <Path
      id="khondri"
      fill={getColor(294)}
      onPress={() => open(294)}
      d="M195.16,287.53l-0.69,0.84l-2.34,1.09l-2.48-0.04l-2.92-0.22l-1.26,0.22l-1.6,0.71l-0.33-1.03
        v-2.02l-0.21-2.16l-0.43-0.9v-1.08l0.86-1.53v-1.39l1.32-1.79l0.84,1.29l2.19,1.92l1.32,1.26l2.1,1.92c0,0,1.68,0.67,1.83,0.73
        c0.15,0.05,1.11,0.35,1.11,0.35l0.33,1.08L195.16,287.53z"
    />
    <Path
      id="gudhe"
      fill={getColor(352)}
      onPress={() => open(352)}
      d="M183.43,307.63c0,0-1.29,0.19-1.97,3.61c-0.67,3.42-0.85,6.11-0.85,6.11l0.81,2.71v3.24l-0.04,2.53
        c-0.63,0.18-1.54,0.35-2.44,0.22c-1.59-0.23-4.47-1.28-4.47-1.28l-1.84-1.35l0.54-1.78l1.65-1.8l0.33-2.7l1.53-3.55l0.42-0.98
        l0.92-2.94l2.5-3.73l2.38-1.94L183.43,307.63z"
    />
    <Path
      id="rayri"
      fill={getColor(350)}
      onPress={() => open(350)}
      d="M214.25,313.18c-0.15,0.45-0.43,0.72-0.43,0.72l-2.02,1.12l-0.12,0.28l-8.32-2.79l-0.3-3.38
        c0,0-0.72-3.19-1.98-3.65c0,0,0.14-1.63,2.9-1.24s4.53,0.99,4.53,0.99l2.91,0.45c0.03,0.3,0.26,0.44,0.26,0.44s1.28,3.73,2.28,5.21
        C214.45,312.08,214.41,312.72,214.25,313.18z"
    />
    <Path
      id="salav"
      fill={getColor(325)}
      onPress={() => open(325)}
      d="M212.11,300.25l-3.33-0.45h-3.3l-1.67-6.28l1.12-0.11c0,0,1.5-0.73,1.54-0.73
        c0.05,0,2.31-1.67,2.31-1.67l0.18,1.22l2.04,5.81l0.62,1.75C211.62,299.79,211.77,299.96,212.11,300.25z"
    />
    <Path
      id="bhambatmal"
      fill={getColor(381)}
      onPress={() => open(381)}
      d="M214.08,302.4c-0.1,0.3-0.32,0.49-0.32,0.49s-1,0.97-1.9,1.87c-0.39,0.39-0.48,0.7-0.44,0.92
        l-2.91-0.45c0,0-1.77-0.6-4.53-0.99s-2.9,1.24-2.9,1.24c-1.26-0.45-2.65-3.33-2.65-3.33v-3.97l-3.71-1.28l0.71-0.16l3.18-1.38
        l1.33-0.86l1.96-0.67l1.32-0.25l0.59-0.06l1.67,6.28h3.3l3.33,0.45h0.01c0.29,0.25,0.73,0.58,1.33,0.95
        C214.15,301.63,214.19,302.08,214.08,302.4z"
    />
    <Path
      id="dhapkegar"
      fill={getColor(335)}
      onPress={() => open(335)}
      d="M202.3,318.89c-0.62,0.19-1.49,0.33-2.29,0.43l-0.14-1.55l-1.53-2.34l-0.2-2.52h-2.95
        l-2.01-0.4c0.47-0.8,1.29-2.35,2.3-4.79c1.58-3.84,0.76-7.5,0.76-7.5l-0.65-1.43l-0.64-1.4l-0.23-0.49l3.71,1.28v3.97
        c0,0,1.39,2.88,2.65,3.33c1.26,0.46,1.98,3.65,1.98,3.65l0.3,3.38l0.34,3.73C203.7,316.24,203.78,318.44,202.3,318.89z"
    />
    <Path
  id="parhar_bk"
  fill={getColor(334)}
  onPress={() => open(334)}
  d="M195.59,298.79l-2.8,3.11l-3.12,2.46l-2.71-0.18l-0.89,1.71l-2.64,1.74L182.9,304l1.94-1.6
	l2.88-0.98l4.21-1.74l3.02-2.29L195.59,298.79z"
/>
<Path
  id="parhar_kh"
  fill={getColor(382)}
  onPress={() => open(382)}
  d="M195.48,307.72c-1.01,2.44-1.83,3.99-2.3,4.79c-0.27,0.46-0.42,0.67-0.42,0.67l-4.33,4.17
	l-0.27-0.89c0,0-0.3-2.65-0.66-4.96c-0.37-2.32-4.07-3.87-4.07-3.87l2.64-1.74l0.89-1.71l2.71,0.18l3.12-2.46l2.8-3.11l0.65,1.43
	C196.24,300.22,197.06,303.88,195.48,307.72z M188.16,316.46c0,0-0.3-2.65-0.66-4.96c-0.37-2.32-4.07-3.87-4.07-3.87
	s-1.29,0.19-1.97,3.61c-0.67,3.42-0.85,6.11-0.85,6.11l0.81,2.71v3.24l-0.04,2.53c0.51-0.14,0.83-0.28,0.83-0.28l1.55-2.29
	l4.14-5.4l0.53-0.51L188.16,316.46z"
/>
<Path
  id="shirvali_hm"
  fill={getColor(332)}
  onPress={() => open(332)}
  d="M182.9,304l-2.38,1.94l-2.5,3.73l-0.92,2.94l-0.42,0.98l-1.47-0.99
	c-0.99-0.55-0.63-1.49-0.99-3.61c-0.36-2.11-2.07-1.75-2.07-1.75l-1.32-1.35l-1.29-1.8v-1.26l2.3-0.78l2.24-1.25l2.21-0.9
	l1.64-1.94c0,0.06,0.63,1.27,0.63,1.27l1.5,2.25l1.45,0.45L182.9,304z M177.86,296.62l-1.98-0.23l-1.48,0.9l-3.33,0.47
	c0,0-3.45,0.21-3.54,0.24c-0.09,0.03-1.14,0.18-1.14,0.18l-2.28,0.61c0,0-1.17,0.09-1.86-0.31c-0.69-0.39-1.8-1.33-1.89,0.31
	c-0.09,1.64,0,4.13,0,4.13l-0.18,1.17l2.84-1.13l4.18-0.63l2.34,0.5l2.3-0.78l2.24-1.25l2.21-0.9l1.64-1.94
	C177.93,297.9,177.86,296.62,177.86,296.62z"
/>
<Path
  id="sangvi_vk"
  fill={getColor(218)}
  onPress={() => open(218)}
  d="M177.67,250.24l-6.32,11.75c-2.03-1.18-5.14-1.87-5.14-1.87l-1.36-0.19l1.39-4.35l-1.39-3.32
	l0.73-1.2l3.96-2.74l2.02-1.7l2.24,1.36l3.48,2.11L177.67,250.24z"
/>
<Path
  id="gruhini"
  fill={getColor(237)}
  onPress={() => open(237)}
  d="M170.08,227.35c0,0-0.4-0.19-0.95-0.34c-0.97-0.26-2.4-0.39-2.86,0.91
	c-0.65,1.83-1.43,3.37-2.99,4.48c-0.18,0.14-0.38,0.26-0.58,0.38c-1.37,0.8-2.76,3.74-3.48,5.42l1.72,0.31l3.2,1.41l2.88-2.84
	l2.88-3.01l2.78-4.83L170.08,227.35z M176.35,232.87l-1.62-1.47l-0.93-1.35l-1.12-0.81l-2.78,4.83l-2.88,3.01l-2.88,2.84l2.9,2.55
	l1.96-2.55l3.33-3.1l5.09-3.11L176.35,232.87z"
/>
<Path
  id="kumble"
  fill={getColor(253)}
  onPress={() => open(253)}
  d="M169.54,248.32l2.02-1.7l-4.09-3.78l-0.43-0.37l-2.9-2.55l-3.2-1.41l-1.72-0.31
	c-0.3,0.72-0.48,1.21-0.48,1.21s-0.32,1.06-0.64,2.27c-0.32,1.19-0.64,2.52-0.66,3.14c-0.05,1.26,0,7.34,0,7.34l-1.54,5.26v0.99
	l3.2,0.73l5.75,0.79l1.39-4.35l-1.39-3.32l0.73-1.2L169.54,248.32z"
/>
<Path
  id="sangvi_hm_yewali"
  fill={getColor(306)}
  onPress={() => open(306)}
  d="M270.65,266.28l-3.96,3.62l-0.95,0.13l-2.43-1.47l4.85-5.75l1.63,2.81L270.65,266.28z"
/>
<Path
  id="bhatgar"
  fill={getColor(317)}
  onPress={() => open(317)}
  d="M273.46,269.77l-1.41,1.02l-2.42,1.66l-2.94-2.55l3.96-3.62l1.94,1.51L273.46,269.77z"
/>
<Path
  id="karnawadi"
  fill={getColor(362)}
  onPress={() => open(59)}
  d="M241.6,248.81l-0.7,4.19l-1.38,3.13l-2.09,2.15l-2.13,0.4l-0.93,0.74l-1.13-0.49l0.44-1.73
	l1.56-2.7l1.02-1.92l0.72-5.8l0.45,0.2l3.75,1.64L241.6,248.81z"
/>
<Path
  id="rajghar"
  fill={getColor(383)}
  onPress={() => open(383)}
  d="M232.65,244.88l-3.35,5h-3l-2.22,2.22l-1.48-0.89c-1.03-0.34-1.67-0.07-2.05,0.37l-0.85-0.96
	l-0.3-3.38l-0.94-1.98l-2.36-2.91l-3.02-5.74l0.92-0.2c0,0,2.46,0.45,2.55,0.48c0.09,0.03,3.21,1.11,3.21,1.11l0.78,0.72l2.37,2.19
	l1.39,0.83l1.69,1.02l4.24,1.29l1.79,0.55L232.65,244.88z"
/>
<Path
  id="velvand"
  fill={getColor(384)}
  onPress={() => open(384)}
  d="M220.02,253.79l0.02,0.13v0.04l-2.89-0.23l-2.93-0.58l-3.06,0.81l-2.88,0.85l-4.9-0.33
		l-0.04-0.14l-0.32-1.01l3.78-4.27l0.99-1.76v-3.78l-0.86-4.65l1.15-0.5l3.1-1.36l1.9-0.4l3.02,5.74l2.36,2.91l0.94,1.98l0.3,3.38
		l0.85,0.96c-0.59,0.67-0.61,1.73-0.61,1.73S219.97,253.49,220.02,253.79z"
/>
<Path
  id="jayatpad"
  fill={getColor(385)}
  onPress={() => open(385)}
  d="M219.58,259.81l-1.68,1.98l-0.74,0.78l-4.49,4.73l-3.62,1.92l-1.96,0.31h-1.51l-0.38-0.97
		l0.29-2.38l0.47-1.57c0,0,0.3-1.44-1.8-2.25c-2.1-0.81-0.66-2.82-0.66-2.82l0.24-3.92l-0.36-1.14l4.9,0.33l2.88-0.85l3.06-0.81
		l2.93,0.58l2.89,0.23v-0.04c0.09,0.63,0.25,1.66,0.38,2.65C220.63,258.16,219.58,259.81,219.58,259.81z"
/>
<Path
  id="bhutonde"
  fill={getColor(252)}
  onPress={() => open(252)}
  d="M181.53,235.62l-0.56,2.47l-1.62,3l-3.6,2.93l-1.22,1.61l-0.73,2.35l-2.24-1.36l-4.09-3.78
		l-0.43-0.37l1.96-2.55l3.33-3.1l5.09-3.11l1.06,0.84c0,0,1.35,0.78,1.44,0.75C179.97,235.28,180.84,235.47,181.53,235.62z"
/>
<Path
  id="dere"
  fill={getColor(255)}
  onPress={() => open(255)}
  d="M185.56,240.15l-0.68,2.83l-1.16,3.1l-0.23,5.88c-1.13-0.17-2.3-0.34-2.3-0.34l-3.52-1.38
		l-0.39-0.15l-3.48-2.11l0.73-2.35l1.22-1.61l3.6-2.93l1.62-3l0.56-2.47c0.47,0.1,0.85,0.19,0.85,0.19l2.7,0.63L185.56,240.15z"
/>
<Path
  id="male"
  fill={getColor(251)}
  onPress={() => open(251)}
  d="M195.52,241.8l0.98,4.96l-1.82,1.56l-1.65,1.41l-3.78,1.85l-0.36,0.18c0,0-3.2,0.49-3.33,0.49
		c-0.07,0-1.05-0.14-2.07-0.29l0.23-5.88l1.16-3.1l0.68-2.83l-0.48-3.71l2.73,0.96c0,0,2.79,0.87,2.88,0.87
		c0.09,0,2.55,0.24,2.55,0.24h1.9l1.72-0.57L195.52,241.8z"
/>
<Path
  id="kurunji"
  fill={getColor(256)}
  onPress={() => open(256)}
  d="M202.75,240.5l-1.67,1.9l-4.58,4.36l-0.98-4.96l1.34-3.86l4.36-1.76l0.43-0.1l1.07,1.86
		L202.75,240.5z"
    />


<Path id="kambre_bk" fill={getColor(257)} onPress={() => open(257)} d="M208.08,238.37l-1.15,0.5l-0.54,0.24l-3.64,1.39l-0.03-2.56l-1.07-1.86v-0.01l3.57-0.87
		l2.57-0.78L208.08,238.37z" />
<Path id="vadhane" fill={getColor(258)} onPress={() => open(258)} d="M224.08,230.16l-0.44,2.98l-3.1,5.58l-0.78-0.72c0,0-3.12-1.08-3.21-1.11
		c-0.09-0.03-2.55-0.48-2.55-0.48l-0.92,0.2l-1.9,0.4l-3.1,1.36l-0.29-3.95l7.83-2.39l4.82-1.47l3.2-0.35L224.08,230.16z" />

<Path id="vakambe" fill={getColor(386)} onPress={() => open(386)} d="M230.23,244.05l-4.24-1.29l-1.69-1.02l2.9-5.35L230.23,244.05z" />

<Path id="nand" fill={getColor(301)} onPress={() => open(301)} d="M240.83,272.59l-1.79,1.97l-1.22-1.04l-3.7-0.06c0,0-1.67-0.75-2.33-1.26
		c-0.12-0.1-0.24-0.15-0.36-0.18l-0.08-1.27l-1.65-2.05l-1.57-2.7l-0.88-2.84l-0.44-7.02c0.65-0.07,1.62-0.06,2.29,0.47
		c0.17,0.14,0.4,0.29,0.65,0.45l-0.27,2.36c0,0,0.86,3.67,2.16,5.47c1.3,1.81,3.36,4.64,3.36,4.64l2.43,1.71L240.83,272.59z" />

<Path id="shind" fill={getColor(301)} onPress={() => open(301)} d="M242.98,270.22l-0.67,0.74l-1.48,1.63l-3.4-1.35l-2.43-1.71c0,0-2.06-2.83-3.36-4.64
		c-1.3-1.8-2.16-5.47-2.16-5.47l0.27-2.36c1.34,0.85,3.49,1.87,3.49,1.87l1.13,0.49l0.63,1.43v3.22c0,0,0.39,3,1.98,3.66
		c1.59,0.66,3.03,1.41,3.03,1.41L242.98,270.22z" />

<Path id="gavadi" fill={getColor(302)} onPress={() => open(302)} d="M244.62,269.01c-0.15,0.08-0.3,0.16-0.43,0.24c-0.16,0.1-0.31,0.21-0.44,0.31
		c-0.48,0.35-0.77,0.66-0.77,0.66l-2.97-1.08c0,0-1.44-0.75-3.03-1.41c-1.59-0.66-1.98-3.66-1.98-3.66v-3.22l0.87-0.14l0.89-0.34
		l1.39,0.09l2.29,0.74h1.66l0.34,0.52h0.32l0.25,3.34L244.62,269.01z" />
<Path id="kiwat" fill={getColor(319)} onPress={() => open(319)} d="M253.45,269.58c-0.57,0.01-1.05,0.01-1.11-0.01c-0.24-0.07-0.47-0.12-0.69-0.16
		c-1.67-0.3-2.71,0.15-4.49-0.62c-0.43-0.19-0.87-0.23-1.29-0.18c-0.07,0.01-0.14,0.02-0.21,0.04c-0.37,0.06-0.72,0.2-1.04,0.36
		l-1.61-3.95l-0.25-3.34h0.2l0.31-1.17l0.59-0.25l0.87,0.7l1.04,0.95l2.79,0.09l0.59,0.23l0.55,0.23l0.17,0.07
		c-0.24,0.22-0.4,0.62-0.11,1.35c0.6,1.53,2.64,4.47,2.64,4.47L253.45,269.58z" />

<Path id="bholawade" fill={getColor(318)} onPress={() => open(318)} d="M271.42,261.79l-2.43,0.45l-0.83,0.57l-4.85,5.75h-1.09l-3.51-1.41l-0.69-2.94
		c0.69-0.19,1.28-0.53,1.28-0.53l1.56-2.76l0.02-3.72l1.73-0.45v-1.34l1.15,0.51l0.25,1.28h0.7v-1.28h0.83l1.15,1.28v1.38l1.6,0.34
		l1.85,2.2L271.42,261.79z M258.02,264.21c-0.69,0.18-1.48,0.22-1.9-0.38c-0.84-1.2-1.17-1.65-2.76-1.65s-2.85,0.12-2.85,0.12
		s-0.22,0.01-0.44,0.13l-0.15,0.11c-0.01,0-0.03,0.02-0.04,0.03h-0.01c-0.24,0.22-0.4,0.62-0.11,1.35c0.6,1.53,2.64,4.47,2.64,4.47
		l1.05,1.19c0.9-0.01,2.02-0.05,2.02-0.05l0.9-0.45l1.2-0.07l1.14-1.86L258.02,264.21z" />

<Path id="karandi_kb_1_" fill={getColor(222)} onPress={() => open(222)} d="M228.07,229.88v2.54l-0.87,2.02v1.95l-2.9,5.35l-1.39-0.83l-2.37-2.19l3.1-5.58l0.44-2.98
		l2.65-0.28H228.07z" />

<Path id="tate_masivali" fill={getColor(387)} onPress={() => open(387)} d="M232.9,237.04l-0.25,7.84l-0.63-0.28l-1.79-0.55l-3.03-7.66v-1.95l0.87-2.02v-2.54h1.95
		l0.6,3.32L232.9,237.04z" />

<Path id="pasure" fill={getColor(388)} onPress={() => open(388)} d="M236.98,246.78l-0.72,5.8l-1.02,1.92l-1.56,2.7l-0.44,1.73c0,0-2.15-1.02-3.49-1.87
		c-0.25-0.16-0.48-0.31-0.65-0.45c-0.67-0.53-1.64-0.54-2.29-0.47c-0.42,0.04-0.71,0.12-0.71,0.12l-2.02,1v-5.16l2.22-2.22h3l3.35-5
		L236.98,246.78z" />
<Path id="jogwadi" fill={getColor(389)} onPress={() => open(389)} d="M241.6,232.37l-0.7,4.73l-1.58,5.22l-1.89,4.66l-0.45-0.2l-4.33-1.9l0.25-7.84l-2.28-3.84
		l-0.6-3.32h1.58l2.54,0.33l1.96,0.26l3.05,0.56l1.08,0.2l0.67,0.56L241.6,232.37z M244.55,234.78l-0.85-0.67l-2.1-1.74l-0.7,4.73
		l-1.58,5.22l-1.89,4.66l3.75,1.64l0.42,0.19l2.67,1.21l-0.27-8.28l0.55-6.95V234.78z" />

<Path id="basarapur_karnawadi" fill={getColor(305)} onPress={() => open(305)} d="M260.31,255.92l0.57,1.28l-0.02,3.72l-1.56,2.76c0,0-0.59,0.34-1.28,0.53
		c-0.69,0.18-1.48,0.22-1.9-0.38c-0.84-1.2-1.17-1.65-2.76-1.65s-2.85,0.12-2.85,0.12s-0.37,0.02-0.63,0.27h-0.01l-0.72-0.3
		l6.5-7.18l1.72,0.83l3.07-1.59l0.64,0.31L260.31,255.92z M255.65,251.13l-1.42,2.38l-5.08,3.69l-4.88,1.86l-0.41,1.24l0.87,0.7
		l1.04,0.95l2.79,0.09l0.59,0.23l6.5-7.18l0.26-1.63L255.65,251.13z" />

<Path id="majgao" fill={getColor(390)} onPress={() => open(390)} d="M252.7,237.54l-1.68,1.6l-0.48,2.6v1.82l-2.28,2.42l-2.67,4.64l-1.32-0.6l-0.27-8.28l0.55-6.95
		l0.68,0.54c0,0,2.77,0.29,5.56,1.34C251.44,236.92,252.08,237.2,252.7,237.54z" />

<Path id="harnas" fill={getColor(391)} onPress={() => open(391)} d="M261.17,243.56l-2.2,2.79l-2.04,3.25l-1.28,1.53l-1.42,2.38l-2.85-0.18l-2.85-1.38l-1.24-0.56
		l-1.7-0.77l2.67-4.64l2.28-2.42v-1.82l0.48-2.6l1.68-1.6c0.66,0.35,1.29,0.76,1.83,1.24c3.21,2.82,4.32,3.39,4.32,3.39
		L261.17,243.56z" />

<Path id="bare_bk" fill={getColor(303)} onPress={() => open(303)} d="M254.23,253.51l-5.08,3.69l-4.88,1.86l-0.41,1.24l-0.59,0.25l-0.31,1.17h-0.52l-0.34-0.52h-1.66
		l-2.29-0.74l0.33-0.92l3.12-0.86l2.4-1.77l3.29-5.52l1.24,0.56l2.85,1.38L254.23,253.51z" />
<Path id="mhalavadi" fill={getColor(283)} onPress={() => open(283)} d="M247.29,251.39l-3.29,5.52l-2.4,1.77l-3.12,0.86l-0.33,0.92l-1.39-0.09l-0.89,0.34l-0.87,0.14
		l-0.63-1.43l0.93-0.74l2.13-0.4l2.09-2.15l1.38-3.13l0.7-4.19l2.67,1.21l1.32,0.6L247.29,251.39z" />

<Path id="mahude_bk" fill={getColor(285)} onPress={() => open(285)} d="M231.43,272.02c-0.53-0.14-0.99,0.24-0.99,0.24l-2.18,0.24l-2.7-0.22l-0.84-4.87l-0.64-10.15
		l2.02-1c0,0,0.29-0.08,0.71-0.12l0.44,7.02l0.88,2.84l1.57,2.7l1.65,2.05L231.43,272.02z"/>

<Path id="mahude_kh" fill={getColor(286)} onPress={() => open(286)} d="M226.38,275.38l-1.49,1.22h-0.17l-2.26,0.04l-2.36-0.42l-0.66-0.12l-7.74-0.14l-1.89,0.5
		l-0.1-0.02l-1.79-0.3l-3.6-3.33c0,0-2.83-2.25-4.09-3.15c-0.83-0.59-1.66-0.46-2.13-0.3l4.92-2.12l2.47-1.06l-0.29,2.38l0.38,0.97
		h1.51l1.96-0.31l3.62-1.92l4.49-4.73l1.97,2.2l0.97,4.76l1.55,2.49L226.38,275.38z" />

<Path id="bramhanagar_hm" fill={getColor(284)} onPress={() => open(284)} d="M226.38,275.38l-4.73-3.36l-1.55-2.49l-0.97-4.76l-1.97-2.2l0.74-0.78l1.68-1.98
		c0,0,1.05-1.65,0.84-3.24c-0.21-1.59-0.48-3.26-0.48-3.26s0.02-1.06,0.61-1.73c0.38-0.44,1.02-0.71,2.05-0.37l1.48,0.89v5.16
		l0.64,10.15l0.84,4.87l0.23,1.34L226.38,275.38z" />

<Path id="pangari" fill={getColor(392)} onPress={() => open(392)} d="M207.79,243.52v3.78l-0.99,1.76l-3.78,4.27l-7.92-1.94l-0.13-0.2l-0.01-0.01l-0.28-2.86
		l1.82-1.56l4.58-4.36l1.67-1.9l3.64-1.39l0.54-0.24L207.79,243.52z M204.16,262.36c-2.1-0.81-0.66-2.82-0.66-2.82l0.24-3.92
		l-0.36-1.14l-0.36-1.15l-7.92-1.94l-0.13-0.2l0.55,5.56c0.61,0.01,1.27,0.16,1.92,0.58c2.48,1.58,2.7,3.78,2.7,3.78l2.88,6.13
		l2.47-1.06l0.47-1.57C205.96,264.61,206.26,263.17,204.16,262.36z" />
<Path id="dehen" fill={getColor(393)} onPress={() => open(393)} d="M203.02,267.24l-4.92,2.12l-0.05,0.02c-0.16,0.05-0.27,0.11-0.32,0.14l-0.02,0.01l-3.45,1.59
		l-1.43,0.41l-0.97-2.63l-0.4-3.87l-1-6.1l2.03-1.06c0,0,1.34-1.14,3.03-1.12c0.61,0.01,1.27,0.16,1.92,0.58
		c2.48,1.58,2.7,3.78,2.7,3.78L203.02,267.24z" />

<Path id="nanavale" fill={getColor(394)} onPress={() => open(394)} d="M195.52,256.75c-1.69-0.02-3.03,1.12-3.03,1.12l-2.03,1.06l-0.04-0.25l-1.44-2.92l0.27-4.18
		l3.78-1.85l1.65-1.41l0.28,2.86l0.01,0.01L195.52,256.75z" />

<Path id="salungan" fill={getColor(290)} onPress={() => open(290)} d="M189.25,251.58l-2.29,5.56c0,0-3.38,3.12-4.28,4.41c-0.9,1.3,0.06,3.27,0.22,3.45
		c0.16,0.18,1.16,2.41,1.16,2.41v2.27h-1.16l-3.5,0.66l-3.7-0.54l-1.12-0.79c-0.4-0.92-0.9-1.6-0.9-1.6s-0.54-1.03-0.63-3.42
		c-0.03-0.76-0.74-1.44-1.7-1.99v-0.01l6.32-11.75l3.52,1.38c0,0,1.17,0.17,2.3,0.34c1.02,0.15,2,0.29,2.07,0.29
		c0.13,0,3.33-0.49,3.33-0.49L189.25,251.58z M188.26,272.62l-1.3-1.68l-1.88-1.26h-2.18l-3.5,0.66l-3.7-0.54l-1.12-0.79
		c0.22,0.49,0.41,1.05,0.48,1.6c0.21,1.59,2.22,3.93,2.22,3.93l1.86,1.02l2.26,0.25l3.06,1.44l0.62-0.03l2.05-0.09l1.94-2.65
		L188.26,272.62z" />

<Path id="kondgaon" fill={getColor(167)} onPress={() => open(167)} d="M192.83,271.53l-0.67,0.19l-3.09,2.76l-0.81-1.86l-1.3-1.68l-1.88-1.26h-1.02v-2.27
		c0,0-1-2.23-1.16-2.41c-0.16-0.18-1.12-2.15-0.22-3.45c0.9-1.29,4.28-4.41,4.28-4.41l2.29-5.56l-0.27,4.18l1.44,2.92l0.04,0.25
		l1,6.1l0.4,3.87L192.83,271.53z" />

<Path id="antroli" fill={getColor(163)} onPress={() => open(163)} d="M153.9,196.45c-1.47,1.68-3.46,0.59-5.62-0.41c-2.16-0.98-4.35,0.12-4.35,0.12
		s-2.16,0.29-2.31,0.29c-0.04,0-0.18-0.02-0.36-0.06c-0.51-0.1-1.38-0.3-1.38-0.3s-1.37-0.7-2.78-1.49
		c-1.42-0.78-0.23-2.18-0.23-2.18l1.26-1.94l1.23-1.02l2.43-3.12l1.47-1.66l3.48-1.61l1.92-0.48l2.91-0.18l1.11,0.15l1.23,1.08
		c0,0-0.19,0.37,0.28,1.04c0.48,0.67,0.36,2.75,0.19,3.98c-0.18,1.24,0.13,3.11,1,4.48C156.25,194.5,155.37,194.77,153.9,196.45z" />
<Path id="dhanep" fill={getColor(165)} onPress={() => open(165)} d="M169.19,192.52c-0.28-1.41-1.6-0.57-1.6-0.57l-1.05,0.84c0,0-0.93,1.23-0.93,1.44
		c0,0.21-1.08,0-1.08,0l-1.98-0.66l-3.09-0.18l1.62-1.8c0,0,0.18-1.32,0.18-1.41s0.39-1.68,0.39-1.68l1.59-2.73l1.11-1.92l0.18-1.33
		l0.87,0.38l1.73-0.17l-0.07,0.02l1.22,5.73l0.4,0.5l0.28,1.58L169.19,192.52z" />












<Path id="dapode" fill={getColor(187)} onPress={() => open(187)} d="M194.29,183.08l-0.27,1.22l-0.76,1.66l-2.48,3.16l-0.58,1.12l-1.76,2.25l-0.76,0.77
		c0,0-1.09,1.93-0.28,4.18c0.82,2.25,0.46,4.27,0.46,4.27h-4.96l-0.85,0.5h-2.21l0.32,1.8l0.9,2.88l0.57,2.82h-3.72l-1.2-0.65
		l-0.24-0.13c0,0-0.85-2.09-1.75-3.53c-0.59-0.93-0.44-1.89-0.26-2.45c0.1-0.32,0.21-0.51,0.21-0.51l3.91-1.26l3.2-2.3v-13.32
		l0.8,0.08l10.65-2.06L194.29,183.08z" />

<Path id="pabe" fill={getColor(175)} onPress={() => open(175)} d="M181.78,185.56v13.32l-3.2,2.3l-1.39-1.94c0,0-0.9-0.5-1.21-2.7c-0.32-2.21-2.16-3.1-2.16-3.1
    l-1.49-0.77l-1.89-0.86l-1.48-1.25l-0.28-1.58l-0.4-0.5l-1.22-5.73l0.07-0.02l0.16-0.01l0.5-0.12l1.84-0.42l1.89-1.21l1.03-1.26
    l2.17,0.67l2.7,0.32l2.38,0.27v0.9L181.78,185.56z" />

<Path id="Nigde_kd" fill={getColor(236)} onPress={() => open(236)} d="M157.44,244.82c-0.05,1.26,0,7.34,0,7.34l-1.54,5.26v0.99h-1.75l-6.71-4.1
    c0,0-0.53-0.37-1.09-0.01c-0.09-0.16-1.01-1.79-0.81-1.92s1.23-1.84,1.23-1.84v-1.8l-1.49-2.66l-0.98-3.24v-3.12l3.68,0.52
    l2.32,0.54l0.34,0.12l2.16,0.8l2.34,0.42l2.14-0.26l0.82-0.18C157.78,242.87,157.46,244.2,157.44,244.82z" />

<Path id="kamawadi" fill={getColor(254)} onPress={() => open(254)} d="M146.35,254.3c-0.24,0.15-0.49,0.44-0.71,0.96c-0.72,1.72-0.8,2.3-0.8,2.3s-1.31,3.47-4.82,1.76
    c-2.17-1.06-8.18-5.16-12.46-8.14c-0.13-2.05,3.32-3.5,3.32-3.5l1.35,1.39c0,0,2.3,0.39,2.57,0.39s3.33,0.32,3.33,0.32l2.93,1.26
    l2.11,1.34h2.37C145.34,252.51,146.26,254.14,146.35,254.3z" />

<Path id="singapur" fill={getColor(180)} onPress={() => open(180)} d="M127.53,234.52l-0.31,0.68l-2.34,1.3l-1.51,1.71l-0.15,0.87l-0.06,0.39l-2.79-0.21
    c0,0-2.28,2.79-2.34,2.88c-0.06,0.09-0.63,0.54-0.63,0.54v0.63l0.96,1.26l2.01,1.38l0.95,0.84v0.89h0.07
    c-0.51,0.09-1,0.42-1.23,1.27c-0.57,2.1,0.51,2.01-1.44,2.82c-1.95,0.81-6.69,2.51-6.69,2.51s-2.97,0.04-1.62-1.94
    c1.35-1.98,4.95-6.48,4.95-6.48s0.81-2.88-1.04-2.92c-1.84-0.05-3.64,0.67-1.7-1.13c1.93-1.8,4.4-4.9,4.4-4.9s0.49-1.46,0.02-2.36
    c0,0,3.4-0.25,7.59-2.59L127.53,234.52z M126.16,225.88l0.27-0.61l-2.52-1.33l-2.16-2.2l-1.89-1.12l-1.62-1.71l-1.76-2.72
    l-1.62,0.15l-5.08,0.76c0,0-2.48,1.18-3.24,2.21c-0.76,1.03-0.63,1.85-0.63,1.85s4.23,1.52,3.01,2.74
    c-1.21,1.22,0.14,3.01,2.3,2.12c2.16-0.9,4.05,0,4.05,0l0.67,2.6l-1.34,1.49c0,0-0.95,1.58-2.84,2.03
    c-1.89,0.45,0.36,1.89,0.36,1.89s1.08-0.14,3.51-0.18c0.76-0.02,1.18,0.28,1.41,0.7c0,0,3.4-0.25,7.59-2.59l1.78-1l-0.25-2.38
    V225.88z" />

<Path id="ghisar" fill={getColor(161)} onPress={() => open(161)} d="M133.78,211.37h-0.99l-2.52-1.15c0,0-0.61-0.45-1.65-0.48c-0.58-0.03-1.3,0.08-2.13,0.48
    c-2.28,1.11-3.75,2.1-3.75,2.1l-0.84,0.24l-0.57,1.44c0,0-0.12,1.12-0.89,0.85c-0.19-0.07-0.42-0.22-0.7-0.49
    c-1.41-1.38-2.04-2.94-2.04-2.94l-0.66-2.16c0.01-0.03,0.14-1.01,0.14-1.01l0.42-1.25l0.04-1.43l-0.7-1.23l-0.86-1.08l-1.14-0.75
    l-0.85-0.71l-0.24-0.39l0.2-0.44l1.42-0.58l1.24-0.66l1.73-1.93l1.89-1.94l2.52-2.53l0.9-0.72l0.55-0.42l4.77-0.69l1.47-0.42h1.83
    l-0.85,3.93c0,0-0.46,2.47,0.42,3.82c0.88,1.35-0.06,4.77-0.06,4.77s-0.81,0.9-0.07,1.29l-0.85,0.92c0,0-0.35,0.78,0.44,1.26
    c0.79,0.48,1.78,2.37,1.78,2.37L133.78,211.37z" />

<Path id="balwad" fill={getColor(231)} onPress={() => open(231)} d="M163.28,232.4c-0.18,0.14-0.38,0.26-0.58,0.38c-1.37,0.8-2.76,3.74-3.48,5.42
    c-0.3,0.72-0.48,1.21-0.48,1.21s-0.32,1.06-0.64,2.27l-0.82,0.18l-2.14,0.26l-2.34-0.42l-2.16-0.8l0.54-5.88v-1.77l0.9-2.96v-2.16
    l0.78-0.27h3.36l0.93,0.54l3.09,0.27l1.41,1.92L163.28,232.4z" />

<Path id="shenwadi" fill={getColor(232)} onPress={() => open(232)} d="M152.08,228.67v1.62l-0.9,2.96v1.77l-0.54,5.88l-0.34-0.12l-2.32-0.54l-3.68-0.52l-0.82-0.12
    l2.06-6.35l1.47-4.49L152.08,228.67z" />

<Path id="bhordi" fill={getColor(234)} onPress={() => open(234)} d="M130.88,247.68c0,0-3.45,1.45-3.32,3.5c-2.67-1.86-4.67-3.28-4.67-3.28s-0.42-0.2-0.95-0.25
    c-0.18-0.02-0.37-0.02-0.55,0.03h-0.07v-0.89l-0.95-0.84l-2.01-1.38l-0.96-1.26v-0.63c0,0,0.57-0.45,0.63-0.54
    c0.06-0.09,2.34-2.88,2.34-2.88l2.79,0.21l1.74,1.13l2.12,1.7l0.54,1.67l1.7,1.75L130.88,247.68z M136.24,235.57h-1.02l-0.42-0.9
    l-1.92-1.44l-1.21-1.5l-1.6-1.44l-1.26-0.67l-2.4,1.34l-1.78,1l2.9,2.56l-0.31,0.68l-2.34,1.3l-1.51,1.71l-0.21,1.26l1.74,1.13
    l2.12,1.7l0.54,1.67l1.7,1.75l1.62,1.96l1.35,1.39l0.41-3.08c0,0,0.86-1.53,0.99-1.84c0.13-0.32,1.08-2.34,1.08-2.34l1.3-3.61
    l0.75-1.09L136.24,235.57z" />

<Path id="varoti_bk" fill={getColor(181)} onPress={() => open(181)} d="M137.75,232.21l-1.51,3.36h-1.02l-0.42-0.9l-1.92-1.44l-1.21-1.5l-1.6-1.44l-1.26-0.67
    l-2.4,1.34l-0.25-2.38v-2.7l0.27-0.61l0.59-1.37l1.6-3.89v-10.27c1.04,0.03,1.65,0.48,1.65,0.48l2.52,1.15h0.99l0.63,2.33l0.24,1.5
    l0.63,0.93v1.56l0.72,4.23l0.66,3.48l-0.78,1.62l-0.15,1.98l0.54,1.02L137.75,232.21z" />
<Path id="harpude" fill={getColor(189)} onPress={() => open(189)} d="M120.44,214.85l-2.11,1.17l-1.85,0.17l-1.62,0.15l-5.08,0.76c0,0-2.48,1.18-3.24,2.21
		c-0.76,1.03-0.63,1.85-0.63,1.85s-3.03-2.24,0.87-4.16c3.9-1.92,2.52-4.68-0.36-4.14c0,0-1.71,0.49-1.86-0.07c0,0-0.13-0.77,0-0.83
		c0.14-0.06,2.57-1.77,2.57-1.77l2.68-1.32l1.94-0.65c0,0,1.18-0.15,1.23-0.15c0.04,0,1.2,0.17,1.2,0.17l2.05,1.05
		c0,0,0.79,0.01,0.81-0.03l0.66,2.16c0,0,0.63,1.56,2.04,2.94C120.02,214.63,120.25,214.78,120.44,214.85z M126.49,210.22
		c-2.28,1.11-3.75,2.1-3.75,2.1l-0.84,0.24l-0.57,1.44c0,0-0.12,1.12-0.89,0.85l-2.11,1.17l-1.85,0.17l1.76,2.72l1.62,1.71
		l1.89,1.12l2.16,2.2l2.52,1.33l0.59-1.37l1.6-3.89v-10.27C128.04,209.71,127.32,209.82,126.49,210.22z" />
<Path id="hirpodi" fill={getColor(176)} onPress={() => open(176)} d="M178.58,201.18l-3.91,1.26c0,0-0.11,0.19-0.21,0.51l-4.74-1.85l0.24-0.99l-0.51-3.27
		c0,0-0.21-1.5-0.21-3.72c0-0.22-0.02-0.41-0.05-0.57v-0.03l-0.23-1.96l1.48,1.25l1.89,0.86l1.49,0.77c0,0,1.84,0.89,2.16,3.1
		c0.31,2.2,1.21,2.7,1.21,2.7L178.58,201.18z" />
<Path id="velhe_kd" fill={getColor(186)} onPress={() => open(186)} d="M176.47,208.93l-2.01,0.06l-1.1-1.65l-1.39-0.58h-1.62l-2.29,0.35l0.43-2.05l0.6-3.78l0.63-0.18
		l4.74,1.85c-0.18,0.56-0.33,1.52,0.26,2.45C175.62,206.84,176.47,208.93,176.47,208.93z" />
<Path id="vihir" fill={getColor(164)} onPress={() => open(164)} d="M163.78,182.18l-1.67,0.54l-4.45,0.18l-2.43,0.2l-1.32,0.54c0,0-0.19,0.37,0.28,1.04
		c0.48,0.67,0.36,2.75,0.19,3.98c-0.18,1.24,0.13,3.11,1,4.48c0.87,1.36-0.01,1.63-1.48,3.31c-1.47,1.68-3.46,0.59-5.62-0.41
		l-0.34,0.71l-0.15,1.5l0.49,0.99l0.14,1.23v0.72l2.31-0.15l1.01-0.36l0.58-0.21l2.16-0.36l1.5-0.39l1.11-1.1
		c0,0,0.55-0.49,1.06-0.49c0.05,0,0.1,0.01,0.15,0.02c0.03,0,0.05,0.01,0.07,0.02c0.02,0.01,0.05,0.01,0.07,0.03
		c0.01-0.01,0.01,0,0.01,0l1.01-4.81l1.62-1.8c0,0,0.18-1.32,0.18-1.41s0.39-1.68,0.39-1.68l1.59-2.73l1.11-1.92l0.18-1.33
		L163.78,182.18z" />
<Path id="metpilavare" fill={getColor(212)} onPress={() => open(212)} d="M171.43,222.64c-1.23,2.79-1.83,3.33-1.83,3.33l-0.47,1.04c-0.97-0.26-2.4-0.39-2.86,0.91
		c-0.65,1.83-1.43,3.37-2.99,4.48l-1.63-1.81l-1.41-1.92l-3.09-0.27l-0.93-0.54h-3.36l-0.78,0.27v0.54l-5.07,0.09l0.48-0.66
		l0.12-2.52c0,0-0.57-0.78-1.47-0.15c-0.9,0.63-2.7,1.41-2.7,1.41l-1.13-0.33l-0.64-0.18c0,0-0.66-1.35-0.14-2.16
		c0.51-0.81,0.83-2.34,0.83-2.34l-0.06-1.78c0,0,0.33-0.89,1.16-0.87c0.82,0.01,1.54-0.39,2.4,0.49c0.85,0.89,1.21,1.49,1.21,1.49
		s1.58,0.97,1.92-0.23c0.06-0.23,0.13-0.55,0.2-0.92l20.95-3.46C171.1,217.27,172.66,219.85,171.43,222.64z" />
<Path id="vaje_ghera_bk" fill={getColor(210)} onPress={() => open(210)} d="M173.36,207.34l-1.39-0.58h-1.62l-2.29,0.35l-3.83,0.76l-2.57,0.64l-1.34-0.64l-1.31,0.46
		l0.05,1.78c-0.54,1.98-3.54,1.55-3.54,1.55s-1.78-0.18-1.68,0.65c0.08,0.84-0.72,1.17-0.72,1.17l-1.87-0.18l-1.37,0.36l0.15,0.52
		l-0.31,1.82c0,0-0.25,2.44-0.53,4.01l20.95-3.46c-0.96-0.72-0.3-1.14,0.87-1.05c1.17,0.09,0.57-1.35,0.57-1.35
		s-0.78-0.51-2.34-2.19c-1.56-1.68,1.74-1.44,1.74-1.44l3.06,0.6c0,0-0.03-0.84,0-1.41c0.03-0.57,0.42-0.72,0.42-0.72L173.36,207.34
		z M182.02,220.84c-1.08-0.75-1.59-1.68-2.31-4.56c-0.72-2.88-2.76-4.05-2.76-4.05l-1.44-0.93l-1.47-0.18l-3.06-0.6
		c0,0-3.3-0.24-1.74,1.44c1.56,1.68,2.34,2.19,2.34,2.19s0.6,1.44-0.57,1.35c-1.17-0.09-1.83,0.33-0.87,1.05
		c0.96,0.72,2.52,3.3,1.29,6.09c-1.23,2.79-1.83,3.33-1.83,3.33l-0.47,1.04c0.55,0.15,0.95,0.34,0.95,0.34l2.6,1.89l1.12,0.81
		c0,0,2.79-3.99,3.81-5.16c1.02-1.17,0.9,0.3,1.32,1.38c0.42,1.08,1.47,0,1.47,0l0.09-1.17c0,0-0.51-0.54-0.48-1.17
		c0.03-0.63,0.69-0.9,1.41-0.33c0.72,0.57,1.38-0.45,1.38-0.45l0.24-1.14C183.04,222.01,183.1,221.59,182.02,220.84z" />
<Path id="kanand" fill={getColor(178)} onPress={() => open(178)} d="M151.74,200.68l-1.78,5.58l-7.65,0.45c0,0,0.05-1.68,0-2.64c-0.03-0.67-0.67-0.87-1.05-0.93
		c0,0,0.89-2.19,1.49-3.36c0.6-1.17,0-1.95,0-1.95s-1.34-1.41-1.49-1.44c0.18,0.04,0.32,0.06,0.36,0.06c0.15,0,2.31-0.29,2.31-0.29
		s2.19-1.1,4.35-0.12l-0.34,0.71l-0.15,1.5l0.49,0.99l0.14,1.23v0.72l2.31-0.15L151.74,200.68z" />
<Path id="bhatti_wagadara" fill={getColor(177)} onPress={() => open(177)} d="M159.25,202.48l-0.36,1.62l-0.36,1.71l-0.14,2.1l-0.46-0.3l-3.24,0.26l-1.17,0.59
		l-2.07-0.31l-0.95-0.99l-0.54-0.9l1.78-5.58l0.58-0.21l2.16-0.36l1.5-0.39l1.11-1.1c0,0,1.56-1.39,1.89,0.53
		C159.31,201.07,159.25,202.48,159.25,202.48z" />
<Path id="nivi" fill={getColor(162)} onPress={() => open(162)} d="M142.75,199.78c-0.6,1.17-1.49,3.36-1.49,3.36c-0.16-0.03-0.28-0.03-0.28-0.03l-2.74,0.52
		c0,0-0.83,0.76-0.92,0.76c-0.09,0-2.18,0.72-2.18,0.72s-1.94,0.16-3.08-0.13c-0.1-0.03-0.18-0.06-0.25-0.09
		c-0.74-0.39,0.07-1.29,0.07-1.29s0.94-3.42,0.06-4.77c-0.88-1.35-0.42-3.82-0.42-3.82l0.85-3.93h3.27l2.49-0.6l-1.26,1.94
		c0,0-1.19,1.4,0.23,2.18c1.41,0.79,2.78,1.49,2.78,1.49s0.87,0.2,1.38,0.3c0.15,0.03,1.49,1.44,1.49,1.44
		S143.35,198.61,142.75,199.78z M142.31,206.71c0,0,0.05-1.68,0-2.64c-0.03-0.67-0.67-0.87-1.05-0.93
		c-0.16-0.03-0.28-0.03-0.28-0.03l-2.74,0.52c0,0-0.83,0.76-0.92,0.76c-0.09,0-2.18,0.72-2.18,0.72s-1.94,0.16-3.08-0.13
		c-0.1-0.03-0.18-0.06-0.25-0.09l-0.85,0.92c0,0-0.35,0.78,0.44,1.26c0.79,0.48,1.78,2.37,1.78,2.37l0.6,1.93h3.72l4.07,1.12
		l0.9-0.97L142.31,206.71z" />
<Path id="kelad" fill={getColor(235)} onPress={() => open(235)} d="M146.77,248.74v1.8c0,0-1.03,1.71-1.23,1.84h-2.37l-2.11-1.34l-2.93-1.26c0,0-3.06-0.32-3.33-0.32
		s-2.57-0.39-2.57-0.39l0.41-3.08c0,0,0.86-1.53,0.99-1.84c0.13-0.32,1.08-2.34,1.08-2.34l1.3-3.61l0.75-1.09l1.19,0.13l3.19,1.6
		l2.34,0.76l0.82,0.12v3.12l0.98,3.24L146.77,248.74z" />
<Path id="charhatwadi" fill={getColor(183)} onPress={() => open(183)} d="M159.06,210.11c-0.54,1.98-3.54,1.55-3.54,1.55s-1.78-0.18-1.68,0.65
		c0.08,0.84-0.72,1.17-0.72,1.17l-1.87-0.18l-1.37,0.36l-0.66,0.18l-0.67,0.18l-1.33-1.46l-1.48-0.63l-3.27-0.41l-0.16-4.81
		l7.65-0.45l0.54,0.9l0.95,0.99l2.07,0.31l1.17-0.59l3.24-0.26l0.46,0.3l0.62,0.42L159.06,210.11z" />
<Path id="kolambi" fill={getColor(182)} onPress={() => open(182)} d="M150.03,214.18l-0.31,1.82c0,0-0.25,2.44-0.53,4.01c-0.07,0.37-0.14,0.69-0.2,0.92
		c-0.34,1.2-1.92,0.23-1.92,0.23s-0.36-0.6-1.21-1.49c-0.86-0.88-1.58-0.48-2.4-0.49c-0.83-0.02-1.16,0.87-1.16,0.87l0.06,1.78
		c0,0-0.32,1.53-0.83,2.34c-0.52,0.81,0.14,2.16,0.14,2.16l0.64,0.18l-4.36,10.73l-1.19-0.13l-0.52-1.54l1.51-3.36l-1.48-2.19
		l-0.54-1.02l0.15-1.98l0.78-1.62l-0.66-3.48l-0.72-4.23v-1.56l-0.63-0.93l-0.24-1.5l-0.63-2.33h3.72l4.07,1.12l0.9-0.97l3.27,0.41
		l1.48,0.63l1.33,1.46l0.67-0.18l0.66-0.18L150.03,214.18z" />
<Path id="pasali" fill={getColor(233)} onPress={() => open(233)} d="M147.61,225.58l-0.12,2.52l-0.48,0.66l-1.47,4.49l-2.06,6.35l-2.34-0.76l-3.19-1.6l4.36-10.73
		l1.13,0.33c0,0,1.8-0.78,2.7-1.41C147.04,224.8,147.61,225.58,147.61,225.58z" />
<Path id="pomgaon" fill={getColor(5)} onPress={() => open(5)} d="M74.01,56.34c0-0.91-0.65,0.06-0.7-0.64c-0.05-0.7-0.48-1.5-0.48-1.5l-0.91,0.88
		c0,0-1.26,0.11-2.57-0.16c-1.32-0.27-3.86-0.13-3.86-0.13s-3.27,1.04-5.39,2.89l-2.11,1.85c-0.06,2.36-0.75,3.56-0.75,3.56v2.28
		c0,0,0.48,1.12,1.63,2.06c1.15,0.94,2.46,1.94,2.46,1.94c0.16-0.47,0.31-0.86,0.46-1.08c0.75-1.07,1.61,0.37,1.61,0.37
		s0.21,3.16,0.27,4.93c0.05,1.77,2.3,1.34,2.3,1.34l6.05-4.66l0.16-2.2l1.34-3.1l0.11-2.2l1.66-4.07
		C75.29,58.7,74.01,57.25,74.01,56.34z" />
<Path id="kumbheri" fill={getColor(4)} onPress={() => open(4)} d="M61.33,69.37c-0.61,1.81-1.38,4.76-3.29,3.53c-2.41-1.56-4.61-4.88-4.61-4.88
		s-1.82-0.64-2.03-2.25c-0.22-1.61-0.11-4.5,0.64-7.66c0.75-3.16,0.91-3.8,1.18-4.18c0.01-0.02,0.03-0.05,0.04-0.1
		c-0.03,0.16-0.16,0.88,0.39,1.15c0.61,0.29,0.8,0.5,0.8,0.5c-0.08,0.35,3,2.74,3,2.74l0.54,1.31c-0.06,2.36-0.75,3.56-0.75,3.56
		v2.28c0,0,0.48,1.12,1.63,2.06C60.02,68.37,61.33,69.37,61.33,69.37z" />
<Path id="kolawali" fill={getColor(190)} onPress={() => open(190)} d="M72.83,54.2l-0.91,0.88c0,0-1.26,0.11-2.57-0.16c-1.32-0.27-3.86-0.13-3.86-0.13
		s-3.27,1.04-5.39,2.89l-2.11,1.85l-0.54-1.31c0,0-3.08-2.39-3-2.74c0.08-0.34-0.02-1.04,1.42-1.28c1.45-0.24,2.33-0.19,3.22-1.45
		c0.88-1.26,1.9-1.85,1.9-1.85l2.25-1.36c0,0,0.4-1.07,0.53-1.93c0.14-0.86,0.81-2.2,1.37-2.57c0.56-0.38,1.85-0.91,1.85-0.91
		c2.09,1.44,2.19,3.96,2.19,3.96v2.36L72.83,54.2z" />
<Path id="visaghar" fill={getColor(2)} onPress={() => open(2)} d="M64.95,39.89c0.02-0.21,0.02-0.4,0.03-0.58l-4.65,2.17h-2.11c0,0-2,1.47-2.93,1.65
		s-2.18,2.21-2.18,2.21l-0.96,0.17c0.18,2.5,0.96,3.87,0.96,3.87s0.12,1.37,0.18,2.61c0.03,0.69,0.04,1.34,0,1.69
		c-0.01,0.04-0.01,0.08-0.02,0.12c-0.01,0.01-0.01,0.02-0.01,0.03c-0.03,0.16-0.16,0.88,0.39,1.15c0.61,0.29,0.8,0.5,0.8,0.5
		c0.08-0.34-0.02-1.04,1.42-1.28c1.45-0.24,2.33-0.19,3.22-1.45c0.88-1.26,1.9-1.85,1.9-1.85l2.25-1.36c0,0,0.4-1.07,0.53-1.93
		c0.14-0.86,0.81-2.2,1.37-2.57c0.56-0.38,1.85-0.91,1.85-0.91C64.9,42.68,64.79,42.36,64.95,39.89z" />
<Path id="Devghar" fill={getColor(1)} onPress={() => open(1)} d="M64.47,37.27l-1.45-2.89c0,0,0.06-3.43,0.16-5.47c0.11-2.03,1.29-2.25,1.29-2.25
		c0-1.44-1.5-1.98-2.25-1.66s-5.79-0.59-10.23-1.55c-4.45-0.97-5.31,0.27-5.31,0.27s0.29,6.84,1.08,6.48
		c0.05-0.02,0.1-0.04,0.17-0.05h0.01c1.14-0.2,5.35,0.62,5.35,0.62l1.04,0.79c1.03,0.78,0.6,2.57,0.28,3.42
		c-0.32,0.86-1.71,4.43-1.71,4.43c-0.73,2.46-0.86,4.51-0.75,6.1l0.96-0.17c0,0,1.25-2.03,2.18-2.21s2.93-1.65,2.93-1.65h2.11
		l4.65-2.17C65,37.4,64.47,37.27,64.47,37.27z M52.9,39.41c-0.73,2.46-0.86,4.51-0.75,6.1c0.18,2.5,0.96,3.87,0.96,3.87
		s0.11,1.26,0.17,2.45c0,0-0.92,0.01-1.61,0.65c-0.7,0.65-0.65,3.27-0.81,4.18c-0.16,0.91-1.07,1.98-1.07,1.98s0.3,1.29,0,3.11
		c-0.29,1.82-0.72,1.58-0.72,1.58l-0.54-0.37l-0.24-0.59l-0.27-1.34l-0.45-0.86c-0.38-0.94-0.89-0.64-0.89-0.64
		c-0.93-0.03-2.21-0.83-2.21-0.83s-0.71-4-0.71-5.72c0-1.71-1.72-6.85-1.72-6.85s-4-3.15-4.43-5.29s0.86-2.71,5-5.43
		c4.15-2.71,5.15-5.21,5.15-5.21l0.17-0.05h0.01c1.14-0.2,5.35,0.62,5.35,0.62l1.04,0.79c1.03,0.78,0.6,2.57,0.28,3.42
		C54.29,35.84,52.9,39.41,52.9,39.41z" />
<Path id="ambavne" fill={getColor(3)} onPress={() => open(3)} d="M49.18,64.14l-0.11-0.81l-0.54-0.37l-0.24-0.59l-0.27-1.34l-0.45-0.86
		c-0.38-0.94-0.89-0.64-0.89-0.64c-0.93-0.03-2.21-0.83-2.21-0.83s-0.71-4-0.71-5.72c0-1.71-1.72-6.85-1.72-6.85s-4-3.15-4.43-5.29
		c0,0-0.85-0.14-1.64,0.93s-1.79,2.79-1.79,2.79l-2.21,4.78c0,0-2,3.07-3.14,4.07c-0.11,0.1-1.01,1.27-1.87,2.43h1.01l0.96,1.47
		c0,0,0.33,0.71,1.4,1.42c1.07,0.72,2.28,0.36,2.28,0.36s0.4-0.64,1.68-0.07c1.29,0.57,2.29,0.32,2.29,0.32l1.71-0.75
		c0,0,1.29-0.36,1.93,0.32s0.5,3.61,0.5,3.61s0.91,2.09,1.11,2.25l0.13,0.39l0.15-0.57h3.36c0,0,1.14-0.75,2.14-0.32
		S49.3,64.94,49.18,64.14z" />
<Path id="majegaon" fill={getColor(43)} onPress={() => open(43)} d="M41.83,64.77c-0.2-0.16-1.11-2.25-1.11-2.25s0.14-2.93-0.5-3.61s-1.93-0.32-1.93-0.32
		l-1.71,0.75c0,0-1,0.25-2.29-0.32c-1.28-0.57-1.68,0.07-1.68,0.07s-1.21,0.36-2.28-0.36c-1.07-0.71-1.4-1.42-1.4-1.42l-0.96-1.47
		h-1.01c-0.82,1.1-1.6,2.21-1.63,2.36c-0.14,0.62-0.19,1.1,0.07,1.55c0.15,0.28,0.42,0.54,0.86,0.81c1.14,0.71,3.38,5.35,5.15,6.78
		c0,0,0.56,1.86,2.06,1.57l1.5-0.28c0,0,0.57-0.93,1.57-0.72l1,0.22c0,0,2.5,0.21,2.93-0.72s1.29-1.5,1.29-1.5l0.2-0.75L41.83,64.77
		z" />
<Path id="salter" fill={getColor(44)} onPress={() => open(44)} d="M37.31,69.89l0.23-1.76l-1-0.22c-1-0.21-1.57,0.72-1.57,0.72l-1.5,0.28
		c-1.5,0.29-2.06-1.57-2.06-1.57c-1.77-1.43-4.01-6.07-5.15-6.78c-0.44-0.27-0.71-0.53-0.86-0.81l-1.22-0.84
		c0,0-2.14-0.55-2.51,0.42c-0.38,0.98-0.54,0.65-0.81,3.06c-0.27,2.42-0.43,6.86-0.43,6.86l1.77,0.32c0,0,0.81-0.26,2.09,0.54
		c1.29,0.8,3.8,2.68,3.8,2.68l1.88,0.91l4.55,0.53l0.29,0.04l3.03,0.45L37.31,69.89z" />
<Path id="bharpe_bk" fill={getColor(42)} onPress={() => open(42)} d="M61.04,78.89l-1.47-1.12l-2.98-2.46l-0.91-0.33l-0.7-0.53c0,0-1.71-1.82-1.81-2.52
		c-0.11-0.7-2.31-2.73-2.31-2.73l-2.46-1.45l-1.5-1.55h-2.68l-0.8-1.04l0.37-0.57h-1.68l-0.15,0.57l-0.2,0.75
		c0,0-0.86,0.57-1.29,1.5s-2.93,0.72-2.93,0.72l-0.23,1.76l0.53,4.83l0.7,0.26h3.7c0,0,2.09-0.39,3.21,0
		c1.13,0.38,2.34,0.91,3.74,1.77c1.4,0.86,3.6,2.84,3.6,2.84l2.41,2.47l1.56-0.92c0,0,0.58-0.58,1.66-0.64
		c1.07-0.05,4.39-0.05,4.39-0.05L61.04,78.89z" />
<Path id="tail_bailla" fill={getColor(45)} onPress={() => open(45)} d="M41.3,95.29c-0.35,0.69-1.58,1.77-2.14,2.03c-0.57,0.27-1.85,0.86-1.85,0.86l-0.9,1.12
		l-0.39-0.37l-4.07-4.12l-2.46,1.5c0,0-2.04-0.43-2.52-2.41c-0.48-1.99,0.54-2.47,0.54-2.47s1.66-1.98,3-4.66l2.25-2.41l-0.38-1.5
		l-2.14,2.3l-1.88,0.16l-2.68-1.12c0,0,0,1.71-0.47,3.05c-0.46,1.34-2.53,1.34-2.53,1.34l-1.5-2.3c-1.5-2.31-2.78-2.41-3.67-3.22
		c-0.89-0.8-0.61-1.6-0.5-4.12c0.1-2.52,1.12-2.52,1.12-2.52l1.13-3.11l1.17-4.07l1.77,0.32c0,0,0.81-0.26,2.09,0.54
		c1.29,0.8,3.8,2.68,3.8,2.68l1.88,0.91l4.55,0.53l0.29,0.04L34.9,79l-1.13,3.06c0,0,0,0.85,1.34,1.12c1.34,0.27,1.56,1.23,2.2,2.57
		c0.64,1.34,0.32,2.68,0.32,2.68l0.64,2.25l1.02,1.34c0,0-0.48-0.21,0.38,0.8C40.52,93.84,41.66,94.59,41.3,95.29z" />
<Path id="ghutke" fill={getColor(47)} onPress={() => open(47)} d="M51.4,104.56l-2.14-2.08c-2.15-2.07-1.15-2.64-1.15-2.64l0.07-0.93l0.66-2.78v-2.29
		c0,0-0.51-2.36-0.8-3.57c-0.28-1.21-1.25-3.02-1.25-3.02l-1.77,1.77l-2.51,1.45l-3.22,1.55c0,0-0.48-0.21,0.38,0.8
		c0.85,1.02,1.99,1.77,1.63,2.47c-0.35,0.69-1.58,1.77-2.14,2.03c-0.57,0.27-1.85,0.86-1.85,0.86l-0.9,1.12l5.51,5.26l2.62,1.28
		c0,0,0.7,0,1.88,1.77l1.17,1.77h4.02l0.65-0.91v-2.57L51.4,104.56z" />
<Path id="adgaon" fill={getColor(48)} onPress={() => open(48)} d="M62.13,86.07c-0.32-0.9-0.93-1.55-0.93-1.55s-1.55-1.45-3.21-0.8c-1.66,0.64-4.45,1.34-5.79,1.39
		l-1.34,0.05c0,0,0.38,1.24,0.27,2.31c-0.11,1.07-1.07,1.12-1.07,1.12s-1.18-0.37-1.07-0.75c0.05-0.17-0.04-1.12-0.16-2.09
		l-0.75,0.22l-1.29,1.28c0,0,0.97,1.81,1.25,3.02c0.29,1.21,0.8,3.57,0.8,3.57v2.29l-0.66,2.78l-0.07,0.93c0,0-1,0.57,1.15,2.64
		l2.14,2.08l3.59-3c3.8-3.91,4.77-3.97,4.18-6.06c-0.59-2.09-0.86-3.75-0.86-3.75s1.55-2.09,1.55-2.19c0-0.11,1.72-0.06,2.31-1.72
		C62.39,87.22,62.31,86.61,62.13,86.07z" />
<Path id="bhambarde" fill={getColor(46)} onPress={() => open(46)} d="M55.2,82.06l-1.61,0.53c0,0-2.89-0.59-3.74-0.27c-0.84,0.33-1.29,1.23-1.29,1.23
		s0.15,1.11,0.27,2.2l-0.75,0.22l-1.29,1.28l-1.77,1.77l-2.51,1.45l-3.22,1.55l-1.02-1.34l-0.64-2.25c0,0,0.32-1.34-0.32-2.68
		c-0.64-1.34-0.86-2.3-2.2-2.57c-1.34-0.27-1.34-1.12-1.34-1.12L34.9,79l-0.09-4.73l3.03,0.45l0.7,0.26h3.7c0,0,2.09-0.39,3.21,0
		c1.13,0.38,2.34,0.91,3.74,1.77c1.4,0.86,3.6,2.84,3.6,2.84L55.2,82.06z" />
<Path id="warak" fill={getColor(395)} onPress={() => open(395)} d="M83.73,118.11l-2.95,0.43c0.04,0.38-0.14,0.8-0.41,1.2c-0.55,0.82-1.44,1.53-1.44,1.53l-2.46,3.32
		l-5.68,6.43c0,0-0.32,0.73-0.21,1.42c0.06,0.36,0.23,0.71,0.64,0.94c1.18,0.64,2.79,0.96,2.79,0.96l1.28,0.54l0.86,0.96
		c1.02-0.19,2.57-0.24,2.57-0.24s0.83-0.94,0.99-1.18c0.16-0.24,1.65,0.58,1.65,0.58l1.22-1.73l1.91,0.33l2.05-16.72L83.73,118.11z" />
<Path id="nive" fill={getColor(76)} onPress={() => open(76)} d="M80.76,118.38c-0.33-1.18-4.41-0.54-4.41-0.54l-1.06-2.57v-1.82c0,0,0.92-2.26,1.04-3.83h0.01
		c0.04-0.51-0.01-0.95-0.19-1.21c-0.75-1.07-3.11-1.5-3.11-1.5l-0.2,0.06l-4.94,1.34l-5.6-0.54l-3.62,2.14c0,0-1.71,3.32-1.71,6.43
		v3.11l0.56-0.56h0.9l1.18,0.85l0.6,0.19c0,0,0.64,0.3,2.14,0.46c1.5,0.16,5.07,0.61,6.11,0.56c1.05-0.06,4.5-0.67,4.5-0.67
		l7.41-0.54c0.27-0.4,0.45-0.82,0.41-1.2C80.78,118.49,80.77,118.43,80.76,118.38z" />
<Path id="adharwadi" fill={getColor(99)} onPress={() => open(99)} d="M80.37,119.74c-0.55,0.82-1.44,1.53-1.44,1.53l-2.46,3.32l-5.68,6.43c0,0-0.32,0.73-0.21,1.42
		l-15.14,0.67c0.29-3.35,0.75-8.94,0.67-10.77c-0.1-2.68,0.86-2.89,0.86-2.89l0.56-0.56h0.9l1.18,0.85l0.6,0.19
		c0,0,0.64,0.3,2.14,0.46c1.5,0.16,5.07,0.61,6.11,0.56c1.05-0.06,4.5-0.67,4.5-0.67L80.37,119.74z" />
<Path id="tamhni_bk" fill={getColor(100)} onPress={() => open(100)} d="M80.54,136.16l0.82-1.16c0,0-1.49-0.82-1.65-0.58c-0.16,0.24-0.99,1.18-0.99,1.18
		s-1.55,0.05-2.57,0.24l-0.86-0.96l-1.28-0.54c0,0-1.61-0.32-2.79-0.96c-0.41-0.23-0.58-0.58-0.64-0.94l-15.14,0.67
		c-0.14,1.55-0.24,2.62-0.24,2.62s-1.77-1.82-2.3,0.97c-0.54,2.78,2.57,20.36,2.57,20.36h2.68c0,0-0.75,1.5,0.96,0.53
		c1.72-0.96,3.65-4.07,3.65-4.07s1.07-0.86,1.6-0.21c0.54,0.64,0.32,3.32,1.07,3.42c0.13,0.02,0.26,0,0.4-0.03
		c0.7-0.19,1.54-0.93,2.07-0.93c0.64,0,3.75-10.39,3.75-10.39l2.03-0.97l0.75-1.39l4.83,0.75l1.82-1.18l1.5-2.57L80.54,136.16z" />
<Path id="dhokalwadi" fill={getColor(98)} onPress={() => open(98)} d="M90.56,116.31h-2.09l-1.93,0.57l-2.05,16.72l1.19,0.21c0,0,1.5,0.21,2.9-1.61
		c1.39-1.82,4.18-5.04,4.18-5.04s0.85-1.93,1.28-2.25L90.56,116.31z" />
<Path id="shirvali" fill={getColor(6)} onPress={() => open(6)} d="M94.36,64.59c-0.53-0.53-3,0-3,0l-4.5-1.25L75.29,58.7l-1.66,4.07l-0.11,2.2l-1.34,3.1
		l-0.16,2.2l0.81-0.05l0.91-0.65l0.85-0.48l0.7-1.55l1.82-3.59l0.65,0.64l0.32,0.8l2.25,1.82l0.43,0.49h1.12l0.8,0.53l0.49,1.34
		h0.59l1.07-0.59l2.03-0.26l2.63-0.91l3.43-1.5l1.62-1.46C94.48,64.74,94.42,64.65,94.36,64.59z" />
<Path id="chandvali" fill={getColor(7)} onPress={() => open(7)} d="M94.54,64.85l-1.62,1.46l-3.43,1.5l-2.63,0.91l-2.03,0.26l-1.07,0.59l0.26,0.7l0.22,1.87
		l1.23,1.45l0.91,0.7c-0.32-0.54,1.88-1.02,1.88-1.02l2.57-0.54l1.82-1.07c0.75-0.64,2.68-3.53,2.68-3.53S94.99,65.75,94.54,64.85z" />
<Path id="nandivali" fill={getColor(40)} onPress={() => open(40)} d="M97.79,75.63l-3.64-2.44c0,0-2.25-0.88-1.5-1.53l-1.82,1.07l-2.57,0.54c0,0-2.2,0.48-1.88,1.02
		c0,0,0.91,2.41,0.48,2.73c0,0-2.46,2.73-2.84,2.41c-0.65,0.86,1.18,2.2,1.18,2.2l1.78-0.86l0.53,0.43l0.42,1.82h1.08l0.53,0.48
		l0.81,2.09c0,1.13,2.57,0,2.57,0l1.12-1.55l2.47-1.56l2.41-1.44l0.8-1.98v-3L97.79,75.63z" />
<Path id="valne" fill={getColor(49)} onPress={() => open(49)} d="M124.26,78.2c0,0,0.21,0.32-2.47,0s-7.07,0-7.07,0l-2.81,1.26v3.29l1.12,0.16h13.48l1.07-3.21
		L124.26,78.2z M111.61,79.59l-5.03-0.64l-6.86,0.11l-0.8,1.98l-2.41,1.44l-2.47,1.56l-1.12,1.55l0.17,0.36h0.47l0.93-0.18
		l1.55-0.11c0.32-0.14,1.72,0.72,1.72,0.72l1.1,1l1.66-0.06l0.72-0.55l1.35-1.3c0.08-0.36,1.42-0.06,1.42-0.06l1.58,2.4l2.18-1.22
		l1.38-0.78l2.76-3.06v-3.29L111.61,79.59z" />
<Path id="lavharde" fill={getColor(103)} onPress={() => open(103)} d="M126.93,127.06l-0.32-0.79l-0.28-0.86v-1.78l-0.93-2.72l-0.57-2.21l-1.32-1.93l-5.15,0.43
		l-3.43-1.39l-0.25,1.84l-0.35,4.48l0.28,3.71l2.43,1.22l2.29,1.12l1.85-0.59l1.4,0.56l0.93,0.37l0.89-0.25l1.28,0.5l0.5-0.36
		l1.15-0.14L126.93,127.06z" />
<Path id="dattawadi" fill={getColor(80)} onPress={() => open(80)} d="M122.89,106.7l-0.31-2.14l-12.09,0.98l-0.38,3.3c0.96,3.22,0,3.54,0,3.54l0.32,1.01l0.75,2.42
		h3.75l3.43,1.39l5.15-0.43v-1.71l0.42-1.08L122.89,106.7z" />
<Path id="dattawadi" fill={getColor(80)} onPress={() => open(80)} d="M122.89,106.7l-0.31-2.14l-12.09,0.98l-0.38,3.3c0.96,3.22,0,3.54,0,3.54l0.32,1.01l0.75,2.42
		h3.75l3.43,1.39l5.15-0.43v-1.71l0.42-1.08L122.89,106.7z" />
<Path id="vandre" fill={getColor(77)} onPress={() => open(77)} d="M81.34,100.36L81.34,100.36l-0.21,1.44l-0.43,2.84l-0.51,0.85l-0.67,4.13
		c-0.8,0.83-1.6,0.32-1.6,0.32l-1.58-0.32c0.04-0.51-0.01-0.95-0.19-1.21c-0.75-1.07-3.11-1.5-3.11-1.5l-0.2,0.06l-0.79-1.93v-1.82
		l0.67-1.77c0,0,1.58-0.22,1.77-0.75c0.19-0.54,0.83-0.51,0.83-0.51l0.69-1.18l1.05-0.08l1.61-0.13l2.11-1.32L81.34,100.36z" />
<Path id="pimpri" fill={getColor(75)} onPress={() => open(75)} d="M77.47,94.51c-1.07,1.33-2.93,1.9-2.93,1.9l-1,1.9l-1,1.32l0.18,1.82l-0.67,1.77v1.82l0.79,1.93
		l-4.94,1.34l-5.6-0.54l-3.62,2.14l-2.03-0.53l-1.45,2.35l-1.77,1.93l-3.1,1.82c0,0-1.61,3.22-2.15,2.52c-0.53-0.69-2.46-0.48-3.7,0
		l1.24,1.66l0.43,1.18l-0.86,0.75c0,0-0.53-0.96-0.96-1.18c-0.42-0.21-0.97,0.32-0.97,0.32l0.54,1.4c0,0-0.54,2.46-0.97,2.35
		c-0.42-0.1-0.85,0-0.93,0.54c-0.07,0.54-0.63,1.61-0.63,1.61l-2.94-1.07l-2.02-1.72c0,0-0.01-2.57,0-4.61l0.95-1.17
		c0,0,1.07,1.6,1.29,2.25c0.21,0.64,1.61,0.64,1.61,0.64s0-1.5,0-2.39c0-0.89,1.82-0.5,2.89-0.08c1.07,0.43,0-1.17,0-1.17
		s-0.86-1.4-1.78-2.68c-0.92-1.29,0.92-1.5,2.21-1.5c1.28,0,2.25-0.11,3.21-0.86s0.8-2.89,0.8-2.89h4.02l0.65-0.91v-2.57l-0.86-1.34
		l3.59-3c3.8-3.91,4.77-3.97,4.18-6.06c-0.59-2.09-0.86-3.75-0.86-3.75s1.55-2.09,1.55-2.19c0-0.11,1.72-0.06,2.31-1.72
		c0.22-0.62,0.14-1.23-0.04-1.77h1.7c0,0,2-0.44,1.85,1.63c-0.14,2.07-0.71,4.86,1.5,3.21c2.22-1.64,2.22-2.71,3.11-1.46
		s1.32,1.11,0,2.57s-1.32,1.46-1.32,1.46s-0.79,1.86,1.32,0.58c2.11-1.29,6.04-1.5,6.04-1.5S78.54,93.18,77.47,94.51z" />
<Path id="tata_talav" fill={getColor(396)} onPress={() => open(396)} d="M102.72,101.45l0.05,4.5l-2.97,3.48l-0.56-0.72l-3.54-1.8l-2.73-1.23l-2.73-0.14l-0.4-0.02
		l-4.26-2.17l-2.23-1.79h-1.12l-0.87-1.08l-0.02-0.11v-0.01l-0.56-2.88l-2.11,1.32l-1.61,0.13l2.3-2.41c0,0,1.82-1.45,2.57-1.77
		s1.08,1.29,1.08,1.29v1.93c0,0,0.26,1.44,0.69,2.39c0.43,0.95,1.29-0.25,1.29-0.25s0.59-2.04,0.1-3.8c-0.48-1.77,0.75-2.58,1.83-3
		c1.07-0.43,3.4,0.43,3.4,0.43l3.72-1.29l3.11-0.91l0.48,1.82c0,0-1.34,1.82-2.25,2.36c-0.91,0.53,0.64,0.91,0.7,0.96
		c0.16,0,3.72-1.61,3.72-1.61h2.71c0,0,0.37,4.72,0.8,5.29C103.74,100.94,102.72,101.45,102.72,101.45z" />
<Path id="vadgaon_1_" fill={getColor(79)} onPress={() => open(79)} d="M99.8,109.43v2.33l-2.04,1.58l-1.74,0.43l-1.76,0.51l-2.09,0.99l-1.85,1.04l-2.47-5.62v-2.38
		l0.41-1.77l0.83-0.54l1.15-0.46l2.73,0.14l2.73,1.23l3.54,1.8L99.8,109.43z" />
<Path id="waghwadi" fill={getColor(78)} onPress={() => open(78)} d="M90.32,116.31h-1.85l-1.93,0.57l-2.81,1.23l-2.95,0.43c0-0.05-0.01-0.11-0.02-0.16
		c-0.33-1.18-4.41-0.54-4.41-0.54l-1.06-2.57v-1.82c0,0,0.92-2.26,1.04-3.83h0.01l1.58,0.32c0,0,0.8,0.51,1.6-0.32l0.67-4.13
		l0.51-0.85l0.43-2.84l0.21-1.43l0.02,0.11l0.87,1.08h1.12l2.23,1.79l4.26,2.17l0.4,0.02L89.09,106l-0.83,0.54l-0.41,1.77v2.38
		L90.32,116.31z" />
<Path id="ekole" fill={getColor(72)} onPress={() => open(72)} d="M110.43,113.39l-0.32-1.01l-1.39-1.45h-1.07l-1.72-0.43l-6.13-1.07v2.33l-2.04,1.58l-1.74,0.43
		l-1.76,0.51l-2.09,0.99l-1.85,1.04h0.24l3.48,8.6c0.43-0.32,2.79-1.18,2.79-1.18l3.43-2.67l3.1,2.25l2.04-1.08l0.86-3.32l3-0.91
		l1.92-2.19L110.43,113.39z" />
<Path id="shedani" fill={getColor(41)} onPress={() => open(41)} d="M86.38,74.29l-0.91-0.7l-1.23-1.45l-0.22-1.87l-0.26-0.7h-0.59l-0.97,0.22L80.22,70
		c-0.54,0.16-1.77,2.36-1.77,2.36c-0.43,0.32,1.66,2.36,1.66,2.36l1.98,0.26l0.38,1.89l0.81,1.54l0.74,1.02
		c0.38,0.32,2.84-2.41,2.84-2.41C87.29,76.7,86.38,74.29,86.38,74.29z" />
<Path id="sambhave" fill={getColor(74)} onPress={() => open(74)} d="M125.97,90.39l-2.04-0.94l-3.09,0.2l-3.44,0.23c0,0-1.39-4.24-3.11-5.6
		c-1.71-1.37-1.71-1.37-1.71-1.37h0.45l-1.12-0.16l-2.76,3.06l-1.38,0.78l-0.3,2.86v2.53l1.43,2.43l1.78,0.66l2.36,1.91l4.36,1.36
		l3.28,1.29l0.94-0.43l4.67-5.14l0.64-3.22L125.97,90.39z" />
<Path id="bhadas_bk" fill={getColor(73)} onPress={() => open(73)} d="M112.58,82.91c0,0,0,0,1.71,1.37c1.72,1.36,3.11,5.6,3.11,5.6l3.44-0.23l3.09-0.2l2.04,0.94
		l-0.43-3.14c-0.35-0.6,0.18-2.29,0.58-3.37h0.01c0.2-0.57,0.38-0.97,0.38-0.97H112.58z" />
<Path id="walen" fill={getColor(39)} onPress={() => open(39)} d="M105.51,71.07c-0.27,0-2.36-1.87-2.36-1.87c-0.54-0.1-1.2-1.47-1.32-1.52h-0.01c0,0,0,0,0,0.01
		c-0.01,0.01-0.01,0.01-0.01,0.01c0,0.27-3.75,3-3.75,3h-1.39c-0.97-0.32-1.34-2.57-1.34-2.57s-1.93,2.89-2.68,3.53
		c-0.75,0.65,1.5,1.53,1.5,1.53l3.64,2.44l1.93,0.43l1.47-1.08c0,0,1.64-0.53,1.85-0.69c0.22-0.16,1.98-0.43,1.98-0.43
		c0.38,0.32,2.04-1.5,2.04-1.5L105.51,71.07z" />
<Path id="kolwan" fill={getColor(37)} onPress={() => open(37)} d="M113.43,67.43l-0.85-0.16v-1.13l-0.67-0.32l-3.24,0.27l-4.24,0.64c-1.33-0.24-2.44,0.79-2.6,0.95
		c0.12,0.05,0.78,1.42,1.32,1.52c0,0,2.09,1.87,2.36,1.87l1.55,1.29l1.66,0.27l2.14-0.27l0.75-0.49l0.7,0.49l1.02-0.27l1.82-0.43
		l0.05-0.48l1.18-1.29L113.43,67.43z" />
<Path id="hadashi" fill={getColor(8)} onPress={() => open(8)} d="M111.24,63.41l-0.55-2.88l-0.2-1.08l-1.93-3.59c0-0.7-2.2-3.27-2.2-3.27v-3.64l1.61-0.27
		l4.02-0.37l-1.18-1.67l-0.8-2.25c-0.33-1.12-1.53-2.36-1.53-2.36c-0.51,0.36-0.88,0.65-0.88,0.65c-0.75,0-5.04,4.5-5.04,4.5
		l-3.32,3.86c-0.86,0.69-0.48,3.27-0.48,3.27c0.21,1.44-0.7,4.92-0.7,4.92l-1.88,3.81l-1.82,1.55c0.06,0.06,0.12,0.15,0.18,0.26
		c0.45,0.9,0.79,3.28,0.79,3.28s0.37,2.25,1.34,2.57h1.39c0,0,3.75-2.73,3.75-3c0,0,0,0,0.01-0.01c0-0.01,0-0.01,0-0.01h0.01
		c0.16-0.16,1.27-1.19,2.6-0.95l4.24-0.64l3.24-0.27c0,0,0-0.01-0.01-0.04L111.24,63.41z" />
<Path id="kashig" fill={getColor(11)} onPress={() => open(11)} d="M121.47,54.79v-1.34l-1.34-1.82c-1.61-1.29-2.03-3.11-2.03-3.11l0.64-2.09l-0.97-1.5l1.02-1.98
		c0.7-0.54-0.43-1.13-0.43-1.13l-1.98-1.23h-5.03c-0.59-0.07-1.96,0.8-2.87,1.44c0,0,1.2,1.24,1.53,2.36l0.8,2.25l1.18,1.67v3.05
		l1.34,1.23l1.65,2.54l0.81-0.99l0.81,0.06l0.75,0.91C122.01,55.22,121.47,54.79,121.47,54.79z" />
<Path id="shindewadi_2_" fill={getColor(10)} onPress={() => open(10)} d="M114.98,55.13l-1.65-2.54l-1.34-1.23v-3.05l-4.02,0.37l-1.61,0.27v3.64
		c0,0,2.2,2.57,2.2,3.27l1.93,3.59l0.2,1.08l1.89-1c0.54-0.45,0-2.65,0-2.65L114.98,55.13z" />
<Path id="andhale" fill={getColor(12)} onPress={() => open(12)} d="M128.11,45.51l-3.53-1.38l-3.97-2.1l-2.25-0.21c0,0,1.13,0.59,0.43,1.13l-1.02,1.98l0.97,1.5
		l-0.64,2.09c0,0,0.42,1.82,2.03,3.11l1.34,1.82v1.34l3.11-0.59c0,0,1.7-0.53,2.35,0c0.65,0.53,0.65,0,0.65,0v-3.32l1.82-1.61
		l2.03-1.41l1.72-1.7v-0.65H128.11z" />
<Path id="bhalgudi" fill={getColor(9)} onPress={() => open(9)} d="M124.58,54.2l-3.11,0.59c0,0,0.54,0.43-4.12,0.32l-0.75-0.91l-0.81-0.06l-0.81,0.99l-2.4,1.75
		c0,0,0.54,2.2,0,2.65l-1.89,1l0.55,2.88l0.63,2.24c-0.04-0.26-0.04-0.63,0.71,0.49c1,1.5,3.8-0.98,3.8-0.98v-2.77l4.57-2.56
		l0.54-0.3C126.79,59.08,124.58,54.2,124.58,54.2z" />
<Path id="sathesai" fill={getColor(36)} onPress={() => open(36)} d="M120.95,66.74v-6.91l-4.57,2.56v2.77c0,0-2.8,2.48-3.8,0.98v1.13l0.85,0.16l2.95,2.46l2.38,0.81
		c0.42,0.43,2.73,0,2.73,0C121.51,69.27,120.95,66.74,120.95,66.74z" />
<Path id="dongargaon" fill={getColor(38)} onPress={() => open(38)} d="M121.49,70.7c0,0-2.31,0.43-2.73,0l-2.38-0.81l-1.18,1.29l-0.05,0.48l-1.82,0.43l-1.02,0.27
		l-0.7-0.49l-0.75,0.49l-2.14,0.27l-1.66-0.27c0,0-1.66,1.82-2.04,1.5c0,0-1.76,0.27-1.98,0.43c-0.21,0.16-1.85,0.69-1.85,0.69
		l-1.47,1.08v3l6.86-0.11l5.03,0.64l0.3-0.13l2.81-1.26c0,0,4.39-0.32,7.07,0l0.25-2.14l0.67-1.08v-1.79l1.22-2.3L121.49,70.7z" />
<Path id="katarkhadak" fill={getColor(13)} onPress={() => open(13)} d="M138.9,46.13c-1.43-0.86-5.75-0.62-5.75-0.62v0.65l-1.72,1.7l-2.03,1.41l-1.82,1.61v3.32
		l1.18,2.17c1.42,0.23,3.28,3.16,3.28,3.16c0.72-0.03,4.43,2.17,4.43,2.17l1.29-3l2-5.7l1.71-4.69L138.9,46.13z" />
<Path id="khamboli" fill={getColor(14)} onPress={() => open(14)} d="M147.04,50.41c-0.71,1-5.57-2.1-5.57-2.1L139.76,53l-2,5.7l-1.29,3l1,1.64l1.71,2.02l1.72-3.66
		l4-3.86l0.93-1l2.5-2.7C148.47,53.01,147.04,50.41,147.04,50.41z" />
<Path id="pimpaloli" fill={getColor(15)} onPress={() => open(14)} d="M152.76,52.41c-1.86-2.14-5.72-2-5.72-2s1.43,2.6,1.29,3.73l-2.5,2.7l1.21,1.86
		c0.71-0.43,2.29,3,2.29,3l1.28-1.32l3.29-3.54l2.43-2.05L152.76,52.41z" />
<Path id="padalgharwadi" fill={getColor(16)} onPress={() => open(16)} d="M157.04,60.53l1.72-3.69l-2.43-2.05l-2.43,2.05l-3.29,3.54l-1.28,1.32
		c0,0,1.71,3.47,2.43,3.66c0,0,4.29,1.62,4.57,3.34c0.18,1.07,0.63-0.86,0.95-2.45c0.19-0.95,0.33-1.77,0.33-1.77
		S156.33,60.65,157.04,60.53z" />
<Path id="jawal" fill={getColor(31)} onPress={() => open(31)} d="M147.04,58.7l-1.21-1.86l-0.93,1l-4,3.86l-1.72,3.66l1.72,0.46c1.27,1.41,1.5,3.4,1.5,3.4l1.5,0.67
		l3-4.07l2.43-4.12C149.33,61.7,147.75,58.27,147.04,58.7z" />
<Path id="kemasewade" fill={getColor(32)} onPress={() => open(32)} d="M155.63,71.87l0.7-3.17c-0.28-1.72-4.57-3.34-4.57-3.34c-0.72-0.19-2.43-3.66-2.43-3.66
		l-2.43,4.12l-3,4.07c0,0,0,0.63,1.93,3.43h2.51l0.43,0.33l3.13,2.41l3.14,1.35C155.04,77.41,156.5,72.18,155.63,71.87z" />
<Path id="nandgaon_1_" fill={getColor(35)} onPress={() => open(35)} d="M128.76,56.37l-1.18-2.17c0,0,0,0.53-0.65,0c-0.65-0.53-2.35,0-2.35,0s2.21,4.88-3.09,5.33
		l-0.54,0.3v6.91c0,0,0.56,2.53,0.54,3.96l2.44,0.19l4.54,0.98l0.71-6.09c0-1.49,2.86-6.25,2.86-6.25S130.18,56.6,128.76,56.37z" />
<Path id="chikhalgaon_1_" fill={getColor(34)} onPress={() => open(34)} d="M136.47,61.7c0,0-3.71-2.2-4.43-2.17c0,0-2.86,4.76-2.86,6.25l-0.71,6.09
		c0,0,0.57-1.25,2.71-0.21c0,0,2.97,1.67,3.34,2.85c0,0,1.52-0.62,1.09-5.5L136.47,61.7z" />
<Path id="hotale" fill={getColor(50)} onPress={() => open(50)} d="M131.18,71.66c-2.14-1.04-2.71,0.21-2.71,0.21l-4.54-0.98l-1.22,2.3v1.79l-0.67,1.08l-0.25,2.14
		c2.68,0.32,2.47,0,2.47,0l3.32,1.5l0.89-3.64C127.76,74.71,131.18,71.66,131.18,71.66z" />
<Path id="nanegaon" fill={getColor(51)} onPress={() => open(51)} d="M151.08,82.06c-1.47,0.82-3.14,0.74-4.35,0.5c-1-0.19-1.69-0.5-1.69-0.5l-3.57-3.11l-2.29-0.89
		l-2.71-2c-0.43-1.78-1.95-1.55-1.95-1.55c-0.37-1.18-3.34-2.85-3.34-2.85s-3.42,3.05-2.71,4.4l-0.89,3.64h4.46l2.03,0.89l1.54,0.68
		l3.57,1.48c1.42,0.34,3.22,2.52,3.22,2.52l2.64,2.54l3.3-1.16l1.77,2.19c0.35,0.3,0.65,0.48,0.91,0.58
		c1.49,0.59,1.59-1.61,1.59-1.61l1.43-2.97L151.08,82.06z" />
<Path id="kule" fill={getColor(33)} onPress={() => open(33)} d="M140.9,65.82l-1.72-0.46l-1.71-2.02l-1-1.64l-0.86,7.31c0.43,4.88-1.09,5.5-1.09,5.5
		s1.52-0.23,1.95,1.55l2.71,2l2.29,0.89l0.85-8.79c0.01-0.13,0.02-0.25,0.03-0.35c0-0.05,0.01-0.1,0.01-0.15
		c0.01-0.12,0.02-0.23,0.03-0.3v-0.07l0.01-0.07C142.4,69.22,142.17,67.23,140.9,65.82z" />
<Path id="dakhane" fill={getColor(52)} onPress={() => open(52)} d="M148.77,73.65l-0.43-0.33h-2.51c-1.93-2.8-1.93-3.43-1.93-3.43l-1.5-0.67l-0.01,0.07v0.07
		c-0.01,0.07-0.02,0.18-0.03,0.3c0,0.05-0.01,0.1-0.01,0.15c-0.01,0.1-0.02,0.22-0.03,0.35l-0.85,8.79l3.57,3.11
		c0,0,0.69,0.31,1.69,0.5l-0.19-1.22c-0.36-0.64,0.78-1.75,0.78-1.75c0.13-0.75,0.01-2.18,0.01-2.18c-0.15-0.5,1.44-1.78,1.44-1.78
		C149.36,74.98,148.77,73.65,148.77,73.65z" />
<Path id="chale" fill={getColor(53)} onPress={() => open(53)} d="M156.97,77.7l-1.93-0.29l-3.14-1.35l-3.13-2.41c0,0,0.59,1.33,0,1.98c0,0-1.59,1.28-1.44,1.78
		c0,0,0.12,1.43-0.01,2.18c0,0-1.14,1.11-0.78,1.75l0.19,1.22c1.21,0.24,2.88,0.32,4.35-0.5l2.96,2.78l2.93-0.36l-0.64-2.57
		C156.26,80.98,156.97,77.7,156.97,77.7z" />
<Path id="karmoli" fill={getColor(30)} onPress={() => open(30)} d="M161.26,68.48c0.07-1.64-1.65-2.23-1.65-2.23h-2.33c-0.32,1.59-0.77,3.52-0.95,2.45l-0.7,3.17
		c0.87,0.31-0.59,5.54-0.59,5.54l1.93,0.29l3.14,0.07l0.65-2.48c-0.58-0.26,0.07-3.42,0.07-3.42
		C161.47,71.11,161.26,68.48,161.26,68.48z" />
<Path id="rihe" fill={getColor(29)} onPress={() => open(29)} d="M173.18,57.27l-0.85,1.5c-1.72,1.79-4.57,0.76-4.57,0.76c-0.86-1.31-4.22-2.19-4.22-2.19
		c-2.21,0.57-4.78-0.5-4.78-0.5l-1.72,3.69c-0.71,0.12,0.57,3.95,0.57,3.95s-0.14,0.82-0.33,1.77h2.33c0,0,1.72,0.59,1.65,2.23
		l0.35,0.13l1.59,0.95l2.7,0.33c1.78,2.19,3.21,2.12,3.21,2.12l1.65-4.45l0.07-2.65l0.43-0.85l2.5-0.69l1.71-1.47v-2.37
		L173.18,57.27z" />
<Path id="kasarsai" fill={getColor(17)} onPress={() => open(17)} d="M184.63,55.16l-0.21-3.64c-0.65-0.91,0.21-7.98,0.21-7.98v-6.06l-4.66,0.06
		c-3.27-0.7-5.41,4.77-5.41,4.77v4.6l-0.54,6.97l-0.84,3.39l2.29,2.26l4.29-0.89C184.79,57.2,184.63,55.16,184.63,55.16z" />
<Path id="dalkarwadi" fill={getColor(19)} onPress={() => open(19)} d="M195.66,25.56l-0.05,2.57c0.43,3.14-2.14,6.28-2.14,6.28l-8.84,3.07h11.27l1.14-3.64v-6
		L195.66,25.56z" />
<Path id="nere_1_" fill={getColor(18)} onPress={() => open(18)} d="M184.63,37.48v6.06c0,0-0.86,7.07-0.21,7.98l0.21,3.64l3.27-0.2l2.93-0.17v-1.2l1.07-4.03
		l2.26-4.66l0.45-0.92l1.29-6.5H184.63z" />
<Path id="jambe" fill={getColor(20)} onPress={() => open(20)} d="M201.76,45.48c-1.29-0.51-0.72-2.5-0.72-2.5l1.14-4.85c0.58-0.86,0-6.61,0-6.61
		c-0.85-1.75-5.14-3.68-5.14-3.68v6l-1.14,3.64l-1.29,6.5l-0.45,0.92l4.17,1.42l6.43,0.66L201.76,45.48z" />
<Path id="marunji" fill={getColor(22)} onPress={() => open(22)} d="M206.33,46.32l-1.57,0.66l-6.43-0.66l-4.17-1.42l-2.26,4.66l-1.07,4.03v1.2l3.93-0.83l2.28-0.37
    l2.42,2.46l3.87-1.91l5-2.01l1.57-4.27L206.33,46.32z" />
<Path id="tathwade" fill={getColor(21)} onPress={() => open(21)} d="M222.9,34.56l-0.57,2.92c0,0-0.57,4.91-2.29,7.42l-3,2.08l-7.14,0.88l-3.57-1.54l0.71-7.76
    c0,0,0.72-3.43,1.57-3.58l4-2.42l4.15,1.28L222.9,34.56z" />
<Path id="hinjavadi" fill={getColor(23)} onPress={() => open(23)} d="M214.61,59.98l-2.93-3.14l-3.35-4.71l-5,2.01l-3.87,1.91l2.58,2.22
    c0.97,0.11,0.86,3.43,0.86,3.43v2.73l0.73,0.37l1.13,0.56l2.32,2.66l1.82-1l2.57-1.66h3.14l0.61-1.41c1.5-0.32,1.5-3.43,1.5-3.43
    L214.61,59.98z" />
<Path id="mahalunge" fill={getColor(59)} onPress={() => open(59)} d="M225.93,66.25l-0.42-2.88l-0.54-4.46h-5.79l-2.46,1.61c0,0,0,3.11-1.5,3.43l-0.61,1.41h-3.14
    l-2.57,1.66l-1.82,1l-1.5,2.3c0,1.56,2.51,3.33,2.51,3.33c0.8-1.76,5.2-1.64,5.2-1.64c1.39-1.05,5.79,0.51,5.79,0.51
    c-0.43-1.82,3.1-3.3,3.1-3.3l3.11-0.21C226.47,68.71,225.93,66.25,225.93,66.25z" />
<Path id="sus" fill={getColor(60)} onPress={() => open(60)} d="M213.29,72.01c0,0-4.4-0.12-5.2,1.64c2.46,7.29,1.81,5.91,1.81,5.91c-0.18,2.85-2.93,4.32-2.93,4.32
    c3.11,4.07,5.14,2.35,5.14,2.35c-0.85-2.89,2.5-4.82,2.5-4.82c1.97-0.64,3.61-3.64,3.61-3.64c0.75-0.75,0.86-5.25,0.86-5.25
    S214.68,70.96,213.29,72.01z" />
<Path id="nande" fill={getColor(58)} onPress={() => open(58)} d="M208.09,73.65c0,0-2.51-1.77-2.51-3.33c-0.53,0.81-3.9,0-3.9,0c-1.76,0.49-3.6,0.57-3.6,0.57
    c-2.25-0.13-1.61,1.84-1.61,1.84c1.82,2.68,1.18,4.68,1.18,4.68c-0.11,0.82,3.64,4,3.64,4c2.57,2.15,5.68,2.47,5.68,2.47
    s2.75-1.47,2.93-4.32C209.9,79.56,210.55,80.94,208.09,73.65z" />
<Path id="lavale" fill={getColor(61)} onPress={() => open(61)} d="M212.11,86.23c0,0-2.03,1.72-5.14-2.35c0,0-3.11-0.32-5.68-2.47c0,0-3.75-3.18-3.64-4l-0.82,0.72
    l-0.93,0.82l-1.14,1.64l-1.4,1.97l-0.85,3.14c-3,4.93-4.08,3.21-4.08,3.21c0.43,2.79-1.48,6.65-1.48,6.65
    c6.12,0.42,9.44,5.89,9.44,5.89c-0.3-0.97,5.87-1.5,5.87-1.5l1.5-0.86c-0.02-0.1,0.13-0.33,0.39-0.64
    c1.07-1.25,3.94-3.75,3.94-3.75c0.19-0.64,2.85-2.24,4.18-3.01c0.45-0.26,0.75-0.42,0.75-0.42
    C212.22,91.16,212.11,86.23,212.11,86.23z" />
<Path id="mulkhed" fill={getColor(65)} onPress={() => open(65)} d="M194.76,79.7h-1.5c0-1.28-2.43-2.29-2.43-2.29c-3.71-1.11-4.86,0.36-4.86,0.36l0.89,4.98
    l0.09,0.48l1.48,5.68c0,0,1.08,1.72,4.08-3.21l0.85-3.14l1.4-1.97l1.14-1.64l0.93-0.82L194.76,79.7z" />
<Path id="bavdhan_bk" fill={getColor(89)} onPress={() => open(89)} d="M227.11,90.73h-6.43l-7.66,0.54c0,0-0.3,0.16-0.75,0.42l0.11,0.3l0.32,0.38l0.78,0.8
    l1.42,0.78c1.82,0.32,4.18,1.12,4.18,1.12c-0.32,0.37,2.25,3.38,2.25,3.38l2.89-1.29c1.5,0.32,2.89-2.09,2.89-2.09
    C227.86,93.08,227.11,90.73,227.11,90.73z" />
<Path id="bhugaon" fill={getColor(90)} onPress={() => open(90)} d="M223.15,106.38v-3.86l-1.82-4.07c0,0-2.57-3.01-2.25-3.38c0,0-2.36-0.8-4.18-1.12l-1.42-0.78
    l-0.78-0.8l-0.32-0.38l-0.11-0.3c-1.33,0.77-3.99,2.37-4.18,3.01c0,0-2.87,2.5-3.94,3.75l2.82,1.28c2.68,0.11,3.01,3.22,3.01,3.22
    c0.76,2.78,0,4.5,0,4.5l1.81,0.43c-0.32,1.07,2.25,1.48,2.25,1.48c1.07,0.63,1.29-1.59,1.29-1.59c0-1.5,1.93-1.07,1.93-1.07
    c0,0.86,3.53,2.36,3.53,2.36c1.07,0.96,3-0.65,3-0.65L223.15,106.38z" />
<Path id="angrewadi" fill={getColor(91)} onPress={() => open(91)} d="M209.98,102.95c0,0-0.33-3.11-3.01-3.22l-2.82-1.28l2.18,6.11l3.65,2.89
    C209.98,107.45,210.74,105.73,209.98,102.95z" />
<Path id="bhukum" fill={getColor(92)} onPress={() => open(92)} d="M206.33,104.56l-2.18-6.11c-0.26,0.31-0.41,0.54-0.39,0.64l-1.5,0.86c0,0-6.17,0.53-5.87,1.5
    l2.22,2.89v4.18h5.04l6.33-1.07L206.33,104.56z" />
<Path id="khatpe_wadi" fill={getColor(93)} onPress={() => open(93)} d="M203.65,108.52h-5.04c0,0.84-0.75,2.36-1.27,3.33c-0.29,0.53-0.51,0.9-0.51,0.9
    c-1.78,2.73-1.75,4.77-1.75,4.77c1.82-1.07,2.68,0.53,2.68,0.53l2.6-0.21c1.22,0.75,5.22-0.75,5.22-0.75
    c3-1.07,3.75-5.68,3.75-5.68l0.65-3.96L203.65,108.52z" />
<Path id="mukaiwadi" fill={getColor(113)} onPress={() => open(113)} d="M196.83,109.47l-1.75,0.55l-1.72-1.5c-1.07,1.71-3.8,0-3.8,0c-0.91,0.96-2.61,0-2.61,0
    c-0.73-0.75-2.91-0.54-2.91-0.54l0.59,1.49l1.34,0.98l1.39,2.3l1.4,2.52l2.64,2.25c0.93-1.07,3.68,0,3.68,0s-0.03-2.04,1.75-4.77
    c0,0,0.22-0.37,0.51-0.9L196.83,109.47z" />
<Path id="pirangut" fill={getColor(94)} onPress={() => open(94)} d="M196.39,101.45c0,0-3.32-5.47-9.44-5.89l-3.44,0.1l0.53,2.79l-1.12,3l-1.13,3.43l2.25,3.1
    c0,0,2.18-0.21,2.91,0.54c0,0,1.7,0.96,2.61,0c0,0,2.73,1.71,3.8,0l1.72,1.5l1.75-0.55l0.51,2.38c0.52-0.97,1.27-2.49,1.27-3.33
    v-4.18L196.39,101.45z" />
<Path id="botarwadi" fill={getColor(114)} onPress={() => open(114)} d="M183.27,99.67l1.48-6.65c0,0-6.53-3.27-6.84-2.12l-2.33,8.57c0.35,1.02,2.13,1.13,2.13,1.13
    l0.01,1.33c0.98,1.17,0.91,2.29,0.91,2.29l0.85,2.08c2.1-0.73,3.04-0.75,3.04-0.75l1.86,0.43L183.27,99.67z" />
<Path
        id="uravade"
        fill={getColor(112)}
        onPress={() => open(112)}
        d="M179.97,113.77v-1.03l2.36,1.24v-2.13h1.71l1.93-1.4l-1.34-0.98l-0.59-1.49l-2.25-3.1l-6.86,3.07
		l0.54,2.5l-0.64,4.28l-1.61,2.47v5.14l0.96,1.29l6.65,0.43l3.21-1.4c0.43,0.11,1.39-2.03,1.39-2.03l-2.89-2.58L179.97,113.77z"
      />
      <Path
        id="bharekarwadi"
        fill={getColor(63)}
        onPress={() => open(63)}
        d="M173.22,122.34v-5.14l-4.5,2.25l-1.39,2.25l1.28,2.36l-0.85,1.28l1.17,1.72l1.72-1.08
		l3.53-2.35L173.22,122.34z"
      />
      <Path
        id="marnewadi"
        fill={getColor(111)}
        onPress={() => open(111)}
        d="M174.93,107.95l-4.17-1.25l-0.75,1.25l-2.15,1.52l-1.71,2.05v1.23l1.82,0.48v0.75h0.96
		l0.75,0.75l3,1.4l2.15-1.4l0.64-4.28L174.93,107.95z"
      />
      <Path
        id="ambegaon"
        fill={getColor(110)}
        onPress={() => open(110)}
        d="M172.68,116.13l-3-1.4l-0.75-0.75h-0.96v-0.75l-1.82-0.48v-1.23l1.71-2.05l2.15-1.52l0.75-1.25
		h-2.04l-3.64,1.82h-4.5c-0.64,0.94-1.68,0.95-1.72,0.95l-0.69,1.51l-0.7,3.49c-0.54,0.91-2.43,1.07-2.43,1.07l2.85,2.11l2.47,1.83
		l0.93-0.57c0.61,0.75,7.43,0.54,7.43,0.54l4.5-2.25l1.61-2.47L172.68,116.13z"
      />
      <Path
        id="morewadi"
        fill={getColor(115)}
        onPress={() => open(115)}
        d="M167.76,125.34l0.85-1.28l-2.46,0.57l-4.25,1.43l-2.64,3.03l1.78,0.54l1.86,0.35l1.5,1.15
		l1.43-1.86l2-1.14l1.1-1.07L167.76,125.34z"
      />
   <Path
        id="mutha"
        fill={getColor(116)}
        onPress={() => open(116)}
        d="M168.72,119.45c0,0-6.82,0.21-7.43-0.54l-0.93,0.57l-2.47-1.83v1.26l-0.63,1.72l-0.24,1.5
          l-0.19,1.21l-0.29,3.07c-0.28,1.07,2.72,2.68,2.72,2.68l2.64-3.03l4.25-1.43l2.46-0.57l-1.28-2.36L168.72,119.45z"
      />
      <Path
        id="andgaon"
        fill={getColor(106)}
        onPress={() => open(106)}
        d="M152.9,120.63c-1.22-0.5-4.43-0.43-4.43-0.43c-1.5,0-3.36,1.07-3.36,1.07l1.15,2.1
          c0.71,0.1,1.5,3.3,1.5,3.3l1.28-0.26c0.72-0.43,2.64,0.32,2.64,0.32l1.58,0.33c0-0.5,3.28-0.65,3.28-0.65l0.29-3.07l0.19-1.21
          L152.9,120.63z"
      />
      <Path
        id="attalwadi"
        fill={getColor(107)}
        onPress={() => open(107)}
        d="M155.04,115.54l-2.78,0.94l-4.58-0.35c-1.07-0.14-4.57,2.57-4.57,2.57l2,2.57
          c0,0,1.86-1.07,3.36-1.07c0,0,3.21-0.07,4.43,0.43l4.12,1.5l0.24-1.5l0.63-1.72v-1.26L155.04,115.54z"
      />
      <Path
        id="kharavade"
        fill={getColor(105)}
        onPress={() => open(105)}
        d="M146.26,123.37l-1.15-2.1l-2-2.57h-7l-0.28,2.78l-0.36,1.36l-0.43,3.07l-0.5,2.5l0.86,0.36
          h1.43l2,0.32c0,0,1.43,0.82,2.07,0.68l2.21-1.36l2.65-1.35l2-0.39C147.76,126.67,146.97,123.47,146.26,123.37z"
      />
      <Path
        id="kolavade"
        fill={getColor(104)}
        onPress={() => open(104)}
        d="M131.9,117.17l-4.29,0.03l-1.57-0.43h-2.53l1.32,1.93l0.57,2.21l0.93,2.72v1.78l0.28,0.86
          l0.32,0.79l0.4,1.21l0.71-0.15l2.93,0.29c1.07-0.65,3.57,0,3.57,0l0.5-2.5l0.43-3.07l0.36-1.36l0.28-2.78
          C134.04,116.06,131.9,117.17,131.9,117.17z"
      />
  <Path
        id="mulshi_kh"
        fill={getColor(81)}
        onPress={() => open(81)}
        d="M110.69,103.79c0,0,1.11-2.45,0-3.31h-4.33l-0.43,10.02l1.72,0.43h1.07l1.39,1.45
          c0,0,0.96-0.32,0-3.54l0.38-3.3L110.69,103.79z"
      />
      <Path
        id="male_1_"
        fill={getColor(251)}
        onPress={() => open(251)}
        d="M110.49,105.54l12.09-0.98l-0.15-1.08l-1.39-3.64l0.58-0.64l-0.94,0.43l-3.28-1.29l-4.36-1.36
          l-2.36-1.91l-1.78-0.66l-1.43-2.43v-2.53l0.3-2.86l-2.18,1.22l0.77,12.67h4.33c1.11,0.86,0,3.31,0,3.31L110.49,105.54z"
      />
      <Path
        id="asade"
        fill={getColor(77)}
        onPress={() => open(77)}
        d="M132.04,79.7h-4.46l-1.07,3.21c0,0-0.18,0.4-0.38,0.97l6.34-0.5l1.6-2.79L132.04,79.7z"
      />
      <Path
        id="khubawali"
        fill={getColor(71)}
        onPress={() => open(71)}
        d="M139.18,82.75l-3.57-1.48l-1.54-0.68l-1.6,2.79l-6.34,0.5h-0.01c-0.4,1.08-0.93,2.77-0.58,3.37
          l0.43,3.14l6.07-3.8l2.48-1.32c1.48,0.11,3.94,1.61,3.94,1.61l1.22,1.6l2.72-3.21C142.4,85.27,140.6,83.09,139.18,82.75z"
      />
      <Path
        id="ravade"
        fill={getColor(69)}
        onPress={() => open(69)}
        d="M150.11,88.84l-1.77-2.19l-3.3,1.16l-2.64-2.54l-2.72,3.21v2.25l1.47,0.81h4.68
          c0,0,2.54-0.29,3.96-0.34c0.3-0.02,0.54-0.02,0.71-0.01l0.52-1.77C150.76,89.32,150.46,89.14,150.11,88.84z"
      />
  <Path
        id="mugavade"
        fill={getColor(54)}
        onPress={() => open(54)}
        d="M164.18,80.59c-0.14-1.14-0.28-2.07-0.28-2.07h-1.72l-2.07-0.75l-3.14-0.07
          c0,0-0.71,3.28-0.64,4.21l0.64,2.57l1.79,0.36h2.53l1.33,0.43l1.81-0.43C164.63,84.58,164.4,82.33,164.18,80.59z"
      />
      <Path
        id="bhegadewadi"
        fill={getColor(56)}
        onPress={() => open(56)}
        d="M185.97,77.77l-1.93,0.08l-5.13,0.21l-4.08,2.42l-10.65,0.11c0.22,1.74,0.45,3.99,0.25,4.25
          l4.63,0.17l6.84,0.26l3.01,0.22l1.92-1.61l6.03-1.13L185.97,77.77z"
      />
      <Path
        id="ghtavade"
        fill={getColor(59)}
        onPress={() => open(59)}
        d="M182.65,76.06h-1.82c-0.75-0.75,0.32-2.41,0.32-2.41l-12.04-1.64c0,0-1.43,0.07-3.21-2.12
          l-2.7-0.33l-1.59-0.95l-0.35-0.13c0,0,0.21,2.63-0.43,3.39c0,0-0.65,3.16-0.07,3.42l-0.65,2.48l2.07,0.75h1.72
          c0,0,0.14,0.93,0.28,2.07l10.65-0.11l4.08-2.42l5.13-0.21L182.65,76.06z"
      />
      <Path
        id="amalewadi"
        fill={getColor(397)}
        onPress={() => open(397)}
        d="M186.95,70.32l-0.98-1.31h-1.93l-0.86,1.88l-2.03,2.76c0,0-1.07,1.66-0.32,2.41h1.82l1.39,1.79
          l1.64-1.79l-0.35-1.55l0.64-2.5L186.95,70.32z"
      />
      <Path
        id="man"
        fill={getColor(24)}
        onPress={() => open(24)}
        d="M202.9,64.43h-1.5l-1.04-1.52l-1.18,0.46l-1.21,0.76l-0.43,0.71l-0.71,0.93l0.21,0.51l0.93-0.03
          l0.71,0.52l0.78,0.86l0.9,0.39h0.61l0.93-0.89l0.71-0.15l0.57-0.07v-1.14l0.45-0.97L202.9,64.43z"
      />
  <Path
        id="godambewadi"
        fill={getColor(28)}
        onPress={() => open(28)}
        d="M183.76,68.02h-1.15l-1.21-0.46l-0.84-0.5v-3.69l-0.59-0.46l-1.06-1.01l-1.37-0.56
		l-2.07-0.28v0.84l-1.71,1.47l-2.5,0.69l-0.43,0.85l-0.07,2.65l-1.65,4.45l12.04,1.64l2.03-2.76l0.86-1.88h0.59L183.76,68.02z"
      />
      <Path
        id="materewadi"
        fill={getColor(26)}
        onPress={() => open(26)}
        d="M187.9,54.96l-3.27,0.2c0,0,0.16,2.04-4.87,3.48l-4.29,0.89v1.53l2.07,0.28l1.37,0.56
		l1.06,1.01l0.59,0.46v3.69l2.57-0.81l1.5-2.09l0.3-0.79l0.18-0.46l0.86-1.01l1.46-1.83l-0.48-2.82L187.9,54.96z"
      />
      <Path
        id="chande"
        fill={getColor(7)}
        onPress={() => open(7)}
        d="M204.76,65.36l-1.13-0.56l-0.45,0.97v1.14l-0.57,0.07l-0.71,0.15l-0.93,0.89h-0.61l-0.9-0.39
		l-0.78-0.86l-1.85,1.81l-0.44,0.43l-3.83,1.31l-3.8-0.37l-1.81,0.37l-0.98,1.69l-0.64,2.5l0.35,1.55l-1.64,1.79l1.93-0.08
		c0,0,1.15-1.47,4.86-0.36c0,0,2.43,1.01,2.43,2.29h1.5l2.07-1.57l0.82-0.72c0,0,0.64-2-1.18-4.68c0,0-0.64-1.97,1.61-1.84
		c0,0,1.84-0.08,3.6-0.57c0,0,3.37,0.81,3.9,0l1.5-2.3L204.76,65.36z"
      />
      <Path
        id="dhumalwadi"
        fill={getColor(27)}
        onPress={() => open(27)}
        d="M184.93,63.37l-0.3,0.79l-1.5,2.09l-2.57,0.81l0.84,0.5l1.21,0.46h1.15l0.87,0.99h1.34
		l0.98,1.31l1.81-0.37l3.8,0.37l3.83-1.31l0.44-0.43L184.93,63.37z"
      />
      <Path
        id="bhoirwadi"
        fill={getColor(25)}
        onPress={() => open(25)}
        d="M202.9,61.7v2.73h-1.5l-1.04-1.52l-1.18,0.46l-1.21,0.76l-0.43,0.71l-0.71,0.93l0.21,0.51
		l0.93-0.03l0.71,0.52l-1.85,1.81l-11.9-5.21l0.18-0.46l0.86-1.01l1.46-1.83l-0.48-2.82l0.95-2.29l2.93-0.17l3.93-0.83l2.28-0.37
		l2.42,2.46l2.58,2.22C203.01,58.38,202.9,61.7,202.9,61.7z"
      />
  <Path
        id="bhare"
        fill={getColor(63)}
        onPress={() => open(63)}
        d="M188.43,88.91l-1.48-5.68l-0.09-0.48l-6.03,1.13l-1.92,1.61v3.21c0,0-0.08,3.5-0.51,3.71
		l-0.57,1.79l1.08,0.36l1.06,0.51l0.59,0.49h1.23l1.72,0.1l3.44-0.1C186.95,95.56,188.86,91.7,188.43,88.91z"
      />
      <Path
        id="ambarwate"
        fill={getColor(64)}
        onPress={() => open(64)}
        d="M175.9,85.27l-6.84-0.26l-0.34,1.12l-0.61,1.57l1,1.5l0.5,1.19l-0.89,1.15v1.09l-0.61,0.64
		v1.36l5.11,0.44l4.61-0.87l0.57-1.79c0.43-0.21,0.51-3.71,0.51-3.71v-3.21L175.9,85.27z"
      />
      <Path
        id="kasar_amboli"
        fill={getColor(88)}
        onPress={() => open(88)}
        d="M183.51,95.66l-1.72-0.1h-1.23l-0.59-0.49l-1.06-0.51l-1.08-0.36l-2.36,1.36
		c0,0-2.31,1.6-1.96,2.46l-0.29,1.61l0.29,1.82l-0.93,2.03l-0.97,1.4l-0.85,1.82l4.17,1.25l6.86-3.07l1.13-3.43l1.12-3L183.51,95.66
		z"
      />
      <Path
        id="shindewadi_1_"
        fill={getColor(65)}
        onPress={() => open(65)}
        d="M173.22,95.07l-5.11-0.44v1.44l-1.53,2.38l-2.07,1.18l-1.04,0.95l-0.85,1.73l-0.44,1.39
		l-0.42,2.73v2.09h3.32l3.64-1.82h2.04l0.85-1.82l0.97-1.4l0.93-2.03l-0.29-1.82l0.29-1.61c-0.35-0.86,1.96-2.46,1.96-2.46
		l2.36-1.36L173.22,95.07z"
      />
      <Path
        id="darawali"
        fill={getColor(66)}
        onPress={() => open(66)}
        d="M169.11,89.2l-1-1.5l0.61-1.57l0.34-1.12l-4.63-0.17l-1.81,0.43l-1.33-0.43h-1.18l-0.39,1.81
		v6.87l2.04,0.68l6.35,1.36v-2.29l0.61-0.64v-1.09l0.89-1.15L169.11,89.2z"
      />
  <Path
        id="survewadi"
        fill={getColor(67)}
        onPress={() => open(67)}
        d="M161.76,94.2l-2.04-0.68v2.04l-0.96,2.03l-0.22,0.48l-0.37,0.81l5.3,1.7l1.04-0.95l2.07-1.18
		l1.53-2.38v-0.51L161.76,94.2z"
      />
      <Path
        id="vithalwadi"
        fill={getColor(87)}
        onPress={() => open(87)}
        d="M158.17,98.88l0.37-0.81l-4.5,1.13l-2.32-0.75l-0.64,1.18l0.45,0.67l3.51,5.24l3.82,3.93
		c0.04,0,1.08-0.01,1.72-0.95h1.18v-2.09l0.42-2.73l0.44-1.39l0.85-1.73L158.17,98.88z"
      />
      <Path
        id="paud"
        fill={getColor(68)}
        onPress={() => open(68)}
        d="M158.76,84.84l-1.79-0.36l-2.93,0.36l-1.43,2.97c0,0-0.1,2.2-1.59,1.61l-0.52,1.77
		c-0.17-0.01-0.41-0.01-0.71,0.01l1.93,7.25l2.32,0.75l4.5-1.13l0.22-0.48l0.96-2.03v-8.91l0.39-1.81H158.76z"
      />
      <Path
        id="kondhawale"
        fill={getColor(207)}
        onPress={() => open(207)}
        d="M151.72,98.45l-1.93-7.25c-1.42,0.05-3.96,0.34-3.96,0.34h-4.68l-0.34,0.82l-0.48,1.16v1.55
		l0.48,3.38c0.11,0.28,0.23,0.55,0.34,0.8c2.09,4.73,4.2,5.31,4.2,5.31c-0.23-1.92,5.73-4.08,5.73-4.08l0.45-0.18l-0.45-0.67
		L151.72,98.45z"
      />
      <Path
        id="chinchvad"
        fill={getColor(95)}
        onPress={() => open(95)}
        d="M151.53,100.3l-0.45,0.18c0,0-5.96,2.16-5.73,4.08l0.67,2.14l2.45,1.25l2.03,0.57l2.36-1.82
		l2.18-1.16L151.53,100.3z"
      />
   <Path
        id="belawade"
        fill={getColor(109)}
        onPress={() => open(109)}
        d="M155.04,105.54l-2.18,1.16l-2.36,1.82l-2.03-0.57l-2.45-1.25l-0.67,1.25l0.33,2.5l0.79,2.3
		l0.61,1.13l0.6,2.25l4.58,0.35l2.78-0.94c0,0,1.89-0.16,2.43-1.07l0.7-3.49l0.69-1.51L155.04,105.54z"
      />
      <Path
        id="khachare"
        fill={getColor(108)}
        onPress={() => open(108)}
        d="M147.08,113.88l-0.61-1.13l-0.79-2.3l-0.33-2.5l0.67-1.25l-0.67-2.14l-1.45,0.98l-2.75-0.49
		l-2.69,0.49l-1.13,1.16v0.75l-1.82,1.07l-1.44,2.89l-0.81,2.47l-1.36,3.29c0,0,2.14-1.11,4.21,1.53h7c0,0,3.5-2.71,4.57-2.57
		L147.08,113.88z"
      />
      <Path
        id="andeshe"
        fill={getColor(96)}
        onPress={() => open(96)}
        d="M141.15,99.25l-3.39,2.2l-3.22,2.03l2.79,3.22l1.13-1.16l2.69-0.49l2.75,0.49l1.45-0.98
		C145.35,104.56,143.24,103.98,141.15,99.25z"
      />
      <Path
        id="akole"
        fill={getColor(72)}
        onPress={() => open(72)}
        d="M139.68,90.73v-2.25l-1.22-1.6c0,0-2.46-1.5-3.94-1.61l-2.48,1.32l-6.07,3.8l0.96,0.45l1.77,0.36
		h4.18l0.27,0.02l4.93,0.32l2.73,0.82l0.34-0.82L139.68,90.73z"
      />
      <Path
        id="kalashet"
        fill={getColor(86)}
        onPress={() => open(86)}
        d="M140.81,98.45l-0.48-3.38v-1.55l0.48-1.16l-2.73-0.82l-4.93-0.32l-0.7,2.3l-0.86,2.04v2.51
		l0.78,3l1.19,1.29l0.98,1.12l3.22-2.03l3.39-2.2C141.04,99,140.92,98.73,140.81,98.45z"
      />
  <Path
        id="shere"
        fill={getColor(84)}
        onPress={() => open(84)}
        d="M132.88,91.2h-4.18l-1.77-0.36l-0.64,3.22l-4.67,5.14l-0.58,0.64l1.39,3.64l0.15,1.08l0.31,2.14
		l2.15-0.27l1.47-2.66l1.96-2.41l2.21-2.11l0.91-1.18v-2.51l0.86-2.04l0.7-2.3L132.88,91.2z"
      />
      <Path
        id="mandede"
        fill={getColor(97)}
        onPress={() => open(97)}
        d="M134.54,103.48l-0.98-1.12l-1.19-1.29l-0.78-3l-0.91,1.18l-2.21,2.11l-1.96,2.41l-1.47,2.66
		l-2.15,0.27l8.7,1.82h3.92l1.82-1.07v-0.75L134.54,103.48z"
      />
      <Path
        id="jamgaon"
        fill={getColor(183)}
        onPress={() => open(183)}
        d="M135.51,108.52l-1.44,2.89l-0.81,2.47l-1.36,3.29l-4.29,0.03l-1.57-0.43h-2.53v-1.71l0.42-1.08
		l-1.04-7.28l8.7,1.82H135.51z"
      />
      <Path
        id="vegre"
        fill={getColor(101)}
        onPress={() => open(101)}
        d="M114.93,115.81h-3.75l-1.92,2.19l-3,0.91l-0.86,3.32l-2.04,1.08l-3.1-2.25l-3.43,2.67
		c0,0-2.36,0.86-2.79,1.18s-1.28,2.25-1.28,2.25s-2.79,3.22-4.18,5.04c-1.4,1.82-2.9,1.61-2.9,1.61l-1.19-0.21l-1.91-0.33L81.36,135
		l-0.82,1.16l2.04,3.86l1.91,0.82h9.34l3.91-0.56l2.06-0.3l0.95-1.5l0.58-0.92l4.6-3.74l4.18-4.03l4.5-3.95l-0.28-3.71l0.35-4.48
		L114.93,115.81z"
      />
      <Path
        id="temghar"
        fill={getColor(102)}
        onPress={() => open(102)}
        d="M121.9,129.79l0.68-1.64l-1.4-0.56l-1.85,0.59l-2.29-1.12l-2.43-1.22l-4.5,3.95l-4.18,4.03
		l-4.6,3.74l-0.58,0.92l1.67,1.79l1.6,0.35l1.02,0.22l4.14,0.86h7.29l4.36-1.61l1.75-1.61v-2.64l-0.68-3.4V129.79z"
      />
   <Path
        id="kalavadi"
        fill={getColor(129)}
        onPress={() => open(129)}
        d="M177.4,142.27l5.07-4.14l5.14-2.29c0,0,2,0.14,0,2.57l-4.45,3.29l-3.19,3.48l-2.14-1.34
		L177.4,142.27z"
      />
      <Path
        id="davaje"
        fill={getColor(130)}
        onPress={() => open(130)}
        d="M177.83,149.41l-0.43-3l-1.93-2.28h-2.25l-1.75,2.14l-3.36,3.14l0.82,0.86l4.29,1.43l5.25,1.86
		L177.83,149.41z"
      />
      <Path
        id="kondhur"
        fill={getColor(128)}
        onPress={() => open(128)}
        d="M172.33,142.2l-1.52-1.36l-1.02-0.33l-1.68-1.38l-0.78-1.57l-1.18-1.72l-1.22-0.86l-0.26,2
		l-3.14,1.72l-3.64,1l-2.26,1.14l-0.68,1.57l0.68,0.72l2.26,3.43l1.37,1.14h2.5l3.17,1.14l3.18,0.57l3.36-3.14l1.75-2.14h2.25
		L172.33,142.2z"
      />
      <Path
        id="jatede"
        fill={getColor(127)}
        onPress={() => open(127)}
        d="M164.09,133.82l-1.91-1.98c0,0,0,0-0.42-0.71c-0.42-0.71-1.65,0-1.65,0l-0.85,1.98l-2.74,2.73
		l-1.48,2.43l-1.71,3.43l1.62,0.71l0.68-1.57l2.26-1.14l3.64-1l3.14-1.72l0.26-2L164.09,133.82z"
      />
      <Path
        id="malegaon"
        fill={getColor(118)}
        onPress={() => open(118)}
        d="M156.52,128.77l-2.62-1.18h-4.11l0.4,2.2l-0.4,5.19l-2.03,3.29l-0.08,1.43l2.11,0.81l1.93,1.69
		l1.61-0.5l1.71-3.43l1.48-2.43l2.74-2.73l0.85-1.98L156.52,128.77z"
      />
  <Path
        id="wanjale"
        fill={getColor(119)}
        onPress={() => open(119)}
        d="M149.79,127.59h-2.03l-2.65,1.5l0.24,2.75l0.67,3.05v3.81l1.66,1l0.08-1.43l2.03-3.29l0.4-5.19
		L149.79,127.59z"
      />
      <Path
        id="valunde"
        fill={getColor(398)}
        onPress={() => open(398)}
        d="M145.35,131.84l-0.24-2.75l-3.07,0.7h-7.5l-4.43-0.7l-4.43-0.32l-3.78,1.02v2.65l0.68,3.4v2.64
		l1.35-0.92l2.4-2.58l3.48-2.54l2.09-1.31l2.64,2.52l1.57,5.05l0.26,3.5h2.1l0.99-0.5l1.69-0.86l1.96-1.14l2.91-1v-3.81
		L145.35,131.84z"
      />
      <Path
        id="bhode"
        fill={getColor(121)}
        onPress={() => open(121)}
        d="M136.11,138.7l-1.57-5.05l-2.64-2.52l-2.09,1.31l-3.48,2.54l-2.4,2.58l-1.35,0.92l-1.75,1.61
		l-4.36,1.61h-2.14l0.6,2.43v3.57l4.68,3h2.97l1.35-1.29l1.97-1.28l2.76-0.84l0.54-0.16v-1l0.91-0.95l2.36-1.05l1.49-1h2.15
		l0.26-0.93L136.11,138.7z"
      />
      <Path
        id="kuran_bk"
        fill={getColor(146)}
        onPress={() => open(146)}
        d="M164.93,148.84l-3.17-1.14h-0.97l-0.68,3v9.25h2.51l1.47-0.64l1.84-0.43l2.18-0.54v-8.93
		L164.93,148.84z"
      />
      <Path
        id="varasagaon"
        fill={getColor(145)}
        onPress={() => open(145)}
        d="M159.26,147.7l-1.37-1.14l-2.26-3.43l-0.68-0.72l-1.62-0.71l-1.61,0.5l-1.93-1.69l-2.11-0.81
		l-0.6,2.71l-1.06,4.15l-0.91,2.85l-1.25,2.29v2.89l1.25,0.54l1.97,0.96h3.11l3.14,0.64l2.3,1.08h4.48v-7.11l0.68-3H159.26z"
      />
   <Path
        id="saiv_bk"
        fill={getColor(144)}
        onPress={() => open(144)}
        d="M146.02,138.7l-2.91,1l-1.96,1.14l-1.69,0.86l-0.99,1.86v2.85l-0.43,2.34l-0.86,0.66l-0.14,2.15
		l-0.67,2.26v3.99l2.39-0.97h5.1v-5.14l1.25-2.29l0.91-2.85l1.06-4.15l0.6-2.71L146.02,138.7z"
      />
      <Path
        id="mose_bk"
        fill={getColor(143)}
        onPress={() => open(143)}
        d="M138.47,142.2h-2.1l-0.26,0.93h-2.15l-1.49,1l-2.36,1.05l-0.91,0.95v1l-0.54,0.16l1.81,0.96
		c1.14,0.28,2.14,2.45,2.14,2.45l0.15,4.14l-0.86,4.14h2.06l1.44-0.7l0.97-0.47v-3.99l0.67-2.26l0.14-2.15l0.86-0.66l0.43-2.34
		v-2.85l0.99-1.86L138.47,142.2z"
      />
      <Path
        id="saiv_kh"
        fill={getColor(131)}
        onPress={() => open(131)}
        d="M143.86,154.59v2.25h-5.1l-2.39,0.97l-0.97,0.47v2.2l0.97,2.15l1.49,1.6l3.29-1.6l1.86-0.54
		l1.6-1.07l0.5-5.89L143.86,154.59z"
      />
      <Path
        id="mose_kh"
        fill={getColor(132)}
        onPress={() => open(132)}
        d="M136.37,162.63l-0.97-2.15v-2.2l-1.44,0.7h-2.06l-2.61,0.97l-2.57,0.64l-2.89,2.68l-0.75,1.5
		l-0.5,3.32h1.25l5.89-2.25l4.24-0.64l3.9-0.97L136.37,162.63z"
      />
      <Path
        id="palase"
        fill={getColor(126)}
        onPress={() => open(126)}
        d="M132.61,150.7c0,0-1-2.17-2.14-2.45l-1.81-0.96l-2.76,0.84l-1.97,1.28l-1.35,1.29h-2.97
		l-0.82,2.86v2.53l0.82,3.86l0.57,2.68l0.65,0.34l0.43,0.22l2.25,0.72l0.32-0.64l2.89-2.68l2.57-0.64l2.61-0.97l0.86-4.14
		L132.61,150.7z"
      />
  <Path
        id="admal"
        fill={getColor(133)}
        onPress={() => open(133)}
        d="M120.18,162.63l-0.57-2.68l-0.82-3.86v-2.53l0.82-2.86l-4.68-3l-1.5,3l-0.96,4.9l-2.68,4.35
		l1.88,1.79v0.01l0.69,0.66c0,0,1.39-0.49,2.57,0.78c0,0,3,1.36,3.86,0.72l2.04-0.94L120.18,162.63z"
      />
      <Path
        id="dasave"
        fill={getColor(122)}
        onPress={() => open(122)}
        d="M114.33,141.7h-5.15l-4.14-0.86l-1.02-0.22l-0.98,1.79l-0.86,3.61l1.08,5.46v4.12h1.5
		c1.39,0.04,1.17,2.68,1.17,2.68l3.86,1.67l2.68-4.35l0.96-4.9l1.5-3v-3.57L114.33,141.7z"
      />
      <Path
        id="bhoini"
        fill={getColor(123)}
        onPress={() => open(123)}
        d="M104.76,155.6h-1.5v-4.12l-1.08-5.46l0.86-3.61l0.98-1.79l-1.6-0.35l-1.67-1.79l-0.95,1.5
		l-2.06,0.3v2.13l-1.88,2.77l-1.07,3.07l0.54,2.45l-0.75,1.86l-0.54,3.04l0.86,1.75h2.14l2.79-0.94l2.35,0.65l3.75,1.22
		C105.93,158.28,106.15,155.64,104.76,155.6z"
      />
      <Path
        id="mugaon"
        fill={getColor(124)}
        onPress={() => open(124)}
        d="M93.83,140.84h-9.34l-1.91-0.82l-1.5,2.57l-1.82,1.18l-4.83-0.75l-0.75,1.39l2.25,3.84l4.61,4.52
		l3.24,1.22l1.58,0.6c1.4,0.21,3.91,4.39,3.91,4.39l1.05-0.7l4.58-0.93l-0.86-1.75l0.54-3.04l0.75-1.86l-0.54-2.45l1.07-3.07
		l1.88-2.77v-2.13L93.83,140.84z"
      />
      <Path
        id="dhamanohal"
        fill={getColor(125)}
        onPress={() => open(125)}
        d="M83.78,153.99l-3.24-1.22l-4.61-4.52l-2.25-3.84l-2.03,0.97c0,0-3.11,10.39-3.75,10.39
		c-0.53,0-1.37,0.74-2.07,0.93l1.43,1.58l1.71,4.45v4.29l2.57,3.86l3.43,2.57h3.58l2.74-0.97v-4.39l1.29-3.86l1.91-3.64
		L83.78,153.99z"
      />
  <Path
        id="gadale"
        fill={getColor(136)}
        onPress={() => open(136)}
        d="M93.51,165.2l-2.15-3.32l-1.04-0.75l-1.05-2.15c0,0-2.51-4.18-3.91-4.39l-1.58-0.6l0.71,6.6
		l-1.91,3.64l-1.29,3.86v4.39l4.42,0.97l3.56,1.39h1.05l2.76-3.32l1.71-3.96L93.51,165.2z"
      />
      <Path
        id="sakhari"
        fill={getColor(135)}
        onPress={() => open(135)}
        d="M111.67,161.75v-0.01l-1.88-1.79l-3.86-1.67l-3.75-1.22l-2.35-0.65l-2.79,0.94H94.9l-4.58,0.93
		l-1.05,0.7l1.05,2.15l1.04,0.75l2.15,3.32l1.28,2.36h2.95l3.01-0.86l4.01-1.07l2.67,0.53
		C107.43,166.16,112.02,163.66,111.67,161.75z"
      />
      <Path
        id="tav"
        fill={getColor(134)}
        onPress={() => open(134)}
        d="M122.58,168.09l0.5-3.32l0.43-0.86l-2.25-0.72l-0.43-0.22l-2.04,0.94c-0.86,0.64-3.86-0.72-3.86-0.72
		c-1.18-1.27-2.57-0.78-2.57-0.78l-0.69-0.66c0.35,1.91-4.24,4.41-4.24,4.41l-2.67-0.53l-4.01,1.07l-3.01,0.86h-2.95l-1.71,3.96
		l-2.76,3.32h4.47l4.07-0.57l1.96-0.33l2.09-0.36l0.77-0.13l4.88-1.07l5.77-0.97l2.38-0.85l2.72-0.97l4.4-1.5H122.58z"
      />
      <Path
        id="panshet"
        fill={getColor(399)}
        onPress={() => open(399)}
        d="M155.63,157.81l-2.3-1.08l-3.14-0.64h-3.11l-1.97-0.96l-0.5,5.89l-1.6,1.07l-1.86,0.54l0.88,2.35
		l1.08,2.04v1.07l2-0.53l0.91-0.43l2.45-1.77l0.84-0.95l0.45-0.5l2.57-0.72l2.62-1.21h0.68l0.51-0.23l3.97-1.8v-2.14H155.63z"
      />
      <Path
        id="kuran_kd"
        fill={getColor(151)}
        onPress={() => open(151)}
        d="M157.02,165.84l-0.5-1.43l-0.38-2.66l-0.51,0.23h-0.68l-2.62,1.21l-2.57,0.72l-0.45,0.5
		l0.88,2.29l0.88,1.39c0,0,2.41,0.75,2.26,2.47h1.62l2.94-3L157.02,165.84z"
      />
  <Path
        id="vadghar"
        fill={getColor(153)}
        onPress={() => open(153)}
        d="M151.07,168.09l-0.88-1.39l-0.88-2.29l-0.84,0.95l-2.45,1.77l-0.91,0.43l-2,0.53l-0.53,1.61v0.86
          l1.71,0.53v0.86l1.73,2.89l1.63,4.5v3.75c0.14-0.64,4.68-0.64,4.68-0.64v-3.86l0.53-4.32l0.47-3.71
          C153.48,168.84,151.07,168.09,151.07,168.09z"
      />
      <Path
        id="ambegaon_bk"
        fill={getColor(154)}
        onPress={() => open(154)}
        d="M146.02,174.84l-1.73-2.89v-0.86l-1.71-0.53v-0.86l0.53-1.61l-2.85,1.61l-2.08,1.93
          l-0.78,0.78l-1.57,0.5l-2.36,1.93l0.59,1.29l1.77,1.71l2.64,2l2.36,1.64l2.64,3.23c0-0.27,4.18-1.62,4.18-1.62v-3.75L146.02,174.84
          z"
      />
      <Path
        id="ambegaon_kd"
        fill={getColor(142)}
        onPress={() => open(142)}
        d="M142.03,164.98l-0.88-2.35l-3.29,1.6l-3.9,0.97l-4.24,0.64l-5.89,2.25l-4.4,1.5l0.97,2.75
          l1.07,1.41l1.11,1.73l0.82,2.65l1.95-2.5h4.87l0.75-0.43l2.5-0.36l2.36-1.93l1.57-0.5l0.78-0.78l2.08-1.93l2.85-1.61v-1.07
          L142.03,164.98z"
      />
      <Path
        id="kadave"
        fill={getColor(152)}
        onPress={() => open(152)}
        d="M165.93,158.88l-1.84,0.43l-1.47,0.64h-2.51l-3.97,1.8l0.38,2.66l0.5,1.43l0.87,1.72l-2.94,3
          h-1.62l-0.47,3.71l-0.53,4.32v3.86l1.64,1.61l1.66-0.97h3.77l3.14-0.32l1.14-0.64l-1.14-2.57l-0.07-3.16l-0.29-3.13l-0.06-2.89
          l-0.01-0.61l-0.78-3.14v-0.86l1.07-2.21l2.07-2.29l0.74-1.64l2.05-0.22l0.85-1.07L165.93,158.88z"
      />
      <Path
        id="shirkoli"
        fill={getColor(155)}
        onPress={() => open(155)}
        d="M140.83,181.48l-2.36-1.64l-2.64-2l-1.77-1.71l-0.59-1.29l-2.5,0.36l-0.75,0.43h-4.87l-1.95,2.5
          l-1.5,1.21c-0.86,0.54-3.11,0.43-3.11,0.43v0.96l1.5,3.33l1.07,2.46l1.22,1.88l0.6,1.33l0.65,2.36l2.89-0.43l2.57-0.75h4.77
          l4.66-0.53l2.43-2.79l2.32-2.88L140.83,181.48z"
      />
   <Path
        id="koshimghar"
        fill={getColor(140)}
        onPress={() => open(140)}
        d="M122.58,175.48l-1.11-1.73l-1.07-1.41l-0.97-2.75l-2.72,0.97v1.71l0.69,2.57l0.64,1.07
          l0.75,1.82v2.04c0,0,2.25,0.11,3.11-0.43l1.5-1.21L122.58,175.48z"
      />
      <Path
        id="bhalvadi"
        fill={getColor(141)}
        onPress={() => open(141)}
        d="M118.04,175.91l-0.64-1.07l-0.69-2.57v-1.71l-2.38,0.85l-5.77,0.97v1.37l0.7,2.65l-0.7,2.73
          v4.93l1.66-0.59l2.36,0.59l1.18-0.97l1.55-1.82l3.48-1.5v-2.04L118.04,175.91z"
      />
      <Path
        id="kasedi"
        fill={getColor(139)}
        onPress={() => open(139)}
        d="M108.56,173.75v-1.37l-4.88,1.07l-0.77,0.13l-0.37,1.26v1.25l0.18,1.22l0.21,1.82l-0.21,1.03
          l0.25,1.57v0.79l-0.25,0.95l0.5,0.59l0.68,1.21h1.75l0.18-0.25l0.57-0.31l1.28-0.4l0.36-0.1l0.52-0.15v-4.93l0.7-2.73
          L108.56,173.75z"
      />
      <Path
        id="ghodkai"
        fill={getColor(138)}
        onPress={() => open(138)}
        d="M103.04,184.71l-0.32-1.24l0.25-0.95v-0.79l-0.25-1.57l0.21-1.03l-0.21-1.82l-0.18-1.22v-1.25
          l0.37-1.26l-2.09,0.36l-1.64,3.37l-1.44,3.03l-1.77,3.72l-0.5,0.65l0.93,2.77l1.34,1.79l1.23,0.5l2.43-0.57l1.93-1.93
          L103.04,184.71z"
      />
      <Path
        id="pole"
        fill={getColor(156)}
        onPress={() => open(156)}
        d="M123.18,189.73l-0.6-1.33l-1.22-1.88l-1.07-2.46l-1.5-3.33v-0.96l-3.48,1.5l-1.55,1.82l-1.18,0.97
          l-2.36-0.59l-1.66,0.59l-0.52,0.15v9.7l0.52,4.65v1.64l1.7,0.57l3.42,0.36l1.63-0.79l2.59-2.07l2.15-2.43l2.53-2.36l1.25-1.39
          L123.18,189.73z"
      />
  <Path
        id="mangaon"
        fill={getColor(157)}
        onPress={() => open(157)}
        d="M108.04,193.91v-9.7l-0.36,0.1l-1.28,0.4l-0.57,0.31l-0.18,0.25h-1.75l-0.68-1.21l-0.5-0.59
          l0.32,1.24l0.29,2.56l-1.93,1.93l-2.43,0.57l-1.23-0.5l-2.95,2.82c0,0,2.54,0.39,3.39,2.82l1.22,4.15l1.08,3.5
          c0,0,2.49-1.5,3.42-1.43l3.17-0.72l1.49-0.21v-1.64L108.04,193.91z"
      />
      <Path
        id="dapsare"
        fill={getColor(137)}
        onPress={() => open(137)}
        d="M98.86,174.27l-4.07,0.57h-5.52l-3.56-1.39l-4.42-0.97l-2.74,0.97h-3.58l-0.93,1.89l-1.93,3.79
          l-0.5,3.57l1.68,0.28l2.75,0.49l2.14,1.8l2.08,1.14h1.03l5.32-0.71l2.15-2.64l3.5,1l3.21,0.65l0.5-0.65l1.77-3.72l1.44-3.03
          l1.64-3.37L98.86,174.27z"
      />
      <Path
        id="ghol"
        fill={getColor(159)}
        onPress={() => open(159)}
        d="M78.18,185.27l-2.14-1.8l-2.75-0.49l-1.68-0.28l-2,2.57l-1.64,2.21l-0.57,2.29l0.86,1.86l0.07,1.78
          l-1.29,2.36l1,2.07l2.36,1.22l2.36-0.93l1.92-0.79l2.29-0.86l0.86-0.14l-0.5-2.71l0.5-3.86l0.78-1.86l1.65-1.5L78.18,185.27z"
      />
      <Path
        id="tekpole"
        fill={getColor(158)}
        onPress={() => open(158)}
        d="M96.4,187.48l-0.93-2.77l-3.21-0.65l-3.5-1l-2.15,2.64l-5.32,0.71h-1.03l-1.65,1.5l-0.78,1.86
          l-0.5,3.86l0.5,2.71h1.35l1.08,1.72l1.78,1.85l2.45,0.65h2.62l2.16-1.22l0.7-2.28l2.29-2.86l2.53-2.11l2.95-2.82L96.4,187.48z"
      />
      <Path
        id="khanu"
        fill={getColor(160)}
        onPress={() => open(160)}
        d="M117.54,206.41l-0.86,2.72l-1.57-0.57l-3.35-0.5l-4.5,1.85l-3.08,2.57l-0.85-1.85l-0.79-1.79
          l-1.72-0.36l-0.42,1.08l-1,2.35l-1.66,1l-0.91-1.07l-2.5,0.72l-2.29-0.36v-1.57h-1.53v-2.57c0.69-0.36,0.75-4.36,0.75-4.36
          l0.5-2.14l-0.58-2.22c-0.5-0.93-1.91,0-1.91,0l0.7-2.28l2.29-2.86l2.53-2.11c0,0,2.54,0.39,3.39,2.82l1.22,4.15l1.08,3.5
          c0,0,2.49-1.5,3.42-1.43l3.17-0.72l1.49-0.21l1.7,0.57l3.42,0.36l0.29,0.93l1.96,1.28L117.54,206.41z"
      />
   <Path
        id="ranavadi"
        fill={getColor(400)}
        onPress={() => open(400)}
        d="M168.11,159.41h-0.85l-2.05,0.22l-0.74,1.64l-2.07,2.29l-1.07,2.21v0.86l0.78,3.14l0.01,0.61
          l5.99-2.29l0.96-0.75h0.01l0.82-0.64l0.71-4.07l0.41-1.02l0.66-1.66L168.11,159.41z"
      />
      <Path
        id="rule"
        fill={getColor(149)}
        onPress={() => open(149)}
        d="M179.18,161.75v-2.34l-2.35,0.93l-2.5,1.27l-0.22,1.02h-1.28v-1.02h-1.81l-0.41,1.02l-0.71,4.07
          l-0.82,0.64h5.03l4.36-1.57l1.64-1.36L179.18,161.75z"
      />
      <Path
        id="tidakiwadi"
        fill={getColor(150)}
        onPress={() => open(150)}
        d="M181.1,166.92l-0.13-0.36l-0.86-2.15l-1.64,1.36l-4.36,1.57h-4.71l0.93,1.57v2.29l0.78,1.35
          l0.57,0.58l0.72,2.43l-0.36,3l0.64,0.92l3.36,0.79l3.22,0.43l0.28-2.86l-0.13-1.44l-0.15-1.56l0.5-4.28l0.35-2.47l1.15-0.75
          L181.1,166.92z"
      />
      <Path
        id="osade"
        fill={getColor(148)}
        onPress={() => open(148)}
        d="M186.95,156.56l-1.84,0.21v1.04l-0.35,2.14l-1.81,3.43l-1.85,3.54l0.16,0.42h5.21v-1.19l0.79-3.81
          l1.24-2.93l0.33-2.85H186.95z"
      />
      <Path
        id="nigde_mose"
        fill={getColor(147)}
        onPress={() => open(147)}
        d="M191.04,156.56h-2.21l-0.33,2.85l-1.24,2.93l-0.79,3.81v1.19l2.03,0.29l1.69-0.19l0.85-0.1
          l0.14-2.45l0.92-3.85l-0.06-2.06C192.4,157.19,191.04,156.56,191.04,156.56z"
      />
   <Path
        id="ambed"
        fill={getColor(166)}
        onPress={() => open(166)}
        d="M188.5,167.63l-2.03-0.29h-5.21l-1.15,0.75l-0.35,2.47l-0.5,4.28l0.15,1.56l1.69-0.34l1.85-0.43
          l2.88-1.36l1.5-1.71c0.5-0.15,1.5-3.08,1.5-3.08L188.5,167.63z"
      />
      <Path
        id="kondgaon_1_"
        fill={getColor(167)}
        onPress={() => open(167)}
        d="M191.04,167.34l1.36,3.04l2.57,1.49h1.79l0.64-2.26l1.43-1.98L191.04,167.34z"
      />
      <Path
        id="khamgaon"
        fill={getColor(168)}
        onPress={() => open(168)}
        d="M190.19,167.44l-1.69,0.19l0.33,1.85c0,0-1,2.93-1.5,3.08l-1.5,1.71l-2.88,1.36l-1.85,0.43
          l-1.69,0.34l0.13,1.44l-0.28,2.86l0.42,0.08l1.42,0.28l2.58-0.72l3.93-1l2.22-2.14l0.64-1.79v-5.8L190.19,167.44z"
      />
      <Path
        id="ranjane"
        fill={getColor(169)}
        onPress={() => open(169)}
        d="M199.68,177.48l-0.57,2.36l0.15,1.86l-2.93,0.57l-2.15,0.82l-4.07,0.97l-3.16,0.65l-3.98,0.56
          l-1,0.36l-1.57-3.29l-0.72-1.56l1.42,0.28l2.58-0.72l3.93-1l2.22-2.14l0.64-1.79v-5.8l-0.28-2.17l0.85-0.1l1.36,3.04l2.57,1.49
          h1.79l2.07,1.4l0.85,2.29V177.48z"
      />



<SvgXml xml={svgText} width="100%" height="50%" />


       
</Svg>
<Modal isVisible={visible}>
        <View style={styles.modalContent}>
          {villageData ? (
            <>
              <RNText>Village Name: {villageData.villagename}</RNText>
              <RNText>Total Voters: {villageData.totalvoters}</RNText>
              <RNText>Male Voters: {villageData.malevoters}</RNText>
              <RNText>Female Voters: {villageData.femalevoters}</RNText>
              <RNText>Other Voters: {villageData.othervoters}</RNText>
              <RNText>Voting Percentage: {villageData.votingpercentage} %</RNText>
              <RNText>Ruling Party: {villageData.rulingparty}</RNText>
              <RNText>Reason: {villageData.reason}</RNText>
              <RNText>Religion wise Voters:</RNText>
              <RNText>Hindu: {villageData.hindu}</RNText>
              <RNText>Muslim: {villageData.muslim}</RNText>
              <RNText>Buddhist: {villageData.buddhist}</RNText>
              <Button title="Close" onPress={close} />
              <Button title="More Details" onPress={navigateToVillageDetails} />
            </>
          ) : (
            <RNText>Loading...</RNText>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Bhormap;