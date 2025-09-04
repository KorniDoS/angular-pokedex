import { Injectable } from '@angular/core';
import { PokemonService } from './pokemon.service';
import { PokemonStorageService } from './pokemon-storage.service';
import { LocalStorageKeys } from '../enums/local-storage-keys.enum';
import { POKEMONS_TOTAL_COUNT } from '../constants/pokemons-total-count.constant';
import { CatchMinigameResult } from '../interfaces/catch-minigame-result.interface';
import { EventBusService } from './event-bus.service';
import { EventBusEnum } from '../enums/event-bus.enum';

@Injectable({ providedIn: 'root' })
export class CatchMinigameService {
  public constructor(
    private readonly pokemonService: PokemonService,
    private readonly storage: PokemonStorageService,
    private readonly eventBusService: EventBusService
  ) {}

  public tryCatchRandomPokemon(): CatchMinigameResult | null {
    const randomId = Math.floor(Math.random() * POKEMONS_TOTAL_COUNT) + 1;
    const pokemon = this.pokemonService.pokemons.find((p) => p.id === randomId);

    if (!pokemon) {
      return null;
    }

    const success = Math.random() < 0.5;
    if (success) {
      this.storage.addPokemon(LocalStorageKeys.CAUGHT_POKEMONS, pokemon);
      console.log('s-a trimis');
      this.eventBusService.sendData({type: EventBusEnum.CATCH_MINIGAME_POKEMON, payload: pokemon});
    }

    return { pokemon, caught: success };
  }
}
