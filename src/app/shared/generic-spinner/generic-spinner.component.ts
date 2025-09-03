import { NgClass } from '@angular/common';
import { GenericSpinnerConfig } from '../../interfaces/generic-spinner-config.interface';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-generic-spinner',
  templateUrl: './generic-spinner.component.html',
  imports: [MatProgressSpinnerModule, NgClass],
  styleUrls: ['./generic-spinner.component.scss'],
})
export class GenericSpinnerComponent {
  @Input({ required: true }) spinnerConfig?: GenericSpinnerConfig;
}
