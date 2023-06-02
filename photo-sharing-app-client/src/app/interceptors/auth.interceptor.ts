import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get the access token from  service
    // const accessToken = AuthenticationService.getAccessToken();

    // const modifiedRequest = request.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${accessToken}`
    //   }
    // });

    // return next.handle(modifiedRequest);
    return next.handle(request);
  }
}
