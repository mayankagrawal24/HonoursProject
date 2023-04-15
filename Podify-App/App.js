import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Routes from './navigation';
import React from 'react';
import { LogBox } from 'react-native';

//LogBox.ignoreLogs(['Warning: ...']); // Ignore specific warning messages, you can put the warning text you want to ignore here
//LogBox.ignoreAllLogs(); // Ignore all log messages

export default function App() {
  return (
    <Routes />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
