import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
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
  protected readonly title = signal('pokedex');
  public showSidenav: boolean = false;
  public isSmall: boolean = false;
  public readonly navigationLinks = NAVIGATION_LINKS;

  @ViewChild('sidenav') public sidenav!: MatSidenav;

  public constructor(
    private toggleSidenavService: ToggleSidenavService,
    private breakpointObs: BreakpointObserver
  ) {
    super();
  }

  public ngOnInit(): void {
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
