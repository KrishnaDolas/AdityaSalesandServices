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
import Svg, { Image as SvgImage, Path, Text as SvgText, SvgXml } from "react-native-svg";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "./types"; // Adjust this import according to your project structure

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

type NavigationProp = StackNavigationProp<RootStackParamList, 'VillageDetails'>;

const DaundMap = () => {
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
      const response = await fetch(`http://baramatiapi.beatsacademy.in/alldata/`);
      const data = await response.json();
      setSvgInfo(data.all_data);
      await AsyncStorage.setItem('svgInfo', JSON.stringify(data.all_data));
    } catch (error) {
      console.error("Error fetching SVG info:", error);
    }
  };

  const fetchVillageData = async (villageId: number) => {
    try {
      const response = await fetch(`http://baramatiapi.beatsacademy.in/daundvillagedetails/${villageId}/`);
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error(`Error fetching village data: ${response.status} ${response.statusText}`);
        console.error('Response Text:', responseText);
        return;
      }
      const data = await response.json();
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
    }
  };

  const svgText= `
  <svg>
  <text transform="matrix(0.9247 0 0 1 131.5003 61.0106)" font-size="5" fill="black">
      Panvali
    </text>
<text transform="matrix(0.9247 0 0 1 105.697 69.7092)" font-size="5" fill="black">
      Takali
    </text>
<text transform="matrix(0.9247 0 0 1 117.711 79.5403)" font-size="5" fill="black">
      <tspan x="0" y="0">Wadgaon</tspan>
      <tspan x="0" y="6.29">Bande</tspan>
    </text>
<text transform="matrix(0.9247 0 0 1 82.9111 101.2836)" font-size="5" fill="black">
      Patethan
    </text>
<text transform="matrix(0.9247 0 0 1 105.6917 117.6638)" font-size="5" fill="black">
      Pilanwadi
    </text>
<text transform="matrix(0.9247 0 0 1 129.1205 106.8316)" font-size="5" fill="black">
      Telewadi
    </text>
<text transform="matrix(0.9247 0 0 1 68.1384 131.6994)" font-size="5" fill="black">
      Devkarwadi
    </text>
<text transform="matrix(0.9247 0 0 1 156.398 94.284)" font-size="5" fill="black">
      <tspan x="0" y="0">Koregaon</tspan>
      <tspan x="0" y="6.29">Bivar</tspan>
    </text>
<text transform="matrix(0.9247 0 0 1 130.6841 141.5595)" font-size="5" fill="black">
      Rahu
    </text>
<text transform="matrix(0.9247 0 0 1 56.8258 146.7904)" font-size="5" fill="black">
      Memanwadi
    </text>
<text transform="matrix(0.9247 0 0 1 81.9912 153.2019)" font-size="5" fill="black">
      Dahitane
    </text>
<text transform="matrix(0.9247 0 0 1 61.7837 165.1057)" font-size="5" fill="black">
      Mirwadi
    </text>
<text transform="matrix(0.9247 0 0 1 175.0222 132.46)" font-size="5" fill="black">
      Walki
    </text>
<text transform="matrix(0.9247 0 0 1 158.5254 154.748)" font-size="5" fill="black">
      Pimpalgaon
    </text>
<text transform="matrix(0.9247 0 0 1 94.3235 176.7381)" font-size="5" fill="black">
      Khamgaon
    </text>
<text transform="matrix(0.9247 0 0 1 72.1062 183.6928)" font-size="5" fill="black">
      Nandur
    </text>
<text transform="matrix(0.9247 0 0 1 68.1381 191.127)" font-size="5" fill="black">
      Borate Wasti
    </text>
<text transform="matrix(0.9247 0 0 1 68.1383 201.2464)" font-size="5" fill="black">
      Sahajpur
    </text>
<text transform="matrix(0.9247 0 0 1 42.9763 215.1492)" font-size="5" fill="black">
      Boribhadak
    </text>
<text transform="matrix(0.9247 0 0 1 64.1656 231.8018)" font-size="5" fill="black">
      Boriaindi
    </text>
<text transform="matrix(0.9247 0 0 1 38.9542 245.5593)" font-size="5" fill="black">
      Dalimb
    </text>
<text transform="matrix(0.9247 0 0 1 68.1381 260.5305)" font-size="5" fill="black">
      Tamhanwadi
    </text>
<text transform="matrix(0.9247 0 0 1 128.0979 182.1737)" font-size="5" fill="black">
      Nathachiwadi
    </text>
<text transform="matrix(0.262 -1.0236 0.9688 0.248 121.7539 191.9741)" font-size="5" fill="black">
      Tambewadi
    </text>
<text transform="matrix(0.364 -0.9314 0.9314 0.364 94.3162 226.5084)" font-size="5" fill="black">
      Javajibuwachiwadi
    </text>
<text transform="matrix(0.9247 0 0 1 106.9256 219.2053)" font-size="5" fill="black">
      Kasurdi
    </text>
<text transform="matrix(0.2368 -0.9716 0.9716 0.2368 153.8789 183.7097)" font-size="5" fill="black">
      Ladkatwadi
    </text>
<text transform="matrix(0.9247 0 0 1 138.7249 205.879)" font-size="5" fill="black">
      Yawat St
    </text>
<text transform="matrix(0.9247 0 0 1 136.4554 233.2136)" font-size="5" fill="black">
      Yawat
    </text>
<text transform="matrix(0.9247 0 0 1 161.3011 187.538)" font-size="5" fill="black">
      Undvadi
    </text>
<text transform="matrix(0.9247 0 0 1 180.1792 170.8538)" font-size="5" fill="black">
      Ekeriwadi
    </text>
<text transform="matrix(0.9247 0 0 1 184.5229 154.7477)" font-size="5" fill="black">
      Delvadi
    </text>
<text transform="matrix(0.9247 0 0 1 108.9575 207.8109)" font-size="5" fill="black">
      <tspan x="0" y="0">Khamgaon</tspan>
      <tspan x="0" y="3.62">Phata</tspan>
    </text>
<text transform="matrix(0.9247 0 0 1 165.3556 246.8633)" font-size="5" fill="black">
      Bhandgaon
    </text>
<text transform="matrix(0.9247 0 0 1 174.9753 205.667)" font-size="5" fill="black">
      Khutbav
    </text>
<text transform="matrix(0.9247 0 0 1 230.3414 162.5674)" font-size="5" fill="black">
      Pargaon
    </text>
<text transform="matrix(0.571 -0.8209 0.8209 0.571 198.8767 183.7023)" font-size="5" fill="black">
      Galandwadi
    </text>
<text transform="matrix(0.9247 0 0 1 263.415 150.7363)" font-size="5" fill="black">
      Nangaon
    </text>
<text transform="matrix(0.9247 0 0 1 265.1655 165.1057)" font-size="5" fill="black">
      Ganesh Road
    </text>
<text transform="matrix(0.9247 0 0 1 265.2935 177.629)" font-size="5" fill="black">
      Amonimal
    </text>
<text transform="matrix(0.9247 0 0 1 239.204 186.282)" font-size="5" fill="black">
      Khopodi
    </text>
<text transform="matrix(0.9247 0 0 1 252.1463 199.4685)" font-size="5" fill="black">
      Dapodi
    </text>
<text transform="matrix(0.9247 0 0 1 203.6454 194.1854)" font-size="5" fill="black">
 Handalwadi
    </text>
<text transform="matrix(0.9247 0 0 1 219.0725 197.9926)" font-size="5" fill="black">
      <tspan x="0" y="0">Deshmukh</tspan>
      <tspan x="0" y="5.39">Mala</tspan>
    </text>
<text transform="matrix(0.9247 0 0 1 198.934 204.9462)" font-size="5" fill="black">
      Kedgaon St
    </text>
<text transform="matrix(0.9247 0 0 1 211.4411 217.1586)" font-size="5" fill="black">
      Kedgaon
    </text>
<text transform="matrix(0.9247 0 0 1 197.3186 222.5888)" font-size="5" fill="black">
      Patil Nimbalkarwasti
    </text>
<text transform="matrix(0.9247 0 0 1 198.9341 233.7071)" font-size="5" fill="black">
      <tspan x="0" y="0">Dhumalicha</tspan>
      <tspan x="0" y="4.17">Mala</tspan>
    </text>
<text transform="matrix(0.9247 0 0 1 205.6997 251.6783)" font-size="5" fill="black">
      Wakhari
    </text>
<text transform="matrix(0.9247 0 0 1 188.5241 283.3179)" font-size="5" fill="black">
      Khor
    </text>
<text transform="matrix(0.9247 0 0 1 188.183 309.2227)" font-size="5" fill="black">
      Pimpalachiwadi
    </text>
<text transform="matrix(0.9247 0 0 1 235.3772 233.4701)" font-size="5" fill="black">
      Boripardhi
    </text>
<text transform="matrix(0.9247 0 0 1 263.4152 237.8727)" font-size="5" fill="black">
      Warvand
    </text>
<text transform="matrix(0.9247 0 0 1 281.6892 211.1562)" font-size="5" fill="black">
      Kadethan
    </text>
<text transform="matrix(0.9247 0 0 1 291.3545 188.2189)" font-size="5" fill="black">
      Hatwalan
    </text>
<text transform="matrix(0.9247 0 0 1 319.3497 198.0421)" font-size="5" fill="black">
      kangaon
    </text>
<text transform="matrix(0.9247 0 0 1 222.9402 270.173)" font-size="5" fill="black">
      Deulgaongada
    </text>
<text transform="matrix(0.9247 0 0 1 253.2685 308.363)" font-size="5" fill="black">
      Padvi
    </text>
<text transform="matrix(0.9247 0 0 1 309.753 267.6036)" font-size="5" fill="black">
      Patas
    </text>
<text transform="matrix(0.9247 0 0 1 282.4236 307.2885)" font-size="5" fill="black">
      kusegaon
    </text>
<text transform="matrix(0.9247 0 0 1 326.8112 303.4053)" font-size="5" fill="black">
      Roti
    </text>
<text transform="matrix(0.9247 0 0 1 308.0714 233.4705)" font-size="5" fill="black">
      Birobawadi
    </text>
<text transform="matrix(0.9247 0 0 1 304.2797 330.6441)" font-size="5" fill="black">
      Hinganigada
    </text>
<text transform="matrix(0.9247 0 0 1 345.3085 209.1599)" font-size="5" fill="black">
      Gar
    </text>
<text transform="matrix(0.9247 0 0 1 341.58 221.0481)" font-size="5" fill="black">
      New Gar
    </text>
<text transform="matrix(0.9247 0 0 1 352.4473 230.8226)" font-size="5" fill="black">
      Betwadi
    </text>
<text transform="matrix(0.9247 0 0 1 370.1567 204.9458)" font-size="5" fill="black">
      Nanvvij
      </text>
<text transform="matrix(0.9247 0 0 1 387.8529 223.3565)" font-size="5" fill="black">
      Sonwadi
    </text>
<text transform="matrix(0.9247 0 0 1 368.4782 252.6508)" font-size="5" fill="black">
      Girim
    </text>
<text transform="matrix(0.9247 0 0 1 348.9543 303.4057)" font-size="5" fill="black">
      Kurkumbh
    </text>
<text transform="matrix(0.9247 0 0 1 383.2834 300.334)" font-size="5" fill="black">
      Pandharewadi
    </text>
<text transform="matrix(0.9247 0 0 1 336.1925 346.0918)" font-size="5" fill="black">
      Vasunde
    </text>
<text transform="matrix(0.9247 0 0 1 362.3657 330.6435)" font-size="5" fill="black">
      Jiregaon
    </text>
<text transform="matrix(0.9247 0 0 1 388.2408 337.0039)" font-size="5" fill="black">
      kauthadi
    </text>
<text transform="matrix(0.9247 0 0 1 419.8144 313.8288)" font-size="5" fill="black">
      Malad
    </text>
<text transform="matrix(0.9247 0 0 1 409.2008 283.8468)" font-size="5" fill="black">
      Mergalwadi
    </text>
<text transform="matrix(0.9247 0 0 1 390.77 268.0697)" font-size="5" fill="black">
      Gopalwadi
    </text>
<text transform="matrix(0.9247 0 0 1 416.8403 263.9441)" font-size="5" fill="black">
      Malwadi
    </text>
<text transform="matrix(0.9247 0 0 1 423.6357 252.6508)" font-size="5" fill="black">
      Mhasnarwadi
    </text>
<text transform="matrix(0.9247 0 0 1 404.7681 241.8791)" font-size="5" fill="black">
      Daund Main
    </text>
<text transform="matrix(0.9247 0 0 1 426.898 243.6493)" font-size="5" fill="black">
      Daund
    </text>
<text transform="matrix(0.9247 0 0 1 436.4875 230.4127)" font-size="5" fill="black">
      Lingali
    </text>
<text transform="matrix(0.9247 0 0 1 445.4806 257.5795)" font-size="5" fill="black">
      Khorodi
    </text>
<text transform="matrix(0.9247 0 0 1 471.7357 246.8638)" font-size="5" fill="black">
      Alegoan
    </text>
<text transform="matrix(0.9247 0 0 1 471.83 254.8862)" font-size="5" fill="black">
      <tspan x="0" y="0">Kadam</tspan>
      <tspan x="0" y="4.55">Wasti</tspan>
    </text>
<text transform="matrix(0.9247 0 0 1 458.6732 286.5148)" font-size="5" fill="black">
      Boribel
    </text>
<text transform="matrix(0.9247 0 0 1 485.0871 285.6749)" font-size="5" fill="black">
      <tspan x="0" y="0">Shin</tspan>
      <tspan x="0" y="6.37">Gadewadi</tspan>
    </text>
<text transform="matrix(0.9247 0 0 1 453.4372 320.2018)" font-size="5" fill="black">
      Ravangaon
    </text>
<text transform="matrix(0.9247 0 0 1 460.5636 355.0111)" font-size="5" fill="black">
      Nandedevi
    </text>
<text transform="matrix(0.9247 0 0 1 494.4666 344.3886)" font-size="5" fill="black">
      Khadki
    </text>
<text transform="matrix(0.9247 0 0 1 505.5082 275.7529)" font-size="5" fill="black">
      Kalewadi
    </text>
<text transform="matrix(0.9247 0 0 1 486.1181 250.6869)" font-size="5" fill="black">
      Deulgaonraje
    </text>
<text transform="matrix(0.9247 0 0 1 497.568 215.1493)" font-size="5" fill="black">
      <tspan x="0" y="0">Wadgaon</tspan>
      <tspan x="0" y="5.5">Darekar</tspan>
    </text>
<text transform="matrix(0.9247 0 0 1 514.3811 201.7753)" font-size="5" fill="black">
      Pedgaon
    </text>
<text transform="matrix(0.9247 0 0 1 524.9502 224.9901)" font-size="5" fill="black">
      Shirapur
    </text>
<text transform="matrix(0.9247 0 0 1 510.0255 260.5301)" font-size="5" fill="black">
      Hinganiberdi
    </text>
<text transform="matrix(0.9247 0 0 1 524.3581 292.0457)" font-size="5" fill="black">
      Malthan
    </text>
<text transform="matrix(0.9247 0 0 1 515.4592 317.6329)" font-size="5" fill="black">
      Lonarwadi
    </text>
<text transform="matrix(0.9247 0 0 1 541.0926 352.2433)" font-size="5" fill="black">
  Chincholi
</text>
<text transform="matrix(0.9247 0 0 1 587.9011 331.6171)" font-size="5" fill="black">
  Rajegoan
</text>
<text transform="matrix(0.9247 0 0 1 579.6851 295.7488)" font-size="5" fill="black">
  Vatluj
</text>
<text transform="matrix(0.9247 0 0 1 595.9396 301.7375)" font-size="5" fill="black">
  Naygaon
</text>
<text transform="matrix(0.9247 0 0 1 621.3948 365.4094)" font-size="5" fill="black">
  Khanota
</text>
<text transform="matrix(0.9247 0 0 1 572.6355 339.7582)" font-size="5" fill="black">
  Rajegoan 2
</text>
<text transform="matrix(0.9247 0 0 1 94.3233 248.9949)" font-size="5" fill="black">
  Bharatgoan
</text>
  </svg>
  `

  return (
    <View style={styles.container}>
      <RNText style={styles.header}>Daund Map</RNText>
      <Svg
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height / 2}
        viewBox="0 0 666.24 418.32"
      >
        <SvgImage
          width="100%"
          height="60%"
          
        />
        <Path
          id="panvali"
          fill={getColor(75)}
          d="M124.48,52.94c0,0,6.61-2.38,6.79-2.43c0.18-0.04,4.27-1.49,4.41-1.49c0.13,0,5.04-0.36,5.4-0.45
            s3.65-1.17,4.1-1.26s2.34-1.4,2.74-1.44c0.4-0.05,3.6-0.72,3.6-0.72s2.02,1.58,2.21,1.62c0.18,0.05,1.75,3.33,1.8,3.47
            c0.04,0.14,0.99,2.7,0.99,2.7l-0.36,4.41c0,0-5.58,8.73-5.62,8.86c-0.04,0.14-3.96,5.13-3.96,5.13l-3.06,1.93
            c0,0-16.47-4.95-19.85-10.58L124.48,52.94z"
          onPress={() => openModal(75)}
        />

