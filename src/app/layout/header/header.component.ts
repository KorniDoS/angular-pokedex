import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { ToggleSidenavService } from '../../services/toggle-sidenav.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CatchMinigameService } from '../../services/catch-minigame.service';
import { CatchResultDialogComponent } from '../../components/catch-minigame-dialog/catch-minigame-dialog.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule, MatToolbarModule, MatIconModule, MatButtonModule],
})
export class HeaderComponent {
  public isToggled = false;

  public constructor(
    private readonly toggleSidenavService: ToggleSidenavService,
    private readonly catchService: CatchMinigameService,
    private readonly matDialog: MatDialog
  ) {}

  public onToggle() {
    this.isToggled = !this.isToggled;
    this.toggleSidenavService.toggled.next(this.isToggled);
  }

  public playMinigame(): void {
    const result = this.catchService.tryCatchRandomPokemon();

    if (!result) {
      return;
    }

    this.matDialog.open(CatchResultDialogComponent, {
      data: {
        pokemon: result.pokemon,
        caught: result.caught,
      },
    });
  }
}
