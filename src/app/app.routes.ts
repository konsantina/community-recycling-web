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
  { path: '**', redirectTo: 'login' },
];