<Path
          id="wadgaon_bande"
          fill={getColor(96)}
          d="M150.94,89.12l-0.9,9.72l-6.66-1.98l-5.85-1.26l-3.15-0.72h-2.7h-11.07l-4.05-1.85
	l-0.18-2.56c0,0-1.53-5.08-2.11-8.96s1.39-5.4,1.39-5.4l4.64-5.26l3.38-8.1c6.75,8.01,20.16,10.08,20.16,10.08
	C135.55,87.77,150.94,89.12,150.94,89.12z"
          onPress={() => openModal(96)}
        />

<Path
          id="takali_1_"
          fill={getColor(91)}
          d="M124.17,53.12l-0.85,10.44l-3.33,7.92l-2.97,3.51c0,0-3.91,2.52-1.93,10.35s1.62,7.92,1.62,7.92
	c-0.84,0.58-2.08,1.31-3.72,1.83c-1.48,0.47-2.79,0.61-3.75,0.65c-0.75-1.92-1.5-3.84-2.25-5.76c0,0-4.5-5.35-4.63-5.53
	c-0.14-0.18-1.76-3.83-1.76-3.83l2.71-1.76c0,0,2.16-0.6,1.44-3.9c-0.72-3.3-1.08-5.1-1.08-5.1s-1.62-3.54,3.18-5.52l3.66-0.72
	c0,0,7.68-1.8,8.7-6.42S124.17,53.12,124.17,53.12z"
          onPress={() => openModal(91)}
        />

