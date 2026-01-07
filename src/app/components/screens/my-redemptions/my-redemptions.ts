import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../services/auth';
import { Redemption, RedemptionService } from '../../../services/redemtion';
import { PointsService, PointsWallet, PointsLedgerItem } from '../../../services/points';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-my-redemptions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatToolbar
  ],
  templateUrl: './my-redemptions.html',
  styleUrls: ['./my-redemptions.css'],
})
export class MyRedemptionsComponent implements OnInit {
  loading = false;
  items: Redemption[] = [];

  wallet: PointsWallet | null = null;
  ledger: PointsLedgerItem[] = [];

  constructor(
    private redemptionService: RedemptionService,
    private pointsService: PointsService,
    private auth: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    const userId = this.auth.getUserIdFromToken();
    if (!userId) {
      this.items = [];
      this.wallet = null;
      this.ledger = [];
      return;
    }

    this.loading = true;

    // 1) redemptions
    this.redemptionService.getByUser(userId).subscribe({
      next: (data) => {
        this.items = (data ?? []).sort((a, b) =>
          (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
        );
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.loading = false;
      },
    });

    // 2) wallet
    this.pointsService.getMyWallet().subscribe({
      next: (w) => (this.wallet = w),
      error: () => (this.wallet = null),
    });

    // 3) ledger (π.χ. τελευταίες 30 μέρες, 20 κινήσεις)
    this.pointsService.getMyLedger(30, 20).subscribe({
      next: (list) => (this.ledger = list ?? []),
      error: () => (this.ledger = []),
    });
  }

  chipClass(status: string): string {
    switch (status) {
      case 'Approved': return 'approved';
      case 'Fulfilled': return 'fulfilled';
      case 'Rejected': return 'rejected';
      default: return 'pending';
    }
  }

  formatDate(iso?: string | null): string {
    if (!iso) return '-';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '-' : d.toLocaleString();
  }

  goBack(): void {
    this.location.back();
  }

  statusLabel(status: number | string): string {
  switch (status) {
    case 0:
    case 'Pending': return 'Σε αναμονή';
    case 1:
    case 'Approved': return 'Εγκρίθηκε';
    case 2:
    case 'Fulfilled': return 'Ολοκληρώθηκε';
    case 3:
    case 'Rejected': return 'Απορρίφθηκε';
    default: return '-';
  }
}

reasonLabel(reason: string | number | null | undefined): string {
  const r = (reason ?? '').toString();

  // αν σου έρχεται numeric enum
  switch (r) {
    case '0': return 'Καταχώρηση ανακύκλωσης';
    case '1': return 'Μπόνους ανακύκλωσης';
    case '2': return 'Εξαργύρωση (χρέωση)';
    case '3': return 'Επιστροφή εξαργύρωσης';
  }

  // αν σου έρχεται string
  switch (r) {
    case 'Dropoff': return 'Καταχώρηση ανακύκλωσης';
    case 'DropoffReward': return 'Μπόνους ανακύκλωσης';
    case 'RedemptionCost': return 'Εξαργύρωση (χρέωση)';
    case 'RedemptionRefund': return 'Επιστροφή εξαργύρωσης';
    default: return r || '-';
  }
}

}
