import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text as RNText,
  Button,
} from "react-native";
import Svg, { Image as SvgImage, Path, Text as SvgText, SvgXml,SvgUri } from "react-native-svg";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";


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

const IndapurMap = () => {
  const [modalVisible, setModalVisible] = useState(false);
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
      const response = await fetch('http://baramatiapi.beatsacademy.in/allindapurdata/');
      const data = await response.json();
      console.log('Svg Info', data.all_data);
      setSvgInfo(data.all_data);
      await AsyncStorage.setItem('svgInfo', JSON.stringify(data.all_data));
    } catch (error) {
      console.error('Error fetching SVG info:', error);
    }
  };

  const fetchVillageData = async (villageId: number) => {
    try {
      const response = await fetch(`http://baramatiapi.beatsacademy.in/indapurvillagedetails/${villageId}/`);
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error(`Error fetching village data: ${response.status} ${response.statusText}`);
        console.error('Response Text:', responseText);
        return;
      }
      const data = await response.json();
      if (!data || !data.village_data) {
        console.error('Received invalid data from server:', data);
        return;
      }
      setVillageData(data.village_data);
    } catch (error) {
      console.error('Error fetching village data:', error);
    }
  };
  

  const openModal = async (villageId: number) => {
    await fetchVillageData(villageId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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

  const getVillageLogo = (villageId: number) => {
    const village = svgInfo.find(item => item.id === villageId);
    if (village) {
      const rulingParty = village.rulingparty;
      if (rulingParty === 'Shivsena') {
        return require('../assets/images/shivsenaLogo.png');
      } else if (rulingParty === 'Congress') {
        return require('../assets/images/congressLogo.png');
      } else if (rulingParty === 'BJP') {
        return require('../assets/images/bjpLogo.png');
      } else if (rulingParty === 'NCP') {
        return require('../assets/images/ncpLogo.png');
      }
    }
    return require('../assets/images/defaultLogo.jpg');
  };

  const navigateToVillageDetails = () => {
    if (villageData) {
      closeModal();
      navigation.navigate('VillageDetails', { id: villageData.id });
    } else {
      console.error('Village data is null');
    }
  };

  
  const svgText = `
  <svg height="1946" width="2347" >
    <text transform="matrix(1 0 0 1 163.7621 37.7094)" font-size="5" fill="black">
  <tspan x="0" y="0">Bhigwan</tspan>
  <tspan x="0" y="4.14">Stn</tspan>
</text>
<text transform="matrix(1 0 0 1 135.2588 47.3961)" font-size="5" fill="black">
  Bhigwan
</text>
<text transform="matrix(1 0 0 1 163.9066 57.6518)" font-size="5" fill="black">
  Diksal
</text>
<text transform="matrix(1 0 0 1 110.2911 64.7221)" font-size="5" fill="black">
  Takrarwadi
</text>
<text transform="matrix(1 0 0 1 111.8234 84.0572)" font-size="5" fill="black">
  Madanwadi
</text>
<text transform="matrix(1 0 0 1 93.3548 97.2149)" font-size="5" fill="black">
  Pimpale
</text>
<text transform="matrix(1 0 0 1 51.5385 105.3389)" font-size="5" fill="black">
  Shetphalgadhe
</text>
<text transform="matrix(1 8.621859e-03 -8.621859e-03 1 159.8507 95.6389)" font-size="5" fill="black">
  Kumbhargaon
</text>
<text transform="matrix(1 8.621859e-03 -8.621859e-03 1 132.6419 99.3852)" font-size="5" fill="black">
  Bandgarwadi
</text>
<text transform="matrix(1 8.621859e-03 -8.621859e-03 1 114.5103 116.8851)" font-size="5" fill="black">
  Poundharwadi
</text>
<text transform="matrix(1 8.621860e-03 -8.621860e-03 1 139.5312 128.9054)" font-size="5" fill="black">
  Bhadalwadi
</text>
<text transform="matrix(1 0 0 1 42.6117 129.4052)" font-size="5" fill="black">
  Lamjewadi
</text>
<text transform="matrix(1 0 0 1 82.9322 138.8498)" font-size="5" fill="black">
  Nirgude
</text>
<text transform="matrix(1 0 0 1 47.4741 158.4049)" font-size="5" fill="black">
  Mhasobachiwadi
</text>
<text transform="matrix(1 0 0 1 115.7822 153.862)" font-size="5" fill="black">
  Akole
</text>
<text transform="matrix(1 0 0 1 102.6238 165.9633)" font-size="5" fill="black">
  Vaysewadi
</text>
<text transform="matrix(1 0 0 1 57.2831 184.683)" font-size="5" fill="black">
  Lakadi
</text>
<text transform="matrix(1 0 0 1 58.2457 209.9507)" font-size="5" fill="black">
  Nimbodi
</text>
<text transform="matrix(1 0 0 1 177.9466 114.8447)" font-size="5" fill="black">
  Dalaj No.1
</text>
<text transform="matrix(1 0 0 1 194.0242 121.9051)" font-size="5" fill="black">
  Dalaj No.3
</text>
<text transform="matrix(1 0 0 1 185.1583 134.2048)" font-size="5" fill="black">
  Dalaj No.2
</text>
<text transform="matrix(1 0 0 1 162.2598 143.9651)" font-size="5" fill="black">
  Pilewadi
</text>
<text transform="matrix(1 0 0 1 167.2804 172.7197)" font-size="5" fill="black">
  Kalas
</text>
<text transform="matrix(1 0 0 1 109.0751 200.1247)" font-size="5" fill="black">
  kazad
</text>
<text transform="matrix(0.0891 -0.996 0.996 0.0891 89.8625 210.8877)" font-size="5" fill="black">
  Shindewadi
</text>
<text transform="matrix(1 0 0 1 71.527 234.1196)" font-size="5" fill="black">
  Sansar
</text>
<text transform="matrix(1 0 0 1 49.678 246.0541)" font-size="5" fill="black">
  Bhavaninagar
</text>
<text transform="matrix(1 0 0 1 57.2829 257.2571)" font-size="5" fill="black">
  Sapakalwadi
</text>
<text transform="matrix(1 0 0 1 85.1219 255.0883)" font-size="5" fill="black">
  Jachakavasti
</text>
<text transform="matrix(1 0 0 1 139.5311 206.3499)" font-size="5" fill="black">
  Birangudwadi
</text>
<text transform="matrix(1 0 0 1 119.5579 233.0294)" font-size="5" fill="black">
  Bori
</text>
<text transform="matrix(0.9292 0.3697 -0.3697 0.9292 59.6068 267.0845)" font-size="5" fill="black">
  Hingnewadi
</text>
<text transform="matrix(1 0 0 1 58.2454 283.0612)" font-size="5" fill="black">
  Tawashi
</text>
<text transform="matrix(1 0 0 1 78.8924 284.768)" font-size="5" fill="black">
  Udhat
</text>
<text transform="matrix(1 0 0 1 82.3219 270.6447)" font-size="5" fill="black">
  Belwadi
</text>
<text transform="matrix(1 0 0 1 97.8354 277.0286)" font-size="5" fill="black">
  Pawarwadi
</text>
<text transform="matrix(1 0 0 1 124.9707 277.0609)" font-size="5" fill="black">
  Lasurne
</text>
<text transform="matrix(1 0 0 1 105.6724 261.0372)" font-size="5" fill="black">
  Kardanwadi
</text>
<text transform="matrix(1 0 0 1 135.8088 253.19)" font-size="5" fill="black">
  Junction
</text>
<text transform="matrix(1 0 0 1 161.375 215.0696)" font-size="5" fill="black">
  Bagawadi
</text>
<text transform="matrix(1 0 0 1 164.3221 257.8553)" font-size="5" fill="black">
  Anthurne
</text>
<text transform="matrix(1 0 0 1 182.9442 267.0844)" font-size="5" fill="black">
  Bharnewadi
</text>
<text transform="matrix(1 0 0 1 197.8827 233.7734)" font-size="5" fill="black">
  Shelgaon
</text>
<text transform="matrix(1 0 0 1 193.2579 171.8931)" font-size="5" fill="black">
  Gosaviwadi
</text>
<text transform="matrix(1 0 0 1 213.9921 179.4301)" font-size="5" fill="black">
  Rui
</text>
<text transform="matrix(1 0 0 1 220.1815 124.4451)" font-size="5" fill="black">
  Kalewadi No.1
</text>
<text transform="matrix(1 0 0 1 258.3098 113.9513)" font-size="5" fill="black">
  Palasdeo
</text>
<text transform="matrix(1 0 0 1 211.5162 154.6253)" font-size="5" fill="black">
  Maradwadi
</text>
<text transform="matrix(1 0 0 1 248.1544 160.0042)" font-size="5" fill="black">
  Nhavi
</text>
<text transform="matrix(1 0 0 1 252.1765 142.5829)" font-size="5" fill="black">
  Bandewadi
</text>
<text transform="matrix(1 0 0 1 267.4029 130.6649)" font-size="5" fill="black">
  Malewadi
</text>
<text transform="matrix(1 0 0 1 304.5739 99.6214)" font-size="5" fill="black">
  Chandgaon
</text>
<text transform="matrix(1 0 0 1 300.5977 116.8849)" font-size="5" fill="black">
  Bhawadi
</text>
<text transform="matrix(1 0 0 1 279.0556 151.6)" font-size="5" fill="black">
  Deokar
</text>
<text transform="matrix(1 0 0 1 328.7079 114.5447)" font-size="5" fill="black">
  Agoti
  <tspan x="0" y="4.99">No.1</tspan>
</text>
<text transform="matrix(1 0 0 1 342.4282 117.9697)" font-size="5" fill="black">
  Agoti
  <tspan x="0" y="4.99">No.2</tspan>
</text>
<text transform="matrix(0.8518 -0.5239 0.5239 0.8518 376.9579 107.0874)" font-size="5" fill="black">
  Ganjewalan
</text>
<text transform="matrix(1 0 0 1 360.6726 125.8759)" font-size="5" fill="black">
  Kalashi
</text>
<text transform="matrix(1 0 0 1 317.2411 146.4145)" font-size="5" fill="black">
  Varkute Bk
</text>
<text transform="matrix(1 0 0 1 359.0037 153.405)" font-size="5" fill="black">
  Kalthan
  <tspan x="0" y="4.99">No.1</tspan>
</text>
<text transform="matrix(1 0 0 1 224.4187 193.8349)" font-size="5" fill="black">
  Thoratwadi
</text>
<text transform="matrix(1 0 0 1 253.8721 192.095)" font-size="5" fill="black">
  Boratwadi
</text>
<text transform="matrix(1 0 0 1 288.9872 176.2346)" font-size="5" fill="black">
  Balpudi
</text>
<text transform="matrix(1 0 0 1 278.0261 204.9549)" font-size="5" fill="black">
  Kauthali
</text>
<text transform="matrix(1 0 0 1 249.7922 229.6069)" font-size="5" fill="black">
  Vyahali
</text>
<text transform="matrix(1 0 0 1 73.5002 297.0952)" font-size="5" fill="black">
  Gholapwadi
</text>
<text transform="matrix(1 0 0 1 81.8432 311.615)" font-size="5" fill="black">
  Jamb
</text>
<text transform="matrix(1 0 0 1 100.8106 308.4333)" font-size="5" fill="black">
  Kurawali
</text>
<text transform="matrix(1 0 0 1 94.4622 293.5707)" font-size="5" fill="black">
  Mankarwadi
</text>
<text transform="matrix(1 0 0 1 113.2325 288.5046)" font-size="5" fill="black">
  Paritwadi
</text>
<text transform="matrix(1 0 0 1 127.5647 298.0554)" font-size="5" fill="black">
  Thoratwadi
</text>
<text transform="matrix(1 0 0 1 122.8158 308.7006)" font-size="5" fill="black">
  Chavanwadi
</text>
<text transform="matrix(1 0 0 1 123.7321 326.1358)" font-size="5" fill="black">
  Chikhali
</text>
<text transform="matrix(1 0 0 1 159.2466 322.9544)" font-size="5" fill="black">
  kalamb
</text>
<text transform="matrix(1 0 0 1 167.2802 295.8868)" font-size="5" fill="black">
  Ranmodwadi
</text>
<text transform="matrix(1 0 0 1 174.6563 307.4371)" font-size="5" fill="black">
  Walchandnagar
</text>
<text transform="matrix(1 0 0 1 204.0124 329.0969)" font-size="5" fill="black">
  kalamb
</text>
<text transform="matrix(1 0 0 1 197.8827 279.8248)" font-size="5" fill="black">
  Sirsatwadi
</text>
<text transform="matrix(1 0 0 1 192.5337 298.0551)" font-size="5" fill="black">
  Kandbandwadi
</text>
<text transform="matrix(0.5274 -0.8496 0.8496 0.5274 223.9026 283.0606)" font-size="5" fill="black">
  Hagarwadi
</text>
<text transform="matrix(1 0 0 1 240.7836 290.1244)" font-size="5" fill="black">
  Gotondi
</text>
<text transform="matrix(1 0 0 1 263.4271 253.1897)" font-size="5" fill="black">
  Kacharwadiv
</text>
<text transform="matrix(1 0 0 1 293.1683 252.6782)" font-size="5" fill="black">
  Nimgaon
  <tspan x="0" y="6.18">Ketki</tspan>
</text>
<text transform="matrix(1 0 0 1 231.086 316.1127)" font-size="5" fill="black">
  Ghorpadwadi
</text>
<text transform="matrix(1 0 0 1 260.6128 309.92)" font-size="5" fill="black">
  Pitkeshwar
</text>
<text transform="matrix(1 0 0 1 253.872 326.1358)" font-size="5" fill="black">
  Sarafwadi
</text>
<text transform="matrix(1 0 0 1 238.1639 339.1157)" font-size="5" fill="black">
  Dagadwadi
</text>
<text transform="matrix(0.2926 -0.9562 0.9562 0.2926 301.2178 217.1852)" font-size="5" fill="black">
  Karewadi
</text>
<text transform="matrix(1 0 0 1 316.4826 201.0507)" font-size="5" fill="black">
  Bijwadi
</text>
<text transform="matrix(1 0 0 1 309.0643 222.0951)" font-size="5" fill="black">
  Pondkulwadi
</text>
<text transform="matrix(1 0 0 1 327.9854 178.3249)" font-size="5" fill="black">
  Gagargaon
</text>
<text transform="matrix(1 0 0 1 355.131 169.8199)" font-size="5" fill="black">
  Kalthan
  <tspan x="0" y="4.16">No.2</tspan>
</text>
<text transform="matrix(1 0 0 1 383.4589 170.6933)" font-size="5" fill="black">
  Shirsodi
</text>
<text transform="matrix(1 0 0 1 437.3394 150.4519)" font-size="5" fill="black">
  Padasthal
</text>
<text transform="matrix(1 0 0 1 337.3166 262.4546)" font-size="5" fill="black">
  Tarangwadi
</text>
<text transform="matrix(1 0 0 1 356.0122 227.438)" font-size="5" fill="black">
  Indapur
  <tspan x="0" y="7.09">(Rural)</tspan>
</text>
<text transform="matrix(1 0 0 1 336.602 243.4268)" font-size="5" fill="black">
  Gokhali
</text>
<text transform="matrix(1 0 0 1 366.12 192.4907)" font-size="5" fill="black">
  Narutwadi
</text>
<text transform="matrix(1 0 0 1 345.0594 200.1248)" font-size="5" fill="black">
  Vangali
</text>
<text transform="matrix(1 0 0 1 368.7509 205.0825)" font-size="5" fill="black">
  Galandwadi
</text>
<text transform="matrix(1 0 0 1 413.831 183.7141)" font-size="5" fill="black">
  Pimpri
  <tspan x="0" y="6.18">Kh</tspan>
</text>
<text transform="matrix(1 0 0 1 447.2575 171.8932)" font-size="5" fill="black">
  Ajoti
</text>
<text transform="matrix(1 0 0 1 409.0021 202.8378)" font-size="5" fill="black">
  Malwadi
</text>
<text transform="matrix(1 0 0 1 435.892 193.8349)" font-size="5" fill="black">
  Sugaon
</text>
<text transform="matrix(1 0 0 1 439.3832 207.8249)" font-size="5" fill="black">
  Malwadi
  <tspan x="0" y="4.64">No.2</tspan>
</text>
<text transform="matrix(1 0 0 1 392.9822 228.6074)" font-size="5" fill="black">
  Indapur
</text>
<text transform="matrix(1 0 0 1 450.3576 235.2398)" font-size="5" fill="black">
  Shaha
</text>
<text transform="matrix(1 0 0 1 482.0934 237.0247)" font-size="5" fill="black">
  Kadalgaon
</text>
<text transform="matrix(1 0 0 1 454.3772 257.5346)" font-size="5" fill="black">
  Hingangaon
</text>
<text transform="matrix(1 0 0 1 478.9322 262.4545)" font-size="5" fill="black">
  Taratgaon
</text>
<text transform="matrix(1 0 0 1 402.2222 262.4545)" font-size="5" fill="black">
  Galandwadi
</text>
<text transform="matrix(1 0 0 1 435.7222 247.1996)" font-size="5" fill="black">
  Sardewadi
</text>
<text transform="matrix(1 0 0 1 378.837 261.0369)" font-size="5" fill="black">
  Vitthal
  <tspan x="0" y="5.83">wadi</tspan>
</text>
<text transform="matrix(1 0 0 1 297.6366 290.1245)" font-size="5" fill="black">
  Varkute Kh
</text>
<text transform="matrix(1 0 0 1 333.6021 281.5631)" font-size="5" fill="black">
  Zagadewadi
</text>
<text transform="matrix(1 0 0 1 297.6573 319.7729)" font-size="5" fill="black">
  Kati
</text>
<text transform="matrix(1 0 0 1 281.4417 340.0053)" font-size="5" fill="black">
  Reda
</text>
<text transform="matrix(1 0 0 1 302.703 340.8881)" font-size="5" fill="black">
  Jadhav
  <tspan x="0" y="5.5">wadi</tspan>
</text>
<text transform="matrix(1 0 0 1 246.6337 353.8773)" font-size="5" fill="black">
  Nirwangi
</text>
<text transform="matrix(1 0 0 1 272.9929 362.5245)" font-size="5" fill="black">
  Redni
</text>
<text transform="matrix(1 0 0 1 242.5262 386.2925)" font-size="5" fill="black">
  Khorochi
</text>
<text transform="matrix(1 0 0 1 263.7504 400.7023)" font-size="5" fill="black">
  Boratwadi
</text>
<text transform="matrix(1 0 0 1 294.002 391.5213)" font-size="5" fill="black">
  Chakati
</text>
<text transform="matrix(1 0 0 1 307.128 374.0268)" font-size="5" fill="black">
  Lakhewadi
</text>
<text transform="matrix(1 0 0 1 318.9533 355.7841)" font-size="5" fill="black">
  Bhodani
</text>
<text transform="matrix(1 0 0 1 342.4283 324.625)" font-size="5" fill="black">
  Shetphal
  <tspan x="0" y="5.11">Haveli</tspan>
</text>
<text transform="matrix(1 0 0 1 342.4282 300.0643)" font-size="5" fill="black">
  Pandharwadi
</text>
<text transform="matrix(1 0 0 1 363.8522 300.9076)" font-size="5" fill="black">
  Wadapuri
</text>
<text transform="matrix(1 0 0 1 426.1531 284.6949)" font-size="5" fill="black">
  Babhulgaon
</text>
<text transform="matrix(1 0 0 1 400.5424 290.1815)" font-size="5" fill="black">
  Bedshinge
</text>
<text transform="matrix(1 0 0 1 409.002 304.3144)" font-size="5" fill="black">
  Bhatnimgoan
</text>
<text transform="matrix(1 0 0 1 388.3129 312.913)" font-size="5" fill="black">
  Awasari
</text>
<text transform="matrix(1 0 0 1 383.4589 336.3494)" font-size="5" fill="black">
  Bhandgaon
</text>
<text transform="matrix(1 0 0 1 363.0126 337.6369)" font-size="5" fill="black">
  Surwad
</text>
<text transform="matrix(1 0 0 1 343.3022 381.1099)" font-size="5" fill="black">
  Bawada
</text>
<text transform="matrix(1 0 0 1 370.4708 356.7498)" font-size="5" fill="black">
  Vakilvasti
</text>
<text transform="matrix(1 0 0 1 318.7418 399.4642)" font-size="5" fill="black">
  Pithewadi
</text>
<text transform="matrix(1 0 0 1 321.2224 416.2447)" font-size="5" fill="black">
  Nirnimgaon
</text>
<text transform="matrix(1 0 0 1 348.3219 421.5032)" font-size="5" fill="black">
  Kacharwadi
</text>
<text transform="matrix(1 0 0 1 376.9583 423.4518)" font-size="5" fill="black">
  Sarati
</text>
<text transform="matrix(1 0 0 1 392.5321 403.5414)" font-size="5" fill="black">
  Ganeshwadi
</text>
<text transform="matrix(1 0 0 1 398.3337 436.2852)" font-size="5" fill="black">
  Lumewadi
</text>
<text transform="matrix(1 0 0 1 407.3897 420.122)" font-size="5" fill="black">
  Gondi
</text>
<text transform="matrix(1 0 0 1 425.015 399.04)" font-size="5" fill="black">
  Pimpri Bk
</text>
<text transform="matrix(1 0 0 1 449.0856 377.1052)" font-size="5" fill="black">
  Tannu
</text>
<text transform="matrix(1 0 0 1 458.6027 392.1092)" font-size="5" fill="black">
  Giravi
</text>
<text transform="matrix(1 0 0 1 478.1612 359.5438)" font-size="5" fill="black">
  Narsingpur
</text>
<text transform="matrix(1 0 0 1 442.0154 417.9872)" font-size="5" fill="black">
  Ozare
</text>

  </svg>`;
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RNText style={styles.header}>Indapur Map</RNText>
      <View style={styles.svgContainer}>
        <Svg viewBox="0 0 552 468.24" width="100%" height="100%">
        <SvgImage
          width="2300"
          height="1951"
          transform="matrix(0.24 0 0 0.24 0 0)"
        />

          <Path
          id="bhigwan_stn"
          fill={getColor(2)}
          onPress={() => openModal(2)}
          d="M178.96,37.7c-0.03,0.56-0.08,1.13-0.12,1.71l-0.03,0.38l-0.05,0.49l-1.24,0.61l-5.76,2.9
          l-3.69,2.34h-2.04l-4.19-1.95c0.13-2.4,0.56-4.71,0.56-4.71v-9.09l12.25,1.26C174.65,31.64,179.32,31.89,178.96,37.7z"
        />
        <Path
          id="diksal"
          fill={getColor(3)}
          onPress={() => openModal(3)}
          d="M178.33,57.65c0,0-2.85,4.4-2.85,6.42c0,2.01,0.18,4.17,0.18,4.17l-3.99,0.21h-6.12l-4.69-0.99
          c0,0-4.94-0.09-1.79-3.96c0.81-0.99,1.3-1.59,1.59-1.92c-0.03,0.1-0.05,0.17-0.05,0.2c0.1-0.14,0.83-1.12,0.05-0.2
          c0.43-1.52,2.98-10.77,1.74-12.75c-0.51-0.81-0.63-2.33-0.59-3.91l0.03-0.74l4.19,1.95h2.04l3.69-2.34l5.76-2.9l1.24-0.61l0.05-0.49
          c-0.46,5.35-1.24,11.2,0.17,13.27C180.58,55.4,178.33,57.65,178.33,57.65z"
        />
        <Path
          id="bhigwan"
          fill={getColor(1)}
          onPress={() => openModal(1)}
          d="M162.4,39.47c0,0-1.35,7.2,0,9.36c1.35,2.16-1.8,12.96-1.8,12.96s1.62-2.16-1.53,1.71
          s1.79,3.96,1.79,3.96l4.69,0.99h6.12l0.36,3.6c0,0-6.66,2.43-6.93,2.43s-4.23,1.08-4.23,1.08l-2.16-1.17l-0.18-2.97l-1.98-4.41
          l-2.61-1.8l-2.79-1.17l-2.16-1.71l-1.8-2.34l-3.6-0.9l-2.88-0.72l-2.61-3.78l-3.87-2.43L130,52.07l-5.4,1.89l-1.35-0.99l3.6-3.91
          l1.53-3.01c0,0,5.76-12.87,7.38-16.38s6.39-2.79,6.39-2.79l4.95,1.26l3.33,1.89l2.79,0.36l4.81-0.72l4.37,0.72V39.47z"
        />
        <Path
          id="takrarwadi"
          fill={getColor(4)}
          onPress={() => openModal(4)}
          d="M124.6,53.96l5.4-1.89l4.23,0.09l3.87,2.43l2.61,3.78l3.9,0.98l1.11,2.89l1.2,1.83
          c0,0,4.08,2.31,6.6,2.97c2.52,0.66,2.4,2.88,2.4,2.88l1.02,2.7l1.09,2.04c0,0-2.29,0.3-2.47,0.3c-0.18,0-2.28,0.96-2.46,0.96
          c-0.18,0-0.96,1.02-0.96,1.02v0.69h-1.86l-0.27-1.14c0,0-0.51-0.96-0.63-0.93s-1.74,0-1.74,0l-0.84-0.78l-16.5-2.31
          c0,0-2.82,0.12-4.5,1.02s-2.25,0.15-2.25,0.15s-2.04-1.2-3.87-2.46s-3.99-0.57-3.99-0.57l-2.34,0.84l-2.1-0.93l-4.12,1.26
          l-3.05-0.07l-2.39,1.71h-2.03l-0.02-0.7c0,0-2.03-1.69-2.21-3.89c-0.18-2.2-2.71-1-2.71-1l-2,1.33l-0.18-1.8l-0.63-4.59
          c0,0-0.45-2.61-0.9-8.01c-0.45-5.4,5.85-4.14,5.85-4.14l9.18,0.99h7.11c0,0,6.12,1.26,6.48,1.35s3.6,0,3.6,0L124.6,53.96z"
        />
        <Path
          id="pimpale_1_"
          fill={getColor(7)}
          onPress={() => openModal(7)}
          d="M111.46,101.03l-0.27,1.53l1.39,1.71l-3.24,2.7l-0.44,3.01c0,0-2.8,0.1-2.93,0.1
            s-2.83-0.05-2.83-0.05l-2.75,2.25l-2.88-0.24l-3.06,3.03l-1.96,1.21l-6.59-4.72l-2.56-2.38l-0.41-1.26l7.17-23.54L103,86l17.34,8.94
            l0.48,1.71l-6.39,3.03L111.46,101.03z"
        />
        <Path
          id="shetphalgadhe_1_"
          fill={getColor(6)}
          onPress={() => openModal(6)}
          d="M92.49,116.28l-1.62-0.11l-1.53,1.04l-0.68,1.37l-3,2.1l-4.71,0.09l-5.88,4.35
            l-1.27-0.33c-1.9-2.47-4.46,1.31-4.46,1.31s-2.93-0.18-3.1-0.18c-0.18,0-1.58,2.29-1.58,2.29l-1.84,0.09l-0.26-1.32
            c-0.24-5.94-5.58-4.62-5.58-4.62l-1.56,0.18l-4.68,0.36l-1.92-0.9v-11.46h-2.46l-3.75,2.74c0.85-3.63,1.84-7.38,2.88-10.36
            c2.97-8.55,10.47-15.48,10.47-15.48s4.98-2.52,13.98-5.46s12.96-0.72,13.2-0.72c0.24,0,6.96,3.12,6.96,3.12l-7.17,23.54l0.41,1.26
            l2.56,2.38L92.49,116.28z"
        />
        <Path
          id="lamjewadi_1_"
          fill={getColor(24)}
          onPress={() => openModal(24)}
          d="M62.82,128.3L62,129.83c-0.99,4.59-7.69,5.4-7.69,5.4l-2.11-0.27l-1.62,0.63
            c-3.88,2.29-7.97-1.21-7.97-1.21l-2.73-2.12v-5.76c0,0,1.12-6.4,2.73-13.22l3.75-2.74h2.46V122l1.92,0.9l4.68-0.36l1.56-0.18
            c0,0,5.34-1.32,5.58,4.62L62.82,128.3z"
        />
        <Path
          id="madanwadi"
          fill={getColor(5)}
          onPress={() => openModal(5)}
          d="M90.1,84.38l0.91-3.6l3.89,1.44c0,0,6.48,1.02,5.4-3.6c0,0-0.72-1.29-0.6-1.29
            c0.12,0-0.18-1.59-0.18-1.59l1.59-0.81l3.69-1.49h4.77h1.68l3-0.97h4.95l1.62,0.69l0.84,0.9l0.81,1.14l1.77,0.54l1.94-0.18
            l1.71-0.85l2.74-0.01l1.29,0.45c0,0,2.76-0.45,2.91-0.45c0.15,0,2.22,0.6,2.22,0.6l1.38,0.39l1.98-0.12l1.29-0.24l1.56,0.75
            l2.79,0.3c0,0,1.65,0.09,1.98,1.08c0.33,0.99,1.74,1.56,1.74,1.56s1.98-0.03,1.41,1.38c-0.57,1.41-1.07,3-1.07,3l-1.8,3.78
            c0,0-0.45,1.22-3.96,1.49c-3.51,0.27-4.23,0.63-4.23,0.63l-3.24,1.53l-2.79,0.49l-2.7,1.17c0,0-5.49,2.25-5.81,2.3
            c-0.31,0.04-5.06,0.86-5.06,0.86l-0.19-0.69L103,86L90.1,84.38z"
        />
         <Path
          id="bhadalwadi_1_"
          fill={getColor(22)}
          onPress={() => openModal(22)}
          d="M170.7,124.51l0.01-0.03l0.01-0.04c0.09-0.72,0.21-1.6,0.35-2.54
            c0.36-2.61,0.78-5.7,1.01-7.35l-14-3.26h-4.5l-3.64-0.9l-1.49-0.36h-3.42l-3.24-1.21l-3.78,3.28l0.45,1.35l-0.9,2.07l-4.38,13.23
            l-1.47,5.74c1.48,0.29,2.36,0.38,2.63,0.4l0.1,0.01c0,0,0.19-0.03,0.53-0.05c0.06,0,0.12-0.01,0.19-0.01
            c0.45-0.03,1.1-0.05,1.87,0.04c0.17,0.02,0.34,0.04,0.52,0.06c0.23,0.03,0.47,0.07,0.72,0.11c0.14,0.03,0.29,0.06,0.44,0.09
            c0.51,0.12,1.05,0.27,1.6,0.47c0.14,0.05,0.28,0.1,0.42,0.16c0.12,0.05,0.24,0.09,0.36,0.16c0.73,0.33,1.47,0.75,2.22,1.28
            c0.13,0.08,0.25,0.17,0.37,0.27c1.76,1.36,3.02,2.39,3.88,3.16c0.02,0.02,0.04,0.04,0.06,0.05c0.12,0.1,0.12,0.1,0.12,0.1l0.07,0.06
            c0.85,0.74,1.27,1.18,1.43,1.35l0.08,0.08l0.3,1.68c0,0,3.3-0.42,3.66-0.54c0.36-0.12,4.38-2.16,4.38-2.16l1.38-1.25l1.86-1.69
            l0.36-2.34l1.74-1.74l2.94-0.72l2.76-0.96l2.1-0.96c0,0-0.42-4.92-0.36-5.22C170.45,126.31,170.55,125.59,170.7,124.51z"
        />
        <Path
          id="kumbhargaon"
          fill={getColor(9)}
          onPress={() => openModal(9)}
          d="M198.4,95.84l-3.66-3.54l-3.42-1.56l-7.26-4.98l-6.48-4.38l-5.55,7.98l-2.19,3l-0.78,2.76
            l-1.14,3.72l-2.64,4.56l-1.02,0.9l1.08,0.9h3c0,0,3.24,0.74,2.84,3.93c-0.41,3.19,0.67,3.91,0.67,3.91h0.53l0.46-1l3.3-0.54h3.3
            l2.88-3.12c0,0,3.84-0.06,4.02-0.06s1.62-1.98,1.8-2.04c0.18-0.06,2.1-0.06,2.1-0.06l1.74-1.68l6.72-0.42l1.08-1.86l0.72-1.68
            L198.4,95.84z M171.18,109.13c0.4-3.19-2.84-3.93-2.84-3.93h-3l-1.08-0.9l1.02-0.9l2.64-4.56l1.14-3.72l0.78-2.76l2.19-3l5.55-7.98
            l-0.36-0.24l-2.44-1.76l-1.22-2.34l0.18-2.02l-1.71-1.35l-2.79,1.03c0,0-4.8,2.99-9.51,2.42s-6.3-0.69-6.21,2.7l-0.3,1.02
            l-0.81,1.14l-0.21,1.08v2.28c0,0-1.62,1.47-2.04,3.03l1.98,4.29c0,0,1.39,3.56,0,8.86c-1.4,5.32-2.2,8.87-2.2,8.87l3.64,0.9h4.5
            l14,3.26c0.1-0.74,0.16-1.19,0.16-1.19l0.14-0.32h-0.53C171.85,113.04,170.77,112.32,171.18,109.13z"
        />
        <Path
          id="poundhawadi_1_"
          fill={getColor(23)}
          onPress={() => openModal(23)}
          d="M138.01,112.1l0.45,1.35l-0.9,2.07l-4.38,13.23l-1.47,5.74c-0.89-0.18-2-0.43-3.33-0.79
            c-4.02-1.08-10.2,0.06-10.2,0.06l-2.4,1.5l-0.36-1.68l-0.78-5.1l-0.42-3.84l-1.5-5.1L112,113.9l-1.02-2.04l-2.08-1.88l0.44-3.01
            l3.24-2.7l-1.39-1.71l0.27-1.53l3.3-0.45l5.04-2.7l2.94-1.26c0,0,0.79-0.21,1.84-0.5l1.73,2.34l4.23,2.48c0,0,1.74,0.42,1.98,0.42
            c0.24,0,4.8,3.12,4.8,3.12l3.48,3.06l0.99,1.28L138.01,112.1z"
        />
        <Path
          id="bandgarwadi_1_"
          fill={getColor(8)}
          onPress={() => openModal(8)}
          d="M152.14,101.52c-1.4,5.32-2.2,8.87-2.2,8.87l-1.49-0.36h-3.42l-3.24-1.21l-0.99-1.28
            l-3.48-3.06c0,0-4.56-3.12-4.8-3.12c-0.24,0-1.98-0.42-1.98-0.42l-4.23-2.48l-1.73-2.34c1.88-0.51,4.59-1.24,4.94-1.36
            c0.54-0.18,4.32-1.92,5.64-1.8s3.72-0.96,4.5-1.92c0.78-0.96,3.18-1.14,5.28-1.32c2.1-0.18,3.42-0.84,3.42-0.84l1.17-0.09l0.63-0.42
            l1.98,4.29C152.14,92.66,153.53,96.22,152.14,101.52z"
        />
         <Path
          id="nirgude_1_"
          fill={getColor(25)}
          onPress={() => openModal(25)}
          d="M115.78,135.26l-0.06,2.34l-2.76,0.96c0,0-3.96,7.68-4.06,7.86
            c-0.1,0.18-4.82,12.03-4.82,12.03l-2.43,7.65l-3.06,9.27L96.16,176c0,0-7.92,0.81-8.28,0.81c-0.36,0-4.14-0.81-4.14-0.81l-6.36-4.26
            l-5.82-1.62l-4.38-1.32l-0.79-0.56l5.47-2.14l2.52-1.89c4.68-0.09,4.5-8.64,4.5-8.64c2.88-3.96-2.16-7.65-2.16-7.65
            s-4.41-1.17-7.2,0.54c-2.79,1.71-6.7,1.62-6.7,1.62s-5.72-0.27-9.68,1.08c-3.96,1.35-6.39,0.54-6.39,0.54l-3.69-0.54l-3.18,0.54
            l-1.77,1.86c-0.32-1.34-0.45-2.4-0.45-2.4l1.02-6.66l1.2-12.24c7.02,6.96,10.7,3.33,10.7,3.33l1.62-0.63l2.11,0.27
            c7.47-1.23,7.69-5.4,7.69-5.4l0.82-1.53l1.84-0.09l1.58-2.29l3.1,0.18c2.82-3.73,4.46-1.31,4.46-1.31l1.27,0.33l5.88-4.35l4.71-0.09
            l3-2.1l0.68-1.37l1.53-1.04l1.62,0.11l1.96-1.21l3.06-3.03l2.88,0.24l2.75-2.25l5.76-0.05l2.08,1.88l1.02,2.04l0.72,5.64l1.5,5.1
            C114.05,125.53,115.78,135.26,115.78,135.26z"
        />
        <Path
          id="mhasbachiwadi_1_"
          fill={getColor(26)}
          onPress={() => openModal(26)}
          d="M78.88,155.57c0,0,0.18,8.55-4.5,8.64l-2.52,1.89l-5.47,2.14l-1.79-1.27l-2.52,0.39
            l-3.72-0.42l-8.64-0.36l-1.35-2.64c0,0-5.76-3.78-7.92-5.58c-1.2-1-1.93-3.11-2.34-4.8l1.77-1.86l3.18-0.54l3.69,0.54
            c0,0,2.43,0.81,6.39-0.54c3.96-1.35,9.68-1.08,9.68-1.08s3.91,0.09,6.7-1.62c2.79-1.71,7.2-0.54,7.2-0.54S81.76,151.61,78.88,155.57
            z"
        />
        <Path
          id="vaysewadi_1_"
          fill={getColor(27)}
          onPress={() => openModal(27)}
          d="M116.23,168.94c0,0-3.55,8.25,0.52,10.16c-0.86-0.19-0.97-0.16-0.97-0.16
            s-4.36-0.51-6.88-2.13c-2.52-1.62-4.87-3.33-10.31-1.44l5.18-15.97l2.96-1l2.48,0.5l1.89,1.35h1.75l2.39-0.92
            c0,0,5.58-2.59,4.05,2.85C117.76,167.63,116.23,168.94,116.23,168.94z"
        />
        <Path
          id="akole_1_"
          fill={getColor(28)}
          onPress={() => openModal(28)}
          d="M149.32,142.28l-0.08-0.08l-1.43-1.35l-0.07-0.06c0,0,0,0-0.12-0.1
            c-0.02-0.01-0.04-0.03-0.06-0.05c-0.34-0.26-1.26-1.02-3.88-3.16c-0.12-0.1-0.24-0.19-0.37-0.27c-0.72-0.55-1.47-0.98-2.22-1.28
            c-0.12-0.07-0.24-0.11-0.36-0.16c-0.14-0.06-0.28-0.11-0.42-0.16c-0.55-0.2-1.09-0.35-1.6-0.47c-0.15-0.03-0.3-0.06-0.44-0.09
            c-0.25-0.04-0.49-0.08-0.72-0.11c-0.18-0.02-0.35-0.04-0.52-0.06c-0.77-0.06-1.42-0.06-1.87-0.04c-0.07,0-0.13,0.01-0.19,0.01
            c-0.34,0.02-0.53,0.05-0.53,0.05l-0.1-0.01l-2.63-0.4l-3.33-0.79c-1-0.37-2.5-0.48-4.04-0.46h-0.23c-0.19,0-0.38,0.01-0.57,0.01
            c-2.35,0.08-4.62,0.4-5.21,0.49c-0.1,0.01-0.15,0.02-0.15,0.02l-2.4,1.5l-0.06,2.34l-2.76,0.96l-4.06,7.86l-4.82,12.03l-0.31,0.95
            l2.96-1l2.48,0.5l1.89,1.35h1.75l2.39-0.92c0,0,5.58-2.59,4.05,2.85c-1.53,5.45-3.06,6.76-3.06,6.76s-3.55,8.25,0.52,10.16h0.01
            l0.17,0.04c0.89,0.2,2.45,0.61,5.21,1.42c5.35,1.57,9.59-0.91,10.37-1.41c0.09-0.06,0.13-0.09,0.13-0.09l2.88-3.69l3.12-2.67
            l2.82-4.86l7.2-16.2l0.96-7.68L149.32,142.28z"
        />
        <Path
          id="bori"
          fill={getColor(73)}
          onPress={() => openModal(73)}
          d="M154,222.5c0,0,1.29-3.22-2.74-3.87c-0.23-0.04-0.48-0.07-0.74-0.09c-4.92-0.36-7.68-6.96-7.68-6.96
            l-9-6l-2.7,0.54l-1.92,1.5c0,0-1.92,1.5-4.92,2.1c-3,0.6-3.12,1.62-3.12,1.62l-1.38,6l-2.22,1.46l-0.48,2.08
            c-1.74,7.26-10.86,4.8-10.86,4.8l-1.12-0.35l-3.06,5.07c0,0-2.52,3.74,0,7.48c2.51,3.73,3.06,4.9,3.06,4.9s-0.59,5.4,3.5,7.11
            c4.1,1.71,3.83,2.52,3.83,2.52h2.97l2.52,0.63h4.8l5.7,1.86l7.86-7.26l6.66-6.48l3.12-4.32h8c-0.76-2.41-0.9-4.83,0.16-7.26
            c0.14-0.32,0.26-0.62,0.36-0.92C155.98,224.59,154,222.5,154,222.5z"
        />
        <Path
  id="kazad_1_"
  fill={getColor(52)}
  onPress={() => openModal(52)}
  d="M136.66,192.92l-1.98-8.19l-1.62-4.68l-0.42-0.99c0,0-0.04,0.03-0.13,0.09
	c-0.8,0.54-5.15,3.22-10.37,1.41l-5.21-1.42l-0.17-0.04h-0.01l-0.97-0.16c0,0-4.67-0.42-6.88-2.13c-2.21-1.71-5.68-3.2-10.31-1.44
	L96.16,176l-8.28,0.81l-3.79-0.74l-0.89,4.55l-1.68,2.58l1.95,0.15l3.37-2.89c0,0,8.19-2.39,8.01,4.27
	c-0.17,6.66-0.76,11.43-0.76,11.43l0.77,2.38l0.52,1.79v4.35c0,0-0.06,3.18,0.72,4.38c0.78,1.2,0.51,2.76-1.2,4.2
	c-1.71,1.44-5.05,7.76-5.05,7.76l1.05,0.48l12.46,3.28l1.76,0.55l1.12,0.35c0,0,9.12,2.46,10.86-4.8l0.48-2.08l2.22-1.46l1.38-6
	c0,0,0.12-1.02,3.12-1.62c3-0.6,4.92-2.1,4.92-2.1l1.92-1.5l2.7-0.54l3.09-3.93l1.17-4.05L136.66,192.92z"
/>
<Path
  id="shindewadi_1_"
  fill={getColor(49)}
  onPress={() => openModal(49)}
  d="M94.9,213.26c-1.71,1.44-5.05,7.76-5.05,7.76l-0.94-0.42l-1.45-1.16l-3.36-0.64
	c0,0,0.15-3.62,0.81-6.44c0.66-2.82-0.27-4.86-2.32-10.44c-0.22-0.61-0.41-1.21-0.58-1.8c-1.35-4.84-0.91-8.94-0.91-8.94l0.42-7.98
	l1.95,0.15l3.37-2.89c0,0,8.19-2.39,8.01,4.27c-0.17,6.66-0.76,11.43-0.76,11.43l0.77,2.38l0.52,1.79v4.35c0,0-0.06,3.18,0.72,4.38
	C96.88,210.26,96.61,211.82,94.9,213.26z"
/>
<Path
  id="lakadi_1_"
  fill={getColor(50)}
  onPress={() => openModal(50)}
  d="M81.1,191.18c0,0-0.44,4.1,0.91,8.94c0,0-7.09-1.2-7.27-1.38s-3.9,0-3.9,0l-9.42-0.8
	c0,0-2.82-1.24-6.06-0.36c-3.24,0.89-6.36-0.15-6.36-0.15l-2.23,0.3l-0.84-3.19c0,0,0.19-7.08,0.01-13.32
	c-0.18-6.24,2.1-9.48,2.1-9.66s1.68-4.98,1.68-4.98l8.64,0.36l3.72,0.42l2.52-0.39l1.79,1.27l0.79,0.56l10.2,2.94l6.36,4.26
	l0.35,0.07l-0.89,4.55l-1.68,2.58L81.1,191.18z"
/>
<Path
  id="jachakwadi"
  fill={getColor(80)}
  onPress={() => openModal(80)}
  d="M112.45,252.41l-7.33,6.15l-3.44,3.3l-1.44,3.06l-10.38-3.43l-4.68-6.11l-4.14-7.21l-2.7-6.35
	l-0.21-1.52l0.39-1.12l4.68,1.8h3l7.08,3.24l5.52,3.95L112.45,252.41z"
/>
<Path
  id="sapakalwadi"
  fill={getColor(76)}
  onPress={() => openModal(76)}
  d="M89.86,261.49l-3.42-1.13c0,0-7.26-1.32-7.32,4.14c-0.03,2.49-0.1,4.59-0.18,6.14l-4.56-2.98
	L67,264.11l4.59-8.19l5.13-11.58l1.41-4.04l0.21,1.52l2.7,6.35l4.14,7.21L89.86,261.49z"
    />
    <Path
  id="sansar"
  fill={getColor(74)}
  onPress={() => openModal(74)}
  d="M112.45,252.41l-13.65-4.24l-5.52-3.95l-7.08-3.24h-3l-4.68-1.8l-0.54,0.02l-12.84,0.47
	c-0.65-4.71-3.18-6.43-3.18-6.43s-1.89-1.56-1.23-4.65c0.18-0.85,0.19-1.87,0.11-2.91v-0.01l1.72-1.07c0,0,2.88-1.08,5.22-0.3
	c2.34,0.78,5.52-1.14,5.52-1.14s5.58-1.8,5.76-1.8s4.02-0.54,4.02-0.54l1.02-2.02l3.36,0.64l1.45,1.16l1.99,0.9l12.46,3.28
	l1.76,0.55l-3.06,5.07c0,0-2.52,3.74,0,7.48c2.51,3.73,3.06,4.9,3.06,4.9s-0.59,5.4,3.5,7.11
	C112.72,251.6,112.45,252.41,112.45,252.41z"
/>
<Path
  id="bhavaninagar"
  fill={getColor(75)}
  onPress={() => openModal(75)}
  d="M78.13,240.3l-1.41,4.04l-5.13,11.58L67,264.11l-6.64-4.07c1.39-3.24,2.93-7.42,4.12-12.13
	c0.86-3.43,0.95-6.14,0.66-8.24l12.84-0.47L78.13,240.3z"
/>
<Path
  id="hingnewadi"
  fill={getColor(77)}
  onPress={() => openModal(77)}
  d="M78.94,270.64c-0.09,1.85-0.18,2.92-0.18,2.92l-1.86,3c0,0-1.68,2.22-2.22,0
	c0,0-4.5-2.46-8.16-2.64c-3.66-0.18-9.6-6.84-9.6-6.84s1.57-2.67,3.44-7.04l6.64,4.07l7.38,3.55L78.94,270.64z"
/>
<Path
  id="nimbodi_1_"
  fill={getColor(51)}
  onPress={() => openModal(51)}
  d="M84.91,212.36c-0.66,2.82-0.81,6.44-0.81,6.44l-1.02,2.02c0,0-3.84,0.54-4.02,0.54
	s-5.76,1.8-5.76,1.8s-3.18,1.92-5.52,1.14c-2.34-0.78-5.22,0.3-5.22,0.3l-1.72,1.07c-0.22-2.74-1.08-5.57-1.08-5.57
	s-2.44-2.7-4.28-3.82c-1.84-1.13-3.9-5.6-3.9-5.6l-0.96-5.16l-3.3-5.7l-0.55-2.09l2.23-0.3c0,0,3.12,1.04,6.36,0.15
	c3.24-0.88,6.06,0.36,6.06,0.36l9.42,0.8c0,0,3.72-0.18,3.9,0s7.27,1.38,7.27,1.38c0.17,0.59,0.36,1.19,0.58,1.8
	C84.64,207.5,85.57,209.54,84.91,212.36z"
    />
    <Path
  id="gholapwadi"
  fill={getColor(106)}
  onPress={() => openModal(106)}
  d="M88.54,293l-0.3,4.68l-0.5,2.38l-5.68,3.44l-6.73,3.48c0.02-0.59,0.07-0.96,0.07-0.96
	l-1.08-1.98l-1.26-4.86v-3.42l-4.98-2.88l2.67-4.38L88.54,293z"
    />
    <Path
  id="chikhali"
  fill={getColor(123)}
  onPress={() => openModal(123)}
  d="M144.64,317.48l-0.67-4.65c0,0-0.5,0.19-1.19,0.52c-0.05,0.02-0.1,0.04-0.15,0.07
	c-0.55,0.26-1.2,0.6-1.83,0.98c-0.13,0.09-0.27,0.17-0.39,0.25c-0.45,0.29-0.87,0.61-1.21,0.93c-0.11,0.11-0.21,0.22-0.3,0.32
	l-0.03,0.03c-0.07,0.09-0.14,0.18-0.19,0.27c-0.02,0.01-0.02,0.02-0.03,0.03c-0.01,0.02-0.01,0.03-0.01,0.03
	c-0.09,0.14-0.16,0.27-0.2,0.41c-0.02,0.06-0.04,0.12-0.05,0.18c-0.34,1.96-2.57,0.75-2.57,0.75l-5.78-4.98c0,0-1.03-1.49-2.48-1.49
	c-1.45,0-2.69-1.17-2.69-1.17s-0.45-0.44-1.1-1.16c-0.09-0.1-0.18-0.2-0.28-0.31c-0.39-0.43-0.83-0.95-1.28-1.51l-3.37,7.35
	l-1.51,5.85v3.61c1.56,0.58,2.83,1.01,2.83,1.01l4.62,1.62l4.02,0.6l2.46,1.86l0.5,3.36l0.49,2.65c0,0,0.59,2.97,3.91,0.73
	c3.34-2.26,9.08-6.98,9.08-6.98L144.64,317.48z"
/>
<Path
  id="jamb"
  fill={getColor(121)}
  onPress={() => openModal(121)}
  d="M98.26,304.76l-1.65,10.11l0.35,6.77c-1.58-0.77-3.19-1.78-4.08-2.94c-2.12-2.79-7.3-2.8-7.3-2.8
	s-2.44-0.64-6.76-1.72c-3.33-0.83-3.56-5.22-3.49-7.2l6.73-3.48l5.68-3.44l0.5-2.38l4-2.07l6.1,8.84L98.26,304.76z"
/>
<Path
  id="mankarwadi"
  fill={getColor(107)}
  onPress={() => openModal(107)}
  d="M105.67,290.72l-4.47,4.44l-1.02,2.52l-1.84,6.77l-6.1-8.84l0.54-2.39l1.13-1.35l0.99-2.16
	l2.61-2.25c0,0,2.39-0.94,3.51-2.11c1.12-1.17,2.56-0.23,2.56-0.23l1.54,0.86L105.67,290.72z"
/>
<Path
  id="kurawali"
  fill={getColor(122)}
  onPress={() => openModal(122)}
  d="M126.79,301.91c-1.47,0.78-3.78,2.07-3.78,2.07s-2.7,0.54-1.2,2.49c0.13,0.17,0.27,0.34,0.40,0.51
	l-3.37,7.35l-1.51,5.85v3.61c-2.19-0.8-4.95-1.88-5.51-2.41c-0.96-0.9-2.34-0.6-2.34-0.6s-1.2-0.3-3.42,1.62
	c-2.22,1.92-4.74,0.96-4.74,0.96s-2.15-0.64-4.36-1.72l-0.35-6.77l1.65-10.11l0.08-0.31l1.84-6.77l1.02-2.52l4.47-4.44
	c0,0,4.44,2.19,7.98,7.08c0,0,0.78,1.98,3.54,0.60c2.73-1.36,6.36-2.58,6.54-2.58c0.09,0.03,3.45,3.93,3.45,3.93
	S128.26,301.13,126.79,301.91z"
/>
<Path
  id="lasurne"
  fill={getColor(82)}
  onPress={() => openModal(82)}
  d="M160.48,276.86l-1.44-11.18l-8.22-0.31l-0.39-0.45h-5.19l-6.78-2.46l-8.4-3.48l-1.62-0.3v0.48
	c0,0-3,8.58-9.72,6.72c-6.72-1.86-4.8,0.72-4.8,0.72s-1.86-1.08-2.04-1.14s-2.52,0.12-2.52,0.12l-1.86-0.66l0.54,2.16
	c0,0-0.27,1.98,2.61,5.4c2.88,3.42,3.87,7.2,3.87,7.2l-0.36,2.43l4.5,0.87l5.28-0.44c0,0,6.96-0.1,6.78,3.62c0,0,5.1,0.24,6.18,1.68
	c0.43,0.58,0.95,1.01,1.2,1.53l2.52-1.23l7.2-1.2l3-0.3h13.05l0.45-0.9L160.48,276.86z"
    />
    <Path
  id="kardanwadi"
  fill={getColor(81)}
  onPress={() => openModal(81)}
  d="M128.44,254.9v4.26c0,0-3,8.58-9.72,6.72c-6.72-1.86-4.8,0.72-4.8,0.72s-1.86-1.08-2.04-1.14
  s-2.52,0.12-2.52,0.12l-1.86-0.66h-7.26l1.44-3.06l3.44-3.3l7.33-6.15h2.97l2.52,0.63h4.8L128.44,254.9z"
/>
<Path
  id="junction"
  fill={getColor(83)}
  onPress={() => openModal(83)}
  d="M158.8,263.78l-0.72-9.24c0,0,2.04-6.48-0.72-11.04c-1.33-2.2-2.57-4.42-3.28-6.66h-8l-3.12,4.32
  l-6.66,6.48l-7.86,7.26v3.78l1.62,0.3l8.4,3.48l6.78,2.46h5.19l0.39,0.45l8.22,0.31L158.8,263.78z"
/>
<Path
  id="paritwadi"
  fill={getColor(103)}
  onPress={() => openModal(103)}
  d="M136.3,293.06c-3.3,3.24-5.7-0.78-5.7-0.78l-6.87,3.54c-0.18,0-3.81,1.22-6.54,2.58
  c-2.76,1.38-3.54-0.6-3.54-0.6c-3.54-4.89-7.98-7.08-7.98-7.08l-0.55-4.74l7.33-2.7l1.71-1.17l4.5,0.87l5.28-0.44
  c0,0,6.96-0.1,6.78,3.62c0,0,5.1,0.24,6.18,1.68c0.43,0.58,0.95,1.01,1.2,1.53C138.49,290.15,138.28,291.12,136.3,293.06z"
/>
<Path
  fill={getColor(108)}
  onPress={() => openModal(108)}
  d="M141.64,305.84c-2.1,3.48-2.64,3.6-2.52,5.64c0.11,1.92-0.41,4.47-0.47,4.75
  c-0.01,0.02-0.01,0.03-0.01,0.03c-0.13,0.2-0.22,0.39-0.25,0.59c-0.34,1.96-2.57,0.75-2.57,0.75l-5.78-4.98c0,0-1.03-1.49-2.48-1.49
  c-1.45,0-2.69-1.17-2.69-1.17s-1.56-1.54-3.06-3.49c-1.5-1.95,1.2-2.49,1.2-2.49s2.31-1.29,3.78-2.07c0.79-0.42,0.84-1.01,0.72-1.47
  l0.03,0.1h3.3c0,0,2.52-0.34,3.66,1.4s4.62,0.78,4.62,0.78S143.74,302.36,141.64,305.84z"
/>
<Path
  id="thoratwadi"
  fill={getColor(102)}
  onPress={() => openModal(102)}
  d="M150.82,286.64l-3,0.3l-7.2,1.2l-2.52,1.23c0.39,0.78,0.18,1.75-1.8,3.69
	c-3.3,3.24-5.7-0.78-5.7-0.78l-6.87,3.54c0.09,0.03,3.45,3.93,3.45,3.93s0.15,0.19,0.26,0.47l0.07,0.22l0.03,0.1h3.3
	c0,0,2.52-0.34,3.66,1.4s4.62,0.78,4.62,0.78s4.62-0.36,2.52,3.12c-2.1,3.48-2.64,3.6-2.52,5.64c0.11,1.92-0.41,4.47-0.47,4.75
	c0.01-0.01,0.01-0.02,0.03-0.03c0.05-0.09,0.12-0.18,0.19-0.27l0.03-0.03c0.09-0.1,0.19-0.21,0.3-0.32
	c0.34-0.32,0.76-0.64,1.21-0.93c0.12-0.08,0.26-0.16,0.39-0.25c0.63-0.38,1.28-0.72,1.83-0.98c0.05-0.03,0.1-0.05,0.15-0.07
	c0.69-0.33,1.19-0.52,1.19-0.52l-0.11-0.75l1.38-6.6c0,0-0.48-5.46,6.24-7.5c6.72-2.04,8.28-2.88,8.28-2.88l1.8-3.84l0.95-1.89
	l1.36-2.73H150.82z"
    />
    <Path
  id="tawashi"
  fill={getColor(97)}
  onPress={() => openModal(97)}
  d="M75.53,277.55l-1.75,2.91l-2.04,3.78l-1.68,4.5l0.69-0.24l-2.67,4.38L56.2,287.3
  c0,0-3.36-0.6-5.76-2.64c-2.4-2.04,1.62-9.39,1.62-9.39l4.86-8.19c0,0,5.94,6.66,9.6,6.84c3.66,0.18,8.16,2.64,8.16,2.64
  C74.87,277.32,75.19,277.56,75.53,277.55z"
/>
<Path
  id="pawarwadi"
  fill={getColor(104)}
  onPress={() => openModal(104)}
  d="M114.52,279.68l-0.36,2.43l-1.71,1.17l-7.33,2.7l-1.54-0.86c0,0-0.91-0.59-1.84-0.25l-4.8-6.27
  l-1.26-4.56l4.56-9.12h7.26l0.54,2.16c0,0-0.27,1.98,2.61,5.4C113.53,275.9,114.52,279.68,114.52,279.68z"
/>
<Path
  id="belwadi"
  fill={getColor(79)}
  onPress={() => openModal(79)}
  d="M100.24,264.92l-4.56,9.12l-14.64-0.48l-2.1-1.74l-0.05-0.18c0.09-1.59,0.2-4.07,0.23-7.14
  c0.06-5.46,7.32-4.14,7.32-4.14L100.24,264.92z"
/>
<Path
  id="udhat"
  fill={getColor(105)}
  onPress={() => openModal(105)}
  d="M101.74,284.87c-0.24,0.09-0.49,0.24-0.72,0.48c-1.12,1.17-3.51,2.11-3.51,2.11l-2.61,2.25
  l-0.99,2.16l-1.13,1.35l-0.54,2.39l-4,2.07l0.3-4.68l-17.79-4.5l-0.69,0.24l1.68-4.5l2.04-3.78l1.75-2.91
  c0.64-0.03,1.37-0.99,1.37-0.99l1.86-3c0,0,0.06-0.69,0.13-1.92l0.05,0.18l2.1,1.74l14.64,0.48l1.26,4.56L101.74,284.87z"
/>
<Path
  id="dalaj_no.2_1_"
  fill={getColor(12)}
  onPress={() => openModal(12)}
  d="M213.99,124.5l-43.27-0.06l-0.01,0.04l-0.01,0.03c-0.15,1.08-0.25,1.8-0.26,1.87
  c-0.06,0.3,0.36,5.22,0.36,5.22c3.48-1.44,5.4,1.8,5.4,1.8l1.74,3.42c0,0,5.1-0.06,5.34-0.06s3.12,1.62,3.36,1.62
  c0.24,0,10.62,3.12,10.62,3.12l9.6,1.32l2.04,1.14l1.2-1.56c0,0-0.3-7.02,1.32-8.82c1.62-1.8,2.28-6.18,2.28-6.18
  S213.18,126.62,213.99,124.5z"
/>
<Path
  id="dalaj_no.3"
  fill={getColor(11)}
  onPress={() => openModal(11)}
  d="M213.92,115.12l0.95-4.73h-2.97l-2.14-1.13l-6.77,3.78l-15.21,5l-16.71,3.86
  c-0.14,0.94-0.26,1.82-0.35,2.54l43.27,0.06l0.13-0.31c0.19-0.45,0.44-0.95,0.75-1.51C216.85,119.16,213.92,115.12,213.92,115.12z"
/>
<Path
  id="dalaj_no.1"
  fill={getColor(10)}
  onPress={() => openModal(10)}
  d="M209.76,109.26l-6.77,3.78l-15.21,5l-16.71,3.86c0.36-2.61,0.78-5.7,1.01-7.35
	c0.1-0.74,0.16-1.19,0.16-1.19l0.14-0.32l0.46-1l3.3-0.54h3.3l2.88-3.12c0,0,3.84-0.06,4.02-0.06s1.62-1.98,1.8-2.04
	c0.18-0.06,2.1-0.06,2.1-0.06l1.74-1.68l6.72-0.42l1.08-1.86l0.72-1.68l3.48,3.51l3.51,3.96L209.76,109.26z"
/>
<Path
  id="boratwadi"
  fill={getColor(44)}
  onPress={() => openModal(44)}
  d="M278.02,176.42l-3.54-6.84l-1.92-5.52l-1.41,0.99l-4.08,5.37l-8.19,8.13l-3.9,2.55l-9.81,9.9
	v6.96l0.39,1.89l0.27,10.11l1.66-1.38l2.15-3.72l6.06-1.74l2.52,0.72l0.24,3.12l6.84,1.14l2.88,1.86l1.2-0.48l2.22-2.34l1.26-1.74
	l2.16-1.08c0,0,0.12-2.46,0.18-5.04c0.06-2.58,4.08-7.02,4.08-7.02l0.3-5.46l2.1-5.64L278.02,176.42z"
/>
<Path
  id="thoratwadi_1_"
  fill={getColor(55)}
  onPress={() => openModal(55)}
  d="M245.56,199.85l-0.39-1.89v-7.74c0,0-0.57-2.64-1.77-6.84c-1.2-4.2-0.6-7.38-0.6-7.38
	l0.07-1.25c0,0-4.29,0.31-4.42,0.31c-0.13,0-4.59,1.21-4.59,1.21l-3.87,0.67c0,0-6.08-1.21-5.99,2.08c0.1,3.28,0,6.2,0,6.2
	s-0.4,3.74-1.12,6.62c-0.72,2.88-0.27,9.13-0.27,9.13l2.47,1.09l2.57,0.04c0,0,7.47,1.94,8.46,4.95s2.7,1.93,2.7,1.93
	s1.68-0.09,1.95,2.32c0.27,2.41,0.6,6.97,0.6,6.97l0.55,1.38l1.89-1.8l1.49-4.77l0.54-3.12L245.56,199.85z"
/>
<Path
  id="pitkeshwar"
  fill={getColor(110)}
  onPress={() => openModal(110)}
  d="M286.74,289.85l-0.82-4.09l0.82-6.71l-1.18,0.58l-5.48,2.07l-4.82,1.13l-1.76,1.03l-3.42,0.28
	c1.22,5.04-1.21,6.07-1.21,6.07s-2.58,2.94-2.55,7.08c0.03,4.14-3.95,6.22-3.95,6.22s-0.5,1.75-0.52,1.82l-2.73,6.03
	c0,0-1.77,3.54,1.36,6.06c2.21,1.77,8.28,4.61,11.69,6.14c1.44,0.65,2.41,1.06,2.41,1.06l0.05-1.71l2.04-2.91l2.46-4.8l1.05-2.1
	l3.12-3.6l2.76-6.72v-2.94l0.66-3.6l0.64-3.02L286.74,289.85z"
/>
<Path
  id="ghorpadwadi"
  fill={getColor(119)}
  onPress={() => openModal(119)}
  d="M255.52,307.67l-0.3,4.89l-2.16,5.04l-1.62,2.7l-0.9,6.06l-0.54,4.86
	c-0.64,3.35-8.18,0-8.18,0s-3.87-2.62-6.56-4.47c-2.7-1.85-4.46-1.75-4.46-1.75l-2,0.4l-0.88-1.08l1.76-16.3
	c0.56,0.46,1.41,0.62,2.65,0.42c2.75-0.46,2.11-0.51,4.14,0.08c2.02,0.59,4.05,1.12,6.61,0c2.57-1.12,2.3-1.36,4.31-0.79
	c2.01,0.57,5.77-0.19,5.64-0.19C253.03,307.55,255.52,307.67,255.52,307.67z"
    />
    <Path
  id="nirwangi"
  fill={getColor(126)}
  onPress={() => openModal(126)}
  d="M274.6,339.98l-0.14-1.86l-5.26,1.02l-12.96,1.92l-8.22,1.8c0,0-7.8,2.7-7.98,2.7
	s-3.3,1.86-3.3,1.86l-3.42,0.84l-1.26,1.08l-5.29,2.89c1.26,0,3.66,0.11,5.74,0.89c2.97,1.12,4.55,1.12,4.55,1.12
	s0.04-0.72,3.64,0.72c3.6,1.44,3.24,5.85,3.24,5.85l-0.45,1.89l-0.36,2.8l2.25-0.54l4.36-0.38h4.94l4.74-0.54l5.26-1.52l0.46-2.52
	l2.92-7.69c0,0,3.42-7.11,5.55-8.82c0.07-0.05,0.13-0.11,0.19-0.16C275.67,341.67,274.6,339.98,274.6,339.98z"
/>
<Path
  id="nimsakhar"
  fill={getColor(124)}
  onPress={() => openModal(124)}
  d="M227.92,324.32l0.88,1.08l-0.88,1.32l-1.17,25.51c-0.53,0-0.85,0.03-0.85,0.03
	s-4.88,2.06-4.97,2.09c-0.09,0.03-3.6,1.95-3.69,1.98c-0.09,0.03-2.76,1.8-4.74-0.81c-1.98-2.61-3.8-5.32-3.8-5.32l-2.16-7.79
	l-1.42-2.79l-2.13-2.61l-2.88-1.92l-1.41-0.24h-2.16l-2.1,0.45l-1.2,1.08l-1.32,2.25v3.63l-0.4,1.19l-1.58-1.37l-0.66-2.52
	c0,0-2.52-12.66-4.38-19.56c-0.32-1.2-0.49-2.33-0.55-3.37l-0.01-0.01c-0.27-4.97,1.94-8.08,1.94-8.08l2.1-2.62l3.58-0.68l1.67,0.68
	h1.93l2.12-0.72l3.92-0.32l2.02-0.86l7.52-2.78l0.61,1.03l7.44-0.52c0,0,6.96,0.03,6.87,0c0,0.01,2.58,1.04,2.64,3.4
	c0.03,1.32,0.29,2.32,0.98,2.87L227.92,324.32z"
/>
<Path
  id="dagadwadi"
  fill={getColor(125)}
  onPress={() => openModal(125)}
  d="M274.45,329.68l0.13-5.06c0,0-0.97-0.41-2.41-1.06l-1.29,3.28l-4.92,3.3l-4.32,0.42l-3.9-0.06
	l-4.56-0.12l-2.42,0.64l-0.76,0.2c-0.64,3.35-8.18,0-8.18,0s-3.87-2.62-6.56-4.47c-2.7-1.85-4.46-1.75-4.46-1.75l-2,0.4l-0.88,1.32
	l-1.17,25.51c0.01,0,0.01,0,0.02,0l5.29-2.89l1.26-1.08l3.42-0.84c0,0,3.12-1.86,3.3-1.86s7.98-2.7,7.98-2.7l8.22-1.8l12.96-1.92
	l5.26-1.02l-0.19-2.5L274.45,329.68z"
/>
<Path
  id="kalamb"
  fill={getColor(120)}
  onPress={() => openModal(120)}
  d="M191.74,345.74v2.28c0,0-1.74,5.13-6.33,3.21c-4.59-1.92-4.79-2.79-4.79-2.79l-2.29-3.02
	c0,0-1.62-3.1-6.97-4.22c-5.36-1.13-7.97-1.67-9.95-4.37c-1.98-2.7-6.63-6.36-6.63-6.36s-0.48-1.2-3.68-1.24
	c-3.19-0.05-5.86-0.59-5.86-0.59l-0.6-11.16l-0.67-4.65l-0.11-0.75l1.38-6.6c0,0-0.48-5.46,6.24-7.5c6.72-2.04,8.28-2.88,8.28-2.88
	l1.8-3.84l0.95-1.89l2.05,8.4l3.9,12.33c0,0,0.05,0.17,0.17,0.44c0.47,1.04,2.06,3.56,6.43,3.94c5.51,0.48,8.19-0.49,9.28,2.14
	l0.01,0.01c0.06,1.04,0.23,2.17,0.55,3.37c1.86,6.9,4.38,19.56,4.38,19.56l0.66,2.52l1.58,1.37l-0.14,0.43L191.74,345.74z"
    />
    <Path
  id="gotondi"
  fill={getColor(87)}
  onPress={() => openModal(87)}
  d="M270.08,284.14v-3.88l-1.57-2.42l-1.53-1.22l-2.48-2.07l-1.16-1.35l0.1-3l-0.18-3.54l-0.84-4.26
	l-1.34-4.28l0.1-2.74l-1.36-1.17l-4-0.27l-3.3,2.7l-3.84,3.06c0,0-6.36,6.54-6.54,6.66c-0.18,0.12-7.29,3.15-8.46,8.19
	c-1.17,5.04-4.14,9.27-4.14,9.27l-5.67,6.03l-3.87,4.29l-0.36,2.79l-4.86,2.23l-3.64,2.08l0.61,1.03l7.44-0.52c0,0,6.96,0.03,6.87,0
	c0,0.01,2.58,1.04,2.64,3.4c0.03,1.32,0.29,2.32,0.98,2.87c0.56,0.46,1.41,0.62,2.65,0.42c2.75-0.46,2.11-0.51,4.14,0.08
	c2.02,0.59,4.05,1.12,6.61,0c2.57-1.12,2.3-1.36,4.31-0.79c2.01,0.57,5.77-0.19,5.64-0.19c0,0.01,2.49,0.13,2.49,0.13l0.24-0.15
	l0.15-0.1c0.27-0.19,0.67-0.51,1.17-1.01c0.96-0.96,3.75-1.5,3.75-1.5s1,0.49,1.02,0.42s0.52-1.82,0.52-1.82s3.98-2.08,3.95-6.22
	c-0.03-4.14,2.55-7.08,2.55-7.08S271.3,289.18,270.08,284.14z"
/>
<Path
  id="sirsatwadi"
  fill={getColor(99)}
  onPress={() => openModal(99)}
  d="M220.32,282.97L220,294.14l-0.36,2.79l-0.9-0.65l-2.88-0.63L212.3,293l-3.97-3.45l-4.02-3.87
	l-2.17-1.14l-3.16-1.73l-1.91-1.4l-3.05-1.59l0.2-0.82l0.85-3.46c0,0,2.53-2.74,2.65-2.74c0.06,0,1.14-1.93,1.53-2.63l5.31,0.17
	l13.8,1.69l0.02,0.09c0.02,0.21,0.07,0.45,0.15,0.71l0.02,0.07c0.03,0.13,0.08,0.27,0.13,0.42
	C220.3,277.94,220.32,282.97,220.32,282.97z"
/>
<Path
  id="shelgaon"
  fill={getColor(72)}
  onPress={() => openModal(72)}
  d="M246.55,240.17l-2.25-4.86l-2.97-6.03l-0.63-6.39l1.21-3.24l-0.55-1.38c0,0-0.33-4.56-0.6-6.97
	c-0.27-2.41-1.95-2.32-1.95-2.32s-1.71,1.08-2.7-1.93s-8.46-4.95-8.46-4.95l-2.57-0.04l-2.47-1.09l-0.49-0.22l-2.57-0.09l-5.49-2.3
	c0,0-1.22-1.17-4-3.42c-1.72-1.38-3.34-1.07-4.34-0.62v0.01c-0.64,0.27-1.02,0.61-1.02,0.61l-6.81,7.59h-0.01l-1.01,1.13l-6.63,4.89
	l-5.04,3.03l-5.46,7.02l-1.26,1.92l1.62,6.18c0,0,2.04,4.2,0,9.48c-2.04,5.28,0.39,11.86,4.58,15.1c1.83,1.42,3.48,2.77,4.76,3.83
	c1.64,1.36,2.66,2.25,2.66,2.25l3.1,1.8l2.8,3.56l1.08,4l0.31,3.2c0,0-0.05,0.09-0.14,0.25l5.31,0.17l13.8,1.69l0.02,0.08
	c-0.43-3.17,3.36-2.15,3.36-2.15l4.56-0.3l3.78-1.56l3.48-3.42l3.78-3.66l8.36-11.04l4.09-6.57L246.55,240.17z"
    />
    <Path
  id="nhavi"
  fill={getColor(45)}
  onPress={() => openModal(45)}
  d="M269.44,156.86l-2.73-8.58l-3.96,0.66l-1.08-0.48l-14.53,0.48v-3.99l-1.85-1.85l-0.13-1.08
	l0.58-3.46l-0.58-1.71l-1.31-0.99l-0.51-1.66c-2.46-2.56-5.76,0.76-5.76,0.76v6.24l-2.4,2.76v3.18l0.3,2.1h6.63l2.04,1.23l1.02,0.27
	V152l-0.6,1.35l-0.99,9.57l-0.14,2.29l-0.57,9.54L242.8,176c0,0-0.6,3.18,0.6,7.38c1.2,4.2,1.77,6.84,1.77,6.84V191l9.81-9.9
	l3.9-2.55l8.19-8.13l4.08-5.37l1.41-0.99L269.44,156.86z"
/>
<Path
  id="kadbanwadi"
  fill={getColor(100)}
  onPress={() => openModal(100)}
  d="M219.64,296.93l-4.86,2.23l-3.64,2.08l-7.52,2.78l-2.02,0.86l-3.92,0.32l-2.12,0.72h-1.93
	l-1.67-0.68l-3.58,0.68l0.3-0.38l1.25-5.1l1.33-5.4l0.42-5.34l2.34-9.88l3.05,1.59l1.91,1.4l3.16,1.73l2.17,1.14l4.02,3.87
	l3.97,3.45l3.56,2.65l2.88,0.63L219.64,296.93z"
/>
<Path
  id="bagawadi"
  fill={getColor(54)}
  onPress={() => openModal(54)}
  d="M197.88,202.53l-1.01,1.13l-6.63,4.89l-5.04,3.03l-5.46,7.02l-1.26,1.92l-8.88,4.58h-2.07
	c0,0-5.81,1.62-6.3,1.8c-0.49,0.18-6.63,1.76-6.63,1.76c1.38-4.07-0.6-6.16-0.6-6.16s1.29-3.22-2.74-3.87l6.23-2.81l-0.22-2.52
	c0,0,1.08,1,5.49-2.34c4.41-3.32,3.33-7.09,3.33-7.09s0.09-0.22-0.08-0.77l1.83-1l2.98-0.63h14.76l6.02,0.82L197.88,202.53z"
/>
<Path
  id="birangdwadi"
  fill={getColor(53)}
  onPress={() => openModal(53)}
  d="M162.76,210.96c-4.41,3.34-5.49,2.34-5.49,2.34l0.22,2.52l-6.23,2.81
	c-0.23-0.04-0.48-0.07-0.74-0.09c-4.92-0.36-7.68-6.96-7.68-6.96l-9-6l3.09-3.93l1.17-4.05l5.58-2.01c0,0,11.31-4.56,17.19,1
	c3.76,3.57,4.85,5.55,5.14,6.51c0.17,0.55,0.08,0.77,0.08,0.77S167.17,207.64,162.76,210.96z"
/>
<Path
  id="kalas"
  fill={getColor(48)}
  onPress={() => openModal(48)}
  d="M208.9,143.96l-2.04-1.14l-9.6-1.32c0,0-10.38-3.12-10.62-3.12c-0.24,0-3.12-1.62-3.36-1.62
	s-5.34,0.06-5.34,0.06c0.11,5.06-1.82,11.95-1.82,11.95s-1.84,3.38-4.86,2.93c-3.01-0.45-5.22,0.18-6.2,0.9
	c-1,0.72-1.67,1.75-3.89,0.99c-2.23-0.77-1.2-2.79-0.21-6.39c0.99-3.6-1.92-7.19-1.92-7.19l-1.38,1.25c0,0-4.02,2.04-4.38,2.16
	c-0.36,0.12-3.66,0.54-3.66,0.54l-0.96,7.68l-7.2,16.2l-2.82,4.86l-3.12,2.67l-2.88,3.69l0.42,0.99l1.62,4.68l1.98,8.19l1.44,4.68
	l5.58-2.01c0,0,11.31-4.56,17.19,1c3.76,3.57,4.85,5.55,5.14,6.51l1.83-1l2.98-0.63h14.76l6.02,0.82l6.28,0.24h0.01l6.81-7.59
	c0,0,0.38-0.34,1.02-0.61v-0.01l-1.79-6.48l-0.43-4.82l-0.6-4.62v-0.6h-2.7c0,0-3.12,0.84-6.48,1.77s-3.24-2.07-3.24-2.07l3-14.34
	c0,0,2.52-1.53,5.49-3.66c2.97-2.13,6-1.9,6-1.9s0.67,0.48,1.89,0.77v-4.51l3.69-6.48L208.9,143.96z"
    />
    <Path
  id="pilewadi"
  fill={getColor(29)}
  onPress={() => openModal(29)}
  d="M177.94,136.82c0.11,5.06-1.82,11.95-1.82,11.95s-1.84,3.38-4.86,2.93
	c-3.01-0.45-5.22,0.18-6.2,0.9c-1,0.72-1.67,1.75-3.89,0.99c-2.23-0.77-1.2-2.79-0.21-6.39c0.99-3.6-1.92-7.19-1.92-7.19l1.86-1.69
	l0.36-2.34l1.74-1.74l2.94-0.72l2.76-0.96l2.1-0.96c3.48-1.44,5.4,1.8,5.4,1.8L177.94,136.82z"
/>
<Path
  id="gosaviwadi"
  fill={getColor(47)}
  onPress={() => openModal(47)}
  d="M206.86,158.37v0.17l-1.26,2.97l-0.78,6.27l-1.92,6.42v3.6h-2.7c0,0-3.12,0.84-6.48,1.77
	s-3.24-2.07-3.24-2.07l3-14.34c0,0,2.52-1.53,5.49-3.66c2.97-2.13,6-1.9,6-1.9S205.64,158.08,206.86,158.37z"
/>
<Path
  id="maradwadi"
  fill={getColor(30)}
  onPress={() => openModal(30)}
  d="M244.15,150.47l-2.04-1.23h-6.63l-0.3-2.1l-1.02,0.96h-4.08c0,0-8.82-0.45-9.09-0.72
	s-7-0.45-7-0.45l-3.44,0.45l-3.69,6.48v4.51c0.75,0.19,1.71,0.3,2.84,0.17c2.97-0.33,5.71-0.36,5.71-0.36s-0.45,2.34,3.06,1.66
	c3.51-0.67,5.79,1.52,5.79,1.52s6.54,0.72,8.28,1.95s6.99,0,6.99,0l3.91,1.9l0.14-2.29l0.99-9.57l0.6-1.35v-1.26L244.15,150.47z"
/>
<Path
  id="rui"
  fill={getColor(46)}
  onPress={() => openModal(46)}
  d="M243.44,165.21l-0.57,9.54c0,0-4.29,0.31-4.42,0.31c-0.13,0-4.59,1.21-4.59,1.21l-3.87,0.67
	c0,0-6.08-1.21-5.99,2.08c0.1,3.28,0,6.2,0,6.2s-0.4,3.74-1.12,6.62c-0.72,2.88-0.27,9.13-0.27,9.13l-0.49-0.22l-2.57-0.09
	l-5.49-2.3c0,0-1.22-1.17-4-3.42c-1.72-1.38-3.34-1.07-4.34-0.62l-1.79-6.48l-0.43-4.82l-0.6-4.62v-4.2l1.92-6.42l0.78-6.27
	l1.26-2.97v-0.17c0.75,0.19,1.71,0.3,2.84,0.17c2.97-0.33,5.71-0.36,5.71-0.36s-0.45,2.34,3.06,1.66c3.51-0.67,5.79,1.52,5.79,1.52
	s6.54,0.72,8.28,1.95s6.99,0,6.99,0L243.44,165.21z"
/>
<Path
  id="bharnewadi"
  fill={getColor(85)}
  onPress={() => openModal(85)}
  d="M199.39,269.92c0,0-0.05,0.09-0.14,0.25l-5.23-0.17l-15.24-1.12v-3.2l6.84-6.34l3.82-4.23
	c1.64,1.36,2.66,2.25,2.66,2.25l3.1,1.8l2.8,3.56l1.08,4L199.39,269.92z"
/>
<Path
  id="hagarwadi"
  fill={getColor(86)}
  onPress={() => openModal(86)}
  d="M255.28,249.35l-5.49-5.94l-4.09,6.57l-8.36,11.04l-3.78,3.66l-3.48,3.42l-3.78,1.56l-4.56,0.3
	c0,0-3.79-1.02-3.36,2.15c0.04,0.35,0.14,0.75,0.3,1.21c1.62,4.62,1.64,9.65,1.64,9.65L220,294.14l3.87-4.29l5.67-6.03
	c0,0,2.97-4.23,4.14-9.27c1.17-5.04,8.28-8.07,8.46-8.19c0.18-0.12,6.54-6.66,6.54-6.66l3.84-3.06l3.3-2.7L255.28,249.35z"
    />
    <Path
  id="anthurne"
  fill={getColor(84)}
  onPress={() => openModal(84)}
  d="M199.25,270.17c-0.39,0.7-1.47,2.63-1.53,2.63c-0.12,0-2.65,2.74-2.65,2.74l-0.85,3.46l-0.2,0.82
	l-2.34,9.88l-0.42,5.34l-1.33,5.4l-3.47-0.9l-2.34-2.34l-3.3-1.44l-3.92-2.2l-1-0.56l-4.95-2.92l-3.42-0.95l-1.89-2.07l-1.77-0.42
	l0.45-0.9l-3.84-8.88l-1.44-11.18l-0.24-1.9l-0.72-9.24c0,0,2.04-6.48-0.72-11.04c-1.33-2.2-2.57-4.42-3.28-6.66
	c-0.76-2.41-0.9-4.83,0.16-7.26c0.14-0.32,0.26-0.62,0.36-0.92c0,0,6.14-1.58,6.63-1.76c0.49-0.18,6.3-1.8,6.3-1.8h2.07l8.88-4.58
	l1.62,6.18c0,0,2.04,4.2,0,9.48c-2.04,5.28,0.39,11.86,4.58,15.1c1.83,1.42,3.48,2.77,4.76,3.83l-3.82,4.23l-6.84,6.34v3.2
	l15.24,1.12L199.25,270.17z"
/>
<Path
  id="walchandnagar"
  fill={getColor(109)}
  onPress={() => openModal(109)}
  d="M189.93,300.44l-1.25,5.1l-0.3,0.38l-2.1,2.62c0,0-2.21,3.11-1.94,8.08
	c-1.09-2.63-3.77-1.66-9.28-2.14c-4.37-0.38-5.96-2.9-6.43-3.94l2.73-2.96l1.88-4.95l2.3-5.27l1.36-3.8l3.92,2.2l3.3,1.44l2.34,2.34
	L189.93,300.44z"
/>
<Path
  id="ranmodwadi"
  fill={getColor(101)}
  onPress={() => openModal(101)}
  d="M176.9,293.56l-1.36,3.8l-2.3,5.27l-1.88,4.95l-2.73,2.96c-0.12-0.27-0.17-0.44-0.17-0.44
	l-3.9-12.33l-2.05-8.4l1.36-2.73l1.77,0.42l1.89,2.07l3.42,0.95l4.95,2.92L176.9,293.56z"
/>
<Path
  id="sarafwadi"
  fill={getColor(118)}
  onPress={() => openModal(118)}
  d="M272.17,323.56l-1.29,3.28l-4.92,3.3l-4.32,0.42l-3.9-0.06l-4.56-0.12l-2.42,0.64l-0.76,0.2
	l0.54-4.86l0.9-6.06l1.62-2.7l2.16-5.04l0.3-4.89l0.24-0.15l0.15-0.1c0.27-0.19,0.67-0.51,1.17-1.01c0.96-0.96,3.75-1.5,3.75-1.5
	s1,0.49,1.02,0.42l-2.73,6.03c0,0-1.77,3.54,1.36,6.06C262.69,319.19,268.76,322.03,272.17,323.56z"
/>
<Path
  id="kalewadi"
  fill={getColor(13)}
  onPress={() => openModal(13)}
  d="M247.49,119.3c-1.48,3.24-0.99,4.77-0.99,4.77s0.45,2.34,0,6.35c-0.44,4-3.16,3.78-3.16,3.78
	c-2.46-2.56-5.76,0.76-5.76,0.76v6.24l-2.4,2.76v3.18l-1.02,0.96h-4.08c0,0-8.82-0.45-9.09-0.72s-7-0.45-7-0.45l-3.44,0.45
	l-1.65-3.42l1.2-1.56c0,0-0.3-7.02,1.32-8.82c1.62-1.8,2.28-6.18,2.28-6.18s-0.52-0.78,0.29-2.9l0.13-0.31
	c0.19-0.45,0.44-0.95,0.75-1.51c1.98-3.52-0.95-7.56-0.95-7.56l0.95-4.73l3.6-0.45l3.6-1.35l6.57-1.53l2.7-0.9h16.2
	c-0.96,1.92-0.05,6-0.05,6S248.98,116.06,247.49,119.3z"
    />
    <Path
  id="khorochi"
  fill={getColor(133)}
  onPress={() => openModal(133)}
  d="M271.48,390.38l-6.8-0.96c0,0-5.26-2.1-6.16,2.1c-0.9,4.2-1.56,6.72-1.56,6.72l-0.48,6.79
	c-5.14-0.6-6.12-6.31-6.12-6.31s-5.07-4.74-9.48-1.23c-4.41,3.51-8.37,5.94-8.37,5.94s-1.35,1.44-4.14,0.18
	c-2.79-1.26-5.58-1.08-3.69-5.85c1.89-4.77,3.69-6.93,3.69-6.93s4.32-5.22,5.67-6.3c1.35-1.08,2.52-1.35,2.52-1.35
	s-0.06-2.28,1.32-4.62s1.2-4.74,1.2-4.74s0.6-2.88,1.74-3.84c1.14-0.96,2.31-4.48,2.31-4.48l2.25-0.54l4.36-0.38h4.94l4.74-0.54
	l5.26-1.52l1.16,5.84l1.44,5.7v4.74l1.98,4.86l1.8,3.84v2.22C271.06,389.72,271.21,390.02,271.48,390.38z"
/>
<Path
  id="redni"
  fill={getColor(132)}
  onPress={() => openModal(132)}
  d="M286.54,366.14c0,0,0.9,1.92-0.54,3.84c-1.44,1.92-1.86,5.04,0,8.04c1.23,1.99,2,6.77,2.38,9.77
	l-5.32,1.09c0,0-2.7,1.08-4.32,0.66c-1.62-0.42-3.66,0.72-3.66,0.72c-0.23,0.32-0.45,0.57-0.66,0.76c-1.27,1.11-2.36,0.12-2.94-0.64
	c-0.27-0.36-0.42-0.66-0.42-0.66v-2.22l-1.8-3.84l-1.98-4.86v-4.74l-1.44-5.7l-1.16-5.84l0.46-2.52l2.92-7.69
	c0,0,3.42-7.11,5.55-8.82c0.07-0.05,0.13-0.11,0.19-0.16l3.76,2.99l2.38,0.59l4.05,1.48l4.73,1.4l5.28,1.56
	c-1.76,3.3-3.23,5.94-5.66,7.35C285.76,360.2,286.54,366.14,286.54,366.14z"
/>
<Path
  id="reda"
  fill={getColor(127)}
  onPress={() => openModal(127)}
  d="M298.09,347.79c-1.28,0.34-2.79,1.14-3.75,2.93c-0.11,0.21-0.22,0.42-0.34,0.63l-5.28-1.56l-4.73-1.4
	l-4.05-1.48l-2.38-0.59l-3.76-2.99c1.87-1.66,0.8-3.35,0.8-3.35l-0.14-1.86l-0.19-2.5l0.18-5.94l0.13-5.06l5.9,2.1l16.26,7.32
	c0,0,1.21,0.64,1.72,1.63c0.2,0.37,0.3,0.79,0.2,1.25c-0.36,1.68,0.04,2.94,0.04,2.94s-0.34,2.04-0.88,4.44
	C297.28,346.7,298.09,347.79,298.09,347.79z"
/>
<Path
  fill={getColor(128)}
  onPress={() => openModal(128)}
  id="jadhav_wadi"
  d="M324.15,338.28l-0.89-2.08c-1.26-3.17-11.46-1.98-11.46-1.98l-7.2,0.54l-6.14,0.91
	c0.2,0.37,0.3,0.79,0.2,1.25c-0.36,1.68,0.04,2.94,0.04,2.94s-0.34,2.04-0.88,4.44c-0.54,2.4,0.27,3.49,0.27,3.49
	c1.31-0.36,2.37-0.25,2.37-0.25s13.44,0.9,17.94,1.2c1.48,0.1,2.34-0.1,2.82-0.42c0.57-0.36,0.62-0.89,0.56-1.27
	c-0.04-0.27-0.14-0.47-0.14-0.47l-0.75-5.43C322.72,340.7,323.66,339.44,324.15,338.28z"
    />
    <Path
  id="shaha"
  fill={getColor(64)}
  onPress={() => openModal(64)}
  d="M473.71,227.39c0,0-13.65-1.56-14.26-1.62l-0.85-0.5c-0.47-0.21-1.11-0.4-1.75-0.4
  c-1.44,0-1.65-1.59-1.65-1.59l-0.39-1.38l-0.72-5.76l-0.13-2.41l-0.13-0.11h-15.31l-4.26,1.17l-0.02,0.63l0.41,3.28l1.59,4.49
  l1.74,4.08l0.4,2.55l0.73,2.02l2.56,3.2l2.16,1.62c0,0,1.41,1.29,1.05,3.06c-0.03,0.15-0.02,0.29,0.02,0.41
  c0.42,1.32,4.42,1.09,4.42,1.09s4.1-0.64,4.46,1.78c0.36,2.44,3.91,1.26,3.91,1.26l2.66,0.7h0.01c0.36-0.26,0.79-0.46,1.32-0.56
  c2.88-0.54,3.9-0.48,3.9-0.48l3.84-1.62H472l1.89-7.17l0.62-7.67L473.71,227.39z"
/>
<Path
  id="kadalgaon"
  fill={getColor(65)}
  onPress={() => openModal(65)}
  d="M523.21,230l-1.17-1.44c-0.67-2.48-3.87-4.32-3.87-4.32s-4.95-1.71-8.91-2.61
  c-3.96-0.9-6.3,0.36-6.3,0.36s-9.54,3.15-13.74,5.13s-6.78,1.02-6.78,1.02l-7.93-0.68l-0.62,7.67L472,242.3h0.96l3.72,1.38
  c0,0,1.8,2.97,1.71,5.76c-0.09,2.79,0.54,3.51,0.54,3.51s-0.13,0.73-0.34,1.66h3.01l4.56,1.07l1.74-0.53l7.93,1.39
  c0.51-1.71,1.07-3.6,1.43-4.79c0.81-2.64,4.68-5.79,4.68-5.79l2.58-1.32c1.98-2.43,9.66-3.03,9.66-3.03l3.36-0.96l2.04-1.2
  l2.1-2.25C524.51,235.89,523.21,230,523.21,230z"
/>
<Path
  id="awasari"
  fill={getColor(112)}
  onPress={() => openModal(112)}
  d="M414.88,324.74l-2.04-1.32l-1.02-2.46l0.12-4.5c-2.52-2.04-0.72-4.83-0.72-4.83l1.29-3.87
  l-4.05-1.71l-1.08-2.16v-2.97l-1.62-2.7l-6.75-5.13v-2.88l-1.03-3.87l-0.59-0.21c0,0-2.01-0.78-4.29-1.44
  c-2.28-0.66-3.72-2.49-3.72-2.49l-5.37,0.15l-0.32-0.23l1.55,3.44c0,0,1.45,9.54-0.77,16.14c-2.23,6.6-2.97,8.45-2.97,8.45
  l9.5,10.75c0,0,5.16,3.48,10.14,7.8c4.98,4.32,13.68,0,13.68,0l1.02-1.14c0,0,0.3-0.36,1.38-2.14L414.88,324.74z"
/>
<Path
  id="wadapuri"
  fill={getColor(97)}
  onPress={() => openModal(97)}
  d="M385.24,285.56l-1.55-3.44l-0.34-0.25c-0.51-1.86-3.12-3.39-3.12-3.39s-3.75-0.48-3.84-2.52
	c-0.09-2.03-3.15-3.66-3.15-3.66c-0.16-1.92-3.21-2.77-5.3-3.12l-3.67,6.63l-1.53,6.39l-0.54,6.21l0.81,3.06l-0.41,2.16l-1.12,4.05
	c0,0-0.45,10.26,0,16.02c0.42,5.4,0.88,7.2,0.93,7.4c0.01,0.01,0.01,0.02,0.01,0.02c0.53,0.6,1.01,0.9,1.43,1.03
	c1.05,0.32,1.72-0.44,1.72-0.44l0.99-0.61l1.4-0.86c0,0,10.26-8.1,11.4-9.42s2.14-0.67,2.14-0.67s0.74-1.85,2.97-8.45
	C386.69,295.1,385.24,285.56,385.24,285.56z"
    />
    <Path
  id="bhatnimgaon"
  fill={getColor(113)}
  onPress={() => openModal(113)}
  d="M442.05,307.19c-1.76,1.4-2,1.83-2,1.83l-5.4,3.74l-5.27,1.98c0,0-7.12,1.96-10,7
	c-0.93,1.63-1.63,2.82-2.16,3.68l-2.34-0.68l-2.04-1.32l-1.02-2.46l0.12-4.5c-2.52-2.04-0.72-4.83-0.72-4.83l1.29-3.87l-4.05-1.71
	l-1.08-2.16v-2.97l8.73-4.68l7.29-3.69l1.06-2.75l1.6,1.11l1.72,1.1l0.96,1.25l0.29,0.97l3.79,3.24l2.49,1.94L442.05,307.19z"
/>
<Path
  id="babhulgaon"
  fill={getColor(95)}
  onPress={() => openModal(95)}
  d="M457.76,275.61l-6.82-3.31l-3.06-3.51l-4.14-3.33l-2.32-3.01l-3.53,2.11l-2.13,2.16
  c0,0-5.85,5.16-8.97,5.94c-3.12,0.78-5.7,5.04-5.7,5.04l-1.79,0.52l0.23,2.16l0.65,1.28l1.78,2.36l1.28,1.17l-0.16,2.88v1.1
  l1.38,0.63l1.6,1.11l1.72,1.1l0.96,1.25l0.29,0.97l3.79,3.24l2.49,1.94l6.74,7.78c0.89-0.71,2.18-1.66,4.03-2.94
  c5.49-3.78,4.86-6.03,4.77-9.27c-0.09-3.24,0.57-9,1.71-12.18C453.33,280.64,455.44,278.01,457.76,275.61z"
/>
<Path
  id="hingangaon"
  fill={getColor(94)}
  onPress={() => openModal(94)}
  d="M478.93,252.95c0,0-0.13,0.73-0.34,1.66c-0.28,1.25-0.69,2.88-1.1,3.65
  c-0.72,1.35-1.89,9-1.89,9l-2.76,1.14c0,0-8.4,1.02-11.76,4.02c-1.08,0.96-2.22,2.05-3.32,3.19l-6.82-3.31l-3.06-3.51l-4.14-3.33
  l-2.32-3.01l1.28-0.77l3.02-1.44l3.55-0.18c0,0,3.23,2.46,3.77-2.76c0.54-5.22,1.98-5.76,1.98-5.76s1.1-0.48,2.09-0.44
  c0.99,0.05,1.7-2.74,1.7-2.74c0-0.04,0.01-2.27,1.54-3.4h0.01c0.36-0.26,0.79-0.46,1.32-0.56c2.88-0.54,3.9-0.48,3.9-0.48
  l3.84-1.62h3.54l3.72,1.38c0,0,1.8,2.97,1.71,5.76C478.3,252.23,478.93,252.95,478.93,252.95z"
/>
<Path
  id="boratwadi_1_"
  fill={getColor(44)}
  onPress={() => openModal(44)}
  d="M290.38,401.99c0,0-5.27-0.86-8.55,1.44c-3.29,2.29-6.48,4.91-6.48,4.91l-1.77-3.02l0.42-2.7
	v-4.98l0.42-6.62c0.21-0.19,0.43-0.44,0.66-0.76c0,0,2.04-1.14,3.66-0.72c1.62,0.42,4.32-0.66,4.32-0.66l5.32-1.09
	c0.2,1.53,0.29,2.59,0.29,2.59L290.38,401.99z M275.35,408.34c0,0-1.8,2.65-3.83,1.3c-2.02-1.35-3.94-2.34-3.94-2.34
	s-3.48-2.52-9.78-2.22c-0.47,0.02-0.91,0.01-1.32-0.05l0.48-6.79c0,0,0.66-2.52,1.56-6.72c0.9-4.2,6.16-2.1,6.16-2.1l6.8,0.96
	c0.58,0.76,1.67,1.75,2.94,0.64l-0.42,6.62v4.98l-0.42,2.7L275.35,408.34z"
    />
    <Path
  id="bandewadi"
  fill={getColor(31)}
  onPress={() => openModal(31)}
  d="M273.1,138.74c0,0-4.43-1.63-8.54-3.2c-2.65-1.02-5.17-2-6.26-2.52
  c-2.8-1.3-4.06-0.49-4.43,1.98c-0.37,2.48-5.03,6.71-5.03,6.71l-3.16,1.77l-0.39-0.38l1.85,1.85v3.99l14.53-0.48l1.08,0.48
  l3.96-0.66c0,0,1.49-0.4,1.75-1.89c0.28-1.49-0.18-2.91-0.18-2.91s0.1-1.59,2.39-2.72c0.84-0.41,1.99-1.08,3.1-1.77L273.1,138.74z"
/>
<Path
  id="palasdeo"
  fill={getColor(14)}
  onPress={() => openModal(14)}
  d="M296.45,98.28c1.35-2.47,0.99-3.5,0.99-3.5c-0.45,0.2-0.87,0.41-1.24,0.64
  c-2.7,1.68-12.48,0.36-12.48,0.36l-6.72-1.2c0,0-6.36,0-10.08,0c-3.72,0-7.08,2.04-7.08,2.04l-2.4,3.24l-2.52,2.04l-2.28,0.6
  l-5.1,3.66c-0.96,1.92-0.05,6-0.05,6s1.49,3.9,0,7.14c-1.48,3.24-0.99,4.77-0.99,4.77s0.45,2.34,0,6.35c-0.44,4-3.16,3.78-3.16,3.78
  l0.51,1.66l1.31,0.99l0.58,1.71l-0.58,3.46l0.13,1.08l0.39,0.38l3.16-1.77c0,0,4.66-4.23,5.03-6.71c0.37-2.47,1.63-3.28,4.43-1.98
  c1.09,0.52,3.61,1.5,6.26,2.52l-1.75-4.09c0,0-0.96-3.48,0-4.77c0.96-1.29-0.06-3.72-0.06-3.72s0.21-2.91,3.57-1.77
  c3.36,1.14,3.6,1.68,3.6,1.68s7.59,2.59,9.16-3.17c1.58-5.76,4.82-13.54,4.82-13.54s1.84-3.6,6.93-2.56
  c4.79,0.97,6.1,0.61,6.24,0.57c0.01-0.01,0.01-0.01,0.01-0.01l-1.03-0.55C296.05,103.61,295.1,100.76,296.45,98.28z"
/>
<Path
  id="chandgaon"
  fill={getColor(15)}
  onPress={() => openModal(97)}
  d="M331.51,101.07c-2.96,2.24-3.69,8.39-3.69,8.39s-7.38-1.68-11.76-3.54s-10.44-1.75-10.44-1.75
  l-1.2-1.13h-4.92l-0.42,1.13h-2.01c0.01-0.01,0.01-0.01,0.01-0.01l-1.03-0.55c0,0-0.95-2.85,0.4-5.33c1.35-2.47,0.99-3.5,0.99-3.5
  c2.78-1.2,6.58-1.67,6.58-1.67l2.11-1.17l2.43-0.18l3.02-1.62l4.27-0.22l1.49-0.41c0,0,3.24-2.11,5.89,0.59
  c2.66,2.7,3.06,3.19,3.06,3.19s2.61,1.44,3.12,5.19C329.58,99.76,330.45,100.56,331.51,101.07z"
/>
<Path
  id="ahoti_no.1"
  fill={getColor(16)}
  onPress={() => openModal(16)}
  d="M336.37,101.9c0,0-2.8,0.14-4.86-0.83c-2.96,2.24-3.69,8.39-3.69,8.39s0.54,1.8-1.68,3.72
	c-2.22,1.92-6.42,5.16-4.62,9.84l0.87,1.44l2.46,0.81h3.03l7.68,3.3l3.92,0.23l-0.59-7.2c0,0-1.93-2.93,0.99-6.66
	c2.92-3.74,3.12-6.02,3.15-6.11c0.03-0.09-0.16-2.06,2.11-3.04L336.37,101.9z"
    />
    <Path
  id="agoti_no.2"
  fill={getColor(17)}
  onPress={() => openModal(17)}
  d="M353.68,109.01l-0.99-1.05l-4.62-1.86l-2.75-0.23l-0.18-0.08c-2.27,0.98-2.08,2.95-2.11,3.04
  c-0.03,0.09-0.23,2.37-3.15,6.11c-2.92,3.73-0.99,6.66-0.99,6.66l0.59,7.2l10.34,1.34l3.38-3.82l4.68-8.34l1.77-4.83l0.21-0.57
  l0.81-3.58L353.68,109.01z"
/>
<Path
  id="ganjewalan"
  fill={getColor(18)}
  onPress={() => openModal(18)}
  d="M403.84,91.4l-3.48,3.96l-5.46,3.84l-3.23,3.99l-4.18,4.14c0,0-2.37,3.87-2.97,6.45
  c-0.05,0.21-0.14,0.47-0.25,0.76c0,0-15.82-3.84-17.97-2.35c-2.16,1.49-6.65,0.96-6.65,0.96l0.21-0.57l0.81-3.58l0.58-1.04
  l9.05-4.23l1.17-0.05l0.45-0.72c0,0,12.78-6.4,15.9-10.06c3.12-3.66,9.42-7.38,9.42-7.38h1.26C398.5,85.52,410.44,81.44,403.84,91.4
  z"
/>
<Path
  id="kalthan_no.2"
  fill={getColor(41)}
  onPress={() => openModal(41)}
  d="M366.74,165.56l-3.37,1.17h-1.89l-13.77-3.97c-0.07,1.2-0.27,2.12-0.53,2.81l2.12,2.99
  l1.05,2.25l1.71,1.38l2.55,2.43l0.53,1.68l0.87,0.57l3.67-0.51l2.25-0.86l4.41-2.05l1.23-1.29l0.21-1.74l1.53-1.62l2.52-1.44
  l2.36-1.13C373.35,164.97,366.74,165.56,366.74,165.56z"
/>
<Path
  id="kalthan_no.1"
  fill={getColor(34)}
  onPress={() => openModal(34)}
  d="M381.7,155.18c0,0-1.14-3.66-4.2-7.56s-4.26-6.06-4.26-6.06s-0.07-0.46-0.11-1.49
  c-0.23,0.14-3.03,1.95-4.93,1.49c-1.98-0.48-3.36,0.6-3.36,0.6l-4.68,3.26l-1.92,1.36c0,0-4.08-0.06-4.44,0
  c-0.36,0.06-2.22-0.6-2.22-0.6l-2.11-1.5l-2.16-0.63l-1.13,6.75c0,0,1.17,2.97,1.53,9.81c0.04,0.8,0.04,1.51,0,2.15l13.77,3.97h1.89
  l3.37-1.17c0,0,6.61-0.59,7.45,0.67l4.81-2.29l2.4-1.8l1.14-2.58L381.7,155.18z"
/>
<Path
  id="kalashi"
  fill={getColor(19)}
  onPress={() => openModal(19)}
  d="M366.3,112.19c-2.16,1.49-6.65,0.96-6.65,0.96l-1.77,4.83l-4.68,8.34l-3.38,3.82l1.08,1
	l-3.16,5.89l-0.39,6.75l-0.04,0.27l2.16,0.63l2.11,1.5c0,0,1.86,0.66,2.22,0.6c0.36-0.06,4.44,0,4.44,0l1.92-1.36l4.68-3.26
	c0,0,1.38-1.08,3.36-0.6c1.9,0.46,4.7-1.35,4.93-1.49v-0.01c-0.03-0.9-0.03-2.24,0.05-4.08c0.18-3.96,4.86-11.16,4.86-11.16
	s4.94-7.11,6.23-10.28C384.27,114.54,368.45,110.7,366.3,112.19z"
    />
    <Path
  id="gagargaon"
  fill={getColor(42)}
  onPress={() => openModal(42)}
  d="M355.14,176.3l-0.53-1.68l-2.55-2.43l-1.71-1.38l-1.05-2.25l-2.12-2.99
  c-0.75,2.07-2.02,2.21-2.02,2.21l-4.26,1.98l-5.22,1.92l-7.32,0.85c0,0-1.98,0.35-6.78,0c-1.29-0.1-2.24,0.12-2.95,0.48l3.97,3.86
  l1.98,1.92l1.04,0.9l0.78,0.18l3.76,4.05l1.35,1.71l1.24,1.17l1.75,0.9l0.68,0.85l-1.9,3.89c-0.13,1.71,0.01,3.98,1.44,5.7
  c1.54,1.85,3.54,1.8,3.9,3.28c0.3,1.25-0.94,1.93-2.79,4.82c-0.51,0.8-1.07,1.67-1.55,2.58c-0.12,0.23-0.24,0.46-0.35,0.7
  c-0.22,0.48-0.42,0.98-0.57,1.49c-0.07,0.21-0.13,0.42-0.18,0.64c0,0.02-0.01,0.03-0.01,0.05l-0.01,0.03
  c-0.01,0.04-0.02,0.07-0.02,0.11c-0.03,0.13-0.05,0.26-0.07,0.39c-0.01,0.07-0.01,0.14-0.02,0.21l-0.01,0.04v0.02l-0.01,0.04
  c-0.01,0.09-0.01,0.18-0.02,0.28c-0.03,0.41-0.02,0.83,0.03,1.25c0.22,1.79,1.18,3.15,1.89,3.96l5.22-8.37l1.71-6.03
  c-0.36-2.88,1.5-5.73,1.5-5.73s3.24-4.32,5.43-6.48c2.19-2.16,0.69-7.29,0.69-7.29l-0.69-3.09l1.35-1.35l5.35-2.75l0.52-0.07
  L355.14,176.3z"
/>
<Path
  id="padasthal"
  fill={getColor(36)}
  onPress={() => openModal(36)}
  d="M449.23,160.43l-10.53,11.34c0,0-6.27,4.31-6.46,3.99c-1.85-2.82-6.32-2.4-6.32-2.4l-0.36-7.53
  l-1.17-9.63l-1.84-9.87c3.18-2.02,7.33-4.65,7.39-4.65c0.09,0,4.68-4.92,4.68-4.92l2.64-3.89l3.33-2.83l4.5-3.36l1.38-0.33
  l1.2,0.69l-0.78,18.27l1.35,4.68l-1.35,2.34C446.89,152.33,444.55,154.31,449.23,160.43z M470.06,132.87c-1.57-5.97-6.46-6.43-6.46-6.43
  l-1.59-0.69l-2.64,0.21l-2.85,0.02l-3.33,0.61l-5.52,0.45l-0.78,18.27l1.35,4.68l-1.35,2.34c0,0-2.34,1.98,2.34,8.1
  c0,0,7.38-1.44,10.35,0c2.97,1.44,4.95,0.18,4.95,0.18l4.17,1.47c1.5-3.48,2.54-14.02,2.54-14.02S471.64,138.83,470.06,132.87z"
/>
<Path
  id="shirodi"
  fill={getColor(35)}
  onPress={() => openModal(35)}
  d="M425.56,165.83l-1.17-9.63l-1.84-9.87c-1.97,1.25-3.56,2.26-3.56,2.26l-3.31,0.41l-2.87,1.68
	l-4.47,0.06l-1.41,0.72l-2.52,0.45c-4.79,0.39-10.62,3.73-10.62,3.78s-4.17,2.22-4.17,2.22l-0.65,0.2l1.27,3.98
	c0,0,0.36,1.45,0,2.43c-0.36,0.99,0.16,2.21,0.16,2.21s1.05,3.19,0.2,5.13c-0.86,1.94-0.99,2.63,0.09,3.9
	c1.08,1.28,1.39,4.35,1.39,4.35h1.3l1.72-0.37c0,0,3.46-1.13,3.59-1.13c0.14,0,4.46-0.77,4.46-0.77l4.01-0.54
	c0,0,1.49-1.04,2.13-0.06l3.37-0.94l4.62-0.3l8.64-2.64L425.56,165.83z M390.69,175.76c-1.08-1.27-0.95-1.96-0.09-3.9
	c0.85-1.94-0.2-5.13-0.2-5.13s-0.52-1.22-0.16-2.21c0.36-0.98,0-2.43,0-2.43l-1.27-3.98l-4.48,1.33c-0.12,3.03-3.06,5.7-3.06,5.7
	l-4.68,2.22l-7.89,4.68l-1.71,2.56l-2.88,1.85l-5.22,1.62l-0.78,0.25l7.71,4.96l1.64-1.43l6.82,0.18l2.12,0.95l4.4-0.18l2.61,1.66
	H385l3.09-1.8c0,0,3.54-2.49,3.54-2.55h0.45C392.08,180.11,391.77,177.04,390.69,175.76z"
    />
    <Path
  id="malewadi"
  fill={getColor(21)}
  onPress={() => openModal(21)}
  d="M295.58,110.52c-2.73-2.28,0.25-6.22,0.46-6.49c-0.14,0.04-1.45,0.4-6.24-0.57
  c-5.09-1.04-6.93,2.56-6.93,2.56s-3.24,7.78-4.82,13.54c-1.57,5.76-9.16,3.17-9.16,3.17s-0.24-0.54-3.6-1.68
  c-3.36-1.14-3.57,1.77-3.57,1.77s1.02,2.43,0.06,3.72c-0.96,1.29,0,4.77,0,4.77l1.75,4.09c4.11,1.57,8.54,3.2,8.54,3.2l0.67,0.25
  c1.92-1.19,3.74-2.41,3.74-2.41l2.25-1.92l7.23-3.57c0,0,0.29-0.15,0.63-0.43c0.33-0.27,0.7-0.67,0.89-1.17
  c0.39-1.01,1.04-1.71,2.37-1.51c1.32,0.21,2.6,0.12,2.6,0.12s2.36-0.25,0.5-2.56s-2.46-6.84-0.24-8.4c2.22-1.56,2.56-1.71,2.56-1.71
  S298.42,112.88,295.58,110.52z"
/>
<Path
  id="vhayali"
  fill={getColor(56)}
  onPress={() => openModal(56)}
  d="M268.18,209.96l-2.88-1.86l-6.84-1.14l-0.24-3.12l-2.52-0.72l-6.06,1.74l-2.15,3.72l-1.66,1.38
  l-0.54,3.12l-1.49,4.77l-1.89,1.8l-1.21,3.24l0.63,6.39l2.97,6.03l2.25,4.86l3.24,3.24l5.49,5.94l0.54,4.59l4,0.27l4.5-7.65
  l2.16-5.13l3.5-12.69c0,0,0.17-4.78,0.24-8.24v-0.22C270.28,216.8,268.18,209.96,268.18,209.96z"
/>
<Path
  id="kauthali"
  fill={getColor(57)}
  onPress={() => openModal(57)}
  d="M296.47,187.52l-1.77-0.51l-2.25-0.89l-4.91-2.16c0,0-2.38-1.7-3.42-2.8c-1.03-1.1-2.44,0-2.44,0
  l-2.1,5.64l-0.3,5.46c0,0-4.02,4.44-4.08,7.02c-0.06,2.58-0.18,5.04-0.18,5.04l-2.16,1.08l-1.26,1.74l-2.22,2.34l-1.2,0.48
  c0,0,2.1,6.84,2.04,10.32v0.22c3.51,1.26,4.72,0.64,10.12-0.76c5.41-1.4,8.01,1.76,8.01,1.76l3.6,3.19l1.45-3.15l1.57-4.05
  l0.99-2.16l0.86-1.98l1.08-5.67l1.25-6.57l0.23-2.75c0,0,0.76-2.11,1.08-4.04c0.31-1.94,1.41-3.86,1.41-3.86l1.59-1.35v-1.05
  L296.47,187.52z"
/>
<Path
  id="bhawadi"
  fill={getColor(20)}
  onPress={() => openModal(20)}
  d="M327.82,109.46c0,0-7.38-1.68-11.76-3.54s-10.44-1.75-10.44-1.75l-1.2-1.13h-4.92l-0.42,1.13
	h-2.01c-0.21,0.27-3.19,4.21-0.46,6.49c2.84,2.36-0.31,4.77-0.31,4.77s-0.34,0.15-2.56,1.71c-2.22,1.56-1.62,6.09,0.24,8.4
	s-0.5,2.56-0.5,2.56s-1.28,0.09-2.6-0.12c-1.33-0.2-1.98,0.5-2.37,1.51c-0.19,0.5-0.56,0.9-0.89,1.17l2.94,0.52l12.78,5.9l3.25,0.26
	l-0.46-0.82c0,0-0.68-3.99-0.95-7.23s5.36-3.73,5.36-3.73l8.82-0.5l0.9-0.6h2.13l-0.87-1.44c-1.8-4.68,2.4-7.92,4.62-9.84
	C328.36,111.26,327.82,109.46,327.82,109.46z"
    />
    <Path
  id="loni_deokar"
  fill={getColor(32)}
  onPress={() => openModal(32)}
  d="M310.45,161.6l-2.16-2.16l-1.04-4.21l-0.43-7.13c-0.84-2.43-0.06-4.62-0.06-4.62l-0.06-5.94
	l-0.11-0.2l-3.25-0.26l-12.78-5.9l-2.94-0.52c-0.34,0.28-0.63,0.43-0.63,0.43l-7.23,3.57l-2.25,1.92c0,0-1.82,1.22-3.74,2.41
	c-1.11,0.69-2.26,1.36-3.1,1.77c-2.29,1.13-2.39,2.72-2.39,2.72s0.46,1.42,0.18,2.91c-0.26,1.49-1.75,1.89-1.75,1.89l2.73,8.58
	l3.12,7.2l1.92,5.52l3.54,6.84l3.66,4.74l1.74-3.66l4.62-7.32l4.44-4.98l3.83-3.08l1.45-0.76l2.64-2.94c0,0,3.06-2.76,5.46-0.6
	c2.4,2.16,5.4,5.22,5.4,5.22C310.88,162.15,310.45,161.6,310.45,161.6z"
/>
<Path
  id="balpudi"
  fill={getColor(43)}
  onPress={() => openModal(43)}
  d="M311.26,163.04c0,0-3-3.06-5.4-5.22c-2.4-2.16-5.46,0.6-5.46,0.6l-2.64,2.94l-1.45,0.76
	l-3.83,3.08l-4.44,4.98l-4.62,7.32l-1.74,3.66c0,0,1.41-1.1,2.44,0c1.04,1.1,3.42,2.8,3.42,2.8l4.91,2.16l2.25,0.89l1.77,0.51
	l6.99,0.54l0.11-0.5l0.73-3.22l1.98-2.04l1.26-2.76c0,0,2.32-8,3.81-11.46C312.21,166.09,311.78,164.25,311.26,163.04z"
/>
<Path
  id="kati"
  fill={getColor(117)}
  onPress={() => openModal(117)}
  d="M331.32,305.36c1.84-2.52,3.43-4.44,3.43-4.44l-1.11-4.08l-0.04-0.36l-2.72,1.26l-1.14,1.68h-1.44
	l-4.14,2.76l-4.92,1.62l-4.2,0.96l-11.22,0.6l-6.64-0.45l-5.49-1.29l-5.63-0.84l-2.76,6.72l-3.12,3.6l-1.05,2.1l-2.46,4.8
	l-2.04,2.91l-0.05,1.71l5.9,2.1l16.26,7.32c0,0,1.21,0.64,1.72,1.63l6.14-0.91l7.2-0.54c0,0,10.2-1.19,11.46,1.98l0.89,2.08
	c0.5-1.18,0.52-2.26,0.52-2.26l1.26-4.32l-0.27-2.7l0.09-5.31c0,0-0.36-3.87,0-8.1C325.96,313.17,328.87,308.73,331.32,305.36z"
/>
<Path
  id="kacharwadi"
  fill={getColor(88)}
  onPress={() => openModal(88)}
  d="M285.79,256.46v3.12l-3.36,1.05l-6.43,3.63c0,0-2.42,3.48-5.3-0.72
	c-2.88-4.2-7.04-7.2-9.52-8.16l-1.36-1.17l4.5-7.65l2.16-5.13l3.5-12.69l1.61,1.84l3.81,7.41l0.83,2.61l2.77,5.96l1.61,2.45
	l1.94,2.11L285.79,256.46z"
/>
<Path
  id="nimgaon_ketki"
  fill={getColor(89)}
  onPress={() => openModal(89)}
  d="M328.14,264.29l-4.5-5.18l-4.37-7.56l-2.79-6.12l-2.97-6.52c0,0-0.3-0.76-0.78-1.95
	c-1.23-3.01-3.64-8.8-5.39-11.98c-0.57-1.04-1.33-1.68-2.18-2.04c-2.76-1.14-6.48,0.75-7.89,1.75c-1.85,1.31-5.32,0-5.32,0
	l-3.6-3.19c0,0-2.6-3.16-8.01-1.76c-5.4,1.4-6.61,2.02-10.12,0.76c-0.07,3.46-0.24,8.24-0.24,8.24l1.61,1.84l3.81,7.41l0.83,2.61
	l2.77,5.96l1.61,2.45l1.94,2.11l3.24,5.34v3.12l-3.36,1.05l-6.43,3.63c0,0-2.42,3.48-5.3-0.72c-2.88-4.2-7.04-7.2-9.52-8.16
	l-0.1,2.74l1.34,4.28l0.84,4.26l0.18,3.54l-0.1,3l1.16,1.35l2.48,2.07l1.53,1.22l1.57,2.42v3.88l3.42-0.28l1.76-1.03l4.82-1.13
	l5.48-2.07l1.18-0.58l1.3-0.54l12.1-0.27l1.18-1.08l3.24-0.5l2.38-0.31h2.16c0,0,4.5-0.63,7.42-3.29c2.93-2.65,9.63-6.39,11.84-5.49
	L328.14,264.29z"
    />
    <Path
  id="varkute_kh"
  fill={getColor(98)}
  onPress={() => openModal(98)}
  d="M333.16,292.22l-0.72-4.38v-3.66l-0.9-2.52l-1.35-8.07l-1.47-2.7l-0.21-1.05l-0.15-2.27
	c-2.21-0.9-8.91,2.84-11.84,5.49c-2.92,2.66-7.42,3.29-7.42,3.29h-2.16l-2.38,0.31l-3.24,0.5l-1.18,1.08l-12.1,0.27l-1.3,0.54
	l-0.82,6.71l0.82,4.09l0.62,3.37l-0.64,3.02l-0.66,3.6v2.94l5.63,0.84l5.49,1.29l6.64,0.45l11.22-0.6l4.2-0.96l4.92-1.62l4.14-2.76
	h1.44l1.14-1.68l2.72-1.26L333.16,292.22z"
/>
<Path
  id="pondkulwadi"
  fill={getColor(71)}
  onPress={() => openModal(71)}
  d="M333.04,214.07c-0.05-0.42-0.06-0.84-0.03-1.25c0.01-0.11,0.02-0.22,0.03-0.32l-0.01,0.04
	c-3.92,0.59-5.39-1.62-9.84-3.33c-4.46-1.71-7.34,0-7.34,0l-5.8,2.1c-0.13,0.43-0.29,0.82-0.45,1.15v0.01
	c-0.42,0.85-0.86,1.33-0.86,1.33l-1.89,3.15l-1.69,5.99c0.85,0.36,1.61,1,2.18,2.04c1.75,3.18,4.16,8.97,5.39,11.98h2.01
	c0,0,5.58-0.3,11.22-1.2c5.64-0.9,5.82-7.08,5.82-7.08l1.92-3.42l1.05-4.44l0.18-2.79C334.22,217.22,333.26,215.86,333.04,214.07z"
/>
<Path
  id="bijwadi"
  fill={getColor(59)}
  onPress={() => openModal(59)}
  d="M338.62,201.42c-0.36-1.48-2.36-1.43-3.9-3.28c-1.43-1.72-1.57-3.99-1.44-5.7l1.9-3.89l-0.68-0.85
	l-1.75-0.9l-1.24-1.17l-1.35-1.71l-3.76-4.05l-0.78-0.18l-1.04-0.9l-1.98-1.92l-3.97-3.86c-1.94,1-2.03,3.11-2.03,3.11l-2.68,12.48
	l-0.83,3.49l-0.3,1.28c-5.04,3.96-5.58,8.55-3.33,12.87c1.04,1.99,0.97,3.75,0.59,5.07l5.8-2.1c0,0,2.88-1.71,7.34,0
	c4.45,1.71,5.92,3.92,9.84,3.33l0.01-0.06l0.01-0.04c0.01-0.07,0.01-0.14,0.02-0.21c0.02-0.13,0.04-0.26,0.07-0.39
	c0-0.04,0.01-0.07,0.02-0.11l0.01-0.03c0-0.02,0.01-0.03,0.01-0.05c0.05-0.22,0.11-0.43,0.18-0.64c0.15-0.51,0.35-1.01,0.57-1.49
	c0.11-0.24,0.23-0.47,0.35-0.7c0.48-0.91,1.04-1.78,1.55-2.58C337.68,203.35,338.92,202.67,338.62,201.42z"
/>
<Path
  id="karewadi"
  fill={getColor(58)}
  onPress={() => openModal(58)}
  d="M303.57,187.56l-0.11,0.5v1.05l-1.59,1.35c0,0-1.1,1.92-1.41,3.86
	c-0.32,1.93-1.08,4.04-1.08,4.04l-0.23,2.75l-1.25,6.57l-1.08,5.67l-0.86,1.98l-0.99,2.16l-1.57,4.05l-1.45,3.15
	c0,0,3.47,1.31,5.32,0c1.41-1,5.13-2.89,7.89-1.75l1.69-5.99l1.89-3.15c0,0,0.44-0.48,0.86-1.33v-0.01
	c0.16-0.33,0.32-0.72,0.45-1.15c0.38-1.32,0.45-3.08-0.59-5.07c-2.25-4.32-1.71-8.91,3.33-12.87l0.3-1.28L303.57,187.56z" 
    />
    <Path
  id="varkute_bk"
  fill={getColor(33)}
  onPress={() => openModal(33)}
  d="M347.31,144.05l-1.13,6.75c0,0,1.17,2.97,1.53,9.81c0.04,0.8,0.04,1.51,0,2.15
	c-0.07,1.2-0.27,2.12-0.53,2.81c-0.75,2.07-2.02,2.21-2.02,2.21l-4.26,1.98l-5.22,1.92l-7.32,0.85c0,0-1.98,0.35-6.78,0
	c-1.29-0.1-2.24,0.12-2.95,0.48c-1.94,1-2.03,3.11-2.03,3.11l-2.68,12.48l-0.83,3.49l-9.52-4.53l0.73-3.22l1.98-2.04l1.26-2.76
	c0,0,2.32-8,3.81-11.46c0.86-1.99,0.43-3.83-0.09-5.04c-0.38-0.89-0.81-1.44-0.81-1.44l-2.16-2.16l-1.04-4.21l-0.43-7.13
	c-0.84-2.43-0.06-4.62-0.06-4.62l-0.06-5.94l-0.11-0.2l-0.46-0.82c0,0-0.68-3.99-0.95-7.23s5.36-3.73,5.36-3.73l8.82-0.5l0.9-0.6
	h2.13l2.46,0.81h3.03l7.68,3.3l3.92,0.23l10.34,1.34l1.08,1l-3.16,5.89l-0.39,6.75L347.31,144.05z"
/>
<Path
  id="zahadewadi"
  fill={getColor(90)}
  onPress={() => openModal(90)}
  d="M365.98,268.94l-10.2-0.48l-2.1-0.89c0,0-6.06-0.13-6.3-0.14c-0.24,0-1.02-1.01-1.02-1.01
	h-6.48l-1.5,1.01l-10.02,0.14l0.15,2.27l0.21,1.05l1.47,2.7l1.35,8.07l0.9,2.52v3.66l0.72,4.38l0.44,4.26l0.04,0.36l1.11,4.08
	l4.32-1.98l7.92-4.59l5.94-3.06l9.27-2.88l0.54-6.21l1.53-6.39l3.67-6.63C366.83,268.99,365.98,268.94,365.98,268.94z"
/>
<Path
  id="bedshinge"
  fill={getColor(96)}
  onPress={() => openModal(96)}
  d="M423.08,289.17v-1.1l0.16-2.88l-1.28-1.17l-1.78-2.36l-0.65-1.28l-0.23-2.16l-1.48-0.25
	c-3.56-0.77-9.05,1.94-9.05,1.94l-9.58,5.62l-1.21,0.81l1.03,3.87v2.88l6.75,5.13l1.62,2.7l8.73-4.68l7.29-3.69l1.06-2.75
	L423.08,289.17z"
/>
<Path
  id="taratgaon"
  fill={getColor(93)}
  onPress={() => openModal(93)}
  d="M487.9,255.15l-1.74,0.53l-4.56-1.07h-3.01c-0.28,1.25-0.69,2.88-1.1,3.65
	c-0.72,1.35-1.89,9-1.89,9l6.84-0.54c0,0,5.4-0.48,8.76-1.08c3.36-0.6,3.48-5.16,3.48-5.16s0.53-1.84,1.15-3.94L487.9,255.15z"
/>
<Path
  id="vangali"
  fill={getColor(60)}
  onPress={() => openModal(60)}
  d="M362.41,200.66l-0.21-3.5l-0.03-0.49l0.59-7.17l2.07-5.22l1.15-1l-7.71-4.96l-4.04,1.32l-5.44,1.4
	l0.69,3.09c0,0,1.5,5.13-0.69,7.29c-2.19,2.16-5.43,6.48-5.43,6.48s-1.86,2.85-1.5,5.73l2.52,1.56l2.55,2.97l2.01,1.65l3.3,1.23
	l2.71,2.98l1.31,1.8l1.3,0.86l4.86,0.5c0,0,2.52-0.41,1.9-3.02c-0.63-2.61-0.18-7.56-0.18-7.56l0.94-0.54l0.22-0.91l0.23-0.98
	l-1.93-1.35L362.41,200.66z"
    />
    <Path
  id="sugaon"
  fill={getColor(38)}
  onPress={() => openModal(38)}
  d="M457.65,186.19c-0.1-0.04-0.97-0.47-3.92-1.82c-3.15-1.44-5.67-1.98-11.16-3.15
	c-5.49-1.17-9.79-0.5-9.79-0.5c-0.02,0.12-0.05,0.25-0.08,0.38c-2.1,8.58,1.4,16.98,1.4,16.98l0.78,2.77c0,0,13.14,3.54,18.95,3.24
	l0.35-6.73C453.77,195.56,455.57,190.83,457.65,186.19z"
/>
<Path
  id="pimpri_kh"
  fill={getColor(39)}
  onPress={() => openModal(39)}
  d="M432.7,181.1c0.03-0.13,0.06-0.26,0.08-0.38c0.5-2.28,0.18-3.87-0.54-4.96
	c-1.85-2.82-6.32-2.4-6.32-2.4l-8.64,2.64l-4.62,0.3l-3.37,0.94c0.25,0.36,0.37,1.02,0.25,2.14c-0.45,4.04-0.5,7.06-0.5,7.06
	L409,188.1c0,0,0.13,2.65,2.27,3.7c0.39,0.2,0.84,0.34,1.37,0.4c3.15,0.36,7.59,0.18,8.12,0.14h0.03c0.29,0.03,2.62,0.2,3.33,1.39
	c0.81,1.35,1.57,4.9,8.6,4.36l1.38-0.01C434.1,198.08,430.6,189.68,432.7,181.1z"
/>
<Path
  id="indapur"
  fill={getColor(67)}
  onPress={() => openModal(67)}
  d="M428.66,218.98c-1.12-3.7-5.17-5.24-5.17-5.24s-1.14-0.36-1.89-0.93s-6.09-0.18-6.45,0.51
	c-0.36,0.69-2.76,0.69-3.39-0.24s-2.61-1.2-2.61-1.2l-1.83-0.54c-5.16-2.76-8.58-2-16-1.32c-7.43,0.67-10.63,8.68-10.81,8.82
	c-0.18,0.13-1.44,3.55-1.48,3.74c-0.68,3.41,0.63,7.1,0.63,7.1s1.4,9.36,7.24,15.98c5.85,6.62,13.28,4.41,13.28,4.41l1.17,0.81
	l0.85-1.22c0,0,1.67-0.31,8.15-1.48c5.56-1,8.76-3.58,10.97-5.29c0.37-0.28,0.71-0.54,1.03-0.77c2.25-1.59,3.75-7.08,5.73-10.56
	C430.06,228.08,429.79,222.66,428.66,218.98z"
/>
<Path
  id="ajoti"
  fill={getColor(37)}
  onPress={() => openModal(37)}
  d="M468.7,162.08c-1.5,3.48-1.83,5.78-1.83,5.78l-3.78,7.33c0,0-2.92,5.43-5.44,11
	c-0.1-0.04-0.97-0.47-3.92-1.82c-3.15-1.44-5.67-1.98-11.16-3.15c-5.49-1.17-9.79-0.5-9.79-0.5c0.5-2.28,0.18-3.87-0.54-4.96
	c0.19,0.32,6.46-3.99,6.46-3.99l10.53-11.34c0,0,7.38-1.44,10.35,0c2.97,1.44,4.95,0.18,4.95,0.18L468.7,162.08z"
    />
    <Path
  id="malwadi_no.2"
  fill={getColor(63)}
  onPress={() => openModal(63)}
  d="M453.64,207.77l0.19-3.68c-5.81,0.3-18.95-3.24-18.95-3.24l0.52,1.85l0.32,2.88l0.1,0.93
	v1.62l-1.41,1.8l-0.15,4.86l4.26-1.17h15.31l0.13,0.11L453.64,207.77z"
/>
<Path
  id="sardewadi"
  fill={getColor(66)}
  onPress={() => openModal(66)}
  d="M457.69,244.26c0,0-3.55,1.18-3.91-1.26c-0.36-2.42-4.46-1.78-4.46-1.78s-4,0.23-4.42-1.09
	c0,0-17.81,1.39-19.25,4.45l10.44,6.3l5.31,4.05l7.87,5.13c0,0,3.23,2.46,3.77-2.76c0.54-5.22,1.98-5.76,1.98-5.76
	s1.1-0.48,2.09-0.44c0.99,0.05,1.7-2.74,1.7-2.74c0-0.04,0.01-2.27,1.54-3.4L457.69,244.26z"
/>
<Path
  id="indapur_rural"
  fill={getColor(68)}
  onPress={() => openModal(68)}
  d="M444.88,239.72c0.36-1.77-1.05-3.06-1.05-3.06l-2.16-1.62l-2.56-3.2l-0.73-2.02l-0.4-2.55
	l-1.74-4.08l-1.59-4.49l-0.41-3.28l0.02-0.63l0.15-4.86l1.41-1.8v-1.62l-0.1-0.93c0,0-7.64,2.04-12.14,1.44
	c-4.5-0.6-6.18,0.8-6.18,0.8l-4.98,1.56l-2.82-0.56l-3.72-0.36l-1.69-2.16l-1.97-4.2c2.46-1.26,3.96-10.09,3.96-10.09l5.09-0.21
	c-2.14-1.05-2.27-3.7-2.27-3.7l0.04-1.66c0,0,0.05-3.02,0.5-7.06c0.12-1.12,0-1.78-0.25-2.14c-0.64-0.98-2.13,0.06-2.13,0.06
	l-4.01,0.54c0,0-4.32,0.77-4.46,0.77c-0.13,0-3.59,1.13-3.59,1.13l-1.72,0.37h-1.75c0,0.06-3.54,2.55-3.54,2.55l-3.09,1.8h-0.39
	c2.52,2.43-0.99,6.66-2.43,9.36l4.86-1c0,0,5.85,1.37,3.51,5.33c-2.34,3.95-4.59,3.32-4.59,3.32l-0.99,1.62c0,0-1.98,8.28-7.74,7.38
	c-5.76-0.9-7.47,0.07-7.47,0.07s-3.62-1.45-4.46-5.39l-0.22,0.91l-0.94,0.54c0,0-0.45,4.95,0.18,7.56c0.62,2.61-1.9,3.02-1.9,3.02
	l-4.86-0.5l-1.3-0.86l-1.31-1.8l-2.71-2.98l-3.3-1.23l-2.01-1.65l-2.55-2.97l-2.52-1.56l-1.71,6.03l-5.22,8.37l-0.18,2.79
	l-1.05,4.44l-1.92,3.42c0,0-0.18,6.18-5.82,7.08c-5.64,0.9-11.22,1.2-11.22,1.2h-2.01c0.48,1.19,0.78,1.95,0.78,1.95l2.97,6.52
	c0,0,3.84-3.61,8.76-2.53c0.51,0.11,1.05,0.25,1.61,0.42c0,0,2.89-4.2,5.29-4.62c2.4-0.42,4.26-2.46,4.26-2.46s6.06-2.82,11.7,0.72
	l4.83-0.24l5.73,4.74c0,0,1.26,0.42,0.72,4.38c-0.54,3.96-0.6,6.56-0.6,6.56c0.48-0.36,0.89-0.65,1.02-0.64c0.36,0.02,1.44,0,1.44,0
	v3.26c0,0-1.32,3.48,3.36,2.76c3-0.46,5.86,2.54,7.52,4.74l5.56-5.28l5.22-5.88l4-5.7c-5.84-6.62-7.24-15.98-7.24-15.98
	s-1.31-3.69-0.63-7.1c0.04-0.19,1.3-3.61,1.48-3.74c0.18-0.14,3.38-8.15,10.81-8.82c7.42-0.68,10.84-1.44,16,1.32l1.83,0.54
	c0,0,1.98,0.27,2.61,1.2s3.03,0.93,3.39,0.24c0.36-0.69,5.7-1.08,6.45-0.51s1.89,0.93,1.89,0.93s4.05,1.54,5.17,5.24
	c1.13,3.68,1.4,9.1-0.58,12.58c-1.98,3.48-3.48,8.97-5.73,10.56c-0.32,0.23-0.66,0.49-1.03,0.77l4.33,1.69
	c1.44-3.06,19.25-4.45,19.25-4.45C444.86,240.01,444.85,239.87,444.88,239.72z"
    />
    <Path
  id="galandwadi_1_"
  fill={getColor(92)}
  onPress={() => openModal(92)}
  d="M441.4,254.93l-5.31-4.05l-10.44-6.3l-4.33-1.69c-2.21,1.71-5.41,4.29-10.97,5.29
  c-6.48,1.17-8.15,1.48-8.15,1.48l-0.85,1.22l-1.17-0.81c0,0-2.14,0.64-5.02,0.2v4.84l-0.74,4.95l-0.76,4.56l-0.68,4.35v12.06
  l0.22,0.49l-0.1,3.17l0.4,0.12c2.11,0.63,3.89,1.32,3.89,1.32l0.59,0.21l1.21-0.81l9.58-5.62c0,0,5.49-2.71,9.05-1.94l1.48,0.25
  l1.79-0.52c0,0,2.58-4.26,5.7-5.04c3.12-0.78,8.97-5.94,8.97-5.94l2.13-2.16l3.53-2.11l1.28-0.77l3.02-1.44l3.55-0.18L441.4,254.93z"
/>
<Path
  id="vitthalwadi"
  fill={getColor(91)}
  onPress={() => openModal(91)}
  d="M395.16,250.27v4.84l-0.74,4.95l-0.76,4.56l-0.68,4.35v12.06l0.22,0.49l-0.1,3.17
  c-2.28-0.66-3.72-2.49-3.72-2.49l-0.09-1.35l-6.63-5.07v-2.16l-2.7-0.48l-6.36-8.4c0,0-0.55-0.99-1.48-2.22l5.56-5.28l5.22-5.88
  l4-5.7C389.61,248.73,392.66,249.9,395.16,250.27z"
/>
<Path
  id="tarangwadi"
  fill={getColor(70)}
  onPress={() => openModal(70)}
  d="M389.29,280.85l-6.63-5.07v-2.16l-2.7-0.48l-6.36-8.4c0,0-0.55-0.99-1.48-2.22
	c-1.66-2.2-4.52-5.2-7.52-4.74c-4.68,0.72-3.36-2.76-3.36-2.76v-3.26c0,0-1.08,0.02-1.44,0c-0.13-0.01-0.54,0.28-1.02,0.64
	c-0.83,0.65-1.86,1.54-1.86,1.54l-3.02-0.72l-1.54-1.46c0,0-1.8-1.78-2.28-1.9c-0.48-0.12-1.92,0.24-1.92,0.24l-4.44,1.66l-6.4-4.18
	c0,0-5.74-2.89-10.47-4.26c-0.56-0.17-1.1-0.31-1.61-0.42c-4.92-1.08-8.76,2.53-8.76,2.53l2.79,6.12l4.37,7.56l4.5,5.18l0.22,3.28
	l10.02-0.14l1.5-1.01h6.48c0,0,0.78,1.01,1.02,1.01c0.24,0.01,6.3,0.14,6.3,0.14l2.1,0.89l10.2,0.48c0,0,0.85,0.05,1.96,0.24
	c2.09,0.35,5.14,1.2,5.3,3.12c0,0,3.06,1.63,3.15,3.66c0.09,2.04,3.84,2.52,3.84,2.52s2.61,1.53,3.12,3.39l0.34,0.25l0.32,0.23
	l5.37-0.15L389.29,280.85z"
    />
    <Path
  id="gokhal"
  fill={getColor(69)}
  onPress={() => openModal(69)}
  d="M359.38,245.84c-0.54,3.96-0.6,6.56-0.6,6.56c-0.83,0.65-1.86,1.54-1.86,1.54l-3.02-0.72
  l-1.54-1.46c0,0-1.8-1.78-2.28-1.9c-0.48-0.12-1.92,0.24-1.92,0.24l-4.44,1.66l-6.4-4.18c0,0-5.74-2.89-10.47-4.26
  c0,0,2.89-4.2,5.29-4.62c2.4-0.42,4.26-2.46,4.26-2.46s6.06-2.82,11.7,0.72l4.83-0.24l5.73,4.74
  C358.66,241.46,359.92,241.88,359.38,245.84z"
/>
<Path
  id="malwadi_1_"
  fill={getColor(62)}
  onPress={() => openModal(62)}
  d="M435.72,205.58c0,0-7.64,2.04-12.14,1.44c-4.5-0.6-6.18,0.8-6.18,0.8l-4.98,1.56l-2.82-0.56
  l-3.72-0.36l-1.69-2.16l-1.97-4.2c2.46-1.26,3.96-10.09,3.96-10.09l5.09-0.21c0.39,0.2,0.84,0.34,1.37,0.4
  c3.15,0.36,7.59,0.18,8.12,0.14h0.03c0.29,0.03,2.62,0.2,3.33,1.39c0.81,1.35,1.57,4.9,8.6,4.36l1.38-0.01l0.78,2.77l0.52,1.85
  L435.72,205.58z"
/>
<Path
  id="galandwadi"
  fill={getColor(61)}
  onPress={() => openModal(61)}
  d="M390.55,198.15c-2.34,3.95-4.59,3.32-4.59,3.32l-0.99,1.62c0,0-1.98,8.28-7.74,7.38
  c-5.76-0.9-7.47,0.07-7.47,0.07s-3.62-1.45-4.46-5.39l0.23-0.98l-1.93-1.35l-1.19-2.16l-0.21-3.5c0,0,7.29,3.5,11.07,2.06
  c3.78-1.44,7.47-2.7,8.91-5.4l4.86-1C387.04,192.82,392.89,194.19,390.55,198.15z"
/>
<Path
  id="narutwadi"
  fill={getColor(40)}
  onPress={() => openModal(40)}
  d="M382.18,193.82c-1.44,2.7-5.13,3.96-8.91,5.4c-3.78,1.44-11.07-2.06-11.07-2.06l-0.03-0.49
  l0.59-7.17l2.07-5.22l1.15-1l1.64-1.43l6.82,0.18l2.12,0.95l4.4-0.18l2.61,1.66h1.04C387.13,186.89,383.62,191.12,382.18,193.82z"
/>
<Path
  id="bhandgaon"
  fill={getColor(114)}
  onPress={() => openModal(114)}
  d="M414.82,328.7c0,0-8.7,4.32-13.68,0c-4.98-4.32-10.14-7.8-10.14-7.8l-9.5-10.75
  c0,0-1-0.65-2.14,0.67s-11.4,9.42-11.4,9.42l-1.4,0.86l2.75,3.08l5.17,4.19l3.29,3.28l3.73,5.36l3.2,6.12l2.61,4.5l3.69,2.16
  l1.44,0.99h1.75l3.61,0.27l2.74,0.72l3-2.91l4.74-3.9l1.38-3.42l3.12-4.86l0.6-2.22l1.62-2.16l0.84-2.28v-2.46L414.82,328.7z"
/>
<Path
  id="giravi"
  fill={getColor(142)}
  onPress={() => openModal(142)}
  d="M497.62,383.18c0,0-0.99-1.08-1.02-0.99c-0.03,0.09-3.5-1.24-3.5-1.24s-3.15-1.82-3.21-1.86
  c-0.07-0.05-1.51-0.57-1.58-0.57c-0.04,0-0.47-0.28-0.88-0.53l-1.21,1.23l-3.87,1.44l-3.06,1.88c0,0-0.81,0.14-1.77,0.31
  c-1.33,0.23-2.97,0.51-3.18,0.51c-0.36,0-5.58,0.63-6.39,0.72c-0.81,0.09-3.51,0.45-3.51,0.45l-4.86,2.16l-2.82,0.03l-0.72,0.96
  l-3.12,0.3l-1.39-0.31l-1.22,3.19l-1.31,4.06c0,0-1.87,5.92,1.88,8.86c0.6-0.6,1.17-0.95,1.17-0.95s4.05-1.62,6-1.95
  s2.52-0.96,2.52-0.96s0.61-0.5,4.39-2.23c3.78-1.73,6.21,0.47,6.21,0.47l3.06,1.76l2.2,1.76l2.66,1.86l1.53,0.09l1.75-0.36
  l1.15-1.1l0.31-1.42l-0.06-1.6l0.45-1.48l1.19-1.8l1.39-1.46l3.02-1.63l2.49-0.96l2.88-1.2l1.74-1.26l0.93-1.74l0.06-2.31L497.62,383.18z"
/>
<Path
  id="chakati"
  fill={getColor(135)}
  onPress={() => openModal(135)}
  d="M325.41,374.99v-0.02c-0.07-0.36-0.23-0.55-0.42-0.63c-0.45-0.2-1.07,0.17-1.07,0.17l-4.47,4.17
	c0,0-7.85,2.92-7.9,3.02c-0.04,0.08-5.51,2.05-5.51,2.05l-4.11,1.02l-0.75-0.45l0.06-1.68l0.12-2.94l3.24-9
	c0,0,3.92-5.17,7.91-10.66c0.06-0.09,0.13-0.17,0.19-0.26c4.05-5.58-3.92-6.7-3.92-6.7l-12.01-1.43l-1.83,2.46l-3.6,3.69
	c0,0-2.76,3.81-2.37,5.64s-0.46,5.34-0.46,5.34l-1.13,2.52l-0.9,3.39l0.57,1.68l2.16,2.98l1.17,2.79l0.27,2.57l-0.27,2.88l0.81,2.88
	l-0.31,2.52l0.81,0.95c0,0,1.12,4.93,0.88,6.28c-0.24,1.35,0.63,1.44,0.63,1.44l3.93,1.38c0,0,8.13,2.46,13.62,2.73
	c5.49,0.27,6.98,2.88,6.98,2.88s0.52,0.71,1.01,1.91l1.16-0.65l-1.17-1.85l-1.75-1.3l-2.39-1.84l-1.35-0.86l-0.54-0.99l0.58-2.03
	c0,0-0.4-4.45-0.44-5.98c-0.05-1.53,0.98-2.38,0.98-2.38l2.57-3.11l0.99-2.43c0,0,1.44-3.02,1.49-2.88
	c0.04,0.14,2.97-2.84,4.77-4.68c1.79-1.84,1.72-2.01,1.81-4.02C325.46,375.33,325.45,375.15,325.41,374.99z"
    />
    <Path
  id="nirnimgaon"
  fill={getColor(145)}
  onPress={() => openModal(145)}
  d="M344.33,405.14l-5.98-0.49l-7.92,0.8l-0.65,0.54l-1.15,0.95c0,0-5.18,0.99-5.94,2.02
	c-0.77,1.04-2.79,0.95-2.79,0.95l-1.16,0.65c0.65,1.59,1.24,4.05,0.48,6.84c-1.32,4.88,3.31,5.31,3.31,5.31l1.33,0.31
	c0,0,2.94,0.48,3.03,0.48c0.09,0,2.52,0.75,2.52,0.75l1.62,1.32l1.26,1.14l1.71,1.17l4.05,1.38l4.08,0.63l1.26-0.27l-0.09-2.75
	l0.63-3.64l0.9-3.69l1.26-4.5c0,0,0.81-1.8,1.57-6.39c0.08-0.48,0.11-0.9,0.09-1.26C347.62,404.27,344.33,405.14,344.33,405.14z"
/>
<Path
  id="kacharwadi_1_"
  fill={getColor(88)}
  onPress={() => openModal(88)}
  d="M365.76,413.73c0,0-3.74-1.53-3.87-1.57c-0.14-0.04-3.11-0.72-3.29-0.72
	s-4.63-1.26-4.81-1.3c-0.18-0.05-3.56-0.91-3.56-0.91l-2.48-1.84c0.02,0.36-0.01,0.78-0.09,1.26c-0.76,4.59-1.57,6.39-1.57,6.39
	l-1.26,4.5l-0.9,3.69l-0.63,3.64l0.09,2.75c0,0,2.28,0.09,2.43,0.09c0.15,0,4.26-0.54,4.26-0.54l4.8,0.06l4.35,0.42
	c0,0,5.15,1.08,5.15,1.12l0.7-6.55l1.32-2.58l0.93-3.18v-3.2L365.76,413.73z"
/>
<Path
  id="sarati"
  fill={getColor(147)}
  onPress={() => openModal(147)}
  d="M396.44,414.77c0,0-1.8,0-1.93,0s-1.62-1.04-1.62-1.04l-4.41-0.67l-11.2-0.36l-4.78,1.17
	c0,0-0.94,0.94-1.16,0.99c-0.23,0.04-4.01,0.4-4.01,0.4v3.2l-0.93,3.18l-1.32,2.58l-0.7,6.55c0,0.04,5.06,1.55,5.06,1.55
	s12.37,2.77,12.37,2.78c0,0.01,3.06,0.85,3.12,0.88c0.06,0.03,3.77-0.01,7.6,0.3l1.59-9.9l2.78-9.36L396.44,414.77z"
/>
<Path
  id="lumewadi"
  fill={getColor(148)}
  onPress={() => openModal(148)}
  d="M425.33,435.24c0,0-1.43-1.12-4.36-3.96c-1.08-1.04-1.7-2.01-2.06-2.83l-1.99,0.75h-11.76
	l-1.92-1.38l1.02-2.16l-0.75-2.88v-6.54l-1.74,0.45l-4.87,0.33l-2.78,9.36l-1.59,9.9c3.83,0.31,3.29,4.5,3.29,4.5l-0.07,2.25
	c0,0,1.01,3.37,2.02,5.51c1.01,2.14,4.12-0.27,4.12-0.27l2.34-2.87l0.72-2.22c2.46-5.22,10.44-4.32,10.44-4.32s2.83,1.47,7.38,0.93
	C427.32,439.25,425.33,435.24,425.33,435.24z"
/>
<Path
  id="ozare"
  fill={getColor(143)}
  onPress={() => openModal(143)}
  d="M458.5,417.14c-0.6,1.44-1.14,2.82-1.14,2.82l-1.49,1.49l-1.08,0.39c0,0-4.48,0.58-5.43,1.95
	c-0.94,1.37-1.48,1.42-1.48,1.42l-4.35-0.27l-2.37-1.26l-2.97-3.36c-0.41-3.53,1.27-7.67,1.36-7.9c0.01-0.01,0.01-0.01,0.01-0.01
	c0.27-0.11,0.52-0.25,0.73-0.4c1.5-1.11,2.97-1.65,4.35-1.62c1.38,0.03,2.29,0.87,3.71,0.13c1.42-0.74,2.73-1.18,2.73-1.18
	c1.62,1.89,3.04,2.82,3.04,2.82l1.98,1.92l1.74,1.08C457.84,415.16,459.1,415.7,458.5,417.14z"
    />
    <Path
  id="gondi"
  fill={getColor(144)}
  onPress={() => openModal(144)}
  d="M439.55,412.42c-1.71,0.73-4.41,0.82-4.41,0.82s-3.6-0.22-3.46-2.03c0.14-1.8-1.44-2.07-1.44-2.07
	s-3.24,0-3.56,0h-6.48c-0.38,0-1.83,0.08-2.86,0.13c-0.56,0.03-0.99,0.05-1.05,0.05c-0.18,0-6.35,1.4-6.35,1.4l-4.24,2.4l-2.19,3.12
	v6.54l0.75,2.88l-1.02,2.16l1.92,1.38h11.76l1.99-0.75c-0.62-1.42-0.46-2.37-0.46-2.37s-0.03-3.39,2.43-7.38
	c2.46-3.99,10.89-1.97,10.89-1.97l5.04,3.39l1.38,0.2C437.78,416.79,439.46,412.65,439.55,412.42z"
/>
<Path
  id="shetphal_haveli"
  fill={getColor(116)}
  onPress={() => openModal(116)}
  d="M362.42,321.12c0,0,0-0.01-0.01-0.02c-1.9-2.11-13.98-13.74-13.98-13.74l-2.16-1.67
	c0,0-0.05-2.93-4.55-3.78c-4.5-0.86-6.97-0.99-6.97-0.99s-1.59,1.92-3.43,4.44l1.36,2.22l0.75,1.17l0.17,1.95l0.91-0.21l1.63,3.57
	l1.62,1.98c0,0,0.77,7.11,0.99,8.96c0.23,1.84,0.05,3.6,0.05,3.6s-2.13,8.2-2.13,10c0,1.8-1.62,1.74-1.62,1.74s-1.23,0.06-3.6-0.24
	c-2.37-0.3-3.57-2.01-3.57-2.01l-0.78,3.29l-1.93,4.75l-1.08,1.29c0.04,0.01,0.09,0.01,0.13,0.02c0.63,0.1,1.15,0.19,1.21,0.19h0.15
	c0.12,0,5.4-0.04,6.37-0.01c0.03,0.01,0.05,0.01,0.05,0.01c0.01,0,0.02,0,0.05-0.01c0.01,0,0.01,0.01,0.02,0
	c0.53-0.06,3.85-0.94,3.85-0.94H336l9.92-0.26l1.65-0.27l3.02-3.02c0,0,4.59-4.69,4.83-4.85c0.03-0.02,0.13-0.14,0.26-0.32
	c0.85-1.16,3.4-5,3.4-5l1.74-4.74l2.46-4.62l0.57-1.45C363.43,322.02,362.95,321.72,362.42,321.12z"
/>
<Path
  id="surwad"
  fill={getColor(115)}
  onPress={() => openModal(115)}
  d="M397.8,351.05l-3.61-0.27h-1.75l-1.44-0.99l-3.69-2.16l-2.61-4.5l-3.2-6.12l-3.73-5.36l-3.29-3.28
	l-5.17-4.19l-2.75-3.08l-0.99,0.61c0,0-0.67,0.76-1.72,0.44l-0.57,1.45l-2.46,4.62l-1.74,4.74c0,0-2.55,3.84-3.4,5l1.18,1.9
	c0,0,4.8,1.14,4.98,1.14s5.1,0.6,5.1,0.6l3.54,1.26l1.8,2.94l0.91,1.31c0.26,0.16,0.17,0.25,0.17,0.25l3.96,0.96
	c0,0,3.36,2.58,3.48,2.76s3.42,2.94,3.42,2.94l0.98,0.38l1.12,0.43h4.88l2.41,1.44l5.64-1.48l0.15-0.47l1.14-2.55L397.8,351.05z"
/>
<Path
  id="ganeshwadi"
  fill={getColor(138)}
  onPress={() => openModal(138)}
  d="M411.43,397.22c-2.82-0.06-3.36-3.12-3.36-3.12c-2.31-4.65-6.74-6.6-6.74-6.6
	s-0.55-0.18-1.38-0.45l-1.87,3.21l-4.08,5.7l-3.78,3.54l-3.24,4.26c0,0-3.36,3.6,0.84,4.8c4.2,1.2,8.28,1.38,8.28,1.38
	s3.42,1.08,3.6,1.08c0.18,0,9-3.06,9-3.06l7.81-2.38l-0.4-0.59l0.48-4.65l1.2-1.5v-1.87C416.92,397.04,413.83,397.27,411.43,397.22z
	"
    />
    <Path
  id="pimpri_bk"
  fill={getColor(139)}
  onPress={() => openModal(139)}
  d="M450.88,403.78c-3.75-2.94-1.88-8.86-1.88-8.86l1.31-4.06l1.22-3.19l-0.47-0.11
  c0,0-1.26-2.46-1.38-2.76s-2.04-3.3-2.04-3.3l-4.14-2.88l-3.9-1.52h-1.96c0,0-2.33,5.84-3.71,10.76s-7.86,6.96-7.86,6.96l-2.55,0.27
  l-1.77,0.6l-2.37,0.54l-1.35,0.72c0,0-0.09,0.01-0.24,0.02v1.87l-1.2,1.5l-0.48,4.65l0.4,0.59l0.44,0.64l0.39,3.05
  c1.03-0.05,2.48-0.13,2.86-0.13h6.48c0.32,0,3.56,0,3.56,0s1.58,0.27,1.44,2.07c-0.14,1.81,3.46,2.03,3.46,2.03s2.7-0.09,4.41-0.82
  c0.01-0.01,0.01-0.01,0.01-0.01c0.27-0.11,0.52-0.25,0.73-0.4c1.5-1.11,2.97-1.65,4.35-1.62c1.38,0.03,2.29,0.87,3.71,0.13
  c1.42-0.74,2.73-1.18,2.73-1.18c-0.33-0.39-0.67-0.82-1.01-1.29C448.84,406.34,449.9,404.74,450.88,403.78z"
/>
<Path
  id="tannu"
  fill={getColor(140)}
  onPress={() => openModal(140)}
  d="M479.56,369.38l-0.96,2.16c0,0-0.66,2.16-0.66,2.34s-0.12,3.84-0.12,3.84l-0.3,5.13
  c-1.33,0.23-2.97,0.51-3.18,0.51c-0.36,0-5.58,0.63-6.39,0.72c-0.81,0.09-3.51,0.45-3.51,0.45l-4.86,2.16l-2.82,0.03l-0.72,0.96
  l-3.12,0.3l-1.39-0.31l-0.47-0.11c0,0-1.26-2.46-1.38-2.76s-2.04-3.3-2.04-3.3l-4.14-2.88l-3.9-1.52h-1.96l0.97-4.63l1.2-1.56
  l1.44-2.67c0,0,2.25-4.26,8.61-2.88s8.13,2.28,8.13,2.28l5.51,3.35c0,0,3.73,1.79,6.56-0.59c2.84-2.38,4.49-3.84,4.49-3.84
  l4.59,1.68L479.56,369.38z"
/>
<Path
  id="narsingpur"
  fill={getColor(141)}
  onPress={() => openModal(141)}
  d="M498.34,367.88v0.9c0,0-4.87-0.41-5.05-0.45c-0.18-0.05-3.38,0.59-3.38,0.59l-3.15,1.43
  l-1.8,2.39l0.27,2.07l0.72,1.39c0,0,0.54,1.29,0.81,1.4c0.12,0.05,0.38,0.21,0.67,0.39l-1.21,1.23l-3.87,1.44l-3.06,1.88
  c0,0-0.81,0.14-1.77,0.31l0.3-5.13c0,0,0.12-3.66,0.12-3.84s0.66-2.34,0.66-2.34l0.96-2.16l-0.42-1.14l-4.59-1.68
  c0,0,1.01-4.04,1.05-4.26c0.04-0.22,0.5-5.58,0.5-5.58s0.46-2.97,0.46-3.09s1.26-5.13,1.26-5.13s0.07-2.67,2.64-3.71l2.39-1.19
  c0,0,3.3-0.43,4.16,0.27c0.85,0.7,2.49,1.28,2.49,1.28s2.69,1.46,4.07,5.18l1.44,2.97l0.39,4.2l1.08,3.63l0.45,2.31l0.12,2.7
  L498.34,367.88z"
/>
<Path
  id="vakilwasti"
  fill={getColor(130)}
  onPress={() => openModal(130)}
  d="M384.22,354.02c0,0-3.3-2.76-3.42-2.94s-3.48-2.76-3.48-2.76l-3.96-0.96l-0.17-0.25
  c-0.32-0.19-1.18-0.49-3.39-0.83c-4-0.63-3.96,2.38-3.96,2.38l0.95,3.56c0,0,1.26,4.72,2.74,8.37c1.49,3.64,4.28,0.27,4.28,0.27
  l4.41-2.66l6.98-3.8L384.22,354.02z"
/>
<Path
  fill={getColor(131)}
  onPress={() => openModal(131)}
  id="lakhewadi"
  d="M322.73,362.34l-10.22-2.3c-3.99,5.49-7.91,10.66-7.91,10.66l-3.24,9l-0.12,2.94l-0.06,1.68
  l0.75,0.45l4.11-1.02c0,0,5.47-1.97,5.51-2.05c0.05-0.1,7.9-3.02,7.9-3.02l4.47-4.17c0,0,0.62-0.37,1.07-0.17l2.05-7L322.73,362.34z"
/>
<Path
  id="bhodani"
  fill={getColor(129)}
  onPress={() => openModal(129)}
  d="M347.57,346.15l-1.65,0.27l-9.92,0.26c0,0-3.76,1-3.9,0.95c0,0-0.01,0-0.03-0.01
  c-0.01,0.01-0.01,0-0.02,0h-0.1c-0.97-0.03-6.25,0.01-6.37,0.01c-0.06,0-0.65-0.1-1.34-0.21l-0.02,0.02l-1.1,1.33
  c-0.42,0.9-0.88,1.48-1.34,1.84c0.2,1.18,0.4,2.4,0.4,2.47c0,0.13,0.49,4.85,0.49,4.85l0.22,4.41l4.28,5c0,0-0.65-2.34,5.13-4.08
  c5.78-1.74,13.17-4.2,14.43-9.6C347.98,348.26,347.57,346.15,347.57,346.15z M312.51,360.04l10.22,2.3l-0.22-4.41
  c0,0-0.5-4.72-0.5-4.85c0-0.07-0.2-1.29-0.4-2.47c-1.08,0.88-2.07,0.53-2.07,0.53l-2.85-0.15c0,0-15.04-1.72-17.46-1.77
  c-2.41-0.04-2.08,1.17-2.08,1.17l-0.38,1.26l12.01,1.43c0,0,7.97,1.12,3.92,6.7C312.64,359.87,312.57,359.95,312.51,360.04z"
/>
<Path
  id="pandharwadi"
  fill={getColor(111)}
  onPress={() => openModal(111)}
  d="M361.48,297.68c0,0-0.45,10.26,0,16.02c0.42,5.4,0.88,7.2,0.93,7.4
  c-1.9-2.11-13.98-13.74-13.98-13.74l-2.16-1.67c0,0-0.05-2.93-4.55-3.78c-4.5-0.86-6.97-0.99-6.97-0.99l4.32-1.98l7.92-4.59
  l5.94-3.06l9.27-2.88l0.81,3.06l-0.41,2.16L361.48,297.68z"
/>
<Path
  id="bawada"
  fill={getColor(137)}
  onPress={() => openModal(137)}
  d="M417.34,409.27c-0.56,0.03-0.99,0.05-1.05,0.05c-0.18,0-6.35,1.4-6.35,1.4l-4.24,2.4l-2.19,3.12
	l-1.74,0.45l-4.87,0.33l-0.46-2.25c0,0-1.8,0-1.93,0s-1.62-1.04-1.62-1.04l-4.41-0.67l-11.2-0.36l-4.78,1.17
	c0,0-0.94,0.94-1.16,0.99c-0.23,0.04-4.01,0.4-4.01,0.4l-1.57-1.53c0,0-3.74-1.53-3.87-1.57c-0.14-0.04-3.11-0.72-3.29-0.72
	s-4.63-1.26-4.81-1.3c-0.18-0.05-3.56-0.91-3.56-0.91l-2.48-1.84c-0.13-3.12-3.42-2.25-3.42-2.25l-5.98-0.49l-7.92,0.8l3.47-4.81
	c0,0-1.13-1.4-1.18-1.53c-0.04-0.14-1.44-1.76-1.44-1.76l-0.9-1.17l-1.35-3.78l-1.66-5.67l-0.67-4.99c0,0-1.25-6.39-1.25-6.54
	l-0.04-0.21v-0.02c-0.07-0.36-0.23-0.55-0.42-0.63l2.05-7l-4.31-5l-0.22-4.41c0,0-0.5-4.72-0.5-4.85c0-0.07-0.2-1.29-0.4-2.47
	c-0.19-1.16-0.39-2.29-0.39-2.29c0.57-0.36,0.62-0.89,0.56-1.27c0,0,1.27,0.21,2.31,0.37c0.04,0.01,0.09,0.01,0.13,0.02l-1.1,1.33
	c-0.42,0.9-0.88,1.48-1.34,1.84c0.2,1.18,0.4,2.4,0.4,2.47c0,0.13,0.49,4.85,0.49,4.85l0.22,4.41l4.28,5c0,0-0.65-2.34,5.13-4.08
	c5.78-1.74,13.17-4.2,14.43-9.6c1.25-5.4,0.84-7.51,0.84-7.51l3.02-3.02c0,0,4.59-4.69,4.83-4.85c0.03-0.02,0.13-0.14,0.26-0.32
	l1.18,1.9c0,0,4.8,1.14,4.98,1.14s5.1,0.6,5.1,0.6l3.54,1.26l1.8,2.94l0.91,1.31c-0.32-0.19-1.18-0.49-3.39-0.83
	c-4-0.63-3.96,2.38-3.96,2.38l0.95,3.56c0,0,1.26,4.72,2.74,8.37c1.49,3.64,4.28,0.27,4.28,0.27l4.41-2.66l6.98-3.8l1.12,0.43h4.88
	l2.41,1.44l5.64-1.48l-0.39,1.27l-1.5,1.8l-1.56,4.5l-1.38,5.22l-0.72,1.26l-0.66,4.32l-0.54,1.98l-0.78,3v3.36
	c0,0-0.48,3.09,2.19,3.75c1.76,0.44,4.43,1.28,6.04,1.8l-1.87,3.21l-4.08,5.7l-3.78,3.54l-3.24,4.26c0,0-3.36,3.6,0.84,4.8
	c4.2,1.2,8.28,1.38,8.28,1.38s3.42,1.08,3.6,1.08c0.18,0,9-3.06,9-3.06l7.81-2.38l0.44,0.64L417.34,409.27z"
    />
    <Path
  id="pithewadi"
  fill={getColor(136)}
  onPress={() => openModal(136)}
  d="M333.9,400.64l-3.47,4.81l-0.65,0.54l-1.15,0.95c0,0-5.18,0.99-5.94,2.02
  c-0.77,1.04-2.79,0.95-2.79,0.95l-1.17-1.85l-1.75-1.3l-2.39-1.84l-1.35-0.86l-0.54-0.99l0.58-2.03c0,0-0.4-4.45-0.44-5.98
  c-0.05-1.53,0.98-2.38,0.98-2.38l2.57-3.11l0.99-2.43c0,0,1.44-3.02,1.49-2.88c0.04,0.14,2.97-2.84,4.77-4.68
  c1.79-1.84,1.72-2.01,1.81-4.02c0.01-0.23,0-0.41-0.04-0.57l0.04,0.21c0,0.15,1.25,6.54,1.25,6.54l0.67,4.99l1.66,5.67l1.35,3.78
  l0.9,1.17c0,0,1.4,1.62,1.44,1.76C332.77,399.24,333.9,400.64,333.9,400.64z"
/>

<SvgXml xml={svgText} width="100%" height="50%" />


<TouchableWithoutFeedback onPress={() => openModal(1)}>
  <SvgImage
    href={getVillageLogo(1)}
    width="10"
    height="10"
    x="135.2588"
    y="47.3961"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(2)}>
  <SvgImage
    href={getVillageLogo(2)}
    width="10"
    height="10"
    x="174.0677"
    y="38.8448"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(3)}>
  <SvgImage
    href={getVillageLogo(3)}
    width="10"
    height="10"
    x="163.9066"
    y="57.6518"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(4)}>
  <SvgImage
    href={getVillageLogo(4)}
    width="10"
    height="10"
    x="110.2911"
    y="64.7221"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(5)}>
  <SvgImage
    href={getVillageLogo(5)}
    width="10"
    height="10"
    x="111.8234"
    y="84.0572"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(7)}>
  <SvgImage
    href={getVillageLogo(7)}
    width="10"
    height="10"
    x="93.3548"
    y="97.2149"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(6)}>
  <SvgImage
    href={getVillageLogo(6)}
    width="10"
    height="10"
    x="51.5385"
    y="105.3389"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(9)}>
  <SvgImage
    href={getVillageLogo(9)}
    width="10"
    height="10"
    x="159.8428"
    y="95.6013"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(8)}>
  <SvgImage
    href={getVillageLogo(8)}
    width="10"
    height="10"
    x="132.634"
    y="99.3477"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(23)}>
  <SvgImage
    href={getVillageLogo(23)}
    width="10"
    height="10"
    x="114.5023"
    y="116.8476"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(22)}>
  <SvgImage
    href={getVillageLogo(22)}
    width="10"
    height="10"
    x="139.5234"
    y="128.8679"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(24)}>
  <SvgImage
    href={getVillageLogo(24)}
    width="10"
    height="10"
    x="42.6117"
    y="129.4052"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(25)}>
  <SvgImage
    href={getVillageLogo(25)}
    width="10"
    height="10"
    x="82.9322"
    y="138.8498"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(26)}>
  <SvgImage
    href={getVillageLogo(26)}
    width="10"
    height="10"
    x="47.4741"
    y="158.4049"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(28)}>
  <SvgImage
    href={getVillageLogo(28)}
    width="10"
    height="10"
    x="115.7822"
    y="153.862"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(27)}>
  <SvgImage
    href={getVillageLogo(27)}
    width="10"
    height="10"
    x="102.6238"
    y="165.9633"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(50)}>
  <SvgImage
    href={getVillageLogo(50)}
    width="10"
    height="10"
    x="57.2831"
    y="184.683"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(51)}>
  <SvgImage
    href={getVillageLogo(51)}
    width="10"
    height="10"
    x="58.2457"
    y="209.9507"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(10)}>
  <SvgImage
    href={getVillageLogo(10)}
    width="10"
    height="10"
    x="177.9466"
    y="114.8447"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(11)}>
  <SvgImage
    href={getVillageLogo(11)}
    width="10"
    height="10"
    x="194.0242"
    y="121.9051"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(12)}>
  <SvgImage
    href={getVillageLogo(12)}
    width="10"
    height="10"
    x="185.1583"
    y="134.2048"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(29)}>
  <SvgImage
    href={getVillageLogo(29)}
    width="10"
    height="10"
    x="162.2598"
    y="143.9651"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(48)}>
  <SvgImage
    href={getVillageLogo(48)}
    width="10"
    height="10"
    x="167.2804"
    y="172.7197"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(52)}>
  <SvgImage
    href={getVillageLogo(52)}
    width="10"
    height="10"
    x="109.0751"
    y="200.1247"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(49)}>
  <SvgImage
    href={getVillageLogo(49)}
    width="10"
    height="10"
    x="89.8192"
    y="210.9144"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(74)}>
  <SvgImage
    href={getVillageLogo(74)}
    width="10"
    height="10"
    x="71.527"
    y="234.1196"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(75)}>
  <SvgImage
    href={getVillageLogo(75)}
    width="10"
    height="10"
    x="49.678"
    y="246.0541"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(76)}>
  <SvgImage
    href={getVillageLogo(76)}
    width="10"
    height="10"
    x="57.2829"
    y="257.2571"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(80)}>
  <SvgImage
    href={getVillageLogo(80)}
    width="10"
    height="10"
    x="85.1219"
    y="255.0883"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(53)}>
  <SvgImage
    href={getVillageLogo(53)}
    width="10"
    height="10"
    x="139.5311"
    y="206.3499"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(73)}>
  <SvgImage
    href={getVillageLogo(73)}
    width="10"
    height="10"
    x="119.5579"
    y="233.0294"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(77)}>
  <SvgImage
    href={getVillageLogo(77)}
    width="10"
    height="10"
    x="59.6336"
    y="267.0377"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(78)}>
  <SvgImage
    href={getVillageLogo(78)}
    width="10"
    height="10"
    x="58.2454"
    y="283.0612"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(105)}>
  <SvgImage
    href={getVillageLogo(105)}
    width="10"
    height="10"
    x="78.8924"
    y="284.768"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(79)}>
  <SvgImage
    href={getVillageLogo(79)}
    width="10"
    height="10"
    x="82.3219"
    y="270.6447"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(104)}>
  <SvgImage
    href={getVillageLogo(104)}
    width="10"
    height="10"
    x="97.8354"
    y="277.0286"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(82)}>
  <SvgImage
    href={getVillageLogo(82)}
    width="10"
    height="10"
    x="124.9707"
    y="277.0609"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(81)}>
  <SvgImage
    href={getVillageLogo(81)}
    width="10"
    height="10"
    x="105.6724"
    y="261.0372"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(83)}>
  <SvgImage
    href={getVillageLogo(83)}
    width="10"
    height="10"
    x="135.8088"
    y="253.19"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(54)}>
  <SvgImage
    href={getVillageLogo(54)}
    width="10"
    height="10"
    x="161.375"
    y="215.0696"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(84)}>
  <SvgImage
    href={getVillageLogo(84)}
    width="10"
    height="10"
    x="164.3221"
    y="257.8553"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(85)}>
  <SvgImage
    href={getVillageLogo(85)}
    width="10"
    height="10"
    x="182.9442"
    y="267.0844"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(72)}>
  <SvgImage
    href={getVillageLogo(72)}
    width="10"
    height="10"
    x="197.8827"
    y="233.7734"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(47)}>
  <SvgImage
    href={getVillageLogo(47)}
    width="10"
    height="10"
    x="193.2579"
    y="171.8931"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(46)}>
  <SvgImage
    href={getVillageLogo(46)}
    width="10"
    height="10"
    x="213.9921"
    y="179.4301"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(13)}>
  <SvgImage
    href={getVillageLogo(13)}
    width="10"
    height="10"
    x="220.1815"
    y="124.4451"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(14)}>
  <SvgImage
    href={getVillageLogo(14)}
    width="10"
    height="10"
    x="258.3098"
    y="113.9513"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(30)}>
  <SvgImage
    href={getVillageLogo(30)}
    width="10"
    height="10"
    x="211.5162"
    y="154.6253"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(45)}>
  <SvgImage
    href={getVillageLogo(45)}
    width="10"
    height="10"
    x="248.1544"
    y="160.0042"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(31)}>
  <SvgImage
    href={getVillageLogo(31)}
    width="10"
    height="10"
    x="252.1765"
    y="142.5829"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(21)}>
  <SvgImage
    href={getVillageLogo(21)}
    width="10"
    height="10"
    x="267.4029"
    y="130.6649"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(15)}>
  <SvgImage
    href={getVillageLogo(15)}
    width="10"
    height="10"
    x="304.5739"
    y="99.6214"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(20)}>
  <SvgImage
    href={getVillageLogo(20)}
    width="10"
    height="10"
    x="300.5977"
    y="116.8849"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(32)}>
  <SvgImage
    href={getVillageLogo(32)}
    width="10"
    height="10"
    x="279.0556"
    y="151.6"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(16)}>
  <SvgImage
    href={getVillageLogo(16)}
    width="10"
    height="10"
    x="328.7079"
    y="114.5447"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(17)}>
  <SvgImage
    href={getVillageLogo(17)}
    width="10"
    height="10"
    x="342.4282"
    y="117.9697"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(18)}>
  <SvgImage
    href={getVillageLogo(18)}
    width="10"
    height="10"
    x="376.9848"
    y="107.0484"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(19)}>
  <SvgImage
    href={getVillageLogo(19)}
    width="10"
    height="10"
    x="360.6726"
    y="125.8759"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(33)}>
  <SvgImage
    href={getVillageLogo(33)}
    width="10"
    height="10"
    x="317.2411"
    y="146.4145"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(34)}>
  <SvgImage
    href={getVillageLogo(34)}
    width="10"
    height="10"
    x="359.0037"
    y="153.4051"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(55)}>
  <SvgImage
    href={getVillageLogo(55)}
    width="10"
    height="10"
    x="224.4187"
    y="193.8349"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(44)}>
  <SvgImage
    href={getVillageLogo(44)}
    width="10"
    height="10"
    x="253.8721"
    y="192.095"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(43)}>
  <SvgImage
    href={getVillageLogo(43)}
    width="10"
    height="10"
    x="288.9872"
    y="176.2346"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(57)}>
  <SvgImage
    href={getVillageLogo(57)}
    width="10"
    height="10"
    x="278.0261"
    y="204.9549"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(56)}>
  <SvgImage
    href={getVillageLogo(56)}
    width="10"
    height="10"
    x="249.7922"
    y="229.6069"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(106)}>
  <SvgImage
    href={getVillageLogo(106)}
    width="10"
    height="10"
    x="73.5002"
    y="297.0952"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(121)}>
  <SvgImage
    href={getVillageLogo(121)}
    width="10"
    height="10"
    x="81.8432"
    y="311.615"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(122)}>
  <SvgImage
    href={getVillageLogo(122)}
    width="10"
    height="10"
    x="100.8106"
    y="308.4333"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(107)}>
  <SvgImage
    href={getVillageLogo(107)}
    width="10"
    height="10"
    x="94.4622"
    y="293.5707"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(103)}>
  <SvgImage
    href={getVillageLogo(103)}
    width="10"
    height="10"
    x="113.2325"
    y="288.5046"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(102)}>
  <SvgImage
    href={getVillageLogo(102)}
    width="10"
    height="10"
    x="127.5647"
    y="298.0554"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(108)}>
  <SvgImage
    href={getVillageLogo(108)}
    width="10"
    height="10"
    x="122.8158"
    y="308.7006"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(123)}>
  <SvgImage
    href={getVillageLogo(123)}
    width="10"
    height="10"
    x="123.7321"
    y="326.1358"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(120)}>
  <SvgImage
    href={getVillageLogo(120)}
    width="10"
    height="10"
    x="159.2466"
    y="322.9544"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(101)}>
  <SvgImage
    href={getVillageLogo(101)}
    width="10"
    height="10"
    x="167.2802"
    y="295.8868"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(109)}>
  <SvgImage
    href={getVillageLogo(109)}
    width="10"
    height="10"
    x="174.6563"
    y="307.4371"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(124)}>
  <SvgImage
    href={getVillageLogo(124)}
    width="10"
    height="10"
    x="204.0124"
    y="329.0969"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(99)}>
  <SvgImage
    href={getVillageLogo(99)}
    width="10"
    height="10"
    x="197.8827"
    y="279.8248"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(100)}>
  <SvgImage
    href={getVillageLogo(100)}
    width="10"
    height="10"
    x="192.5337"
    y="298.0551"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(86)}>
  <SvgImage
    href={getVillageLogo(86)}
    width="10"
    height="10"
    x="223.8996"
    y="283.1354"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(87)}>
  <SvgImage
    href={getVillageLogo(87)}
    width="10"
    height="10"
    x="240.7836"
    y="290.1244"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(88)}>
  <SvgImage
    href={getVillageLogo(88)}
    width="10"
    height="10"
    x="263.4271"
    y="253.1897"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(89)}>
  <SvgImage
    href={getVillageLogo(89)}
    width="10"
    height="10"
    x="293.1683"
    y="252.6782"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(119)}>
  <SvgImage
    href={getVillageLogo(119)}
    width="10"
    height="10"
    x="231.086"
    y="316.1127"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(110)}>
  <SvgImage
    href={getVillageLogo(110)}
    width="10"
    height="10"
    x="260.6128"
    y="309.92"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(118)}>
  <SvgImage
    href={getVillageLogo(118)}
    width="10"
    height="10"
    x="253.872"
    y="326.1358"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(125)}>
  <SvgImage
    href={getVillageLogo(125)}
    width="10"
    height="10"
    x="238.1639"
    y="339.1157"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(58)}>
  <SvgImage
    href={getVillageLogo(58)}
    width="10"
    height="10"
    x="301.2435"
    y="217.1883"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(59)}>
  <SvgImage
    href={getVillageLogo(59)}
    width="10"
    height="10"
    x="316.4826"
    y="201.0507"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(71)}>
  <SvgImage
    href={getVillageLogo(71)}
    width="10"
    height="10"
    x="309.0643"
    y="222.0951"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(42)}>
  <SvgImage
    href={getVillageLogo(42)}
    width="10"
    height="10"
    x="327.9854"
    y="178.3249"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(41)}>
  <SvgImage
    href={getVillageLogo(41)}
    width="10"
    height="10"
    x="355.131"
    y="169.8199"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(35)}>
  <SvgImage
    href={getVillageLogo(35)}
    width="10"
    height="10"
    x="383.4589"
    y="170.6933"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(36)}>
  <SvgImage
    href={getVillageLogo(36)}
    width="10"
    height="10"
    x="437.3394"
    y="150.4519"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(70)}>
  <SvgImage
    href={getVillageLogo(70)}
    width="10"
    height="10"
    x="337.3166"
    y="262.4546"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(68)}>
  <SvgImage
    href={getVillageLogo(68)}
    width="10"
    height="10"
    x="356.0122"
    y="227.438"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(69)}>
  <SvgImage
    href={getVillageLogo(69)}
    width="10"
    height="10"
    x="336.602"
    y="243.4268"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(40)}>
  <SvgImage
    href={getVillageLogo(40)}
    width="10"
    height="10"
    x="366.12"
    y="192.4907"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(60)}>
  <SvgImage
    href={getVillageLogo(60)}
    width="10"
    height="10"
    x="345.0594"
    y="200.1248"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(61)}>
  <SvgImage
    href={getVillageLogo(61)}
    width="10"
    height="10"
    x="368.7509"
    y="205.0825"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(39)}>
  <SvgImage
    href={getVillageLogo(39)}
    width="10"
    height="10"
    x="413.831"
    y="183.7141"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(37)}>
  <SvgImage
    href={getVillageLogo(37)}
    width="10"
    height="10"
    x="447.2575"
    y="171.8932"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(62)}>
  <SvgImage
    href={getVillageLogo(62)}
    width="10"
    height="10"
    x="409.0021"
    y="202.8378"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(38)}>
  <SvgImage
    href={getVillageLogo(38)}
    width="10"
    height="10"
    x="435.892"
    y="193.8349"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(63)}>
  <SvgImage
    href={getVillageLogo(63)}
    width="10"
    height="10"
    x="439.3832"
    y="207.8249"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(67)}>
  <SvgImage
    href={getVillageLogo(67)}
    width="10"
    height="10"
    x="392.9822"
    y="228.6074"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(64)}>
  <SvgImage
    href={getVillageLogo(64)}
    width="10"
    height="10"
    x="450.3576"
    y="235.2398"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(65)}>
  <SvgImage
    href={getVillageLogo(65)}
    width="10"
    height="10"
    x="482.0934"
    y="237.0247"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(94)}>
  <SvgImage
    href={getVillageLogo(94)}
    width="10"
    height="10"
    x="454.3772"
    y="257.5346"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(93)}>
  <SvgImage
    href={getVillageLogo(93)}
    width="10"
    height="10"
    x="478.9322"
    y="262.4545"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(61)}>
  <SvgImage
    href={getVillageLogo(61)}
    width="10"
    height="10"
    x="402.2222"
    y="262.4545"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(66)}>
  <SvgImage
    href={getVillageLogo(66)}
    width="10"
    height="10"
    x="435.7222"
    y="247.1996"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(91)}>
  <SvgImage
    href={getVillageLogo(91)}
    width="10"
    height="10"
    x="378.837"
    y="261.0369"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(98)}>
  <SvgImage
    href={getVillageLogo(98)}
    width="10"
    height="10"
    x="297.6366"
    y="290.1245"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(90)}>
  <SvgImage
    href={getVillageLogo(90)}
    width="10"
    height="10"
    x="333.6021"
    y="281.5631"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(117)}>
  <SvgImage
    href={getVillageLogo(117)}
    width="10"
    height="10"
    x="297.6573"
    y="319.7729"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(127)}>
  <SvgImage
    href={getVillageLogo(127)}
    width="10"
    height="10"
    x="281.4417"
    y="340.0053"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(128)}>
  <SvgImage
    href={getVillageLogo(128)}
    width="10"
    height="10"
    x="302.703"
    y="340.8881"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(126)}>
  <SvgImage
    href={getVillageLogo(126)}
    width="10"
    height="10"
    x="246.6337"
    y="353.8773"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(132)}>
  <SvgImage
    href={getVillageLogo(132)}
    width="10"
    height="10"
    x="272.9929"
    y="362.5245"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(133)}>
  <SvgImage
    href={getVillageLogo(133)}
    width="10"
    height="10"
    x="242.5262"
    y="386.2925"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(134)}>
  <SvgImage
    href={getVillageLogo(134)}
    width="10"
    height="10"
    x="263.7504"
    y="400.7023"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(135)}>
  <SvgImage
    href={getVillageLogo(135)}
    width="10"
    height="10"
    x="294.002"
    y="391.5213"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(131)}>
  <SvgImage
    href={getVillageLogo(131)}
    width="10"
    height="10"
    x="307.128"
    y="374.0268"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(129)}>
  <SvgImage
    href={getVillageLogo(129)}
    width="10"
    height="10"
    x="318.9533"
    y="355.7841"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(116)}>
  <SvgImage
    href={getVillageLogo(116)}
    width="10"
    height="10"
    x="342.4283"
    y="324.6249"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(111)}>
  <SvgImage
    href={getVillageLogo(111)}
    width="10"
    height="10"
    x="342.4282"
    y="300.0643"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(97)}>
  <SvgImage
    href={getVillageLogo(97)}
    width="10"
    height="10"
    x="363.8522"
    y="300.9076"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(95)}>
  <SvgImage
    href={getVillageLogo(95)}
    width="10"
    height="10"
    x="426.1531"
    y="284.6949"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(96)}>
  <SvgImage
    href={getVillageLogo(96)}
    width="10"
    height="10"
    x="400.5424"
    y="290.1815"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(113)}>
  <SvgImage
    href={getVillageLogo(113)}
    width="10"
    height="10"
    x="409.002"
    y="304.3144"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(112)}>
  <SvgImage
    href={getVillageLogo(112)}
    width="10"
    height="10"
    x="388.3129"
    y="312.913"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(114)}>
  <SvgImage
    href={getVillageLogo(114)}
    width="10"
    height="10"
    x="383.4589"
    y="336.3494"
  />
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={() => openModal(115)}>
  <SvgImage
    href={getVillageLogo(115)}
    width="10"
    height="10"
    x="363.0126"
    y="337.6369"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(137)}>
  <SvgImage
    href={getVillageLogo(137)}
    width="10"
    height="10"
    x="343.3022"
    y="381.1099"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(130)}>
  <SvgImage
    href={getVillageLogo(130)}
    width="10"
    height="10"
    x="370.4708"
    y="356.7498"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(136)}>
  <SvgImage
    href={getVillageLogo(136)}
    width="10"
    height="10"
    x="318.7418"
    y="399.4642"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(145)}>
  <SvgImage
    href={getVillageLogo(145)}
    width="10"
    height="10"
    x="321.2224"
    y="416.2447"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(146)}>
  <SvgImage
    href={getVillageLogo(146)}
    width="10"
    height="10"
    x="348.3219"
    y="421.5032"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(147)}>
  <SvgImage
    href={getVillageLogo(147)}
    width="10"
    height="10"
    x="376.9583"
    y="423.4518"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(138)}>
  <SvgImage
    href={getVillageLogo(138)}
    width="10"
    height="10"
    x="392.5321"
    y="403.5414"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(148)}>
  <SvgImage
    href={getVillageLogo(148)}
    width="10"
    height="10"
    x="398.3337"
    y="436.2852"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(144)}>
  <SvgImage
    href={getVillageLogo(144)}
    width="10"
    height="10"
    x="407.3897"
    y="420.122"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(139)}>
  <SvgImage
    href={getVillageLogo(139)}
    width="10"
    height="10"
    x="425.015"
    y="399.04"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(140)}>
  <SvgImage
    href={getVillageLogo(140)}
    width="10"
    height="10"
    x="449.0856"
    y="377.1052"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(142)}>
  <SvgImage
    href={getVillageLogo(142)}
    width="10"
    height="10"
    x="458.6027"
    y="392.1092"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(141)}>
  <SvgImage
    href={getVillageLogo(141)}
    width="10"
    height="10"
    x="478.1612"
    y="359.5438"
  />
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={() => openModal(143)}>
  <SvgImage
    href={getVillageLogo(143)}
    width="10"
    height="10"
    x="442.0154"
    y="417.9872"
  />