<Path
          id="patethan_1_"
          fill={getColor(78)}
          d="M100.6,81.44l1.44,2.94l4.62,5.58l2.88,6.24l-1.92,6l-1.62,4.92c0,0-3.18,3.42-3.54,3.6
	s-2.52,1.14-2.52,1.14l-0.84,1.8l-2.64,1.32l-9.24-2.76l-3.18-1.44l-9.42-0.42l2.1-2.1l0.18-1.8l0.9-8.82c0,0,0.24-2.4,2.88-2.46
	s6.84-0.84,6.84-0.84s5.82,0.18,6.54-6.66C94.78,80.84,100.6,81.44,100.6,81.44z"
          onPress={() => openModal(78)}
        />

<Path
          id="devkarwadi_1_"
          fill={getColor(20)}
          d="M84.88,111.44l8.28,3.42l2.88,0.06l1.8,1.5l0.66,2.16l-0.54,0.72l0.3,4.56l0.78,3.42
	l0.42,7.44c0,0,1.08,8.7,1.08,8.88c0,0.18,0.66,1.74,0.66,1.74s-3.12,2.22-3.3,2.22s-6-2.16-6-2.16s-4.68-1.98-7.92-3.36
	c-3.24-1.38-4.62,0.54-4.62,0.54h-4.38l-3.78-1.5l-4.32-5.52l-1.86-3.18l-0.48-11.1c0,0,5.28-4.14,5.52-4.32
	c0.24-0.18,4.92-6.6,4.92-6.6L84.88,111.44z"
          onPress={() => openModal(20)}
        />

<Path
          id="pilanwadi"
          fill={getColor(80)}
          d="M121.06,94.67l5.46,0.63c1.11,1.2,0.36,8.34,0.27,8.43c-0.09,0.09-0.15,1.37,0.43,6.14
	c0.58,4.77,3.92,5.13,3.92,5.13l-1.12,3.24l-1.89,4.86l-2.32,2.99c0,0-3.84,4.32-3.9,4.5c-0.06,0.18-2.76,4.56-2.52,4.56
	c0.24,0-2.52,2.4-2.52,2.4s-6.42,3.54-6.6,3.48c-0.18-0.06-6.36,3.66-6.36,3.66l-2.1,1.02l-0.78-0.48l-1.8-15.06l-1.08-6.06v-4.5
	l-0.25-2.76l-1.73-1.89c2.88,0.72,3.8-2.72,3.8-2.72l2.11-1.42c3.96-2.25,7.29-12.96,7.29-12.96s-1.8-2.88,0.63-2.16
	c2.43,0.72,7.2-2.25,7.2-2.25L121.06,94.67z"
          onPress={() => openModal(80)}
        />

<Path
          id="rahu"
          fill={getColor(80)}
          d="M162.4,101.09l-0.48,8.55l2.46,15.66c0,0-0.78-0.42-4.92-0.66s-5.73,2.1-5.73,2.1
	s-1.21,0.14-4.05,6.55c-2.84,6.41,1.21,9.52,1.21,9.52l5.09,2.61l0.36,7.7l-10.93,9.32c0,0-2.25-0.76-5.58,0.9
	c-3.33,1.67-8.96-0.27-8.96-0.27l-0.18,2.43l-5.98-4.01l-3.96-1.21l-2.93-1.98l-6.35-1.12l-5.89-0.68l-0.27-1.89l-2.46-4.15
	l-0.42-2.22l-0.72-2.58l2.88-1.62l4.59-2.52l6.57-3.42l3.69-2.88l2.43-4.41l0.9-1.17l3.15-3.42l3.78-6.12l1.62-4.95h9
	c0,0,7.29,0,7.56,0s2.88-1.17,5.58-4.14s1.53-5.58,1.53-5.58l-1.53-4.32H162.4z"
          onPress={() => openModal(80)}
        />

<Path
          id="telewadi"
          fill={getColor(94)}
          d="M135.28,94.7l4.5,1.26l7.5,2.46l4.92,1.38l2.94,8.16l-2.04,2.64c0,0-1.26,2.7-1.26,2.88
	s-2.88,1.56-2.88,1.56l-4.5-0.06l-3.12,0.48c0,0-3.36-0.54-9-0.54c-5.64,0-5.22-5.94-5.22-5.94l-0.48-4.32l0.48-6.84l-0.96-2.7
	L135.28,94.7z"
          onPress={() => openModal(94)}
        />

<Path
          id="memanwadi_1_"
          fill={getColor(106)}
          d="M64.54,121.16l0.36,9.72l1.14,3.48l2.46,3.78l3.12,3.24l2.82,0.9h6.12l-3.6,3.36l-4.86,3.3
	l-2.16,1.92l-5.7,3.9c0,0-2.52,0.84-2.7,0.84s-5.46,0.3-5.46,0.3l-0.6-7.68c0,0-0.66-9-0.66-9.18c0-0.18-1.02-2.88-1.02-2.88v-5.22
	l0.66-2.94C54.46,128,55.24,124.34,64.54,121.16z"
          onPress={() => openModal(106)}
        />

<Path
          id="mirwadi"
          fill={getColor(63)}
          d="M56.14,155.96h4.98l3.24-1.08c0,0,3.24-2.64,3.42-2.58s2.94-2.04,2.94-2.04h1.98l1.92,1.62
	l2.52,1.8l2.58,2.28l3.36,2.82c0,0,2.28,1.14,4.14,4.44s2.28,4.8,2.28,4.8l-1.98,1.95l-0.96,2.34l-2.85,2.49l-3.18,1.32l-5.79,0.15
	l-3.75-0.3c0,0-1.59-0.96-1.74-0.96s-2.34-0.12-2.34-0.12s-0.43-1.62-3.09-2.57c-2.65-0.94-5.22-2.97-6.57-4.86
	S56.14,155.96,56.14,155.96z"
          onPress={() => openModal(63)}
        />

