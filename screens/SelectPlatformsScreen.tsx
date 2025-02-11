import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  SelectPlatforms: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'SelectPlatforms'>;

interface Platform {
  id: string;
  name: string;
}

const availablePlatforms: Platform[] = [
  { id: '1', name: 'Uber' },
  { id: '2', name: 'Ola' },
  { id: '3', name: 'Rapido' },
  { id: '4', name: 'Swiggy' },
  { id: '5', name: 'Zepto' },
];

const SelectPlatformsScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.some((p) => p.id === platform.id)
        ? prev.filter((p) => p.id !== platform.id)
        : [...prev, platform]
    );
  };

  const savePlatforms = async () => {
    if (selectedPlatforms.length === 0) {
      Alert.alert('No Platforms Selected', 'Please select at least one platform to proceed.');
      return;
    }

    const initializedPlatforms = selectedPlatforms.map((platform) => ({
      ...platform,
      earnings: 0,
    }));

    await AsyncStorage.setItem('platforms', JSON.stringify(initializedPlatforms));
    navigation.replace('Home');
  };

  const renderPlatform = ({ item }: { item: Platform }) => {
    const isSelected = selectedPlatforms.some((p) => p.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => togglePlatform(item)}
      >
        <Text style={styles.platformName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Gig Platforms</Text>
      <FlatList
        data={availablePlatforms}
        renderItem={renderPlatform}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Button title="Save & Continue" onPress={savePlatforms} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  platformName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});

export default SelectPlatformsScreen;
