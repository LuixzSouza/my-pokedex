const BASE_URL = 'https://pokeapi.co/api/v2';

export type FetchOptions = {
  signal?: AbortSignal;
};

// --- Tipagens e Funções Originais ---

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export async function fetchPokemonList(
  limit = 20,
  offset = 0,
  options?: FetchOptions,
): Promise<PokemonListResponse> {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(url, { signal: options?.signal });

  if (!response.ok) {
    throw new Error('Falha ao buscar lista de Pokémon');
  }

  return response.json();
}

export type PokemonDetailResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
};

export async function fetchPokemonDetail(
  nameOrId: string | number,
  options?: FetchOptions,
): Promise<PokemonDetailResponse> {
  const url = `${BASE_URL}/pokemon/${nameOrId}`;
  const response = await fetch(url, { signal: options?.signal });

  if (!response.ok) {
    throw new Error('Falha ao buscar detalhes do Pokémon');
  }

  return response.json();
}

export type PokemonSpeciesResponse = {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }[];
};

export async function fetchPokemonSpecies(
  nameOrId: string | number,
  options?: FetchOptions,
): Promise<PokemonSpeciesResponse> {
  const url = `${BASE_URL}/pokemon-species/${nameOrId}`;
  const response = await fetch(url, { signal: options?.signal });

  if (!response.ok) {
    throw new Error('Erro ao buscar a espécie do Pokémon');
  }

  return response.json();
}

// --- Funções Adicionadas para a Tela de Lista ---

export type PokemonListItemUI = {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
};

export type PokemonListPageResponse = {
  items: PokemonListItemUI[];
  next: string | null;
};

export async function fetchPokemonListPage(
  limit = 10,
  offset = 0,
  options?: FetchOptions,
): Promise<PokemonListPageResponse> {
  // 1. Busca a lista básica com os limites e offsets (apenas nome e url)
  const listResponse = await fetchPokemonList(limit, offset, options);

  // 2. Para cada item da lista, busca os detalhes individuais para pegar ID, foto e tipos
  const itemsPromises = listResponse.results.map(async (basicPokemon) => {
    const detail = await fetchPokemonDetail(basicPokemon.name, options);
    
    return {
      id: detail.id,
      name: detail.name,
      // Fallback de imagem caso o front_default venha nulo
      imageUrl: 
        detail.sprites.front_default ?? 
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`,
      // Mapeia o array de objetos de tipo para um array simples de strings (ex: ['grass', 'poison'])
      types: detail.types.map((t) => t.type.name),
    } as PokemonListItemUI;
  });

  // Aguarda todas as requisições de detalhes finalizarem
  const items = await Promise.all(itemsPromises);

  return {
    items,
    next: listResponse.next,
  };
}