<Path
          id="dahitane"
          fill={getColor(11)}
          d="M89.29,167.74c0-0.13-0.94-2.97-0.94-2.97l-1.67-2.79l-2.65-2.97l-3.33-1.98l-1.8-1.85l-2.61-2.2
	l-2.43-1.67l-1.85-1.3l-0.99,0.18l2.52-2.7l3.6-1.8l3.42-3.96l2.83,0.18c0,0,2.48,0.36,4.19,1.49s9.13,4.01,9.13,4.01
	s1.58,0.85,2.88-0.68s1.75-1.62,1.75-1.62s1.53,0.09,1.17,1.26s0.36,5.58,2.03,7.43s1.12,3.19,1.12,3.19l-2.31,0.66l-4.32,2.76
	l-4.02,3.84l-1.62,1.38L89.29,167.74z"
          onPress={() => openModal(11)}
        />

<Path
          id="nandur"
          fill={getColor(65)}
          d="M86.82,172.35c0,0,3.19,3.11,4.99,5.6c1.8,2.5,1.33,4.37,1.33,4.37l-0.43,3.1l-14.94,0.24
	l-5.97,0.48l-6.3-0.15l1.08-5.13l0.33-6.06C83.98,179.06,86.82,172.35,86.82,172.35z"
          onPress={() => openModal(65)}
        />

<Path
          id="borate_wasti"
          fill={getColor(5)}
          d="M90.79,193.76L88,192.71l-10.56-0.12l-3.54,0.81l-1.74,0.99l-1.95,0.66l-4.05,0.87
	l-1.65,3.15l0.15-3.42l-0.15-6.03l0.63-2.04l0.72-1.65c0,0,5.58,0.27,5.88,0.27c0.3,0,5.82-0.54,5.82-0.54h15.06
	C89.68,188.27,90.79,193.76,90.79,193.76z"
          onPress={() => openModal(5)}
        />

<Path
          id="sahajpur_1_"
          fill={getColor(88)}
          d="M64.54,199.1l1.31-1.98c0,0-0.76-1.08,1.85-1.57s4.72-1.35,4.72-1.35l5.04-1.66l10.39,0.23
	l3.15,1.08l0.68,7.61c0,0-0.86,0.22-0.18,2.93c0.67,2.7-0.54,6.93-0.54,6.93l-5.67-0.18l-3.73-0.32l-3.02-1.64
	c0,0-0.67-0.38-4.54,0.34c-3.87,0.72-7.88,1.35-8.1,1.35s-2.47-0.04-2.47-0.04s-1.31-2.34-0.45-4.05
	C63.82,205.04,64.54,199.1,64.54,199.1z"
          onPress={() => openModal(88)}
        />

<Path
          id="boribhadak"
          fill={getColor(8)}
          d="M63.6,210.8c0,0-1.03,2.83-0.77,6.07c0.27,3.24-0.93,5.57-0.93,5.57l-2.04,6.12l-1.68,5.76
	l-1.26,1.44c0,0-0.18,3.06-0.18,3.24c0,0.18-0.54,0.3-0.72,0.36s-7.32-1.2-8.04-4.86s-4.8-7.14-4.8-7.14s1.98-5.34,1.02-6
	s-1.8-4.62-1.8-4.62s0.06-4.14-0.48-4.44c-0.54-0.3-0.96-3.14-0.96-3.14s-0.72-1.42,3.24-5.68c3.96-4.26,8.4-0.84,8.58-0.84
	s-0.42,0.96,2.52,1.8c2.94,0.84,4.68,2.94,4.68,2.94s2.22,0,2.64,0L63.6,210.8z"
          onPress={() => openModal(8)}
        />

<Path
          id="dalimb"
          fill={getColor(12)}
          d="M60.04,262.82c-1.44-0.36-14.13,4.14-16.92,7.11s-6.3,2.25-6.3,2.25l-0.09-3.33l-1.08-3.51
	l-0.54-9.45l-0.79-3.96l0.21-5.52c0,0,0.01-4.11-0.2-10.65c-0.21-6.54,2.62-8.18,2.62-8.18s4.73-0.45,6.39,0.18
	c1.66,0.63,3.1,3.69,3.1,3.69c1.22,5.35,5.85,6.71,5.85,6.71s3.58,0.89,3.65,1.08C56.89,242.03,61.48,263.18,60.04,262.82z"
          onPress={() => openModal(12)}
        />

<Path
          id="tamhanwadi"
          fill={getColor(93)}
          d="M60.13,262.73c-0.13,0.02-0.63-4.32-0.63-4.32s-0.22-1.89,1.67-0.81
	c1.89,1.08,3.42,2.52,4.59,0c1.17-2.52,5.31-3.24,5.31-3.24l2.52-3.15l1.57,0.41c0,0,4.77-5.04,6.62-1.22
	c1.85,3.83,2.21,4.82,5.99,5.22l-0.68,6.03c0,0-0.36-0.99-0.58-0.99s-5.67,0.54-5.67,0.54s-3.96,3.55-4.1,3.6
	c-0.14,0.05-0.54,1.89-3.87,0.5c-3.33-1.4-7.51-2.07-7.51-2.07S63.96,262.24,60.13,262.73z"
          onPress={() => openModal(93)}
        />

<Path
          id="boriaindi"
          fill={getColor(6)}
          d="M58.84,251.36l-1.8-6l-0.56-4.68l0.22-1.49l0.27-2.79l1.62-4.18l1.71-6.3l2.34-6.12l0.83-8.89
	c0,0,4.16-0.25,9.47-1.24c5.31-0.99,8.53,1.2,8.53,1.2l3.09,0.16c0,0,1.56,6.78,1.56,7.08s0.79,6.47,0.9,9.67
	c0.11,3.19,3.33,1.1,3.33,1.1l0.45,2.79l-0.72,6.75c0,0-0.63,17.01-2.61,17.68c-1.98,0.68-3.46-2.47-6.07-6.03
	c-2.61-3.55-5.72,1.26-5.72,1.26l-2.25-0.18l-2.79,3.29c0,0-3.51-0.09-4.99,3.08c-1.49,3.17-2.79,0.83-2.79,0.83l-3.19-1.66
	L58.84,251.36z"
          onPress={() => openModal(6)}
        />

<Path
          id="javajibuwachiwadi"
          fill={getColor(34)}
          d="M85.15,210.8l5.62,0.58c0,0,1.21-4.55,0.9-6.12c-0.32-1.58-1.31-4.64,1.31-4.46
	c2.61,0.18,10.26,0.81,12.38-0.27c2.11-1.08,4.18,0.67,4.18,0.67s-1.98,3.02-1.89,7.11c0.09,4.1,0.04,6.07-3.82,6.26
	c-3.87,0.18-3.19,7.47-3.19,7.47s1.53,5.07,0.45,8.55c0,0-6.3-2.28-10.02-1.62c-2.18,0.39-3.18,0.67-3.67,0.29
	c-0.42-0.33-0.44-0.88-0.47-2.03c-0.09-2.78,0.06-3.75,0-5.04c-0.08-1.99-0.59-3.58-0.9-4.56c-0.59-1.87-1.12-2.58-1.2-4.15
	C84.76,212.36,84.97,211.43,85.15,210.8z"
          onPress={() => openModal(34)}
        />

<Path
          id="khamgaon_phata"
          fill={getColor(46)}
          d="M121.72,201.86c0.24,0.06,3.72,13.86,3.72,13.86s-24.72-1.14-22.62-0.84
	c2.1,0.3,5.46-0.9,4.8-4.68c-0.66-3.78,1.68-8.94,1.68-8.94S121.48,201.8,121.72,201.86z"
          onPress={() => openModal(46)}
        />

<Path
          id="kasurdi"
          fill={getColor(41)}
          d="M125.44,215.72c0.31,0.29,0.16,0.97,0,1.43c-0.21,0.59-0.56,1.25-0.9,1.81l-0.84,13.62
	c0,0,0.06-1.08-3.12,0.6c-3.18,1.68-5.28-0.3-5.28-0.3s-7.26-2.04-8.64-0.9c-1.38,1.14-3.96,0-3.96,0l-1.92-1.26
	c0,0,1.2-0.3,0.6-5.16c-0.6-4.86,0.9-10.62,0.9-10.62c2.76,0.01,5.12,0.04,6.97,0.08c12.73,0.27,14.08,0.96,15.25,0.64
	C124.63,215.63,125.17,215.47,125.44,215.72z"
          onPress={() => openModal(41)}
        />

