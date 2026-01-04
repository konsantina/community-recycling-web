import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../services/auth'; // <-- βάλε το σωστό path

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.html',
})
export class RegisterComponent {
  get emailCtrl() {
    return this.form.get('email');
  }
  get passwordCtrl() {
    return this.form.get('password');
  }
  get confirmPasswordCtrl() {
    return this.form.get('confirmPassword');
  }

  loading = false;

  form!: FormGroup;

  hidePass = true;
  hideConfirm = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        displayName: ['', [Validators.required, Validators.minLength(2)]], // ✅
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const dto = {
      email: this.form.value.email!,
      password: this.form.value.password!,
      displayName: this.form.value.displayName!,
      // neighborhoodId: this.form.value.neighborhoodId!
    };

    this.auth.register(dto).subscribe({
      next: (res) => {
        this.loading = false;
        this.snack.open('Ο λογαριασμός δημιουργήθηκε. Κάνε login.', 'OK', { duration: 3000 });
        this.authService.saveToken(res.token);

        this.authService.saveToken(res.token);
        if (this.authService.isAdmin() || this.authService.isModerator?.()) {
          this.router.navigate(['admin/pending-dropoffs']);
        } else {
          this.router.navigate(['/my-dropoffs']);
        }
      },
      error: (err) => {
        this.loading = false;

        const backendErrors = err?.error?.errors;
        if (backendErrors?.DisplayName?.length) {
          this.snack.open(backendErrors.DisplayName[0], 'OK', { duration: 3500 });
          return;
        }
        this.snack.open('Απέτυχε η εγγραφή.', 'OK', { duration: 3500 });
      },
    });
  }

  get passwordMismatch(): boolean {
    return !!this.form.errors?.['passwordMismatch'];
  }
}
