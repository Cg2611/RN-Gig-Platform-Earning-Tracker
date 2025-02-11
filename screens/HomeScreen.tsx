import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  PlatformDetail: { platformName: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface Platform {
  id: string;
  name: string;
  earnings: number;
}

const initialPlatforms: Platform[] = [
  { id: '1', name: 'Uber', earnings: 0 },
  { id: '2', name: 'Ola', earnings: 0 },
  { id: '3', name: 'Rapido', earnings: 0 },
  { id: '4', name: 'Swiggy', earnings: 0 },
  { id: '5', name: 'Zepto', earnings: 0 },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);

  // Fetch earnings from AsyncStorage on load
  useEffect(() => {
    const fetchEarnings = async () => {
      const storedPlatforms = await AsyncStorage.getItem('platforms');
      if (storedPlatforms) {
        setPlatforms(JSON.parse(storedPlatforms));
      } else {
        await AsyncStorage.setItem('platforms', JSON.stringify(initialPlatforms));
      }
    };
    fetchEarnings();
  }, []);

  // Refresh earnings when returning to the home screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const storedPlatforms = await AsyncStorage.getItem('platforms');
      if (storedPlatforms) {
        setPlatforms(JSON.parse(storedPlatforms));
      }
    });
    return unsubscribe;
  }, [navigation]);

  const calculateTotalEarnings = () => {
    return platforms.reduce((total, platform) => total + platform.earnings, 0);
  };

  const renderPlatform = ({ item }: { item: Platform }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PlatformDetail', { platformName: item.name })}
    >
      <Text style={styles.platformName}>{item.name}</Text>
      <Text style={styles.earnings}>Earnings: ₹{item.earnings}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gig Platforms</Text>
      <Text style={styles.totalEarnings}>Total Earnings: ₹{calculateTotalEarnings()}</Text>
      <FlatList
        data={platforms}
        renderItem={renderPlatform}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  totalEarnings: {
    fontSize: 20,
    color: '#28a745',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  platformName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  earnings: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default HomeScreen;
