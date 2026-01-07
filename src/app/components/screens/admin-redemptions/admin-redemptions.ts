import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../../services/auth';
import { PendingRedemption, Redemption, RedemptionService } from '../../../services/redemtion';
import { FormsModule } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-admin-redemptions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatToolbar
  ],
  templateUrl: './admin-redemptions.html',
  styleUrls: ['./admin-redemptions.css'],
})
export class AdminRedemptionsComponent implements OnInit {
  loading = false;
  items: PendingRedemption[] = [];

  busyId: number | null = null;

  // local input for fulfill code per item
  codes: Record<number, string> = {};

  constructor(
    private redemptionService: RedemptionService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.redemptionService.getPending().subscribe({
      next: (data) => {
        this.items = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.loading = false;
        this.snack.open('Αποτυχία φόρτωσης pending redemptions.', 'OK', { duration: 2500 });
      },
    });
  }

  approve(id: number): void {
    const adminId = this.auth.getUserIdFromToken();
    if (!adminId) return;

    this.busyId = id;
    this.redemptionService.approve(id, adminId).subscribe({
      next: () => {
        this.busyId = null;
        this.snack.open('Approved ✅', 'OK', { duration: 2000 });
        this.load();
      },
      error: () => {
        this.busyId = null;
        this.snack.open('Αποτυχία approve.', 'OK', { duration: 2500 });
      },
    });
  }

  reject(id: number): void {
    const adminId = this.auth.getUserIdFromToken();
    if (!adminId) return;

    this.busyId = id;
    this.redemptionService.reject(id, adminId).subscribe({
      next: () => {
        this.busyId = null;
        this.snack.open('Rejected ✅', 'OK', { duration: 2000 });
        this.load();
      },
      error: () => {
        this.busyId = null;
        this.snack.open('Αποτυχία reject.', 'OK', { duration: 2500 });
      },
    });
  }

  fulfill(id: number): void {
    const code = (this.codes[id] ?? '').trim();
    if (!code) {
      this.snack.open('Βάλε code για fulfill.', 'OK', { duration: 2500 });
      return;
    }

    this.busyId = id;
    this.redemptionService.fulfill(id, code).subscribe({
      next: () => {
        this.busyId = null;
        this.snack.open('Fulfilled ✅', 'OK', { duration: 2000 });
        this.load();
      },
      error: () => {
        this.busyId = null;
        this.snack.open('Αποτυχία fulfill.', 'OK', { duration: 2500 });
      },
    });
  }

  isBusy(id: number): boolean {
    return this.busyId === id;
  }

  goBack(): void {
    this.location.back();
  }

  statusText(s: any): string {
  if (s == null) return 'Unknown';

  // αν έρχεται number (enum) κάνε map εδώ
  if (typeof s === 'number') {
    // προσαρμόζεις ανάλογα με το δικό σου enum
    const map: Record<number, string> = {
      0: 'Pending',
      1: 'Approved',
      2: 'Fulfilled',
      3: 'Rejected',
    };
    return map[s] ?? String(s);
  }

  // αν έρχεται string
  return String(s);
}

statusClass(s: any): string {
  return this.statusText(s).trim().toLowerCase();
}

}
