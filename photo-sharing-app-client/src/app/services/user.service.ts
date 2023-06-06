import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

//todo: implement interface from interfaces
export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  email: string;
  password: string;
}

export interface User {
  email: string;
  name: string;
  id: string;
}

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

  loginUser(user: LoginUser) {
    return this.http.post(`${this.API_URL}login`, user);
  }

  registerUser(user: RegisterUser) {
    return this.http.post(`${this.API_URL}register`, user);
  }

  logout(): void {
    this.tokenService.clearAuthToken();
    this.removeCurrentUser();
    this.router.navigate(['/login']).then((_) => false);
  }
}
