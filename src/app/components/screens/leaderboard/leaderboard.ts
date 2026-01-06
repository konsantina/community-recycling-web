import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { LeaderboardEntry } from '../../../services/model';
import { LeaderboardService } from '../../../services/leaderboard';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbar } from '@angular/material/toolbar';

type LeaderboardRow = LeaderboardEntry & { rank: number };

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatChipsModule,
     MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatToolbar
  ],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css'],
})
export class LeaderboardComponent implements OnInit {
  displayedColumns: string[] = ['rank', 'displayName', 'neighborhoodName', 'totalPoints'];
  dataSource = new MatTableDataSource<LeaderboardRow>([]);

  loading = true;
  errorMessage: string | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private leaderboardService: LeaderboardService, private location: Location) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = null;

    this.leaderboardService.getLeaderboard().subscribe({
      next: (items) => {
        // ✅ DESC by points
        const sorted = [...items].sort((a, b) => b.totalPoints - a.totalPoints);

        // ✅ add rank
        const filtered = sorted.filter((x) => x.totalPoints > 0);
        const rows = filtered.map((x, i) => ({ ...x, rank: i + 1 }));
        this.dataSource.data = rows;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Δεν μπόρεσα να φορτώσω το leaderboard.';
        this.loading = false;
      },
    });
  }

  medal(rank: number): string | null {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  }

  rowClass(rank: number): string {
    if (rank === 1) return 'top1';
    if (rank === 2) return 'top2';
    if (rank === 3) return 'top3';
    return '';
  }

   goBack(): void {
    this.location.back();
  }
}
