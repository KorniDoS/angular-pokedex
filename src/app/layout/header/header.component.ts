import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToggleSidenavService } from '../../services/toggle-sidenav.service';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule, MatToolbarModule, MatIconModule, MatButtonModule],
})
export class HeaderComponent {
  public isToggled = false;

  public constructor(private readonly toggleSidenavService: ToggleSidenavService) {}

  public onToggle() {
    this.isToggled = !this.isToggled;
    this.toggleSidenavService.toggled.next(this.isToggled);
  }
}
