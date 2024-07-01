import React from 'react';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import CityInfo from './CityInfo';

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
      <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/dadasaheb.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>About Baramati Taluka</Text>
        <Text style={styles.paragraph}>
          Baramati taluka is a taluka in Baramati subdivision of Pune district of state of Maharashtra in India.
          Baramati Tehsil is located in Western Maharashtra. It belongs to Pune Division. It is located 100 km
          towards east from district headquarters Pune. 240 km from state capital Mumbai towards east. Baramati
          tehsil has its head quarter that is Baramati town. Baramati tehsil lies between 18º04΄ to 18°32΄ north
          latitudes and 74° 26΄to 74° 69΄ east longitudes. It is located at altitude of 550 meters above means
          sea level. There are 2 towns and 116 main villages in Baramati Taluka. Baramati Taluka is bounded by
          Phaltan Taluka towards the South, Daund Taluka towards North, Indapur Taluka towards East and Purandhar
          Taluka towards West. The climate of the Baramati Taluka is slightly different in irrigated and
          non-irrigated area. The winter season is from December to about the middle of February followed by
          summer season which last up to May. June to September is the south-west monsoon season, whereas October
          and November constitute the post-monsoon season. The mean minimum temperature is about 12 °C and means
          temperature is about 39 °C. The average annual rainfall for the period 2001 to 2012 of Baramati Tahsil
          was 502 mm. The rainfall analysis indicates study area is drought area (DPAP). Baramati taluka has a
          population of 429,600 according to the 2011 census. Baramati had a literacy rate of 82.27% and a sex
          ratio of 943 females per 1000 males. 47,668 (11.10%) are under 7 years of age. 73,761 (17.17%) lived
          in urban areas. Scheduled Castes and Scheduled Tribes make up 14.98% and 0.92% of the population
          respectively.
        </Text>
        <CityInfo />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 24,
    padding : 7,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200, // Adjust height as per your image aspect ratio
  },
});

export default Home;
