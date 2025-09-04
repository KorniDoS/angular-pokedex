import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  public constructor(private readonly snackbarService: SnackbarService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackbarService.error(error.message || 'An unknown error occurred!');

        return throwError(() => error);
      })
    );
  }
}
