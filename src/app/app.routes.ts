import { Routes } from '@angular/router';

import { LoginComponent } from './components/screens/login/login';
import { RegisterComponent } from './components/screens/register/register';

import { MyDropoffs } from './components/screens/my-dropoffs/my-dropoffs';
import { CreateDropoffComponent } from './components/screens/create-dropoff/create-dropoff';
import { EditDropoffComponent } from './components/screens/edit-dropoff/edit-dropoff';
import { PendingDropoffsComponent } from './components/screens/pending-dropoffs/pending-dropoffs';

import { AppLayoutComponent } from './components/layout/app-layout/app-layout';

import { authGuard } from './guards/auth.guard';
import { userGuard } from './guards/user.guard';
import { adminGuard } from './guards/admin.guard';
import { MeComponent } from './components/screens/me/me';
import { AdminRewardsComponent } from './components/screens/admin-rewards/admin-rewards';
import { AdminCreateRewardComponent } from './components/screens/admin-create-reward/admin-create-reward';
import { AdminEditRewardComponent } from './components/screens/admin-edit-reward/admin-edit-reward';

export const routes: Routes = [
  // Public
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected shell
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      // User
      { path: 'my-dropoffs', component: MyDropoffs, canActivate: [userGuard] },
      { path: 'dropoffs/new', component: CreateDropoffComponent, canActivate: [userGuard] },
      { path: 'dropoffs/edit/:id', component: EditDropoffComponent, canActivate: [userGuard] },

      // Admin/Moderator
      {
        path: 'admin/pending-dropoffs',
        component: PendingDropoffsComponent,
        canActivate: [adminGuard],
      },
    ],
  },
  { path: 'me', component: MeComponent, canActivate: [authGuard] },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./components/screens/leaderboard/leaderboard').then((m) => m.LeaderboardComponent),
  },
  {
    path: 'rewards',
    loadComponent: () =>
      import('./components/screens/rewards/rewards').then((m) => m.RewardsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin/rewards/new',
    loadComponent: () =>
      import('./components/screens/admin-create-reward/admin-create-reward').then(
        (m) => m.AdminCreateRewardComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'my-redemptions',
    loadComponent: () =>
      import('./components/screens/my-redemptions/my-redemptions').then(
        (m) => m.MyRedemptionsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/redemptions',
    loadComponent: () =>
      import('./components/screens/admin-redemptions/admin-redemptions').then(
        (m) => m.AdminRedemptionsComponent
      ),
    canActivate: [adminGuard],
  },
  { path: 'admin/rewards', component: AdminRewardsComponent, canActivate: [adminGuard] },               // ✅ list
  { path: 'admin/rewards/new', component: AdminCreateRewardComponent, canActivate: [adminGuard] },      // ✅ create
  { path: 'admin/rewards/:id/edit', component: AdminEditRewardComponent, canActivate: [adminGuard] }, // ✅ edit

  { path: '**', redirectTo: 'login' },
];
