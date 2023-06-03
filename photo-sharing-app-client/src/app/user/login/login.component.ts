import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

export interface LoggedInUser {
  //todo: define interface
  message: string;
  data: {
    email: string;
    password: string;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  login(): void {
    if (this.userForm.invalid) {
      return;
    }
    const data = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    };
    this.userService.loginUser(data).subscribe({
      next: (loggedInRes: any) => {
        if (loggedInRes.code) {
          //storing access token
          let authToken = loggedInRes.data.token;
          this.tokenService.setAuthToken(authToken);

          //storing loggedin user data
          this.userService.setCurrentUser({
            name: loggedInRes.data.name,
            email: loggedInRes.data.email,
            id: loggedInRes.data._id,
          });

          this.router.navigate(['/photos']).then((_) => false);
        }else{
          //todo: display error // loggedInRes.message
        }
      },
      error: (error) => {
        console.error(error);
        //todo: handle error using http interceptor
      },
    });
  }
}
