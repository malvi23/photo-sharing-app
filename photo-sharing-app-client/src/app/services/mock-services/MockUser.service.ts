import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, LoginUser, RegisterUser } from '../user.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root',
})
export class MockUserService {
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}
  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  removeCurrentUser(): void {
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  loginUser(user:LoginUser): Observable<any> {
    console.log("In mock service loginUser");
    
    // Mock implementation for loginUser method
    return of({
      code: 200,
      data: {
        token: 'testAuthToken',
        name: 'Test User',
        email: 'test@test.com',
        _id: 'testUserId',
      },
    });
  }

  registerUser(user: RegisterUser): Observable<any> {
    // Mock implementation for registerUser method
    return of({ code: 200, data: {} });
  }

  logout(): void {
    this.currentUser = null;
  }
}
