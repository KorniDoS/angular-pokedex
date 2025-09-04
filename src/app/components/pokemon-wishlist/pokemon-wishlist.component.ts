import { Component, OnInit } from '@angular/core';
import { GenericPokemonListComponent } from '../../shared/generic-pokemon-list/generic-pokemon-list.component';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { LocalStorageService } from '../../services/localstorage.service';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-pokemon-wishlist',
  imports: [GenericPokemonListComponent],
  templateUrl: './pokemon-wishlist.component.html',
  styleUrls: ['./pokemon-wishlist.component.scss'],
})
export class PokemonWishlistComponent implements OnInit {
  public wishlist: PokemonListItem[] = [];

  public constructor(private readonly localStorageService: LocalStorageService, private readonly snackbarService: SnackbarService) {}

  public ngOnInit(): void {
    this.wishlist = this.localStorageService.getItem(LocalStorageKeys.WISHLIST_POKEMONS) ?? [];
  }

  public removeFromWishlist(id: number): void {
    this.wishlist = this.wishlist.filter((p) => p.id !== id);
    this.localStorageService.setItem(LocalStorageKeys.WISHLIST_POKEMONS, this.wishlist);
    this.snackbarService.warning(`Pokemon #${id} removed from wishlist`);
  }

  public moveToCaught(id: number): void {
    const pokemon = this.wishlist.find((p) => p.id === id);

    if (!pokemon) {
      return;
    }

    const caughtPokemons = this.localStorageService.getItem(LocalStorageKeys.CAUGHT_POKEMONS) ?? [];
    caughtPokemons.push(pokemon);
    this.localStorageService.setItem(LocalStorageKeys.CAUGHT_POKEMONS, caughtPokemons);

    this.snackbarService.success(`Pokemon ${pokemon.name}#${pokemon.id} moved to caught list`);

    this.removeFromWishlist(id);
  }
}
