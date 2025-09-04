import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../services/localstorage.service';
import { LocalStorageKeys } from '../../../enums/local-storage-keys.enum';
import { PokemonListItem } from '../../../interfaces/pokemon-list-item.interface';
import { PokemonStorageService } from '../../../services/pokemon-storage.service';

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
    private readonly pokemonStorageService: PokemonStorageService
  ) {}

  public navigateToDetails(id: number): void {
    if (!this.navigateOnClick) {
      return;
    }
    this.router.navigate(['/pokemon', id]);
  }

  public addToWishlist(): void {
    this.pokemonStorageService.addPokemon(LocalStorageKeys.WISHLIST_POKEMONS, this.pokemon);
  }

  public addToCaught(): void {
    this.pokemonStorageService.addPokemon(LocalStorageKeys.CAUGHT_POKEMONS, this.pokemon);

    this.removeCaughtPokemonFromWishlist();
  }

  private removeCaughtPokemonFromWishlist(): void {
    this.pokemonStorageService.removePokemon(LocalStorageKeys.WISHLIST_POKEMONS, this.pokemon.id);
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
