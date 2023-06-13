import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoggedInUserReq, User } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.apiURL;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  removeCurrentUser() {
    localStorage.setItem('currentUser', '');
  }

  isAuthenticated() {
    if (this.tokenService.getAuthToken()) {
      return true;
    }
    return false;
  }

  loginUser(user: LoggedInUserReq) {
    return this.http.post(`${this.API_URL}login`, user);
  }

  registerUser(user: LoggedInUserReq) {
    return this.http.post(`${this.API_URL}register`, user);
  }

  logout(): void {
    this.tokenService.clearAuthToken();
    this.removeCurrentUser();
    this.router.navigate(['/login']).then((_) => false);
  }
}
