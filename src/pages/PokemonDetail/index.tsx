// src/pages/PokemonDetail/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import { fetchPokemonDetail, fetchPokemonSpecies, type PokemonDetailResponse, type PokemonSpeciesResponse } from '../../services/pokeapi';
import { isFavorite, toggleFavorite } from '../../services/favoritesStorage';
import { addLastViewed } from '../../services/lastViewedStorage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCapturedPhotoUri } from '../../services/photoCache';

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C',
  ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3',
  psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC',
  dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD',
};

// Siglas curtas para deixar o layout de stats mais bonito
const STAT_ACRONYMS: Record<string, string> = {
  hp: 'HP', attack: 'ATK', defense: 'DEF', 'special-attack': 'SpA', 'special-defense': 'SpD', speed: 'SPD',
};

function getTypeColor(type: string) {
  return TYPE_COLORS[type] ?? '#A8A8A8';
}

export default function PokemonDetailScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<RouteProp<RootStackParamList, 'PokemonDetail'>>();
  const { id } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonDetail'>>();

  const [pokemon, setPokemon] = useState<PokemonDetailResponse | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  function handleOpenCamera() {
    navigation.navigate('PokemonCamera', { id });
  }

  useFocusEffect(
    useCallback(() => {
      const uri = getCapturedPhotoUri(id);
      setCapturedPhoto(uri);
    }, [id])
  );

  function getPokemonDescriptionFromSpecies(species: PokemonSpeciesResponse): string | null {
    const ptEntry = species.flavor_text_entries.find(entry => entry.language.name === 'pt-BR');
    if (ptEntry) return ptEntry.flavor_text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
    const enEntry = species.flavor_text_entries.find(entry => entry.language.name === 'en');
    if (enEntry) return enEntry.flavor_text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
    return null;
  }

  async function handleToggleFavorite() {
    if (!pokemon) return;
    const summary = {
      id: pokemon.id, name: pokemon.name,
      imageUrl: pokemon.sprites.front_default ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      types: pokemon.types.map((t) => t.type.name),
    };
    const updated = await toggleFavorite(summary);
    setFavorite(updated.some((item) => item.id === pokemon.id));
  }

  async function handleSharePokemon() {
    if (!pokemon) return;
    const pokeApiUrl = `https://www.pokemon.com/br/pokedex/${pokemon.id}/`;
    const message = `Olha esse Pokémon na Pokédex: ${pokemon.name} (#${String(pokemon.id).padStart(3, '0')})\n${pokeApiUrl}`;
    try {
      await Share.share({ message, title: `Pokémon: ${pokemon.name}` }, { subject: `Pokémon: ${pokemon.name}` });
    } catch (error) {
      console.warn('Erro ao compartilhar:', error);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    async function loadPokemon() {
      try {
        setIsLoading(true); setError(null);
        const [detail, species] = await Promise.all([
          fetchPokemonDetail(id, { signal: controller.signal }),
          fetchPokemonSpecies(id, { signal: controller.signal }),
        ]);
        setPokemon(detail);
        setDescription(getPokemonDescriptionFromSpecies(species));
        
        addLastViewed({
          id: detail.id, name: detail.name,
          imageUrl: detail.sprites.front_default ?? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`,
          types: detail.types.map((t) => t.type.name),
        });
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError('Não foi possível carregar os dados do pokémon!');
      } finally {
        setIsLoading(false);
      }
    }
    async function loadFavoriteStatus() {
      try {
        const result = await isFavorite(id);
        setFavorite(result);
      } finally {
        setFavoriteLoading(false);
      }
    }
    loadPokemon();
    loadFavoriteStatus();
    return () => { controller.abort(); };
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.text, fontWeight: '700' }}>Carregando Pokedéx...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text, marginBottom: 16, fontWeight: '700' }}>{error ?? 'Erro inesperado.'}</Text>
        <TouchableOpacity style={{ paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, backgroundColor: theme.colors.accent }} onPress={() => navigation.goBack()}>
          <Text style={{ color: theme.colors.text, fontWeight: '900' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Cor principal baseada no primeiro tipo do Pokémon para usar de tema
  const primaryTypeColor = getTypeColor(pokemon.types[0].type.name);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
        </View>

        <View style={styles.typeContainer}>
          {pokemon.types.map(({ type }) => (
            <View key={type.name} style={[styles.typeBadge, { backgroundColor: getTypeColor(type.name) }]}>
              <Text style={styles.typeText}>{type.name}</Text>
            </View>
          ))}
        </View>

        {pokemon.sprites.front_default ? (
          <View style={styles.imageContainer}>
             <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} resizeMode="contain"/>
          </View>
        ) : null}
      </View>
    
      {/* Container unificado de Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={handleToggleFavorite} 
          disabled={favoriteLoading} 
          style={[styles.actionButton, { backgroundColor: favorite ? '#FFCB05' : '#E5E7EB' }]}
        >
          <Text style={[styles.actionButtonText, { color: '#111827' }]}>
            {favorite ? '★ Favorito' : '☆ Favoritar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSharePokemon} style={[styles.actionButton, { backgroundColor: primaryTypeColor }]}>
          <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Compartilhar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOpenCamera} style={[styles.actionButton, { backgroundColor: '#111827' }]}>
          <Text style={[styles.actionButtonText, { color: '#FFF' }]}>📷 Câmera</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre o Pokémon</Text>
        <Text style={styles.sectionText}>{description ?? 'Descrição não disponível.'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ficha Física</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Base</Text>
        {pokemon.stats.map((stat) => {
          // Calcula a porcentagem para preencher a barra (max stats é em torno de 255)
          const fillPercentage = Math.min((stat.base_stat / 255) * 100, 100);
          // Muda a cor da barra dependendo se o status é bom ou ruim
          const barColor = stat.base_stat < 50 ? '#EF4444' : stat.base_stat < 80 ? '#F59E0B' : '#10B981';

          return (
            <View key={stat.stat.name} style={styles.statRow}>
              <Text style={styles.statName}>{STAT_ACRONYMS[stat.stat.name] || stat.stat.name}</Text>
              <Text style={styles.statValue}>{stat.base_stat}</Text>
              
              {/* Barra de Progresso do Status */}
              <View style={styles.statBarContainer}>
                <View style={[styles.statBarFill, { width: `${fillPercentage}%`, backgroundColor: barColor }]} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Foto da Câmera (Se existir) ganha destaque no final */}
      {capturedPhoto && (
        <View style={[styles.section, { borderColor: primaryTypeColor, borderWidth: 2 }]}>
          <Text style={styles.sectionTitle}>📸 Sua Foto Capturada</Text>
          <Image 
            source={{ uri: capturedPhoto }} 
            style={{ width: '100%', height: 300, resizeMode: 'cover', borderRadius: 16, marginTop: 8 }} 
          />
        </View>
      )}

      {/* Botão de Voltar Discreto no Final */}
      <TouchableOpacity 
        style={{ padding: 16, alignItems: 'center', marginTop: 10 }} 
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: theme.colors.textSecondary, fontWeight: '800', fontSize: 16 }}>Voltar para a lista</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}