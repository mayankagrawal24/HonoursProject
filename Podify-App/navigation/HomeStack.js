import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import SpotifyConnectScreen from '../screens/SpotifyConnectScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Home' component={HomeScreen} />

      <Stack.Screen name='Spotify' component={SpotifyConnectScreen}/>
    </Stack.Navigator>
  );
}