import { Routes } from '@angular/router';
import { LoginComponent } from './components/screens/login/login';
import { MyDropoffs } from './components/screens/my-dropoffs/my-dropoffs';
import { CreateDropoffComponent } from './components/screens/create-dropoff/create-dropoff';
import { PendingDropoffsComponent } from './components/screens/pending-dropoffs/pending-dropoffs';
import { EditDropoffComponent } from './components/screens/edit-dropoff/edit-dropoff';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'my-dropoffs', component: MyDropoffs },
  { path: 'dropoffs/new', component: CreateDropoffComponent },
  { path: 'admin/pending-dropoffs', component: PendingDropoffsComponent },
  {
    path: 'dropoffs/edit/:id',
    component: EditDropoffComponent,
    // canActivate: [userGuard] // προαιρετικό
  },

  { path: '**', redirectTo: 'login' },
];