<Path
          id="khamgaon"
          fill={getColor(46)}
          d="M117.64,158.06c0,0,10.8,5.85,12.96,6.84c2.16,0.99,0,3.96,0,3.96l-1.8,2.88
	c-6.12,0.18-8.19,3.96-8.19,3.96l-29.52,0.9l-4.05-4.14c0,0,0.09-4.59,2.88-4.77c2.79-0.18,8.73-7.29,8.73-7.29l6.93-3.6
	L117.64,158.06z M91.72,200.99c0.14-0.05-0.5-7.02-0.58-7.2c-0.09-0.18-1.31-2.21-1.31-2.21l1.53-4.14c0,0,0.04-1.84,0.38-1.96
	c0.34-0.12,3.13-5.02-0.65-8.88l29.52-0.9c0,0-4.65,10.32-2.49,17.16l1.08,2.64c0,0,2.88,2.4,1.74,5.88c0,0-8.82-0.18-9,0
	c-0.18,0.18-2.7,0.12-3.06-1.2c-0.36-1.32-6.3,0.96-6.3,0.96L91.72,200.99z"
          onPress={() => openModal(46)}
        />

<Path
          id="tambewadi"
          fill={getColor(92)}
          d="M126.58,182.42c-2.08,2.7-0.18,6.36-0.18,6.36l1.46,4.15l-1.17,2.34l-0.4,7.07h-4.9l-0.4-1.44
	c-0.5-3.69-1.62-5.67-1.62-5.67s-0.49,0.54-1.8-4.54c-1.31-5.08,1.71-11.93,4.86-16.69c3.15-4.77,7.56-2.43,7.56-2.43
	S126.73,182.23,126.58,182.42z"
          onPress={() => openModal(92)}
        />

<Path
          id="nathachiwadi"
          fill={getColor(68)}
          d="M147.94,160.76c0,0-0.06,0.36,1.08,3.36s-0.48,7.56-0.48,7.56l-1.32,9.9l0.48,2.18
	c0,0,0.32,1.93,0.22,6.07c-0.09,4.14-3.38,3.65-3.38,3.65s-3.64,0.72-4.05,0.77c-0.4,0.05-9.67,0-9.67,0s-2.61,0.18-4.14-4.1
	c-1.53-4.28,0.54-9.81,0.54-9.81l2.6-9.28c2.43-3.24,0.66-7.35,0.66-7.35s-0.36-0.9,3.81,0c4.17,0.9,6.21-0.33,6.21-0.33
	C143.62,163.4,147.94,160.76,147.94,160.76z"
          onPress={() => openModal(68)}
        />

<Path
          id="pimpalgaon"
          fill={getColor(82)}
          d="M149.5,158.72l7.2-6l-0.48-6.66l-4.68-2.64c0,0-4.74-4.08-2.04-9.66
	c2.7-5.58,2.52-6.12,2.52-6.12s3.36-4.44,9.48-3.06c6.12,1.38,10.86,7.5,10.86,7.5s4.02,5.64,6.36,5.76c0,0,1.32,1.32,0,5.76
	c-1.32,4.44-0.18,14.16-0.18,14.16s-0.3,5.04-1.08,6.66s-3.54,1.2-3.54,1.2s-2.1,0.54-4.14-0.54c-2.04-1.08-5.7,0.24-6.48,2.34
	s-1.74,2.16-1.74,2.16s-1.68-5.88-1.38-6.9c0.3-1.02-4.32-4.08-4.32-4.08l-3.36,1.38C152.5,159.98,148.6,160.58,149.5,158.72z"
          onPress={() => openModal(82)}
        />

<Path
          id="koregaon_bivar"
          fill={getColor(52)}
          d="M150.22,99.2l0.63-10.08c0,0,4.59,0.27,7.11-4.41c0,0,4.23-2.97,4.59-4.32
	s6.48-3.33,6.48-3.33l9.27,7.11c0,0,1.71,0.81,1.53,5.22c-0.18,4.41,0.01,8.91,0.01,8.91v2.43l1.88,5.49l1.62,4.23l0.63,1.71
	c0,0-6.39,3.51-13.86,3.51c-7.47,0-7.47,0.54-7.47,0.54l-0.27-15.75l-8.46,0.18L150.22,99.2z"
          onPress={() => openModal(52)}
        />

<Path
          id="walki"
          fill={getColor(97)}
          d="M163.18,116.12h5.85c0,0,11.7-1.35,13.86-4.23l1.53-0.36v4.59c0,0,3.6,4.32,2.88,9.09
	s6.66,7.02,6.66,7.02l4.92,1.35c0,0,1.92-1.08,5.28,2.82l1.5,0.48c0,0,3.36,3.66,2.64,6.84l-1.62,0.42l-15.78-2.46l-12-3.54
	c0,0-2.94-1.62-6.48-5.94c-3.54-4.32-8.22-7.32-8.22-7.32L163.18,116.12z"
          onPress={() => openModal(97)}
        />

<Path
          id="ladkatwadi"
          fill={getColor(55)}
          d="M155.86,158.24l4.2,4.68l1.74,6.42l-0.36,9.12c0,0-1.68,3.78-1.8,3.96
	c-0.12,0.18-1.92,7.38-1.92,7.38l-9.3-4.8c0,0-1.92-4.8-0.24-11.4c1.68-6.6,0-12,0-12l1.26-2.16L155.86,158.24z"
          onPress={() => openModal(55)}
        />

<Path
          id="yewat_st"
          fill={getColor(105)}
          d="M157.06,189.74c2.43,2.7,6.03,2.88,6.03,2.88s2.61,1.71,6.03,4.68s3.33,9.72,3.33,9.72v6.48
	l-11.25-0.36l-7.2,0.27l-11.52,1.17l-8.73,2.25l-4.68,1.8l-2.79,2.16h-1.62l0.18-1.44l0.99-4.05l-1.44-4.95l-2.61-8.19h4.56v-5.52
	l0.96-2.4h6.36c0,0,6.06,0,10.38-0.66c4.32-0.66,3.6-2.58,3.6-2.58l0.48-5.88C148.12,185.12,154.63,187.04,157.06,189.74z"
          onPress={() => openModal(105)}
        />

<Path
          id="yawat"
          fill={getColor(104)}
          d="M172.95,221.51c-0.49,2.39-5.62,3.24-5.62,3.24s-5.1,6.57-3.9,11.55c1.2,4.98-2.22,5.64-5.4,6.84
	c-3.18,1.2-2.94,4.38-2.94,4.38l0.45,3.74c0,0-1.26-0.54-5.31-0.76c-4.05-0.23-5.8,3.38-5.8,3.38s-0.54,1.62-3.06,6.12
	c-2.52,4.5-8.1,1.8-8.1,1.8l-3.87-1.98c0,0-1.31-1.79-0.1-5.86c1.2-4.08-0.96-7.68-0.96-7.68s-0.42-1.44-3.66-6.12
	c-3.24-4.68-0.45-9.72-0.45-9.72l0.63-9.54l3.69-1.89l1.35-0.72l5.76-2.43c0,0,10.89-1.98,11.43-2.04s10.83-0.78,10.83-0.78h11.64
	l2.58,0.78C170.56,216.74,173.44,219.13,172.95,221.51z"
          onPress={() => openModal(104)}
        />

<Path
          id="undvadi"
          fill={getColor(95)}
          d="M178.03,167.57l-1.23,4.29c0,0-0.66,0.18-1.47,4.77c-0.81,4.59,2.97,5.76,2.97,5.76
	s-0.99,8.25-0.85,13.74c0.13,5.49-6.48,3.78-6.48,3.78c-1.71-5.99-11.16-8.33-11.16-8.33s-1.85-1.08-1.49-2.02
	c0.36-0.94,1.93-8.15,1.93-8.15l1.57-3.06v-8.64c0,0,0.72-0.58,1.89-2.74c1.17-2.16,2.93-3.01,6.98-1.8s6.39,0,6.39,0
	C179.2,165.44,178.03,167.57,178.03,167.57z"
          onPress={() => openModal(95)}
        />

<Path
          id="khubav"
          fill={getColor(51)}
          d="M182.35,181.52h8.16l0.63,0.69c-0.27,4.23,0.66,3.48,4.12,3.62c3.46,0.13,4.32,1.62,4.63,3.42
	s1.08,1.67,1.08,1.67s1.3-0.72,2.07,0.04s-0.85,4.77-0.85,4.77L196.93,206l-2.97,5.74c0,0-2.38,4.28-2.34,4.5
	c0.04,0.23-1.85,5.81-1.85,5.81l-16.43-0.68c0,0-1.62-5.74-1.35-11.65c0.27-5.91-1.14-10.98-1.14-10.98
	c6.48,2.4,7.11-2.76,7.11-2.76s-1.47-4.5-0.45-6.96c1.02-2.46,0-6.36,0-6.36C179.29,181.37,182.35,181.52,182.35,181.52z"
          onPress={() => openModal(51)}
        />

