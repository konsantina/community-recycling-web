import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})

export class LoginComponent {
  form!: FormGroup;
  error = '';

  constructor(private fb: FormBuilder,private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    const { email, password } = this.form.controls;
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth.login(email.value, password.value).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigateByUrl('/my-dropoffs');
      },
      error: (err) => {
        this.error = err?.error || 'Login failed';
      }
    });
  }
  
}
