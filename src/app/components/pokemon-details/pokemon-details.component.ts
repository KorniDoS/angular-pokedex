import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AsyncPipe, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Pokemon } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-details',
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    AsyncPipe,
    SlicePipe,
    TitleCasePipe,
    UpperCasePipe,
  ],
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent implements OnInit {
  public pokemon$!: Observable<Pokemon | null>;

  public constructor(
    private readonly pokemonService: PokemonService,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.pokemon$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id: number = +params.get('id')!;
        return this.pokemonService.getOneById(id);
      })
    );
  }
}
