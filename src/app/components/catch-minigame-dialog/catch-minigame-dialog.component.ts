import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CatchMinigameResult } from '../../interfaces/catch-minigame-result.interface';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-catch-minigame-dialog',
  imports: [MatDialogModule, MatButtonModule, TitleCasePipe],
  templateUrl: './catch-minigame-dialog.component.html',
  styleUrls: ['./catch-minigame-dialog.component.scss'],
})
export class CatchResultDialogComponent {
  public constructor(@Inject(MAT_DIALOG_DATA) public readonly data: CatchMinigameResult) {}
}
