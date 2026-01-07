import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
import { MatToolbar } from '@angular/material/toolbar';

import { RewardService, RewardCreateRequest, Reward } from '../../../services/reward';

@Component({
  standalone: true,
  selector: 'app-admin-edit-reward',
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
  templateUrl: './admin-edit-reward.html',
  styleUrls: ['./admin-edit-reward.css'],
})
export class AdminEditRewardComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  loading = false;
  id!: number;

  constructor(
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.id) {
      this.snack.open('Λάθος id', 'OK', { duration: 2500 });
      return;
    }
    this.load();
  }

  load(): void {
    this.loading = true;

    this.rewardService.getById(this.id).subscribe({
      next: (r: Reward) => {
        this.loading = false;

        // προσοχή: αν παίρνεις string dates -> new Date(...)
        this.form.patchValue({
          title: r.title ?? '',
          description: r.description ?? '',
          costPoints: r.costPoints ?? 0,
          stock: r.stock ?? 0,
          validFrom: r.validFrom ? new Date(r.validFrom) : null,
          validTo: r.validTo ? new Date(r.validTo) : null,
          termsUrl: r.termsUrl ?? '',
          isActive: !!r.isActive,
        });
      },
      error: () => {
        this.loading = false;
        this.snack.open('Δεν βρέθηκε reward', 'OK', { duration: 2500 });
      },
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
      stock: Number(v.stock ?? 0),
      validFrom: this.toDateOnlyOrNull(v.validFrom),
      validTo: this.toDateOnlyOrNull(v.validTo),
      termsUrl: (v.termsUrl ?? '').trim() || null,
      isActive: !!v.isActive,
    };

    if (dto.validFrom && dto.validTo && dto.validFrom > dto.validTo) {
      this.snack.open('Το ValidFrom δεν μπορεί να είναι μετά το ValidTo.', 'OK', { duration: 3000 });
      return;
    }

    this.saving = true;

    this.rewardService.update(this.id, dto).subscribe({
      next: () => {
        this.saving = false;
        this.snack.open('Έγινε ενημέρωση ✅', 'OK', { duration: 2500 });
        this.location.back();
      },
      error: (err) => {
        this.saving = false;
        const msg =
          err?.status === 401 ? 'Χρειάζεται σύνδεση.' :
          err?.status === 403 ? 'Δεν έχεις δικαίωμα.' :
          'Αποτυχία ενημέρωσης.';
        this.snack.open(msg, 'OK', { duration: 3000 });
      }
    });
  }

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