<Path
          id="delvadi"
          fill={getColor(16)}
          d="M204.94,143.84c5.16,0.6,3,2.88,3,2.88l-3.78,9.66l-25.46-0.24c0,0,0.2,0.3-0.31-2.7
	c-0.51-3,0.03-9.15,1.02-11.97c0.99-2.82-1.02-3.84-1.02-3.84C181.54,141.02,199.78,143.24,204.94,143.84z"
          onPress={() => openModal(16)}
        />

<Path
          id="ekeriwadi"
          fill={getColor(22)}
          d="M181.09,181.49c0,0,0-0.39-2.04,0.6c-2.04,0.99-2.1,0.18-3-1.29c-0.9-1.47-0.36-5.6-0.36-5.53
	c0,0.07,1.74-5.6,2.4-7.67c0.66-2.07-0.94-2.16-0.94-2.16l0.25-0.99c1.8-2.25,1.3-8.31,1.3-8.31l25.46,0.24l-1.11,3.75
	c0,0-3.96,9.36-4.14,9.72c-0.18,0.36-8.1,11.7-8.1,11.7L181.09,181.49z"
          onPress={() => openModal(22)}
        />

<Path
          id="bhandgaon"
          fill={getColor(108)}
          d="M182.8,221.87c0,0,8.55,0.76,11.88,1.26c3.33,0.49,3.76,3.91,3.76,3.91l-0.21,2.97l-0.07,3.76
	c1.14,4.74-1.56,6-1.56,6v3.78v4.86l-1.26,4.32c0,0,0.06,2.28,0,4.74c-0.06,2.46-3.15,8.79-4.5,10.29c-1.35,1.5-5.91,1.5-7.92,0.63
	c-2.01-0.87-6.84-0.27-6.84-0.27h-2.67c0,0-0.21-0.78,0.51-3.12s-1.71-2.73-1.71-2.73s-2.28,0.27-4.41-1.5
	c-2.13-1.77-8.01-2.1-8.01-2.1s-2.37,0.54-2.04-2.58c0.33-3.12-1.35-3.72-2.43-5.22s-0.27-7.32,4.83-8.73
	c5.1-1.41,3.21-4.62,3.21-4.62s-0.13-11.88,3.87-12.74c4-0.85,6.07-3.33,6.07-3.33L182.8,221.87z"
          onPress={() => openModal(108)}
        />

<Path
          id="galandwadi"
          fill={getColor(24)}
          d="M212.86,162.17c1.62,2.37,0.57,3.72,0.57,3.72l-0.09,2.55c0,0,0.54,1.59,0.6,1.68
	s0,4.59,0,4.59s-1.71,1.22-5.04,5.22c-3.33,4.01-1.44,10.44-1.44,10.44s-0.94-0.76-4.14,0.5c-3.2,1.26-3.51-1.44-3.51-1.44
	s2.43-3.2-4.54-3.69c-6.98-0.49-3.2-6.3-3.02-6.26c3.71,0.93,10.35-16.92,10.35-16.92L212.86,162.17z"
          onPress={() => openModal(24)}
        />

<Path
          id="pargaon"
          fill={getColor(76)}
          d="M227.5,140.66c6.3-4.62,15.72-4.8,15.72-4.8s10.44-1.26,12.36-3s3.42-0.66,3.42-0.66l4.74,3.06
	c0,0,0.18,7.74-3.24,12.78c-3.42,5.04-3.06,9.36-3.06,9.36l-1.2,9.36l-6.48,2.52c0,0-9.18,2.1-8.55,7.14s-4.95,5.85-4.95,5.85
	s-2.97,0-4.41,0.27c-1.44,0.27-1.08,1.89-1.08,1.89l-5.4,0.18c0,0-2.25-0.45-7.2-1.08c-4.95-0.63-3.42,5.13-3.42,5.13
	s-5.94,4.23-7.56,1.71c-1.62-2.52,1.35-7.56,2.34-10.98c0.99-3.42,3.99-4.59,3.99-4.59v-1.92l0.6-2.34l-0.72-2.64l0.36-3.18
	l-0.6-2.76l-2.22-0.18l-8.64,0.66l2.55-8.34l2.34-4.41l1.44-5.76C218.86,146.12,221.2,145.28,227.5,140.66z"
          onPress={() => openModal(76)}
        />

<Path
          id="nangaon"
          fill={getColor(66)}
          d="M267.52,136.64l0.42,1.02l2.22,0.48l1.2,0.96l3.12,1.14l3.96,3.48l5.76,2.52l1.68,2.04
	c0,0,1.14,2.16,2.46,3.9c1.32,1.74,1.02,3.9,1.02,3.9l-0.66,1.8c0,0-13.5,0-20.64,0c-7.14,0-10.2-1.74-10.2-1.74
	s-0.54,0.93,2.25-6.27c2.79-7.2,3.6-14.49,3.6-14.49L267.52,136.64z"
          onPress={() => openModal(66)}
        />

<Path
          id="ganesh_road"
          fill={getColor(25)}
          d="M257.86,155.72c0,0-0.06,2.1,11.34,2.28c11.4,0.18,19.44,0,19.44,0s-0.48,1.74-0.3,1.74
	c0.18,0,1.02,1.14,1.02,1.14l0.36,3.18c0,0,2.28,3.84,5.1,4.56l-2.22,6.84l-3.12-2.16c0,0-1.74-2.1-6.9-2.58s-11.88-1.2-11.88-1.2
	l-14.28-2.4C256.42,167.12,255.88,161.96,257.86,155.72z"
          onPress={() => openModal(25)}
        />

<Path
          id="amonimal"
          fill={getColor(2)}
          d="M291.4,176.51l-6.3,4.08c0,0-1.77,0.12-1.92,0.15c-0.15,0.03-2.01,2.22-2.01,2.22
	c-2.07-1.92-4.02-1.26-4.02-1.26c-4.89,1.74-8.31-1.17-8.31-1.17s-2.52-1.92-5.67-1.11s-3.99-1.5-3.99-1.5s0.01-4.79-2.29-4.63
	c-2.3,0.16-0.97-2.88-0.97-2.88l0.19-3.29c0,0,11.76,1.8,11.94,1.8c0.18,0,11.82,1.68,15.12,1.86c3.3,0.18,9.54,4.2,9.54,4.2
	L291.4,176.51z"
          onPress={() => openModal(2)}
        />

<Path
          id="khopodi"
          fill={getColor(48)}
          d="M255.7,170.9c-0.4,4.11,0.96,2.28,0.96,2.28s1.74,0.6,2.52,3.12c0.78,2.52-0.06,2.7,4.02,3
	c4.08,0.3,5.88,1.2,5.88,1.2c-0.36,2.58-3.84,3.84-3.84,3.84c-1.01,0.61-2.63,1.57-4.68,2.7c-4.56,2.52-5.01,2.46-6.84,3.78
	c-2.99,2.16-3.01,3.22-5.49,4.59c-2.17,1.2-4.28,1.56-5.73,1.68c0.21-3.54-1.86-1.98-1.86-1.98s-3.33-0.69-3.72-5.04
	s-5.03-4.61-5.57-5.95c-0.54-1.35,2.07-1.76,2.07-1.76l2.97-0.23c0,0,4.1-0.86,4.86-6.08s6.44-6.52,6.44-6.52l8.41-2.74
	C256.11,166.79,256.11,166.79,255.7,170.9z"
          onPress={() => openModal(48)}
        />

<Path
          id="dapodi"
          fill={getColor(13)}
          d="M277.51,188.48c-0.03,0.12-0.32,1.4-0.61,3.85c-0.29,2.45-3.47,2.83-3.47,2.83
	s-4.43,2.99-3.53,5.96c0.9,2.97-1.62,3.62-1.62,3.62l-1.48,1.04c0,0,0.11,1.73-2.57,3.74c-2.68,2-4.21,0.18-4.21,0.18
	s-0.65-1.24-2.09-0.7c-1.44,0.54-2.18-0.07-2.18-0.07s-1.62-2.27-3.26-0.52c-1.64,1.76-5.29,0.86-5.29,0.86l-3.76-0.11
	c0,0-0.29,0.02-0.65-2.5c-0.36-2.52-0.27-4.86-0.27-4.86v-4.54c6.97-1.08,10.8-5.99,10.8-5.99s4.9-3.87,9.32-5.26
	c4.41-1.4,6.12-5.31,6.12-5.31s5.4,1.98,7.65,1.31s2.93,0,2.93,0l1.85,1.08C277.72,186.23,277.54,188.36,277.51,188.48z"
          onPress={() => openModal(13)}
        />

