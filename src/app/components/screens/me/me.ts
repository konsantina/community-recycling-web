import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MeDto, MeService } from '../../../services/me';
import { MatDividerModule } from '@angular/material/divider';
import { BadgeDto } from '../../../services/model';
import { BadgeService } from '../../../services/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatToolbar,
    MatDividerModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  templateUrl: './me.html',
})
export class MeComponent {
  loading = true;
  error: string | null = null;
  me: MeDto | null = null;
  badges: BadgeDto[] = [];
  badgesLoading = true;
  badgesError: string | null = null;

  constructor(private meService: MeService, private location: Location, private badgeService: BadgeService) {}

  ngOnInit(): void {
    this.meService.me().subscribe({
      next: (res) => {
        this.me = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Δεν μπόρεσα να φορτώσω τα στοιχεία προφίλ.';
        this.loading = false;
      },
    });

    this.loadBadges();

  }

  goBack(): void {
    this.location.back();
  }

  private loadBadges(): void {
  this.badgesLoading = true;
  this.badgesError = null;

  this.badgeService.getMyBadges().subscribe({
    next: (data) => {
      this.badges = data ?? [];
      this.badgesLoading = false;
    },
    error: () => {
      this.badgesError = 'Δεν μπόρεσα να φορτώσω τα badges.';
      this.badgesLoading = false;
    },
  });
}
  
}
