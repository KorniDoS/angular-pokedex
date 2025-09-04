import { Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemons', pathMatch: 'full' },
  {
    path: 'pokemons',
    component: PokemonListComponent,
  },
  {
    path: 'pokemon/:id',
    component: PokemonDetailsComponent,
  },
  {
    path: 'caught',
    loadComponent: () =>
      import('./components/pokemon-caught-list/pokemon-caught-list.component').then(
        (m) => m.PokemonCaughtListComponent
      ),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./components/pokemon-wishlist/pokemon-wishlist.component').then(
        (m) => m.PokemonWishlistComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./shared/not-found-component/not-found.component').then((m) => m.NotFoundComponent),
  },
  { path: '**', redirectTo: '404' },
];
