import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './src/pages/Login';
import PokemonListScreen from './src/pages/PokemonList';
import PokemonDetailScreen from './src/pages/PokemonDetail';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      < LoginScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
