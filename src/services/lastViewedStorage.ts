import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_VIEWED_KEY = '@mypokedex/lastViewed:v1';
const MAX_HISTORY_SIZE = 15; 

export type ViewedPokemon = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  viewedAt: string;
};

// Busca a lista de últimos vistos
export async function getLastViewedPokemons(): Promise<ViewedPokemon[]> {
  try {
    const raw = await AsyncStorage.getItem(LAST_VIEWED_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ViewedPokemon[];
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
}

// Adiciona um Pokémon ao histórico (ou move para o topo se já existir)
export async function addLastViewed(pokemon: Omit<ViewedPokemon, 'viewedAt'>): Promise<ViewedPokemon[]> {
  try {
    const history = await getLastViewedPokemons();
    
    // Remove o Pokémon da lista caso ele já exista (para evitar duplicatas)
    const filteredHistory = history.filter((item) => item.id !== pokemon.id);

    // Cria o novo registro com a data/hora atual
    const newEntry: ViewedPokemon = {
      ...pokemon,
      viewedAt: new Date().toISOString(),
    };

    // Coloca o Pokémon mais recente no INÍCIO da lista e corta o array no limite máximo
    const updatedHistory = [newEntry, ...filteredHistory].slice(0, MAX_HISTORY_SIZE);

    await AsyncStorage.setItem(LAST_VIEWED_KEY, JSON.stringify(updatedHistory));
    
    return updatedHistory;
  } catch (error) {
    console.error('Erro ao salvar no histórico:', error);
    return [];
  }
}

// Limpa todo o histórico
export async function clearLastViewed(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LAST_VIEWED_KEY);
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
}