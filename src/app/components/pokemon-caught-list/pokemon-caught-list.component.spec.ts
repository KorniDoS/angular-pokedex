import { TestBed } from '@angular/core/testing';
import { PokemonCaughtListComponent } from './pokemon-caught-list.component';
import { LocalStorageService } from '../../services/localstorage.service';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonStorageService } from '../../services/pokemon-storage.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { EventBusService } from '../../services/event-bus.service';
import { LocalStorageKeys } from '../../enums/local-storage-keys.enum';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';
import { Subject } from 'rxjs';

describe('PokemonCaughtListComponent', () => {
  let component: PokemonCaughtListComponent;
  let localStorageService: LocalStorageService;
  let pokemonService: PokemonService;
  let pokemonStorageService: PokemonStorageService;
  let loaderService: LoaderService;
  let eventBusService: EventBusService;

  const mockPokemon: PokemonListItem = { id: 1, name: 'bulbasaur' };
  const mockCaught = [mockPokemon];
  const eventBusSubject = new Subject<any>();

  beforeEach(() => {
    localStorageService = {
      getItem: jest.fn(),
    } as any;
    pokemonService = {
      pokemons: mockCaught,
      allPokemons: mockCaught,
      allPokemonsIds: [1],
    } as any;
    pokemonStorageService = {
      removePokemon: jest.fn(),
      addPokemon: jest.fn(),
    } as any;
    loaderService = {
      setLoading: jest.fn(),
    } as any;
    eventBusService = {
      getData: jest.fn(() => eventBusSubject.asObservable()),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: localStorageService },
        { provide: PokemonService, useValue: pokemonService },
        { provide: PokemonStorageService, useValue: pokemonStorageService },
        { provide: LoaderService, useValue: loaderService },
        { provide: EventBusService, useValue: eventBusService },
        PokemonCaughtListComponent,
      ],
    });

    component = TestBed.inject(PokemonCaughtListComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize caughtPokemons from localStorage', () => {
    jest.spyOn(localStorageService, 'getItem').mockReturnValue(mockCaught);
    component.ngOnInit();
    expect(component.caughtPokemons).toEqual(mockCaught);
  });

  it('should add to caughtPokemons on eventBus data', () => {
    component.ngOnInit();
    eventBusSubject.next({ payload: mockPokemon });
    expect(component.caughtPokemons).toContain(mockPokemon);
    expect(pokemonStorageService.addPokemon).toHaveBeenCalledWith(
      LocalStorageKeys.CAUGHT_POKEMONS,
      mockPokemon
    );
  });

  it('should catch random pokemon and add to caughtPokemons', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    component.caughtPokemons = [];
    component.catchRandomPokemon();
    expect(loaderService.setLoading).toHaveBeenCalledWith(true);
    expect(component.caughtPokemons).toContain(mockPokemon);
    expect(pokemonStorageService.addPokemon).toHaveBeenCalledWith(
      LocalStorageKeys.CAUGHT_POKEMONS,
      mockPokemon
    );
    expect(pokemonStorageService.removePokemon).toHaveBeenCalledWith(
      LocalStorageKeys.WISHLIST_POKEMONS,
      mockPokemon.id
    );
  });

  it('should not add to caughtPokemons if random pokemon not found', () => {
    Object.defineProperty(pokemonService, 'allPokemons', { get: () => [] });
    component.caughtPokemons = [];
    component.catchRandomPokemon();
    expect(loaderService.setLoading).toHaveBeenCalledWith(false);
    expect(component.caughtPokemons).toEqual([]);
  });

  it('should remove from caughtPokemons', () => {
    jest.spyOn(pokemonStorageService, 'removePokemon').mockReturnValue([]);
    component.removeFromCaughtList(1);
    expect(pokemonStorageService.removePokemon).toHaveBeenCalledWith(
      LocalStorageKeys.CAUGHT_POKEMONS,
      1
    );
    expect(component.caughtPokemons).toEqual([]);
  });
});
