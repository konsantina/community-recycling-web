import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { BadgeDto } from './model';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private base = `${environment.apiUrl}/UserProfile`;

  constructor(private http: HttpClient) {}

  getMyBadges(): Observable<BadgeDto[]> {
    return this.http.get<BadgeDto[]>(`${this.base}/me/badges`);
  }
}
