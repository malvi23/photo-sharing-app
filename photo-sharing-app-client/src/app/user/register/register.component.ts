import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  userForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.userForm = new FormGroup({
    //   name: new FormControl('', [Validators.required]),
    //   email: new FormControl('', [Validators.required, Validators.email]),
    //   password: new FormControl('', Validators.required),
    // });
  }

  register(): void {
    if (this.userForm.invalid) {
      return;
    }
    const data = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    };
    this.userService.registerUser(data).subscribe({
      next: (registeredUserRes: any) => {
        let authToken = registeredUserRes.data.token;
        this.tokenService.setAuthToken(authToken);
        this.router.navigate(['/photos']).then((_) => false);
      },
      error: (error) => {
        console.error(error);
        //todo: handle error using http interceptor
      },
    });
  }
}
