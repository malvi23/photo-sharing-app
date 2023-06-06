import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable({
    providedIn: 'root',
  })
export class MockTokenService {
  private readonly ACCESS_TOKEN = 'access_token';
  private authToken: string | null = null;
  constructor(private cookieService: CookieService) {}

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }
}
