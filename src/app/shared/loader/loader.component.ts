import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { LoaderService } from './loader.service';
import { GenericSpinnerComponent } from '../generic-spinner/generic-spinner.component';
import { CommonModule } from '@angular/common';
import { GenericSpinnerColor } from '../../enums/generic-spinner-color.enum';
import { GenericSpinnerMode } from '../../enums/generic-spinner-mode.enum';
import { GenericSpinnerConfig } from '../../interfaces/generic-spinner-config.interface';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  imports: [GenericSpinnerComponent, CommonModule],
})
export class LoaderComponent {
  public readonly isLoading$: Observable<boolean>;

  public readonly spinnerConfig: GenericSpinnerConfig = {
    color: GenericSpinnerColor.PRIMARY,
    mode: GenericSpinnerMode.INDETERMINATE,
    disableLoadingContainer: false,
  };

  public constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.isLoading;
  }
}
