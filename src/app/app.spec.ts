import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { App } from './app';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ToggleSidenavService } from './services/toggle-sidenav.service';
import { LocalStorageService } from './services/localstorage.service';
import { PokemonService } from './services/pokemon.service';

describe('AppComponent', () => {
  let component: App;
  let toggleSidenavService: ToggleSidenavService;
  let breakPointObserver: BreakpointObserver;
  let localStorageService: LocalStorageService;
  let pokemonService: PokemonService;

  const toggledSubject = new Subject<boolean>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        App,
        {
          provide: ToggleSidenavService,
          useValue: {
            toggled: toggledSubject,
          },
        },
        {
          provide: BreakpointObserver,
          useValue: {
            observe: jest.fn(() => of(null)),
          },
        },
        {
          provide: LocalStorageService,
          useValue: {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
          },
        },
        {
          provide: PokemonService,
          useValue: {
            getAll: jest.fn(() => of(null)),
          },
        },
      ],
    });

    component = TestBed.inject(App);

    toggleSidenavService = TestBed.inject(ToggleSidenavService);
    breakPointObserver = TestBed.inject(BreakpointObserver);
    localStorageService = TestBed.inject(LocalStorageService);
    pokemonService = TestBed.inject(PokemonService);

    jest.clearAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch pokemons ', () => {
      jest.spyOn(localStorageService, 'getItem').mockReturnValue(true);
      jest.spyOn(pokemonService, 'getAll').mockReturnValue(of([]));

      component.ngOnInit();

      expect(pokemonService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to ToggleSidenavService', () => {
      component.ngOnInit();

      toggledSubject.next(true);
      expect(component.showSidenav).toBe(true);
    });

    it('should subscribe to BreakpointObserver and set small screen state', () => {
      const mockState: BreakpointState = { matches: true, breakpoints: {} };
      jest.spyOn(breakPointObserver, 'observe').mockReturnValue(of(mockState));

      component.ngOnInit();

      expect(component.isSmall).toBe(true);
      expect(component.showSidenav).toBe(false);
    });
  });
});
