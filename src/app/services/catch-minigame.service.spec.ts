import { provideToastr } from 'ngx-toastr';
import { CatchMinigameService } from './catch-minigame.service';
import { PokemonService } from './pokemon.service';
import { TestBed } from '@angular/core/testing';

const mockPokemon = { id: 1, name: 'bulbasaur' };

describe('CatchMinigameService', () => {
  let service: CatchMinigameService;
  let pokemonService: PokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PokemonService,
          useValue: {
            pokemons: [mockPokemon],
          } as any,
        },
        provideToastr(),
      ],
    });
    service = TestBed.inject(CatchMinigameService);
    pokemonService = TestBed.inject(PokemonService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return null if no pokemon found', () => {
    Object.defineProperty(pokemonService, 'pokemons', { value: [] });
    const result = service.tryCatchRandomPokemon();
    expect(result).toBeNull();
  });
});
