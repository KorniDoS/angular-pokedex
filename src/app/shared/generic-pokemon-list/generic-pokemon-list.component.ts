import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PokemonListItem } from '../../interfaces/pokemon-list-item.interface';
import { NoDataComponent } from '../no-data-component/no-data.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-generic-pokemon-list',
  templateUrl: './generic-pokemon-list.component.html',
  imports: [MatCardModule, NoDataComponent, MatButtonModule, TitleCasePipe],
})
export class GenericPokemonListComponent {
  @Input() public pokemons: PokemonListItem[] = [];
  @Input() public showCatchButton: boolean = true;

  @Output() private readonly remove: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly move: EventEmitter<number> = new EventEmitter<number>();

  public movePokemon(pokemonId: number): void {
    if (!this.showCatchButton) {
      return;
    }

    this.move.emit(pokemonId);
  }

  public removePokemon(pokemonId: number): void {
    this.remove.emit(pokemonId);
  }
}
