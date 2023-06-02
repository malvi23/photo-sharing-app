import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('An error occurred:', error);

        // Optionally, you can throw a custom error or re-throw the original error
        // throw new Error('Custom error message');
        // return throwError(error);

        // Rethrow the error to propagate it to the subscriber
        return throwError(error);
      })
    );
    // return next.handle(request);
  }
}
