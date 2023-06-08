import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { Router, UrlTree } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RegisterComponent } from './register.component';
import { ToastrService } from 'ngx-toastr';

class MockRouter {
  navigate(url: string | UrlTree): Promise<boolean> {
    // Mock implementation for navigate method
    return Promise.resolve(true);
  }
}

fdescribe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registredUserRes: any;
  let mockUserService: any;
  let mockRouterService: any;
  let mockTokenService: any;
  let mockToastrService: any;
  // let mockUserServiceSpy: any;
  // let mockRouterServiceSpy: any;
  // let mockTokenService: any;

  beforeEach(async () => {
    registredUserRes = {
      code: 1,
      status: 'success',
      message: 'Registreed successfully !',
      data: {
        _id: 'testUserId',
        name: 'Test User',
        email: 'test@gmail.com',
        token: 'testAuthToken',
      },
    };
    mockUserService = jasmine.createSpyObj('MockUserService', [
      'registerUser',
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
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success']);
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: Router, useValue: mockRouterService },
        { provide: ToastrService, useValue: mockToastrService },
      ],
      imports: [ReactiveFormsModule, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the access token and navigate to "/photos" when register is successful', fakeAsync(() => {
    component.userForm.setValue({
      name: 'test33',
      email: 'john@example.com',
      password: 'password',
    });

    // Creating spy objects
    let mockUserServiceSpy = mockUserService.registerUser.and.returnValue(
      of(registredUserRes)
    );
    let mockrouterSpy = mockRouterService.navigate.and.returnValue(
      Promise.resolve(false)
    );
    component.register();
    tick();

    fixture.detectChanges();
    tick();
    expect(mockUserServiceSpy).toHaveBeenCalled();
    expect(mockrouterSpy).toHaveBeenCalledWith(['/photos']);
  }));

  it('should handle empty form values', fakeAsync(() => {
    component.userForm.setValue({
      name: '',
      email: null,
      password: 'test',
    });

    // Creating spy objects
    let mockUserServiceSpy = mockUserService.registerUser.and.returnValue(
      of(registredUserRes)
    );

    component.register();
    tick();

    fixture.detectChanges();
    tick();

    expect(mockUserServiceSpy).not.toHaveBeenCalled();
  }));

  it('should handle invalid form values', fakeAsync(() => {
    component.userForm.setValue({
      name: '',
      email: 'john',
      password: '1234',
    });

    // Creating spy objects
    let mockUserServiceSpy = mockUserService.registerUser.and.returnValue(
      of(registredUserRes)
    );

    component.register();
    tick();

    fixture.detectChanges();
    tick();

    expect(mockUserServiceSpy).not.toHaveBeenCalled();
  }));

  it('should handle register errors', fakeAsync(() => {
    const error = new Error('Register error');
    const errorResponse = {
      code: 500,
      message: 'Registration failed',
    };
    let mockUserServiceSpy = mockUserService.registerUser.and.returnValue(
      throwError(error)
    );
    let mockrouterSpy = mockRouterService.navigate.and.returnValue(
      Promise.resolve(false)
    );

    component.userForm.setValue({
      name: 'John',
      email: 'failure@example.com',
      password: 'password',
    });
    component.register();
    tick();

    expect(mockUserServiceSpy).toHaveBeenCalled();
    expect(mockrouterSpy).not.toHaveBeenCalled();
  }));
});