<Path
          id="deshmukh_mala"
          fill={getColor(17)}
          d="M234.76,207.62l-8.58-0.78h-11.1l0.78-7.86l0.66-7.86v-7.86c0,0,2.16-0.3,2.4,0
	c0.24,0.3,3.42,2.04,4.74,1.44c1.32-0.6,2.7-0.66,3.42-0.42s2.4,0.6,4.74,0.3s4.62,3,4.44,4.8c-0.18,1.8,3.48,5.58,4.38,5.34
	c0.9-0.24,1.49,0.6,1.49,0.6s0.31,4.44-0.23,6.12c-0.54,1.68,0.6,5.94,0.6,5.94L234.76,207.62z"
          onPress={() => openModal(17)}
        />

<Path
          id="handalwadi"
          fill={getColor(30)}
          d="M215.83,199.1l-3.28-0.77l-10.26-0.13l-1.55,0.49l0.37-0.61c1.38-1.5,2.16-4.5,2.16-5.82
	c0-1.32,1.3-1.3,1.3-1.3l3.12-0.09c7.06,0,6.88-3.47,7.11-5.54c0.22-2.07,1.98-1.98,1.98-1.98
	C217.32,191.05,215.83,199.1,215.83,199.1z"
          onPress={() => openModal(30)}
        />

<Path
          id="kedgaon_st"
          fill={getColor(44)}
          d="M215.52,206.62h-18.86l1.57-4.19l2.75-3.78c0,0,11.29-0.31,11.47-0.4
	c0.18-0.09,3.06,0.81,3.29,0.81L215.52,206.62z"
          onPress={() => openModal(44)}
        />

<Path
          id="kedgaon"
          fill={getColor(43)}
          d="M243.19,209l-1.38,0.16l-0.72,1.91l-2.13,1.29l-2.91,1.32l-3.45,3.24c0,0-0.96,2.76,0.96,1.98
	s3.42,1.71,3.42,1.71l0.63,4.5l-1.35,3.96l-6.57,5.31l-1.08-5.4l-1.89-0.99h-4.68l-2.97-0.9c-1.65,0.63-3.3,1.26-4.95,1.89
	c-0.14-1.11-0.47-2.76-1.32-4.56c-2.13-4.51-6.01-6.78-10.23-9.18c-2.03-1.15-4.98-2.62-8.79-3.81l2.43-4.59h30.06l8.73,0.63h7.47
	L243.19,209z"
          onPress={() => openModal(43)}
        />

<Path
          id="patil_nimbalkarwasti"
          fill={getColor(71)}
          d="M208.72,219.8c0,0,0.9,0.32,1.08,0.22c0.18-0.09,2.97,3.65,2.97,3.65
	s3.38,7.07,1.17,5.31c-2.21-1.75-16.24-3.33-16.24-3.33c0.54-1.3-3.74-2.88-3.74-2.88l-3.24-0.45l-0.27-0.72
	c-0.18-2.16,4.05-10.17,4.05-10.17C202.47,214.04,208.72,219.8,208.72,219.8z"
          onPress={() => openModal(71)}
        />

<Path
          id="dhumalicha_mala"
          fill={getColor(21)}
          d="M214.44,229.07c0,0-15.75,19.71-14.76,21.65c0.99,1.93-1.12,2.43-1.12,2.43h-3.06
	c0,0,1.26-5.13,0.9-7.51c-0.36-2.39,0.54-6.75,0.54-6.75l1.08-0.81l0.76-2.74c0,0-1.76-3.19-0.95-4.68c0.81-1.49,0-4.9,0-4.9
	C202.56,224.93,214.44,229.07,214.44,229.07z"
          onPress={() => openModal(21)}
        />

<Path
          id="wakhari"
          fill={getColor(100)}
          d="M195.58,253.19l2.31,0.15c0,0,0.44,0.17,0.92-0.03c0.86-0.36,1.03-1.71,1.09-2.16
	c0.33-2.24,1.52-4.26,2.21-6.42c0.83-2.61,1.5-1.86,6.26-8.51c2.15-3,3.09-4.66,5.43-6.55c2.06-1.67,3.33-2.01,3.98-2.13
	c1.79-0.34,4.27-0.06,4.27-0.06l0,0l0.12,0.72h4.68c0,0,1.8-0.51,2.01,1.62c0.21,2.13,1.51,4.79,1.51,4.79l-1.66,5.17L229,251
	c0,0-0.48,7.98-6.18,11.22s-9.29,6.09-9.29,6.09l-0.56,1.62h-1.33c0,0-3.42-0.67-5.26-3.73s-6.43-4.45-6.43-4.45l-3.1,0.04
	c0,0-0.36,3.42-5.81,5.76l2.52-4.5l1.93-5.58L195.58,253.19z"
          onPress={() => openModal(100)}
        />

<Path
          id="khor"
          fill={getColor(49)}
          d="M182.37,268.72c0.11,0,5.2,0.49,5.2,0.49s7.44-2.7,8.88-5.94c1.44-3.24,5.85-0.42,5.85-0.42
	l3.84,3.06c0,0,0.78,1.47,4.26,3.66s2.85-0.51,2.85-0.51l2.19-1.32l3.12,10.32l5.4,7.32l5.64,8.28c0,0-50.58,3.54-55.35,3.72
	c-4.77,0.18-3.94-4.68-3.94-4.68l0.36-4.28c0,0-2.29-0.2-4.68,0.32c-2.38,0.52-2.57-0.6-2.57-0.6s-1.26-1.32,4.26-7.2
	s5.67-12.36,5.67-12.36C177.27,266.9,182.26,268.72,182.37,268.72z"
          onPress={() => openModal(49)}
        />

<Path
          id="pimpalachiwadi"
          fill={getColor(81)}
          d="M234.37,306.56l1.8,2.07l-2.61,13.32c-8.82-6.84-21.45-5.88-21.45-5.88l-7.39,2.28
	c0,0-18.95-0.09-20.96,0c-2.01,0.09-1.5-1.41-1.5-1.41s-1.98-8.36-3.42-13.58s-5.22-6.07-5.22-6.07s55.8-3.78,56.25-3.87
	L234.37,306.56z"
          onPress={() => openModal(81)}
        />

<Path
          id="boripardhi"
          fill={getColor(9)}
          d="M267.56,206.06l0.2,3.1l-3.51,5.33l-0.54,5.67l-2.61,3.51l-1.71,4.32l-3.15,3.24l-1.89,6.12
	l-2.79,6.39c0,0-2.25,3.6-2.25,3.74c0,0.13,0,2.34,0,2.34s-0.23,0.45-3.42,0.18c-3.2-0.27-8.55,0-8.55,0s-6.89,4.9-6.93,5.04
	c-0.04,0.13-1.84,0.27-1.84,0.27l0.63-2.38c0,0-0.04-5.85-0.54-10.3c-0.5-4.46,1.3-7.61,1.3-7.61l3.65-3.64c0,0,2.21-1.98,3.69-5.26
	c1.49-3.29-0.5-6.24-0.5-6.24s-1.66-1.07-3.1-0.96c-1.44,0.11-1.04-1.44-1.04-1.44s1.93-3.78,5.04-4.54
	c3.1-0.76,4.23-3.76,4.23-3.76h4.27c0,0,3.11,1.24,5.99-0.34c2.88-1.57,4.23,0.34,4.23,0.34s0.18-1.06,3.87,0.34
	c3.69,1.4,4.77-0.54,5.04-0.63c0.27-0.09,1.35-2.43,1.48-2.61L267.56,206.06z"
          onPress={() => openModal(9)}
        />

