import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PlatformDetailScreen from './screens/PlatformDetailScreen';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="PlatformDetail"
          component={PlatformDetailScreen}
          options={({ route }: any) => ({
            title: route.params.platformName,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
