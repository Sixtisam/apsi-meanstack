import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  constructor(public authService: AuthService, private router: Router) {}

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService
      .createUser(form.value.email, form.value.password)
      .subscribe(() => {
        this.router.navigate(['login']);
      });
  }
}
