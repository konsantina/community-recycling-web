import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaderboardEntry } from './model';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  // ✅ Βάλε εδώ το σωστό base url που ήδη χρησιμοποιείς στα υπόλοιπα services σου
  // (ή χρησιμοποίησε environment.apiUrl αν το έχεις).
  private baseUrl = `${environment.apiUrl}/UserPointLedger`;

  constructor(private http: HttpClient) {}

  // ✅ Endpoint: GET /api/leaderboard
  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.baseUrl}/leaderboard`);
  }
}
