import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './login.html'
})

export class LoginComponent {
  form!: FormGroup;
  error = '';

  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router,  private snack: MatSnackBar) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 login() {
  if (this.form.invalid) return;

  this.authService.login(
    this.form.value.email,
    this.form.value.password
  ).subscribe({
    next: (res) => {

      this.authService.saveToken(res.token);
      if (this.authService.isAdmin() || this.authService.isModerator?.()) {
        this.router.navigate(['admin/pending-dropoffs']);
      } else {
        this.router.navigate(['/my-dropoffs']);
      }
    },
    error: () => {
      this.snack.open('Λάθος στοιχεία σύνδεσης', 'OK', { duration: 3000 });
    }
  });
}

  
}
