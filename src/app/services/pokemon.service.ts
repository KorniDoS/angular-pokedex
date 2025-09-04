// src/app/core/services/pokemon.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { POKEMONS_TOTAL_COUNT } from '../constants/pokemons-total-count.constant';
import { PokemonListItem } from '../interfaces/pokemon-list-item.interface';
import { PokemonListResponse } from '../interfaces/pokemon-list-response.interface';
import { Pokemon } from '../interfaces/pokemon.interface';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  private _allPokemons: PokemonListItem[] = [];

  public get allPokemons(): PokemonListItem[] {
    return [...this._allPokemons];
  }

  private set allPokemons(pokemons: PokemonListItem[]) {
    this._allPokemons = pokemons;
  }

  public get allPokemonsIds(): number[] {
    return this.allPokemons.map((p) => p.id);
  }

  public constructor(private http: HttpClient) {}

  public getAll(
    limit: number = POKEMONS_TOTAL_COUNT,
    offset: number = 0
  ): Observable<PokemonListItem[]> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        map((res) =>
          res.results.map((p) => {
            const id = Number(
              p.url
                .split('/')
                .filter((value) => !!value)
                .pop()
            );
            return { name: p.name, id };
          })
        ),
        tap((data) => {
          //? we want to store all the pokemons, not some of them
          if (limit !== POKEMONS_TOTAL_COUNT || offset > 0) {
            return;
          }

          this.allPokemons = data;
        }),
        catchError(() => of([]))
      );
  }

  public getOneById(id: number): Observable<Pokemon | null> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`).pipe(catchError(() => of(null)));
  }
}
