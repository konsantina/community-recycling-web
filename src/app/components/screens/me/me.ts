import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MeDto, MeService } from '../../../services/me';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatToolbar
],
  templateUrl: './me.html',
})
export class MeComponent {
  loading = true;
  error: string | null = null;
  me: MeDto | null = null;

  constructor(private meService: MeService, private location: Location) {}

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
  }

  goBack(): void {
    this.location.back();
  }
}
