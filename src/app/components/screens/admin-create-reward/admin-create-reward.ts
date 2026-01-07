import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { RewardService, RewardCreateRequest } from '../../../services/reward';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-admin-create-reward',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbar,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './admin-create-reward.html',
  styleUrls: ['./admin-create-reward.css'],
})
export class AdminCreateRewardComponent {
  form!: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private rewardService: RewardService,
    private snack: MatSnackBar,
    private location: Location
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(300)]],
      costPoints: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      validFrom: [null],
      validTo: [null],
      termsUrl: ['', [Validators.maxLength(200)]],
      isActive: [true],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    const dto: RewardCreateRequest = {
      title: (v.title ?? '').trim(),
      description: (v.description ?? '').trim() || null,
      costPoints: Number(v.costPoints ?? 0),
      stock: v.stock === '' ? null : v.stock ?? null,
      // ✅ date-only για να μην σου αλλάζει μέρα/ώρα λόγω UTC
      validFrom: this.toDateOnlyOrNull(v.validFrom),
      validTo: this.toDateOnlyOrNull(v.validTo),
      termsUrl: (v.termsUrl ?? '').trim() || null,
      isActive: !!v.isActive,
    };

    // ✅ check date range (string compare works for YYYY-MM-DD)
    if (dto.validFrom && dto.validTo && dto.validFrom > dto.validTo) {
      this.snack.open('Το ValidFrom δεν μπορεί να είναι μετά το ValidTo.', 'OK', {
        duration: 3000,
      });
      return;
    }

    this.saving = true;

    // ✅ περιμένουμε full response από service (observe: 'response')
    this.rewardService.create(dto).subscribe({
      next: (res: any) => {
        this.saving = false;

        // χρήσιμο για debugging
        console.log('CREATE REWARD status:', res?.status ?? '(no status)');
        console.log('CREATE REWARD body:', res?.body ?? res);

        this.snack.open('Reward δημιουργήθηκε ✅', 'OK', { duration: 2500 });

        this.form.reset({
          title: '',
          description: '',
          costPoints: 0,
          stock: null,
          validFrom: null,
          validTo: null,
          termsUrl: '',
          isActive: true,
        });
      },
      error: (err) => {
        this.saving = false;

        const backendMsg =
          typeof err?.error === 'string'
            ? err.error
            : err?.error?.message
            ? err.error.message
            : err?.message
            ? err.message
            : '';

        const msg =
          err?.status === 0
            ? 'Δεν υπάρχει σύνδεση με το API (CORS/HTTPS).'
            : err?.status === 400
            ? backendMsg || 'Bad Request.'
            : err?.status === 401
            ? 'Χρειάζεται σύνδεση.'
            : err?.status === 403
            ? 'Δεν έχεις δικαίωμα.'
            : err?.status === 500
            ? 'Server error: ' + (backendMsg || 'δες το backend console')
            : 'Σφάλμα: ' + (backendMsg || err?.status);

        this.snack.open(msg, 'OK', { duration: 4000 });
      },
    });
  }

  // ✅ returns "YYYY-MM-DD" (date only)
  private toDateOnlyOrNull(d: any): string | null {
    if (!d) return null;
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return null;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${y}-${m}-${day}`;
  }

  goBack(): void {
    this.location.back();
  }
}
