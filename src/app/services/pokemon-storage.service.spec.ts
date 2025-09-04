import { PokemonStorageService } from './pokemon-storage.service';
import { LocalStorageService } from './localstorage.service';
import { LocalStorageKeys } from '../enums/local-storage-keys.enum';
import { PokemonListItem } from '../interfaces/pokemon-list-item.interface';
import { TestBed } from '@angular/core/testing';
import { provideToastr } from 'ngx-toastr';

describe('PokemonStorageService', () => {
  let service: PokemonStorageService;
  let localStorageService: LocalStorageService;

  const key = LocalStorageKeys.CAUGHT_POKEMONS;
  const pokemon: PokemonListItem = { id: 1, name: 'bulbasaur' };
  const pokemon2: PokemonListItem = { id: 2, name: 'ivysaur' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LocalStorageService,
          useValue: {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
          },
        },
        provideToastr(),
      ],
    });
    service = TestBed.inject(PokemonStorageService);
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get list from localStorage', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue([pokemon]);
    expect(service.getList(key)).toEqual([pokemon]);
  });

  it('should save list to localStorage', () => {
    service.saveList(key, [pokemon]);
    expect(localStorageService.setItem).toHaveBeenCalledWith(key, [pokemon]);
  });

  it('should add pokemon if not present', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue([]);
    const result = service.addPokemon(key, pokemon);
    expect(result).toEqual([pokemon]);
    expect(localStorageService.setItem).toHaveBeenCalledWith(key, [pokemon]);
  });

  it('should not add pokemon if already present', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue([pokemon]);
    const result = service.addPokemon(key, pokemon);
    expect(result).toEqual([pokemon]);
    expect(localStorageService.setItem).not.toHaveBeenCalledWith(key, [pokemon, pokemon]);
  });

  it('should remove pokemon by id', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue([pokemon, pokemon2]);
    const result = service.removePokemon(key, 1);
    expect(result).toEqual([pokemon2]);
    expect(localStorageService.setItem).toHaveBeenCalledWith(key, [pokemon2]);
  });

  it('should move pokemon between lists', () => {
    jest.spyOn(service, 'addPokemon').mockReturnValue([pokemon]);
    jest.spyOn(service, 'removePokemon').mockReturnValue([]);
    service.movePokemon(LocalStorageKeys.WISHLIST_POKEMONS, key, pokemon);
    expect(service.addPokemon).toHaveBeenCalledWith(key, pokemon);
    expect(service.removePokemon).toHaveBeenCalledWith(
      LocalStorageKeys.WISHLIST_POKEMONS,
      pokemon.id
    );
  });
});
