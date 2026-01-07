import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Reward, RewardService } from '../../../services/reward';
import { RedemptionService } from '../../../services/redemtion';
import { AuthService } from '../../../services/auth';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './rewards.html',
  styleUrls: ['./rewards.css'],
})
export class RewardsComponent implements OnInit {
  rewards: Reward[] = [];
  loading = false;
  redeemedIds = new Set<number>();

  redeemingId: number | null = null;

  constructor(
    @Inject(RewardService) private rewardService: RewardService,
    @Inject(RedemptionService) private redemptionService: RedemptionService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadRewards();
    this.loadMyRedemptions();
  }

  loadRewards(): void {
    this.loading = true;

    this.rewardService.getAll().subscribe({
      next: (data) => {
        this.rewards = data ?? [];
        this.loading = false;
      },
      error: () => {
        this.rewards = [];
        this.loading = false;
        this.snackBar.open('Αποτυχία φόρτωσης rewards.', 'OK', { duration: 2500 });
      },
    });
  }

  redeem(reward: Reward): void {
    if (!reward?.id) return;

    // αν έχει ήδη εξαργυρωθεί, stop
    if (this.redeemedIds.has(reward.id)) return;

    this.redeemingId = reward.id;

    this.redemptionService.create(reward.id).subscribe({
      next: () => {
        this.redeemingId = null;

        // ✅ mark ως εξαργυρωμένο
        this.redeemedIds.add(reward.id);

        this.snackBar.open('Η εξαργύρωση καταχωρήθηκε ✅', 'OK', { duration: 2500 });
      },
      error: (err) => {
        this.redeemingId = null;

        const apiMsg = (err?.error ?? '').toString();
        let msg = 'Αποτυχία εξαργύρωσης.';

        if (apiMsg.includes('Reward has expired')) msg = 'Το reward έχει λήξει.';
        else if (apiMsg.includes('Reward not yet available'))
          msg = 'Το reward δεν είναι διαθέσιμο ακόμα.';
        else if (apiMsg.includes('Reward is not active')) msg = 'Το reward δεν είναι ενεργό.';
        else if (apiMsg.includes('Reward out of stock')) msg = 'Δεν υπάρχει διαθέσιμο απόθεμα.';
        else if (apiMsg.includes('Not enough points')) msg = 'Δεν έχεις αρκετούς πόντους.';
        else if (err?.status === 401) msg = 'Χρειάζεται σύνδεση.';
        else if (err?.status === 403) msg = 'Δεν έχεις δικαίωμα για αυτή την ενέργεια.';

        this.snackBar.open(msg, 'OK', { duration: 3000 });
      },
    });
  }

  isRedeeming(id: number): boolean {
    return this.redeemingId === id;
  }

  isRedeemed(id: number): boolean {
    return this.redeemedIds.has(id);
  }

  trackById(_: number, item: Reward): number {
    return item.id;
  }

  loadMyRedemptions(): void {
    const userId = this.auth.getUserIdFromToken();
    if (!userId) return;

    this.redemptionService.getByUser(userId).subscribe({
      next: (list) => {
        for (const x of list ?? []) {
          this.redeemedIds.add(x.rewardId);
        }
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  // μέσα στο RewardsComponent

  private toDate(v: any): Date | null {
    if (!v) return null;
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  isExpired(r: Reward): boolean {
    const to = this.toDate((r as any).validTo);
    if (!to) return false;
    return to.getTime() < Date.now();
  }

  isNotYetAvailable(r: Reward): boolean {
    const from = this.toDate((r as any).validFrom);
    if (!from) return false;
    return from.getTime() > Date.now();
  }

  isInactive(r: Reward): boolean {
    return (r as any).isActive === false;
  }

  isOutOfStock(r: Reward): boolean {
    // stock null => unlimited (ΔΕΝ είναι out of stock)
    return r.stock !== null && r.stock !== undefined && r.stock <= 0;
  }

  getStockLabel(r: Reward): string | null {
    // stock null => unlimited -> δεν δείχνουμε chip stock
    if (r.stock === null || r.stock === undefined) return null;
    if (r.stock <= 0) return 'Εξαντλήθηκε';
    return `Stock: ${r.stock}`;
  }

  /** Μπορεί να πατηθεί το redeem; */
  canRedeem(r: Reward): boolean {
    return (
      !this.isRedeemed(r.id) &&
      !this.isRedeeming(r.id) &&
      !this.isInactive(r) &&
      !this.isExpired(r) &&
      !this.isNotYetAvailable(r) &&
      !this.isOutOfStock(r)
    );
  }

  /** Τι κείμενο θα δείχνει το κουμπί; */
  getButtonLabel(r: Reward): string {
    if (this.isRedeeming(r.id)) return 'Γίνεται…';
    if (this.isRedeemed(r.id)) return 'Εξαργυρώθηκε';
    if (this.isOutOfStock(r)) return 'Μη διαθέσιμο';
    if (this.isExpired(r)) return 'Μη διαθέσιμο';
    if (this.isNotYetAvailable(r)) return 'Μη διαθέσιμο';
    if (this.isInactive(r)) return 'Μη διαθέσιμο';
    return 'Εξαργύρωση';
  }

  /** Icon κουμπιού */
  getButtonIcon(r: Reward): string {
    if (this.isRedeemed(r.id)) return 'check_circle';
    if (!this.canRedeem(r)) return 'block';
    return 'redeem';
  }

  /** Chip κατάστασης (πάνω στην κάρτα) */
  getStatusLabel(r: Reward): string {
    if (this.isRedeemed(r.id)) return 'Εξαργυρώθηκε';
    if (this.isOutOfStock(r)) return 'Εξαντλήθηκε';
    if (this.isExpired(r)) return 'Έχει λήξει';
    if (this.isNotYetAvailable(r)) return 'Δεν είναι διαθέσιμο ακόμα';
    if (this.isInactive(r)) return 'Ανενεργό';
    return 'Ενεργό';
  }

  getStatusClass(r: Reward): string {
    if (this.isRedeemed(r.id)) return 'st-redeemed';
    if (this.isOutOfStock(r)) return 'st-out';
    if (this.isExpired(r)) return 'st-expired';
    if (this.isNotYetAvailable(r)) return 'st-soon';
    if (this.isInactive(r)) return 'st-inactive';
    return 'st-active';
  }
}
