import { Component, OnInit } from '@angular/core';

import { GenericPokemonListComponent } from '../../shared/generic-pokemon-list/generic-pokemon-list.component';
import { LocalStorageService } from '../../services/localstorage.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { PokemonService } from '../../services/pokemon.service';
import { POKEMONS_TOTAL_COUNT } from '../../constants/pokemons-total-count.constant';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';
import { MatButtonModule } from '@angular/material/button';
import { PokemonStorageService } from '../../services/pokemon-storage.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { BaseComponent } from '../../shared/base-component/base-component.component';
import { EventBusService } from '../../services/event-bus.service';
import { EventBusEnum } from '../../enums/event-bus.enum';
import { filter } from 'rxjs';

@Component({
  selector: 'app-pokemon-caught-list',
  imports: [GenericPokemonListComponent, MatButtonModule],
  templateUrl: './pokemon-caught-list.component.html',
})
export class PokemonCaughtListComponent extends BaseComponent implements OnInit {
  public caughtPokemons: PokemonListItem[] = [];

  public constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly pokemonService: PokemonService,
    private readonly pokemonStorageService: PokemonStorageService,
    private readonly loaderService: LoaderService,
    private readonly eventBusService: EventBusService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.caughtPokemons = this.localStorageService.getItem(LocalStorageKeys.CAUGHT_POKEMONS) ?? [];

    this.addSubscription(
      this.eventBusService
        .getData(EventBusEnum.CATCH_MINIGAME_POKEMON)
        .pipe(filter((data) => !!data.payload))
        .subscribe((data) => {
          const pokemon = data.payload as PokemonListItem;
          this.addToCaughtList(pokemon);
          this.caughtPokemons.push(pokemon);
        })
    );
  }

  public catchRandomPokemon(): void {
    this.loaderService.setLoading(true);
    const randomId = Math.floor(Math.random() * POKEMONS_TOTAL_COUNT) + 1;
    const pokemon = this.pokemonService.pokemons.find((p) => p.id === randomId);

    if (!pokemon) {
      this.loaderService.setLoading(false);
      return;
    }

    this.caughtPokemons.push(pokemon);
    this.addToCaughtList(pokemon);
    this.removeFromWishlist(pokemon.id);

    setTimeout(() => {
      this.loaderService.setLoading(false);
    }, 400);
  }

  public removeFromCaughtList(pokemonId: number): void {
    this.caughtPokemons = this.pokemonStorageService.removePokemon(
      LocalStorageKeys.CAUGHT_POKEMONS,
      pokemonId
    );
  }

  private removeFromWishlist(id: number): void {
    this.pokemonStorageService.removePokemon(LocalStorageKeys.WISHLIST_POKEMONS, id);
  }

  private addToCaughtList(pokemon: PokemonListItem): void {
    this.pokemonStorageService.addPokemon(LocalStorageKeys.CAUGHT_POKEMONS, pokemon);
  }
}
