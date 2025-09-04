import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, startWith, tap } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PokemonService } from '../../services/pokemon.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NoDataComponent } from '../../shared/no-data-component/no-data.component';
import { PokemonListItemComponent } from './pokemon-list-item/pokemon-list-item.component';
import { BaseComponent } from '../../shared/base-component/base-component.component';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';
import { POKEMONS_TOTAL_COUNT } from '../../constants/pokemons-total-count.constant';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    NoDataComponent,
    PokemonListItemComponent,
  ],
})
export class PokemonListComponent extends BaseComponent implements OnInit, OnDestroy {
  public pokemons: PokemonListItem[] = [];
  public searchControl: UntypedFormControl = new UntypedFormControl('');
  public pageSize: number = 20;
  public currentPage: number = 0;

  public readonly totalPokemons = POKEMONS_TOTAL_COUNT;

  public constructor(private readonly pokemonService: PokemonService) {
    super();
  }

  public ngOnInit(): void {
    this.loadPage();

    this.addSubscription(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          startWith(''),
          tap(() => {
            this.currentPage = 0;
            this.loadPage();
          })
        )
        .subscribe()
    );
  }

  public onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadPage();
  }

  private loadPage(): void {
    const search = this.searchControl.value?.toLowerCase() || '';

    this.addSubscription(
      this.pokemonService
        .getAll(this.pageSize, this.currentPage * this.pageSize)
        .subscribe((data) => {
          let filtered = data;

          if (search) {
            filtered = filtered.filter((p) => p.name.toLowerCase().includes(search));

            if (filtered.length === 0) {
              filtered = this.pokemonService.pokemons
                .filter((p) => p.name.toLowerCase().includes(search))
                .slice(0, this.pageSize);
            }
          }

          this.pokemons = filtered;
        })
    );
  }
}
