import { Injectable } from '@angular/core';
import { LocalStorageKeys } from '../enums/local-storage-keys.enum';
import { PokemonListItem } from '../interfaces/pokemon-list-item.interface';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonStorageService {
  public constructor(private readonly localStorageService: LocalStorageService) {}

  public getList(key: LocalStorageKeys): PokemonListItem[] {
    return this.localStorageService.getItem(key) ?? [];
  }

  public saveList(key: LocalStorageKeys, pokemons: PokemonListItem[]): void {
    this.localStorageService.setItem(key, pokemons);
  }

  public addPokemon(key: LocalStorageKeys, pokemon: PokemonListItem): PokemonListItem[] {
    const list = this.getList(key);

    if (!list.find((p) => p.id === pokemon.id)) {
      list.push(pokemon);
      this.saveList(key, list);
    }

    return list;
  }

  public removePokemon(key: LocalStorageKeys, id: number): PokemonListItem[] {
    let list = this.getList(key);
    list = list.filter((p) => p.id !== id);
    this.saveList(key, list);
    return list;
  }

  public movePokemon(
    fromKey: LocalStorageKeys,
    toKey: LocalStorageKeys,
    pokemon: PokemonListItem
  ): void {
    this.addPokemon(toKey, pokemon);

    this.removePokemon(fromKey, pokemon.id);
  }
}
