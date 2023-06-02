import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // private authToken: string | null = null;
  private readonly ACCESS_TOKEN = 'access_token';

  constructor(private cookieService: CookieService) {}

  setAuthToken(token: string): void {
    // this.authToken = token;
    this.cookieService.put(this.ACCESS_TOKEN, token);
  }

  getAuthToken(): string | undefined {
    // return this.authToken;
    return this.cookieService.get(this.ACCESS_TOKEN);
  }

  clearAuthToken(): void {
    // this.authToken = null;
    this.cookieService.remove(this.ACCESS_TOKEN);
  }
}
