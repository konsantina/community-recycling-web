import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/navbar/confirm-dialog';
import { DropoffListItem, DropoffService } from '../../../services/dropoff';


@Component({
  selector: 'app-pending-dropoffs',
  standalone: true,
  imports: [
    CommonModule,

    // Material
    MatTableModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './pending-dropoffs.html',
})
export class PendingDropoffsComponent implements OnInit {
  items: DropoffListItem[] = [];

  loading = false;
  busyId: number | null = null;

  displayedColumns: string[] = [
    'id',
    'material',
    'neighborhood',
    'qty',
    'location',
    'createdAt',
    'actions',
  ];

  constructor(
    @Inject(DropoffService) private dropoffs: DropoffService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.dropoffs.pending().subscribe({
      next: (data: DropoffListItem[]) => {
        this.items = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snack.open('Απέτυχε η φόρτωση pending dropoffs.', 'OK', { duration: 3000 });
        console.error(err);
      },
    });
  }

  verify(x: DropoffListItem): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Επιβεβαίωση Dropoff',
        message: `Θες να κάνεις verify το dropoff #${x.id};`,
        confirmText: 'Verify',
        cancelText: 'Άκυρο',
      },
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;

      this.busyId = x.id;

      this.dropoffs.verify(x.id).subscribe({
        next: () => {
          this.busyId = null;
          this.snack.open(`Έγινε verify το #${x.id}`, 'OK', { duration: 2500 });
          this.load();
        },
        error: (err: any) => {
          this.busyId = null;
          this.snack.open('Απέτυχε το verify.', 'OK', { duration: 3000 });
          console.error(err);
        },
      });
    });
  }

  reject(x: DropoffListItem): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Απόρριψη Dropoff',
        message: `Θες να κάνεις reject το dropoff #${x.id};`,
        confirmText: 'Reject',
        cancelText: 'Άκυρο',
      },
    });

    ref.afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;

      this.busyId = x.id;

      this.dropoffs.reject(x.id).subscribe({
        next: () => {
          this.busyId = null;
          this.snack.open(`Έγινε reject το #${x.id}`, 'OK', { duration: 2500 });
          this.load();
        },
        error: (err: any) => {
          this.busyId = null;
          this.snack.open('Απέτυχε το reject.', 'OK', { duration: 3000 });
          console.error(err);
        },
      });
    });
  }

  unitLabel(unit: number | string): string {
    if (typeof unit === 'string') return unit;

    // άλλαξέ το με βάση το enum σου
    switch (unit) {
      case 0: return 'kg';
      case 1: return 'pcs';
      case 2: return 'lt';
      default: return `unit ${unit}`;
    }
  }
}
