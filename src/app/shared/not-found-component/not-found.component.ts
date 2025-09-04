import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  imports: [CommonModule, RouterModule, MatButtonModule],
})
export class NotFoundComponent {}
