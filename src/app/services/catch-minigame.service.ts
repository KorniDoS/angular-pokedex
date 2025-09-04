import { Injectable } from '@angular/core';
import { PokemonService } from './pokemon.service';
import { PokemonStorageService } from './pokemon-storage.service';
import { LocalStorageKeys } from '../enums/local-storage-keys.enum';
import { CatchMinigameResult } from '../interfaces/catch-minigame-result.interface';
import { EventBusService } from './event-bus.service';
import { EventBusEnum } from '../enums/event-bus.enum';
import { getRandomArrayElement } from '../utils/random.util';

@Injectable({ providedIn: 'root' })
export class CatchMinigameService {
  public constructor(
    private readonly pokemonService: PokemonService,
    private readonly storage: PokemonStorageService,
    private readonly eventBusService: EventBusService
  ) {}

  public tryCatchRandomPokemon(): CatchMinigameResult | null {
    const allIds = this.pokemonService.allPokemonsIds;

    if (!allIds || allIds.length === 0) {
      return null;
    }

    const randomId = getRandomArrayElement(allIds) as number;

    if (randomId == null) {
      return null;
    }

    const pokemon = this.pokemonService.allPokemons.find((p) => p.id === randomId);

    if (!pokemon) {
      return null;
    }

    const success = Math.random() < 0.5;

    if (success) {
      this.storage.addPokemon(LocalStorageKeys.CAUGHT_POKEMONS, pokemon);

      this.eventBusService.sendData({
        type: EventBusEnum.CATCH_MINIGAME_POKEMON,
        payload: pokemon,
      });
    }

    return { pokemon, caught: success };
  }
}