</TouchableWithoutFeedback>

          <SvgText x="163.7621" y="37.7094" fontSize="3.4467px">Bhigwan</SvgText>
          <SvgText x="163.7621" y="41.8494" fontSize="3.4467px">Stn</SvgText>
          <SvgImage
            href={getVillageLogo(2)}
            x="174.0677"
            y="38.8448"
            width="10"
            height="10"
          />
        </Svg>
      </View>
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          {villageData && (
            <>
              <RNText style={styles.modalTitle}>Village Details</RNText>
              <RNText><strong>Village Name:</strong> {villageData.villagename}</RNText>
              <RNText><strong>Total Voters:</strong> {villageData.totalvoters}</RNText>
              <RNText><strong>Male:</strong> {villageData.malevoters}</RNText>
              <RNText><strong>Female:</strong> {villageData.femalevoters}</RNText>
              <RNText><strong>Others:</strong> {villageData.othervoters}</RNText>
              <RNText><strong>Voting Percentage:</strong> {villageData.votingpercentage} %</RNText>
              <RNText><strong>Ruling party:</strong> {villageData.rulingparty}</RNText>
              <RNText><strong>Reason:</strong> {villageData.reason}</RNText>
              <RNText><strong>Hindu:</strong> {villageData.hindu}</RNText>
              <RNText><strong>Muslim:</strong> {villageData.muslim}</RNText>
              <RNText><strong>Buddhist:</strong> {villageData.buddhist}</RNText>
              <Button title="Read More" onPress={navigateToVillageDetails} />
            </>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  svgContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#e3e3e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  svg: {
    position: 'absolute',
  },
});

export default IndapurMap;