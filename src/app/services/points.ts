import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export interface PointsWallet {
  userId: number;
  availablePoints: number;
  earnedTotal: number;
  spentTotal: number;
}

export interface PointsLedgerItem {
  id: number;
  createdAt: string;
  amount: number;
  reason: string;
  refEntityType?: string | null;
  refEntityId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class PointsService {
  private base = `${environment.apiUrl}/Points`;

  constructor(private http: HttpClient) {}

  getMyWallet(): Observable<PointsWallet> {
    return this.http.get<PointsWallet>(`${this.base}/me`);
  }

  getMyLedger(days = 30, take = 50): Observable<PointsLedgerItem[]> {
    return this.http.get<PointsLedgerItem[]>(
      `${this.base}/me/ledger?days=${days}&take=${take}`
    );
  }
}
