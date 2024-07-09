import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { HomeScreenProps } from '../../components/types'; // Adjust path as necessary

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card} onPress={() => navigation.navigate('Baramati')}>
        <Card.Content style={styles.cardContent}>
          <Image source={require('../../assets/images/ncpLogo.png')} style={styles.cardImage} />
          <Title style={styles.cardTitle}>Baramati</Title>
        </Card.Content>
      </Card>
      <Card style={styles.card} onPress={() => navigation.navigate('Khadakwasla')}>
        <Card.Content style={styles.cardContent}>
          <Image source={require('../../assets/images/ncpLogo.png')} style={styles.cardImage} />
          <Title style={styles.cardTitle}>Khadakwasla</Title>
        </Card.Content>
      </Card>
      <Card style={styles.card} onPress={() => navigation.navigate('DaundMap')}>
        <Card.Content style={styles.cardContent}>
          <Image source={require('../../assets/images/ncpLogo.png')} style={styles.cardImage} />
          <Title style={styles.cardTitle}>Daund</Title>
        </Card.Content>
      </Card>
      <Card style={styles.card} onPress={() => navigation.navigate('IndapurMap')}>
        <Card.Content style={styles.cardContent}>
          <Image source={require('../../assets/images/ncpLogo.png')} style={styles.cardImage} />
          <Title style={styles.cardTitle}>Indapur</Title>
        </Card.Content>
      </Card>
      <Card style={styles.card} onPress={() => navigation.navigate('Purandarmap')}>
        <Card.Content style={styles.cardContent}>
          <Image source={require('../../assets/images/ncpLogo.png')} style={styles.cardImage} />
          <Title style={styles.cardTitle}>Purandar</Title>
        </Card.Content>
      </Card>
      <Card style={styles.card} onPress={() => navigation.navigate('Bhormap')}>
        <Card.Content style={styles.cardContent}>
          <Image source={require('../../assets/images/ncpLogo.png')} style={styles.cardImage} />
          <Title style={styles.cardTitle}>Bhor</Title>
        </Card.Content>
      </Card>
      {/* <Card style={styles.card} onPress={() => navigation.navigate('CreateForms')}>
        <Card.Content style={styles.cardContent}>
          <Image source={require('../../assets/create_forms.png')} style={styles.cardImage} />
          <Title>Create Forms</Title>
        </Card.Content>
      </Card> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%',
    marginVertical: 10,
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Add shadow for iOS
    shadowOpacity: 0.2, // Add shadow for iOS
    shadowRadius: 2, // Add shadow for iOS
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center horizontally
  },
  cardImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  cardTitle: {
    textAlign: 'center', // Center text
  },
});

export default Home;
