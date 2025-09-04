export interface PokemonListResponse {
  count: number;
  results: { name: string; url: string }[];
}