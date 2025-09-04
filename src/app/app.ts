import { Component, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { NgStyle, TitleCasePipe } from '@angular/common';
import { BaseComponent } from './shared/base-component/base-component.component';
import { NAVIGATION_LINKS } from './constants/navigation-links.constant';
import { SMALL_WIDTH_BREAKPOINT } from './constants/small-width-breakpoint.constant';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ToggleSidenavService } from './services/toggle-sidenav.service';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from './shared/loader/loader.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PokemonService } from './services/pokemon.service';
import { first } from 'rxjs';
import { LocalStorageService } from './services/localstorage.service';
import { LocalStorageKeys } from './enums/local-storage-keys.enum';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    HeaderComponent,
    MatSidenavModule,
    MatNavList,
    MatListItem,
    MatIconModule,
    LoaderComponent,
    FooterComponent,
    TitleCasePipe,
    NgStyle,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App extends BaseComponent implements OnInit {
  @HostListener('window:beforeunload')
  public setRefreshFlag(): void {
    this.localStorageService.setItem(LocalStorageKeys.REFRESH, true);
  }

  protected readonly title = signal('pokedex');
  public showSidenav: boolean = false;
  public isSmall: boolean = false;
  public readonly navigationLinks = NAVIGATION_LINKS;

  @ViewChild('sidenav') public sidenav!: MatSidenav;

  public constructor(
    private readonly toggleSidenavService: ToggleSidenavService,
    private readonly breakpointObs: BreakpointObserver,
    private readonly localStorageService: LocalStorageService,
    private readonly pokemonService: PokemonService
  ) {
    super();
  }

  public ngOnInit(): void {
    if (this.localStorageService.getItem(LocalStorageKeys.REFRESH)) {
      this.pokemonService.getAll().pipe(first()).subscribe();
      this.localStorageService.removeItem(LocalStorageKeys.REFRESH);
    }

    this.addSubscription(
      this.toggleSidenavService.toggled.subscribe((res: boolean) => {
        this.showSidenav = res;
      })
    );

    this.addSubscription(
      this.breakpointObs
        .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}em)`])
        .subscribe((state: BreakpointState) => {
          this.isSmall = state.matches;
          this.showSidenav = !state.matches;

          this.toggleSidenavService.toggled.next(this.showSidenav);
        })
    );
  }
}
