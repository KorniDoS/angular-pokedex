import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoaderService } from '../shared/loader/loader.service';

@Injectable()
export class LoadingHttpInterceptor implements HttpInterceptor {
  public constructor(private readonly loaderService: LoaderService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.setLoading(true);

    return next
      .handle(request)
      .pipe(
        catchError((err) => {
          this.loaderService.setLoading(false);
          return err;
        })
      )
      .pipe(
        map((evt: any) => {
          if (evt instanceof HttpResponse) {
            //? Due to the fact that requests finish almost instantly, we add a small delay before hiding the loader
            setTimeout(() => {
              this.loaderService.setLoading(false);
            }, 400);
          }
          return evt;
        })
      );
  }
}
