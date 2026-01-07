import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

import { Reward, RewardService } from '../../../services/reward';

@Component({
  standalone: true,
  selector: 'app-admin-rewards',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbar,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: './admin-rewards.html',
  styleUrls: ['./admin-rewards.css'],
})
export class AdminRewardsComponent implements OnInit {
  loading = false;
  deletingId: number | null = null;

  data: Reward[] = [];
  displayedColumns = ['title', 'costPoints', 'stock', 'status', 'valid', 'actions'];

  constructor(
    private rewardService: RewardService,
    private snack: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    // ΘΑ χρειαστεί service method: getAllAdmin()
    this.rewardService.getAll().subscribe({
      next: (rows) => {
        this.data = rows ?? [];
        this.loading = false;
      },
      error: () => {
        this.data = [];
        this.loading = false;
        this.snack.open('Αποτυχία φόρτωσης rewards.', 'OK', { duration: 2500 });
      },
    });
  }

  delete(id: number): void {
    if (!id) return;

    const ok = confirm('Σίγουρα θέλεις διαγραφή αυτού του reward;');
    if (!ok) return;

    this.deletingId = id;

    this.rewardService.delete(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.data = this.data.filter(x => x.id !== id);
        this.snack.open('Διαγράφηκε ✅', 'OK', { duration: 2000 });
      },
      error: (err) => {
        this.deletingId = null;
        const msg =
          err?.status === 401 ? 'Χρειάζεται σύνδεση.' :
          err?.status === 403 ? 'Δεν έχεις δικαίωμα.' :
          'Δεν μπορεί να διαγραφεί: υπάρχουν εξαργυρώσεις για αυτό το reward.';
        this.snack.open(msg, 'OK', { duration: 3000 });
      }
    });
  }

  stockLabel(r: Reward): string {
    if (r.stock === null || r.stock === undefined) return '∞';
    return String(r.stock);
  }

  statusLabel(r: Reward): string {
    const now = Date.now();
    const from = r.validFrom ? new Date(r.validFrom).getTime() : null;
    const to = r.validTo ? new Date(r.validTo).getTime() : null;

    if (!r.isActive) return 'Ανενεργό';
    if (r.stock !== null && r.stock !== undefined && r.stock <= 0) return 'Εξαντλήθηκε';
    if (to !== null && to < now) return 'Έχει λήξει';
    if (from !== null && from > now) return 'Δεν είναι διαθέσιμο ακόμα';
    return 'Ενεργό';
  }

  statusClass(r: Reward): string {
    const s = this.statusLabel(r);
    if (s === 'Ενεργό') return 'st-active';
    if (s === 'Ανενεργό') return 'st-inactive';
    if (s === 'Εξαντλήθηκε') return 'st-out';
    if (s === 'Έχει λήξει') return 'st-expired';
    return 'st-soon';
  }

  goBack(): void {
    this.location.back();
  }
}
