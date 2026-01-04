import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../services/auth'; // άλλαξε path αν χρειάζεται

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css'
})
export class AppLayoutComponent {
  constructor(public auth: AuthService, private router: Router) {}

  isAdminOrModerator(): boolean {
    return this.auth.isAdmin() || this.auth.isModerator();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
