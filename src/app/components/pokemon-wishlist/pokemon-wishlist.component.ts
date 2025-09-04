import { Component, OnInit } from '@angular/core';
import { GenericPokemonListComponent } from '../../shared/generic-pokemon-list/generic-pokemon-list.component';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { LocalStorageService } from '../../services/localstorage.service';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';
import { PokemonStorageService } from '../../services/pokemon-storage.service';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-wishlist',
  imports: [GenericPokemonListComponent],
  templateUrl: './pokemon-wishlist.component.html',
})
export class PokemonWishlistComponent implements OnInit {
  public wishlist: PokemonListItem[] = [];

  public constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly pokemonStorageService: PokemonStorageService,
    private readonly pokemonService: PokemonService
  ) {}

  public ngOnInit(): void {
    this.wishlist = this.localStorageService.getItem(LocalStorageKeys.WISHLIST_POKEMONS) ?? [];
  }

  public removeFromWishlist(id: number): void {
    this.wishlist = this.pokemonStorageService.removePokemon(
      LocalStorageKeys.WISHLIST_POKEMONS,
      id
    );
  }

  public moveToCaught(id: number): void {
    const pokemon = this.pokemonService.allPokemons.find((p) => p.id === id);

    if (pokemon) {
      this.pokemonStorageService.movePokemon(
        LocalStorageKeys.WISHLIST_POKEMONS,
        LocalStorageKeys.CAUGHT_POKEMONS,
        pokemon
      );
    }

    this.removeFromWishlist(id);
  }
}
