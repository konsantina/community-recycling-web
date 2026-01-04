import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DropoffListItem, DropoffService, DropoffUpdateDto } from '../../../services/dropoff';


type Option = { id: number; name: string };

@Component({
  selector: 'app-edit-dropoff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit-dropoff.html',
})
export class EditDropoffComponent implements OnInit {
  id!: number;
  form!: FormGroup
  loading = false;
  saving = false;

  // ⚠️ προσωρινά options (αν δεν έχεις endpoints)
  // Αν έχεις MaterialService/NeighborhoodService, τα κουμπώνουμε μετά.
  materials: Option[] = [
    { id: 1003, name: 'Χαρτί' },
    { id: 1004, name: 'Γυαλί' },
  ];

  neighborhoods: Option[] = [
    { id: 1004, name: 'Νέα Ιωνία' },
    { id: 1005, name: 'Άγια Παρασκευή' },
  ];

  // unit mapping (βάλε τα δικά σου)
  units = [
    { value: 0, label: 'kg' },
    { value: 1, label: 'pcs' },
    { value: 2, label: 'lt' },
  ];

  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dropoffs: DropoffService,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
    materialId: [null as number | null, Validators.required],
    neighborhoodId: [null as number | null, Validators.required],
    quantity: [null as number | null, [Validators.required, Validators.min(0.001)]],
    unit: [null as number | null, Validators.required],
    location: ['', [Validators.required, Validators.minLength(2)]],
  });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(idParam);

    if (!this.id) {
      this.snack.open('Λάθος id.', 'OK', { duration: 2500 });
      this.router.navigate(['/my-dropoffs']);
      return;
    }

    this.load();
  }

  private canEdit(status: number): boolean {
    return status === 0 || status === 1; // Recorded ή Flagged
  }

  load(): void {
    this.loading = true;

    this.dropoffs.getById(this.id).subscribe({
      next: (x: DropoffListItem) => {
        this.loading = false;

        if (!this.canEdit(x.status)) {
          this.snack.open('Δεν επιτρέπεται edit μετά την έγκριση.', 'OK', { duration: 3000 });
          this.router.navigate(['/my-dropoffs']);
          return;
        }

        this.form.patchValue({
          materialId: x.materialId,
          neighborhoodId: x.neighborhoodId,
          quantity: Number(x.quantity),
          unit: typeof x.unit === 'string' ? 0 : (x.unit as number), // αν έρχεται number είσαι οκ
          location: x.location,
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.snack.open('Απέτυχε η φόρτωση του dropoff.', 'OK', { duration: 3000 });
        console.error(err);
        this.router.navigate(['/my-dropoffs']);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const dto: DropoffUpdateDto = {
      materialId: this.form.value.materialId!,
      neighborhoodId: this.form.value.neighborhoodId!,
      quantity: Number(this.form.value.quantity),
      unit: Number(this.form.value.unit),
      location: this.form.value.location!,
    };

    this.dropoffs.update(this.id, dto).subscribe({
      next: () => {
        this.saving = false;
        this.snack.open('Αποθηκεύτηκε.', 'OK', { duration: 2500 });
        this.router.navigate(['/my-dropoffs']);
      },
      error: (err: any) => {
        this.saving = false;
        this.snack.open('Απέτυχε η αποθήκευση.', 'OK', { duration: 3000 });
        console.error(err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/my-dropoffs']);
  }
}
