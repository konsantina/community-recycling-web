import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { DropoffService, DropoffListItem } from '../../../services/dropoff';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/navbar/confirm-dialog';

@Component({
  selector: 'app-my-dropoffs',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './my-dropoffs.html',
})
export class MyDropoffs implements OnInit {
  loading = true;
  error = '';

  items: DropoffListItem[] = [];

  displayedColumns: string[] = [
  'id',
  'materialName',
  'quantity',
  'unit',
  'status',
  'pointsAwarded',
  'createdAt',
  'actions',
];


  constructor(private dropoffs: DropoffService,private router: Router,
  private dialog: MatDialog,
  private snack: MatSnackBar,
) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';

    this.dropoffs.my().subscribe({
      next: (res) => {
        this.items = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error || 'Δεν μπόρεσα να φορτώσω τις καταχωρήσεις.';
        this.loading = false;
      },
    });
  }

  statusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Υπό έλεγχο'; // Recorded
      case 1:
        return 'Υπό έλεγχο'; // Flagged
      case 2:
        return 'Εγκρίθηκε'; // Verified
      case 3:
        return 'Απορρίφθηκε'; // Rejected
      default:
        return `Status ${status}`;
    }
  }

  statusChipColor(status: number): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 1:
        return 'primary';
      case 2:
        return 'warn';
      default:
        return 'accent';
    }
  }

  unitLabel(unit: number | string) {
    if (typeof unit === 'string') return unit;

    // ⚠️ Άλλαξέ το αν το enum σου είναι αλλιώς
    switch (unit) {
      case 0:
        return 'kg';
      case 1:
        return 'τεμ.';
      case 2:
        return 'lt';
      default:
        return unit.toString();
    }
  }

  pointsLabel(points: number, status: number) {
    if (status === 0) return '—';
    if (status === 1) return '—';
    return (points ?? 0).toString();
  }

  totalPoints() {
    return this.items
      .filter((x) => x.status === 1 || x.status === 2)
      .reduce((sum, x) => sum + (x.pointsAwarded || 0), 0);
  }

  canEditOrDelete(status: number): boolean {
    return status === 0 || status === 1; // Recorded ή Flagged
  }

  edit(x: DropoffListItem): void {
    if (!this.canEditOrDelete(x.status)) {
      this.snack.open('Δεν μπορείς να κάνεις edit μετά την έγκριση.', 'OK', { duration: 2500 });
      return;
    }

    this.router.navigate(['/dropoffs/edit', x.id]);
  }

  remove(x: DropoffListItem): void {
    if (!this.canEditOrDelete(x.status)) {
      this.snack.open('Δεν μπορείς να κάνεις delete μετά την έγκριση.', 'OK', { duration: 2500 });
      return;
    }

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Διαγραφή καταχώρησης',
        message: `Θες να σβήσεις την καταχώρηση #${x.id};`,
        confirmText: 'Delete',
        cancelText: 'Άκυρο',
      },
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;

      this.dropoffs.delete(x.id).subscribe({
        next: () => {
          this.snack.open(`Διαγράφηκε το #${x.id}`, 'OK', { duration: 2500 });
          this.load(); // ✅ ξαναφόρτωσε τη λίστα
        },
        error: (err) => {
          this.snack.open('Απέτυχε η διαγραφή.', 'OK', { duration: 3000 });
          console.error(err);
        },
      });
    });
  }
}
