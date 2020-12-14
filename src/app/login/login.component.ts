import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading = false;


  constructor(public authservice: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.authservice
      .loginUser(form.value.email, form.value.password)
      .subscribe(() => {
        this.router.navigate(['']);
        this.loading = false;
      });
  }
}
