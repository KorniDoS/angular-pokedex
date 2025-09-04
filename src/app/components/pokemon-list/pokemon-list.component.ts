import { Component, OnInit, OnDestroy } from '@angular/core';

import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PokemonService } from '../../services/pokemon.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NoDataComponent } from '../../shared/no-data-component/no-data.component';
import { PokemonListItemComponent } from './pokemon-list-item/pokemon-list-item.component';
import { BaseComponent } from '../../shared/base-component/base-component.component';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';

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
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent extends BaseComponent implements OnInit, OnDestroy {
  public pokemons: PokemonListItem[] = [];
  public searchControl: UntypedFormControl = new UntypedFormControl('');
  public pageSize = 20;
  public currentPage = 0;
  public totalPokemons = 0;

  public constructor(private readonly pokemonService: PokemonService) {
    super();
  }

  public ngOnInit(): void {
    this.addSubscription(
      this.pokemonService.getAll().subscribe(this.updateDisplayedPokemons.bind(this))
    );

    this.addSubscription(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          startWith(''),
          tap(() => {
            this.currentPage = 0;
            this.updateDisplayedPokemons();
          })
        )
        .subscribe()
    );
  }

  public onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.updateDisplayedPokemons();
  }

  private updateDisplayedPokemons(): void {
    const search = this.searchControl.value?.toLowerCase() || '';

    let filtered = this.allPokemons;

    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search));
    }

    this.totalPokemons = filtered.length;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pokemons = filtered.slice(start, end);
  }

  public get allPokemons(): PokemonListItem[] {
    return this.pokemonService.pokemons;
  }
}
