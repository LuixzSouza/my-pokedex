import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes';
import { fetchPokemonListPage, type PokemonListItemUI } from '../../services/pokeapi';
import { getFavoriteIds, getFavoritePokemons } from '../../services/favoritesStorage';
import { getLastViewedPokemons } from '../../services/lastViewedStorage'; // <-- IMPORTANTE: Importamos a nova função

const PAGE_SIZE = 10;

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

function getTypeColor(type: string) {
  return TYPE_COLORS[type] ?? '#A8A8A8';
}

type ViewMode = 'all' | 'favorites' | 'history';

export default function PokemonListScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonList'>>();

  // Estado principal (Abas)
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // Dados da API (Todos)
  const [items, setItems] = useState<PokemonListItemUI[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados Locais (Favoritos)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<PokemonListItemUI[]>([]);
  
  // Dados Locais (Histórico)
  const [historyItems, setHistoryItems] = useState<PokemonListItemUI[]>([]);
  const [isLocalDataLoading, setIsLocalDataLoading] = useState(false);

  // Carrega os dados da API (Todos)
  async function loadInitial() {
    try {
      setError(null);
      setIsInitialLoading(true);
      const page = await fetchPokemonListPage(PAGE_SIZE, 0);
      setItems(page.items);
      setOffset(PAGE_SIZE);
      setHasNextPage(Boolean(page.next));
    } catch {
      setError('Falha ao carregar a lista de Pokémon.');
    } finally {
      setIsInitialLoading(false);
    }
  }

  async function loadMore() {
    if (viewMode !== 'all' || isLoadingMore || isInitialLoading || isRefreshing || !hasNextPage) return;
    try {
      setIsLoadingMore(true);
      const page = await fetchPokemonListPage(PAGE_SIZE, offset);
      setItems((prev) => [...prev, ...page.items]);
      setOffset((prev) => prev + PAGE_SIZE);
      setHasNextPage(Boolean(page.next));
    } catch {
      setError('Falha ao carregar mais Pokémon.');
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function refreshList() {
    try {
      setError(null);
      setIsRefreshing(true);
      const page = await fetchPokemonListPage(PAGE_SIZE, 0);
      setItems(page.items);
      setOffset(PAGE_SIZE);
      setHasNextPage(Boolean(page.next));
    } catch {
      setError('Falha ao atualizar a lista.');
    } finally {
      setIsRefreshing(false);
    }
  }

  // Carrega Favoritos e Histórico do AsyncStorage
  async function loadLocalData() {
    try {
      setIsLocalDataLoading(true);
      
      const [ids, favorites, history] = await Promise.all([
        getFavoriteIds(),
        getFavoritePokemons(),
        getLastViewedPokemons(),
      ]);

      setFavoriteIds(ids);
      
      setFavoriteItems(favorites.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        imageUrl: pokemon.imageUrl,
        types: pokemon.types,
      })));

      setHistoryItems(history.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        imageUrl: pokemon.imageUrl,
        types: pokemon.types,
      })));

    } finally {
      setIsLocalDataLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
  }, []);

  // Sempre que a tela voltar a ter foco (ex: voltar da tela de detalhes), recarrega os dados locais
  useFocusEffect(
    React.useCallback(() => {
      loadLocalData();
    }, [])
  );

  function handleLogout() {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }

  // Define qual lista será renderizada no FlatList
  const visibleItems = 
    viewMode === 'favorites' ? favoriteItems : 
    viewMode === 'history' ? historyItems : 
    items;

  const renderItem = ({ item }: { item: PokemonListItemUI }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PokemonDetail', { id: item.id })}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardName}>{item.name} {favoriteIds.includes(item.id) ? '★' : '☆'}</Text>
        <View style={styles.typeContainer}>
          {item.types.map((type) => (
            <View
              key={`${item.id}-${type}`}
              style={[styles.typeBadge, { backgroundColor: getTypeColor(type) }]}
            >
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
    </TouchableOpacity>
  );

  // Telas de Loading e Erro Iniciais
  if (isInitialLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando lista...</Text>
      </View>
    );
  }

  if (error && viewMode === 'all' && items.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text, marginBottom: 16 }}>{error}</Text>
      </View>
    );
  }

  if (viewMode !== 'all' && isLocalDataLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 }}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.buttonLogoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Botões de Filtro / Abas */}
      <View style={[styles.actionsRow, { flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }]}>
        <TouchableOpacity
          style={[
            styles.actionButton, 
            { backgroundColor: viewMode === 'all' ? theme.colors.primary : '#E5E7EB', paddingHorizontal: 12, borderRadius: 20 }
          ]}
          onPress={() => setViewMode('all')}
        >
          <Text style={[styles.actionButtonText, { color: viewMode === 'all' ? '#FFF' : '#111827', fontSize: 13 }]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton, 
            { backgroundColor: viewMode === 'favorites' ? '#FFCB05' : '#E5E7EB', paddingHorizontal: 12, borderRadius: 20 }
          ]}
          onPress={() => setViewMode('favorites')}
        >
          <Text style={[styles.actionButtonText, { color: '#111827', fontSize: 13 }]}>
            Favoritos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton, 
            { backgroundColor: viewMode === 'history' ? theme.colors.accent : '#E5E7EB', paddingHorizontal: 12, borderRadius: 20 }
          ]}
          onPress={() => setViewMode('history')}
        >
          <Text style={[styles.actionButtonText, { color: viewMode === 'history' ? '#FFF' : '#111827', fontSize: 13 }]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={viewMode === 'all' ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        onRefresh={viewMode === 'all' ? refreshList : undefined}
        refreshing={isRefreshing}
        ListEmptyComponent={
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 }}>
              {viewMode === 'favorites' && 'Você ainda não favoritou nenhum Pokémon.'}
              {viewMode === 'history' && 'Você ainda não visualizou nenhum Pokémon.'}
              {viewMode === 'all' && 'Nenhum Pokémon encontrado.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          viewMode === 'all' && hasNextPage && isLoadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
}