import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  PlatformDetail: { platformName: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'PlatformDetail'>;

interface EarningEntry {
  id: string;
  date: string;
  amount: number;
}

const PlatformDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { platformName } = route.params;
  const [earnings, setEarnings] = useState<string>('');
  const [earningEntries, setEarningEntries] = useState<EarningEntry[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);

  useEffect(() => {
    const fetchPlatformData = async () => {
      const storedPlatforms = await AsyncStorage.getItem('platforms');
      if (storedPlatforms) {
        const platforms = JSON.parse(storedPlatforms);
        const platform = platforms.find((p: any) => p.name === platformName);
        if (platform && platform.earningEntries) {
          setEarningEntries(platform.earningEntries);
        }
      }
    };
    fetchPlatformData();
  }, [platformName]);

  const calculateTotals = () => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const monthAgo = new Date(now);
    monthAgo.setDate(now.getDate() - 30);

    const weekly = earningEntries
      .filter((entry) => new Date(entry.date) >= weekAgo)
      .reduce((total, entry) => total + entry.amount, 0);

    const monthly = earningEntries
      .filter((entry) => new Date(entry.date) >= monthAgo)
      .reduce((total, entry) => total + entry.amount, 0);

    setWeeklyTotal(weekly);
    setMonthlyTotal(monthly);
  };

  useEffect(() => {
    calculateTotals();
  }, [earningEntries]);

  const handleSave = async () => {
    if (!earnings) {
      alert('Please enter a valid amount.');
      return;
    }

    const newEntry: EarningEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      amount: parseFloat(earnings),
    };

    const updatedEntries = [...earningEntries, newEntry];
    setEarningEntries(updatedEntries);
    setEarnings('');

    const storedPlatforms = await AsyncStorage.getItem('platforms');
    const platforms = storedPlatforms ? JSON.parse(storedPlatforms) : [];
    const updatedPlatforms = platforms.map((p: any) =>
      p.name === platformName
        ? { ...p, earningEntries: updatedEntries, earnings: updatedEntries.reduce((sum, e) => sum + e.amount, 0) }
        : p
    );

    await AsyncStorage.setItem('platforms', JSON.stringify(updatedPlatforms));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{platformName} Earnings</Text>
      <Text style={styles.totalEarnings}>Weekly: ₹{weeklyTotal}</Text>
      <Text style={styles.totalEarnings}>Monthly: ₹{monthlyTotal}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter today's earnings"
        value={earnings}
        onChangeText={setEarnings}
        keyboardType="numeric"
      />
      <Button title="Add Earnings" onPress={handleSave} />

      <FlatList
        data={earningEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>Date: {item.date}</Text>
            <Text>Amount: ₹{item.amount}</Text>
          </View>
        )}
      />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  totalEarnings: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#28a745',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  entry: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});

export default PlatformDetailScreen;
