/// <reference types="jasmine" />
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { Router, UrlTree } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loggedInRes: any;
  let mockUserService: any;
  let mockRouterService: any;
  let mockTokenService: any;

  beforeEach(async () => {
    loggedInRes = {
      code: 1,
      status: 'success',
      message: 'Loggedin successfully !',
      data: {
        _id: 'testUserId',
        name: 'Test User',
        email: 'test@gmail.com',
        token: 'testAuthToken',
      },
    };
    mockUserService = jasmine.createSpyObj('MockUserService', [
      'loginUser',
      'setCurrentUser',
    ]);
    mockRouterService = jasmine.createSpyObj('MockRouter', ['navigate']);
    mockTokenService = {
      setAuthToken: jasmine.createSpy('setAuthToken'),
      getAuthToken: jasmine
        .createSpy('getAuthToken')
        .and.returnValue('testAuthToken'),
      clearAuthToken: jasmine.createSpy('clearAuthToken'),
    };
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: Router, useValue: mockRouterService },
      ],
      imports: [ReactiveFormsModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the access token and navigate to "/photos" when login is successful', fakeAsync(() => {
    component.userForm.setValue({
      email: 'john@example.com',
      password: 'password',
    });

    // Creating spy objects
    const mockUserServiceSpy = mockUserService.loginUser.and.returnValue(
      of(loggedInRes)
    );
    const mockRouterSpy = mockRouterService.navigate.and.returnValue(
      Promise.resolve(false)
    );
    component.login();
    tick();
    expect(mockUserServiceSpy).toHaveBeenCalled();
    expect(mockRouterSpy).toHaveBeenCalledWith(['/photos']);
  }));

  it('should handle empty form values', fakeAsync(() => {
    component.userForm.setValue({
      email: null,
      password: 'test',
    });

    // Creating spy objects
    let mockUserServiceSpy = mockUserService.loginUser.and.returnValue(
      of(loggedInRes)
    );

    component.login();
    tick();

    expect(mockUserServiceSpy).not.toHaveBeenCalled();
  }));

  it('should handle invalid form values', fakeAsync(() => {
    component.userForm.setValue({
      email: "john",
      password: 'test',
    });

    // Creating spy objects
    let mockUserServiceSpy = mockUserService.loginUser.and.returnValue(
      of(loggedInRes)
    );

    component.login();
    tick();

    expect(mockUserServiceSpy).not.toHaveBeenCalled();
  }));

  it('should handle login errors', fakeAsync(() => {
    const error = new Error('Login error');
    let mockUserServiceSpy = mockUserService.loginUser.and.returnValue(
      throwError(error)
    );
    let mockrouterSpy = mockRouterService.navigate.and.returnValue(
      Promise.resolve(false)
    );

    component.userForm.setValue({
      email: 'failure@example.com',
      password: 'password',
    });
    component.login();
    tick();

    expect(mockUserServiceSpy).toHaveBeenCalled();
    expect(mockrouterSpy).not.toHaveBeenCalled();
  }));
});
