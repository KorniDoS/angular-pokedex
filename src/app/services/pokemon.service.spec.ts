import { PokemonService } from './pokemon.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

const mockResponse = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

describe('PokemonService', () => {
  let service: PokemonService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(PokemonService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all pokemons and populate _pokemons', (done) => {
    jest.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse));
    service.getAll().subscribe((data) => {
      expect(data).toEqual([
        { name: 'bulbasaur', id: 1 },
        { name: 'ivysaur', id: 2 },
      ]);
      expect(service.pokemons).toEqual([
        { name: 'bulbasaur', id: 1 },
        { name: 'ivysaur', id: 2 },
      ]);
      done();
    });
  });

  it('should not populate _pokemons if limit or offset is set', (done) => {
    jest.spyOn(httpClient, 'get').mockReturnValue(of(mockResponse));
    service.getAll(1, 1).subscribe((data) => {
      expect(service.pokemons).toEqual([]);
      done();
    });
  });

  it('should handle error and return empty array', (done) => {
    jest.spyOn(httpClient, 'get').mockReturnValueOnce({
      pipe: () => of([]),
    } as any);
    service.getAll().subscribe((data) => {
      expect(data).toEqual([]);
      done();
    });
  });

  it('should fetch one pokemon by id', (done) => {
    const mockPokemon = { name: 'bulbasaur', id: 1 };
    jest.spyOn(httpClient, 'get').mockReturnValue(of(mockPokemon));
    service.getOneById(1).subscribe((data) => {
      expect(data).toEqual(mockPokemon);
      done();
    });
  });
});
