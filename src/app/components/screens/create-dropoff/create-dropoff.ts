import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { DropoffService } from '../../../services/dropoff';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-create-dropoff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './create-dropoff.html'
})
export class CreateDropoffComponent implements OnInit {
  error = '';
  loading = false;
  form!: FormGroup;
  // προσωρινά “στατικά” για να δουλέψει σήμερα
  // μετά θα τα φέρνουμε από API (materials/neighborhoods)
  materials = [
    { id: 1002, name: 'Πλαστικό' },
    { id: 1003, name: 'Χαρτί' },
    { id: 1004, name: 'Γυαλί' }
  ];

  neighborhoods = [
    { id: 1003, name: 'Κέντρο' },
    { id: 1004, name: 'Νέα Ιωνία' },
    { id: 1005, name: 'Αγία Παρασκευή' },
    { id: 1006, name: 'Καλλιθέα' },
  ];

  units = [
    { value: 0, label: 'kg' },
    { value: 1, label: 'τεμ.' },
    { value: 2, label: 'lt' }
  ];


  constructor(
    private fb: FormBuilder,
    private dropoffs: DropoffService,
    private auth: AuthService,
    private router: Router
  ) {
    
  this.form = this.fb.group({
    materialId: [null as any, Validators.required],
    neighborhoodId: [null as any, Validators.required],
    quantity: [null as any, [Validators.required, Validators.min(0.01)]],
    unit: [0, Validators.required],
    location: ['', [Validators.required, Validators.minLength(2)]]
  });
  }

  
  ngOnInit(): void {}

  submit() {
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.auth.getUserIdFromToken();
    if (!userId) {
      this.error = 'Δεν βρέθηκε user στο token. Κάνε login ξανά.';
      return;
    }
    const { materialId, neighborhoodId, quantity, unit, location} = this.form.controls;

    const dto = {
      userId,
      materialId: materialId.value,
      neighborhoodId: neighborhoodId.value,
      quantity: Number(quantity.value),
      unit: Number(unit.value),
      location: location.value
    };

    this.loading = true;
    
    this.dropoffs.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/my-dropoffs');
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error || 'Αποτυχία καταχώρησης.';
      }
    });
  }
}
