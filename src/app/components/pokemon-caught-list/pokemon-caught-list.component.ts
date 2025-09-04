import { Component, OnInit } from '@angular/core';

import { GenericPokemonListComponent } from '../../shared/generic-pokemon-list/generic-pokemon-list.component';
import { LocalStorageService } from '../../services/localstorage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { PokemonService } from '../../services/pokemon.service';
import { POKEMONS_TOTAL_COUNT } from '../../constants/pokemons-total-count.constant';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../services/snackbar.service';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-pokemon-caught-list',
  imports: [GenericPokemonListComponent, MatButtonModule],
  templateUrl: './pokemon-caught-list.component.html',
  styleUrls: ['./pokemon-caught-list.component.scss'],
})
export class PokemonCaughtListComponent implements OnInit {
  public caughtPokemons: PokemonListItem[] = [];

  public constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly pokemonService: PokemonService,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: SnackbarService
  ) {}

  public ngOnInit(): void {
    this.caughtPokemons = this.localStorageService.getItem(LocalStorageKeys.CAUGHT_POKEMONS) ?? [];
  }

  public catchRandomPokemon(): void {
    this.loaderService.setLoading(true);
    const randomId = Math.floor(Math.random() * POKEMONS_TOTAL_COUNT) + 1;
    const pokemon = this.pokemonService.pokemons?.find((p) => p.id === randomId);

    if (!pokemon) {
      this.loaderService.setLoading(false);
      return;
    }

    this.caughtPokemons.push(pokemon);
    this.localStorageService.setItem(LocalStorageKeys.CAUGHT_POKEMONS, this.caughtPokemons);
    this.removeFromWishlist(pokemon.id);

    setTimeout(() => {
      this.loaderService.setLoading(false);
    }, 400);
  }

  public removeFromCaughtList(pokemonId: number): void {
    this.caughtPokemons = this.caughtPokemons.filter((p) => p.id !== pokemonId);
    this.localStorageService.setItem(LocalStorageKeys.CAUGHT_POKEMONS, this.caughtPokemons);
  }

  public removeFromWishlist(id: number): void {
    let wishlist: PokemonListItem[] =
      this.localStorageService.getItem(LocalStorageKeys.WISHLIST_POKEMONS) ?? [];

    if (!wishlist.find((pokemon) => pokemon.id === id)) {
      return;
    }

    wishlist = wishlist.filter((p) => p.id !== id);
    this.localStorageService.setItem(LocalStorageKeys.WISHLIST_POKEMONS, wishlist);
    this.snackbarService.warning(`Pokemon #${id} removed from wishlist`);
  }
}
