import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Exclude login and register APIs
    if (request.url.includes('/login') || request.url.includes('/register')) {
      return next.handle(request);
    }

    // Get the access token from service
    const accessToken = this.tokenService.getAuthToken();
    
    // Get loggedin user id
    const userData = this.userService.getCurrentUser();

    let modifiedRequest = request.clone({
      setHeaders: {
        'x-access-token': `${accessToken}`,
      },
    });

    if (request.url.includes('/getUserPhotos') || request.url.includes('/addPhoto')) {
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          'user-id': `${userData.id}`, 
        },
      });
    }
    
    return next.handle(modifiedRequest);
  }
}