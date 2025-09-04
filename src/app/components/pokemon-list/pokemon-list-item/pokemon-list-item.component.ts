import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../services/localstorage.service';
import { LocalStorageKeys } from '../../../enums/local-storage-keys.enum';
import { SnackbarService } from '../../../services/snackbar.service';
import { PokemonListItem } from '../../../interfaces/pokemon-list-item.interface';

@Component({
  selector: 'app-pokemon-list-item',
  templateUrl: 'pokemon-list-item.component.html',
  imports: [MatCardModule, MatButtonModule, TitleCasePipe, RouterModule, NgStyle],
})
export class PokemonListItemComponent {
  @Input({ required: true }) public pokemon!: PokemonListItem;
  @Input() public navigateOnClick: boolean = false;

  public constructor(
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
    private readonly snackbarService: SnackbarService
  ) {}

  public navigateToDetails(id: number): void {
    if (!this.navigateOnClick) {
      return;
    }
    this.router.navigate(['/pokemon', id]);
  }

  public addToWishlist(): void {
    const wishlist: PokemonListItem[] =
      this.localStorageService.getItem(LocalStorageKeys.WISHLIST_POKEMONS) ?? [];

    if (wishlist.find((pokemon) => pokemon.id === this.pokemon.id)) {
      this.snackbarService.info('Pokemon is already in wishlist');
      return;
    }

    wishlist.push(this.pokemon);
    this.localStorageService.setItem(LocalStorageKeys.WISHLIST_POKEMONS, wishlist);

    this.snackbarService.info(`Pokemon ${this.pokemon.name}#${this.pokemon.id} added to wishlist`);
  }

  public addToCaught(): void {
    const caught: PokemonListItem[] =
      this.localStorageService.getItem(LocalStorageKeys.CAUGHT_POKEMONS) ?? [];

    if (caught.find((pokemon) => pokemon.id === this.pokemon.id)) {
      this.snackbarService.info('Pokemon is already caught');
      return;
    }

    this.storeCaughtPokemonInStorage(this.pokemon);
    this.removeCaughtPokemonFromWishlist();
  }

  private storeCaughtPokemonInStorage(pokemon: PokemonListItem): void {
    const caught: PokemonListItem[] =
      this.localStorageService.getItem(LocalStorageKeys.CAUGHT_POKEMONS) ?? [];

    caught.push(pokemon);

    this.localStorageService.setItem(LocalStorageKeys.CAUGHT_POKEMONS, caught);

    this.removeCaughtPokemonFromWishlist();

    this.snackbarService.success(`Pokemon ${pokemon.name}#${pokemon.id} caught successfully`);
  }

  private removeCaughtPokemonFromWishlist(): void {
    const wishlist: PokemonListItem[] =
      this.localStorageService.getItem(LocalStorageKeys.WISHLIST_POKEMONS) ?? [];

    const pokemonWishlistIndex = wishlist.findIndex((pokemon) => pokemon.id === this.pokemon.id);

    if (pokemonWishlistIndex === -1) {
      return;
    }

    wishlist.splice(pokemonWishlistIndex, 1);
    this.localStorageService.setItem(LocalStorageKeys.WISHLIST_POKEMONS, wishlist);
  }

  public get isPokemonCaught(): boolean {
    const caught: PokemonListItem[] =
      this.localStorageService.getItem(LocalStorageKeys.CAUGHT_POKEMONS) ?? [];

    return !!caught.find((pokemon) => pokemon.id === this.pokemon.id);
  }

  public get canAddPokemonToWishlist(): boolean {
    const wishlist: PokemonListItem[] =
      this.localStorageService.getItem(LocalStorageKeys.WISHLIST_POKEMONS) ?? [];
    const caught: PokemonListItem[] =
      this.localStorageService.getItem(LocalStorageKeys.CAUGHT_POKEMONS) ?? [];

    return (
      !wishlist.find((pokemon) => pokemon.id === this.pokemon.id) &&
      !caught.find((pokemon) => pokemon.id === this.pokemon.id)
    );
  }
}
