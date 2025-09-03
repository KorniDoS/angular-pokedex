import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  public constructor(private readonly toastr: ToastrService) {}

  public success(message: string, title?: string, options?: Partial<IndividualConfig<any>>) {
    this.toastr.success(message, title, options);
  }

  public error(message: string, title?: string, options?: Partial<IndividualConfig<any>>) {
    this.toastr.error(message, title, options);
  }

  public warning(message: string, title?: string, options?: Partial<IndividualConfig<any>>) {
    this.toastr.warning(message, title, options);
  }

  public info(message: string, title?: string, options?: Partial<IndividualConfig<any>>) {
    this.toastr.info(message, title, options);
  }
}
