import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN = 'access_token';
  private API_URL = environment.apiURL;
  isIdle: any;
  TOKEN_EXPIRY_BUFFER_MINS = 5; //token refresh time is 5mins before expiration time

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  getDelay(token: string) {
    const bufferTime = this.TOKEN_EXPIRY_BUFFER_MINS * 60 * 1000;
    const decodedToken = this.jwtHelper.decodeToken(token);
    const tokenRefreshTimeStamp = decodedToken.exp * 1000 - bufferTime; // Convert Unix timestamp to JavaScript Date object
    const tokenRefreshTime = new Date(tokenRefreshTimeStamp).getTime();
    const currentTime = new Date().getTime();
    const delay = Math.abs(currentTime - tokenRefreshTime);
    return delay;
  }

  async setAuthToken(token: string): Promise<void> {
    this.cookieService.put(this.ACCESS_TOKEN, token);
    const delay = await this.getDelay(token);
    this.startRefreshTokenTimer(delay);
  }

  getAuthToken(): string | undefined {
    return this.cookieService.get(this.ACCESS_TOKEN);
  }

  clearAuthToken(): void {
    this.cookieService.remove(this.ACCESS_TOKEN);
  }

  refreshToken() {
    return this.http.get(`${this.API_URL}refreshToken`);
  }

  startRefreshTokenTimer(tokenExpiryTime: any) {
    setTimeout(() => {
      if (!this.isIdle) {
        this.refreshToken().subscribe({
          next: (token: any) => {
            console.log('refreshedToken: ', token);
            this.setAuthToken(token.data.refreshedToken);
          },
          error: (error) => {
            console.error(error);
          },
        });
      } else {
        /* Logout the user (cannot user UserService logout due to circular dependency) */
        this.logout();
      }
    }, tokenExpiryTime);
  }

  logout() {
    this.clearAuthToken();
    localStorage.setItem('currentUser', '');
    this.router.navigate(['/login']).then((_) => false);
  }
}
