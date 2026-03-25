import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LogOut } from 'lucide-react-native';

import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { RootStackParamList } from '../../routes';
import { fetchPokemonDetail, fetchPokemonList } from '../../services/pokeapi';

type PokemonListItem = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
};

const PAGE_SIZE = 20;

export default function PokemonListScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonList'>>();

  const [pokemonListData, setPokemonListData] = useState<PokemonListItem[]>([]);
  
  // Estados de controle da paginação
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Função auxiliar para buscar detalhes após buscar a lista base
  const fetchDetailedPage = async (currentOffset: number, signal?: AbortSignal) => {
    const listResponse = await fetchPokemonList(PAGE_SIZE, currentOffset, { signal });
    
    const detailedPromises = listResponse.results.map(async (p) => {
      const detail = await fetchPokemonDetail(p.name, { signal });
      return {
        id: detail.id,
        name: detail.name,
        imageUrl: detail.sprites.front_default || '', 
        types: detail.types.map(t => t.type.name)
      };
    });

    const fullData = await Promise.all(detailedPromises);
    return {
      data: fullData,
      hasNext: !!listResponse.next,
    };
  };

  const loadInitial = async () => {
    try {
      setError(null);
      setIsInitialLoading(true);
      const { data, hasNext } = await fetchDetailedPage(0);
      setPokemonListData(data);
      setOffset(PAGE_SIZE);
      setHasNextPage(hasNext);
    } catch (e) {
      setError('Falha ao carregar a lista de Pokémon.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || isInitialLoading || isRefreshing || !hasNextPage) return;
    try {
      setIsLoadingMore(true);
      const { data, hasNext } = await fetchDetailedPage(offset);
      setPokemonListData((prev) => [...prev, ...data]);
      setOffset((prev) => prev + PAGE_SIZE);
      setHasNextPage(hasNext);
    } catch (e) {
      // Falha silenciosa ou log para não travar a lista
      console.log('Falha ao carregar mais Pokémon.', e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const refreshList = async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      const { data, hasNext } = await fetchDetailedPage(0);
      setPokemonListData(data);
      setOffset(PAGE_SIZE);
      setHasNextPage(hasNext);
    } catch (e) {
      setError('Falha ao atualizar a lista.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitial();
    // Você pode colocar lógica de abort controller aqui se necessário para cleanup
  }, []);

  const handleLogout = () => {
    // Atenção: Garanta que "Login" exista no seu RootStackParamList
    navigation.reset({ index: 0, routes: [{ name: "Login" } as any] });
  };

  const renderItem = ({ item }: { item: PokemonListItem }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8} 
      onPress={() => navigation.navigate('PokemonDetail', { id: item.id } as any)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <Text style={styles.cardName}>{item.name}</Text>
      <View style={styles.typeContainer}>
        {item.types.map((type) => (
          <View key={type} style={styles.typeBadge}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  if (isInitialLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <LogOut size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {error ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>{error}</Text>
            <TouchableOpacity onPress={loadInitial} style={{ marginTop: 10 }}>
               <Text style={{ color: theme.colors.primary }}>Tentar Novamente</Text>
            </TouchableOpacity>
         </View>
      ) : (
        <FlatList
          data={pokemonListData}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Propriedades para Infinite Scroll:
          onEndReached={loadMore}
          onEndReachedThreshold={0.5} // Aciona a busca quando chegar na metade do final
          ListFooterComponent={renderFooter}
          // Propriedades para Refreshing (puxar para baixo):
          refreshing={isRefreshing}
          onRefresh={refreshList}
        />
      )}
    </View>
  );
}