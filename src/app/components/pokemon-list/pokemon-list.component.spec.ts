import { TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';
import { PageEvent } from '@angular/material/paginator';
import { of } from 'rxjs';
import { POKEMONS_TOTAL_COUNT } from '../../constants/pokemons-total-count.constant';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let pokemonService: jest.Mocked<PokemonService>;

  const mockPokemons: PokemonListItem[] = [
    { id: 1, name: 'bulbasaur' },
    { id: 2, name: 'ivysaur' },
    { id: 3, name: 'venusaur' },
  ];

  beforeEach(() => {
    pokemonService = {
      getAll: jest.fn(() => of(mockPokemons)),
    } as any;

    TestBed.configureTestingModule({
      providers: [{ provide: PokemonService, useValue: pokemonService }, PokemonListComponent],
    });

    component = TestBed.inject(PokemonListComponent);
    component.searchControl = new UntypedFormControl('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pokemons on ngOnInit', () => {
    component.ngOnInit();
    expect(pokemonService.getAll).toHaveBeenCalledWith(component.pageSize, 0);
    expect(component.pokemons.length).toBeGreaterThan(0);
  });


  it('should paginate pokemons', () => {
    component.ngOnInit();
    component.pageSize = 2;
    component.currentPage = 1;
    component.onPageChange({ pageIndex: 1, pageSize: 2, length: 3 } as PageEvent);
    expect(pokemonService.getAll).toHaveBeenCalledWith(2, 2);
    expect(component.pokemons).toEqual(mockPokemons);
  });

  it('should set totalPokemons to constant', () => {
    expect(component.totalPokemons).toBe(POKEMONS_TOTAL_COUNT);
  });
});
