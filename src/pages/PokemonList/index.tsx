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

export default function PokemonListScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonList'>>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pokemonListData, setPokemonListData] = useState<PokemonListItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAllPokemon() {
      try {
        setIsLoading(true);
        setError(null);

        const listResponse = await fetchPokemonList(20, 0, { signal: controller.signal });

        const detailedPromises = listResponse.results.map(async (p) => {
          const detail = await fetchPokemonDetail(p.name, { signal: controller.signal });
          return {
            id: detail.id,
            name: detail.name,
            imageUrl: detail.sprites.front_default || '', 
            types: detail.types.map(t => t.type.name)
          };
        });

        const fullData = await Promise.all(detailedPromises);
        setPokemonListData(fullData);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setError('Erro ao carregar Pokédex');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadAllPokemon();
    return () => controller.abort();
  }, []);

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const renderItem = ({ item }: { item: PokemonListItem }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8} 
      onPress={() => navigation.navigate('PokemonDetail', { id: item.id })}
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

  if (isLoading) {
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

      <FlatList
        data={pokemonListData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}