<Path
          id="deulgaongada"
          fill={getColor(18)}
          d="M252.1,258.8c0.66,2.1,1.89,2.52,4.08,2.4c2.19-0.12,2.61,1.47,2.61,1.47s1.3,1.3,1.55,5.84
	c0.25,4.54,2.56,3.67,2.56,3.67l1.12-0.38l1.69-0.02l1.64,0.45c0,0,3.2,0.02,5.06-0.18c1.87-0.2,4.45-1.53,4.45-1.53h1.03v1.01
	l-2.25,1.92l-2.85,0.72l-3.03,3.78l-0.75-0.09l-6.57,3.42l-10.62,6.21l-5.31,3.42c0,0-0.81,2.07-5.76,6.93
	c-4.95,4.86-4.5,9.78-4.5,9.78s-1.86-0.69-2.16-0.81c-0.3-0.12-1.77-5.28-1.77-5.28l-2.85-7.98l-9.12-12.66l-2.76-5.16l-0.06-2.16
	l-2.04-5.76c10.32-6.18,13.05-12.45,13.05-12.45l2.79-0.96l5.82-4.77h3.42l1.56-0.48l3.66,0.96c0,0,3.18-0.06,3.36,0
	C249.16,250.1,251.44,256.7,252.1,258.8z"
          onPress={() => openModal(18)}
        />

<Path
          id="padvi"
          fill={getColor(73)}
          d="M277.48,280.4c0,0-1.02,3.01-1.8,5.83c-0.78,2.82-1.02,5.58-1.02,5.58s0.3,2.52,1.5,4.5
	c1.2,1.98,0.63,3.45,0.63,3.45s-1.17,5.94-2.73,9.93c-1.56,3.99,1.05,5.16,1.05,5.16l1.98,1.5l0.42,2.07c0,0-3.75,0.51-6.99,1.62
	c-3.24,1.11-4.59,0.12-4.59,0.12s-6.24-0.36-6.57,1.86c-0.33,2.22-5.85,4.14-5.85,4.14s-2.26-0.15-7.49,0.57s-5.35-1.85-5.35-1.85
	h-2.43l-0.04-0.63l-3.68-2.14c0,0,1.02-9.06,1.68-14.46c0.66-5.4,2.94-7.88,2.94-7.88l3.51-3.87l4.47-5.38l11.01-7.17l9.72-5.08
	l1.93-0.72l3.6-3.51l3.38-1.08l1.21-1.8L277.48,280.4z"
          onPress={() => openModal(73)}
        />

<Path
          id="hatwalan"
          fill={getColor(31)}
          d="M300.25,169.49c0,0,2.34,0.81,3.02,2.52c0.67,1.71,3.91,3.38,3.91,3.38s2.79-0.13,5.18,1.93
	c2.39,2.07,6.48,2.57,6.48,2.57s-2.34,8.01-4.5,10.8c-2.16,2.79-3.47,7.99-3.47,7.99l-0.45,2.07c-0.51-1.95-6.18-2.97-6.18-2.97
	c-6.66-0.27-11.58-3.18-11.58-3.18s-3.3-1.02-5.67-1.71c-2.37-0.69-0.63-3.33-0.63-3.33l1.26-0.42l3.42-8.64l-0.24-3.36l1.08-0.36
	l3.33-7.98L300.25,169.49z"
          onPress={() => openModal(31)}
        />

<Path
          id="kadethan"
          fill={getColor(37)}
          d="M290.94,180.18c-0.14,1.09-0.46,1.97-0.74,2.56l-0.8,0.79l-2.25,5.73
	c-3.78,2.1,0.24,4.26,0.24,4.26s4.68,1.2,4.86,1.2c0.18,0,6.24,2.58,6.24,2.58l8.22,1.38c6.84-1.14,5.52,13.98,5.52,13.98
	l-1.62,2.64c-4.84,3.96-9.68,7.92-14.52,11.88c-0.69-1.03-1.76-2.46-3.27-3.96c-2.33-2.3-5.14-4.18-11.7-6.82
	c-3.7-1.49-8.64-3.23-14.65-4.7c1.39-1.35,0.85-5.94,0.85-5.94l0,0c2.03-1.57,2.2-1.8,2.21-1.8c1.07-1.38,0.18-2.83,0.54-4.59
	c0.27-1.31,1.27-3,4.55-4.63c0,0,2.34-1.76,2.88-4.82c0.54-3.06,2.11-5.04,2.11-5.04l3.64-4.23h1.08l6.39-3.82
	C290.91,177.56,291.12,178.74,290.94,180.18z"
          onPress={() => openModal(37)}
        />

<Path
          id="warvand"
          fill={getColor(101)}
          d="M289.52,237.62c-1.67,3.24,0.97,3.42,0.97,3.42l1.57,0.36c4.98,2.52,1.5,7.74,1.5,7.74
	s-2.94,2.46-2.52,10.44c0.42,7.98-10.38,10.95-10.38,10.95l-2.94-0.03c-2.94,1.8-9.24,1.95-9.24,1.95s-1.95-1.41-4.68-0.45
	c-2.73,0.96-2.94-0.9-2.94-0.9s-1.26-5.07-1.71-7.44c-0.45-2.37-2.01-2.31-2.01-2.31l-4.01-0.69c0,0-5.94-11.34-3.15-13.95
	c2.79-2.61,3.35-7.47,3.35-7.47l1.35-2.82c0,0,1.47-6.27,3.63-7.62c2.16-1.35,2.85-5.88,2.85-5.88s2.16-0.69,2.31-4.56
	c0.08-1.93,0.68-3.49,1.27-4.57c0.41-0.76,0.85-1.32,1.16-1.67c1.48,0.04,3.62,0.19,6.14,0.75c0.95,0.21,3.07,0.73,9.77,3.83
	c7.28,3.37,8.91,4.67,9.76,5.4c1.99,1.7,3.35,3.43,4.21,4.67C290.92,231.38,291.18,234.38,289.52,237.62z"
          onPress={() => openModal(101)}
        />

<Path
          id="kangaon"
          fill={getColor(40)}
          d="M319.11,179.84c0,0,3.69,1.08,6.12-4.95s2.61-9.54,2.61-9.54s0.04-2.16,3.1-2.48
	s7.88,0.85,10.44,4.9s2.88,7.07,2.88,7.07s-0.14,4.82,1.76,6.75l2.34,8.64c0,0,1.54,5.54,3.32,5.9l-6.63,5.79c0,0-4.2,3.12-5.1,6.84
	s-3.54,14.22-3.54,14.22s-0.78,0.72-3.06,0s-5.82-2.07-9.36-1.74c-3.54,0.33-11.58-1.62-11.58-1.62s-1.19,0.07-1.12-1.44
	c0.07-1.51-0.88-2.63-0.88-2.63s1.73-2.63,1.91-4.1c0.18-1.46,0.39-7.37-1.44-10.82c-1.83-3.45,4.47-11.73,4.47-11.73
	S319.74,180.43,319.11,179.84z"
          onPress={() => openModal(40)}
        />

<Path
          id="birobawadi"
          fill={getColor(98)}
          d="M311.38,217.88c0.12,1.86,1.74,2.04,1.74,2.04s5.64,1.38,11.28,1.68
	c5.64,0.3,7.32,1.08,7.32,1.08l2.7,0.84l2.4-0.24l8.82,4.98l3,1.08c0,0,2.1,4.68,4.44,9.66s0,6.96,0,6.96l-3.9,4.14l-3.84-2.58
	c-5.13-2.97-35.46-3.51-35.46-3.51l-15.24,0.87c0,0-1.47-3.42-3.66-3.69c-2.19-0.27-1.68-2.25-1.68-2.25l0.78-2.7
	c0.06-5.7,14.94-16.86,14.94-16.86l5.4-3.9C310.42,215.48,311.26,216.02,311.38,217.88z"
          onPress={() => openModal(98)}
        />

<Path
          id="patas"
          fill={getColor(77)}
          d="M343.54,259.36c0,0-0.45,7.47-0.54,7.83c-0.09,0.36-0.72,2.61-0.72,2.61l2.16,2.26
	c-0.6,2.88-0.96,10.92-0.96,10.92l-2.4,0.12l-1.56,0.9l-4.62,0.24l-4.32,3.36c0,0-12.6,8.29-13.64,10.18
	c-1.04,1.89-1.85,1.3-1.85,1.3l-1.67-1.67c0,0-3.82,0.81-4.77-3.29c-0.95-4.09-5.48-9.33-5.48-9.33s-1.77-2.4-3.45-2.43
	c-1.68-0.03-2.7-1.29-2.7-1.29c-1.44-2.64-5.82-3.03-5.82-3.03l-3.06-0.3h-6.72l-3.27-7.2l5.01-0.99
          onPress={() => openModal(77)}
        />
