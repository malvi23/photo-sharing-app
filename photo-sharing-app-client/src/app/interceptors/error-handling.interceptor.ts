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
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        let errorMsg = error.statusText;
        let err = new Error(error.message);
        console.log(err);

        // Handle the error based on its type
        if (error instanceof HttpErrorResponse) {
          // Handle HTTP errors
          console.log('HTTP error:', error);
          errorMsg = error.error.message;
        } else {
          // Handle other errors (e.g., client-side errors)
          console.log('Other error:', error);
          errorMsg = error.message;
        }
        this.toastr.error(errorMsg, '', { closeButton: true });
        return throwError(() => err);
        // return throwError(error);
      })
    );
  }
}
