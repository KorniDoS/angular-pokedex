import { TestBed } from '@angular/core/testing';
import { PokemonListItemComponent } from './pokemon-list-item.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/localstorage.service';
import { PokemonStorageService } from '../../../services/pokemon-storage.service';
import { LocalStorageKeys } from '../../../enums/local-storage-keys.enum';
import { PokemonListItem } from '../../../interfaces/pokemon-list-item.interface';

describe('PokemonListItemComponent', () => {
  let component: PokemonListItemComponent;
  let router: Router;
  let localStorageService: LocalStorageService;
  let pokemonStorageService: PokemonStorageService;

  const mockPokemon: PokemonListItem = { id: 1, name: 'bulbasaur' };

  beforeEach(() => {
    router = { navigate: jest.fn() } as any;
    localStorageService = {
      getItem: jest.fn(),
    } as any;
    pokemonStorageService = {
      addPokemon: jest.fn(),
      removePokemon: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: PokemonStorageService, useValue: pokemonStorageService },
        PokemonListItemComponent,
      ],
    });

    component = TestBed.inject(PokemonListItemComponent);
    component.pokemon = mockPokemon;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to details if navigateOnClick is true', () => {
    component.navigateOnClick = true;
    component.navigateToDetails(1);
    expect(router.navigate).toHaveBeenCalledWith(['/pokemon', 1]);
  });

  it('should not navigate to details if navigateOnClick is false', () => {
    component.navigateOnClick = false;
    component.navigateToDetails(1);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should add to wishlist', () => {
    component.addToWishlist();
    expect(pokemonStorageService.addPokemon).toHaveBeenCalledWith(
      LocalStorageKeys.WISHLIST_POKEMONS,
      mockPokemon
    );
  });

  it('should add to caught and remove from wishlist', () => {
    jest.spyOn(component as any, 'removeCaughtPokemonFromWishlist');
    component.addToCaught();
    expect(pokemonStorageService.addPokemon).toHaveBeenCalledWith(
      LocalStorageKeys.CAUGHT_POKEMONS,
      mockPokemon
    );
    expect((component as any).removeCaughtPokemonFromWishlist).toHaveBeenCalled();
  });

  it('should remove caught pokemon from wishlist', () => {
    component['removeCaughtPokemonFromWishlist']();
    expect(pokemonStorageService.removePokemon).toHaveBeenCalledWith(
      LocalStorageKeys.WISHLIST_POKEMONS,
      mockPokemon.id
    );
  });

  it('should return true for isPokemonCaught if pokemon is in caught list', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue([mockPokemon]);
    expect(component.isPokemonCaught).toBe(true);
  });

  it('should return false for isPokemonCaught if pokemon is not in caught list', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue([]);
    expect(component.isPokemonCaught).toBe(false);
  });

  it('should return true for canAddPokemonToWishlist if not in wishlist or caught', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue([]);
    expect(component.canAddPokemonToWishlist).toBe(true);
  });

  it('should return false for canAddPokemonToWishlist if in wishlist', () => {
    jest.spyOn(localStorageService, 'getItem').mockImplementation((key) => {
      if (key === LocalStorageKeys.WISHLIST_POKEMONS) return [mockPokemon];
      return [];
    });
    expect(component.canAddPokemonToWishlist).toBe(false);
  });

  it('should return false for canAddPokemonToWishlist if in caught', () => {
    jest.spyOn(localStorageService, 'getItem').mockImplementation((key) => {
      if (key === LocalStorageKeys.CAUGHT_POKEMONS) return [mockPokemon];
      return [];
    });
    expect(component.canAddPokemonToWishlist).toBe(false);
  });
});
