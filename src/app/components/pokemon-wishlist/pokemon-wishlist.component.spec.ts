import { TestBed } from '@angular/core/testing';
import { PokemonWishlistComponent } from './pokemon-wishlist.component';
import { LocalStorageService } from '../../services/localstorage.service';
import { PokemonStorageService } from '../../services/pokemon-storage.service';
import { PokemonService } from '../../services/pokemon.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';

describe('PokemonWishlistComponent', () => {
  let component: PokemonWishlistComponent;
  let localStorageService: LocalStorageService;
  let pokemonStorageService: PokemonStorageService;
  let pokemonService: PokemonService;

  const mockPokemon: PokemonListItem = { id: 1, name: 'bulbasaur' };
  const mockWishlist = [mockPokemon];

  beforeEach(() => {
    localStorageService = {
      getItem: jest.fn(),
    } as any;
    pokemonStorageService = {
      removePokemon: jest.fn(),
      movePokemon: jest.fn(),
    } as any;
    pokemonService = {
      pokemons: [mockPokemon],
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: PokemonStorageService, useValue: pokemonStorageService },
        { provide: PokemonService, useValue: pokemonService },
        PokemonWishlistComponent,
      ],
    });

    component = TestBed.inject(PokemonWishlistComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize wishlist from localStorage', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue(mockWishlist);
    component.ngOnInit();
    expect(component.wishlist).toEqual(mockWishlist);
  });

  it('should remove from wishlist', () => {
    jest.spyOn(pokemonStorageService, 'removePokemon').mockReturnValue([]);
    component.removeFromWishlist(1);
    expect(pokemonStorageService.removePokemon).toHaveBeenCalledWith(
      LocalStorageKeys.WISHLIST_POKEMONS,
      1
    );
    expect(component.wishlist).toEqual([]);
  });

  it('should move to caught if pokemon found', () => {
    component.wishlist = mockWishlist;
    component.moveToCaught(1);
    expect(pokemonStorageService.movePokemon).toHaveBeenCalledWith(
      LocalStorageKeys.WISHLIST_POKEMONS,
      LocalStorageKeys.CAUGHT_POKEMONS,
      mockPokemon
    );
    expect(pokemonStorageService.removePokemon).toHaveBeenCalledWith(
      LocalStorageKeys.WISHLIST_POKEMONS,
      1
    );
  });

  it('should not move to caught if pokemon not found', () => {
    Object.defineProperty(pokemonService, 'pokemons', { get: () => [] });
    component.moveToCaught(2);
    expect(pokemonStorageService.movePokemon).not.toHaveBeenCalled();
    expect(pokemonStorageService.removePokemon).toHaveBeenCalledWith(
      LocalStorageKeys.WISHLIST_POKEMONS,
      2
    );
  });
});
