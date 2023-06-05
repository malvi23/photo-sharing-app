import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { SpinnerService } from '../services/spinner.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private spinnerService: SpinnerService, private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    this.spinnerService.showSpinner()
    
    // Exclude login and register APIs
    if (request.url.includes('/login') || request.url.includes('/register')) {
      return next.handle(request);
    }

    // Get the access token from service
    const accessToken = this.tokenService.getAuthToken();

    if(!accessToken){
      this.router.navigate(['/login']).then((_) => false);
    }

    // Get loggedin user id
    const userData = this.userService.getCurrentUser();

    let modifiedRequest = request.clone({
      setHeaders: {
        'x-access-token': `${accessToken}`,
      },
    });

    if (
      request.url.includes('/getUserPhotos') ||
      request.url.includes('/addPhoto')
    ) {
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          'user-id': `${userData.id}`,
        },
      });
    }

    return next.handle(modifiedRequest).pipe(
      finalize(() => {
        this.spinnerService.hideSpinner();
      })
    );;
  }
}
