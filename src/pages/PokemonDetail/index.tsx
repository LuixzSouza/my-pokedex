import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { RootStackParamList } from '../../routes';
import { fetchPokemonDetail, PokemonDetailResponse } from '../../services/pokeapi';

export default function PokemonDetailScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<RouteProp<RootStackParamList, 'PokemonDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonDetail'>>();
  
  const { id } = route.params;

  const [pokemon, setPokemon] = useState<PokemonDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvert, setIsInvert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPokemon() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPokemonDetail(id, { signal: controller.signal });
        setPokemon(data);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setError('Erro ao carregar o Pokémon.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPokemon();
    return () => controller.abort();
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text, marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Header Superior */}
      <View style={styles.headerBetween}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerId}>#{String(pokemon.id).padStart(3, '0')}</Text>
      </View>

      {/* 2. Área do Pokémon (Hero) */}
      <View style={styles.pokemonHero}>
        <View style={styles.statRow} >
          {pokemon.sprites.front_default && (
          <Image 
            source={{ uri: pokemon.sprites.front_default }} 
            style={styles.image} 
            resizeMode="contain"
          />
          )}
          {pokemon.sprites.back_default && (
            <Image 
              source={{ uri: pokemon.sprites.back_default }} 
              style={styles.image} 
              resizeMode="contain"
            />
          )}
        </View>
        <Text style={styles.name}>{pokemon.name}</Text>
        
        <View style={styles.typeContainer}>
          {pokemon.types.map(({ type }) => (
            <View key={type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Card de Detalhes */}
      <View style={styles.infoCard}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Peso</Text>
              <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Altura</Text>
              <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Base</Text>
          {pokemon.stats.map((stat) => (
            <View key={stat.stat.name} style={styles.statRow}>
              <Text style={styles.statName}>
                {stat.stat.name.replace('special-', 'sp.').toUpperCase()}
              </Text>
              <Text style={styles.statValue}>{stat.base_stat}</Text>
              <View style={styles.statBarBg}>
                <View 
                  style={[
                    styles.statBarFill, 
                    { width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}