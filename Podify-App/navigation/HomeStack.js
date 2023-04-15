import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import EditScreen from '../screens/EditScreen';
import SpotifyConnectScreen from '../screens/SpotifyConnectScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CommunityScreen from '../screens/CommunityScreen';
import PodcastNotesScreen from '../screens/PodcastNotesScreen';
import SinglePodcastNoteScreen from '../screens/SinglePodcastNoteScreen';
import colours from '../config/colours';


const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen name='Home' component={HomeScreen} />

      <Stack.Screen name='Edit' component={EditScreen} options={{
        headerStyle: {
          backgroundColor: colours.primary,
        },
      }}/>
      <Stack.Screen name='Community' component={CommunityScreen} options={{
        headerStyle: {
          backgroundColor: colours.primary,
        },
      }}/>

      <Stack.Screen name='Podcast Notes' component={PodcastNotesScreen} options={{
        headerStyle: {
          backgroundColor: colours.primary,
        },
      }}/>

      <Stack.Screen name='Single Note' component={SinglePodcastNoteScreen} options={{
        headerStyle: {
          backgroundColor: colours.primary,
        },
      }}/>
      <Stack.Screen name='Spotify' component={SpotifyConnectScreen}/>
      <Stack.Screen name='Notification System' component={NotificationScreen}/>
    </Stack.Navigator>
  );
}