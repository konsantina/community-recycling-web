import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs';

export type RedemptionStatus = 'Pending' | 'Approved' | 'Fulfilled' | 'Rejected';

export type Redemption = {
  id: number;
  userId: number;
  rewardId: number;
  status: RedemptionStatus;
  costSnapshot?: number | null;
  code?: string | null;
  createdAt?: string | null;
};

export interface PendingRedemption {
  id: number;

  userId: number;
  userName: string;

  rewardId: number;
  rewardTitle: string;

  status: string;       
  costSnapshot: number;
  code?: string | null;
  createdAt: string;
}
@Injectable({ providedIn: 'root' })
export class RedemptionService {
  private base = `${environment.apiUrl}/Redemption`;

  constructor(private http: HttpClient) {}

  // POST /api/Redemption  body: { rewardId }
  create(rewardId: number): Observable<Redemption> {
    return this.http.post<Redemption>(this.base, { rewardId });
  }

  // GET /api/Redemption/user/{userId}
  getByUser(userId: number): Observable<Redemption[]> {
    return this.http.get<Redemption[]>(`${this.base}/user/${userId}`);
  }

  // ADMIN: GET /api/Redemption/pending
 getPending(): Observable<PendingRedemption[]> {
  return this.http.get<PendingRedemption[]>(`${this.base}/pending`);
}

  // ADMIN: POST /api/Redemption/{id}/approve  body: { approverUserId }
  approve(id: number, approverUserId: number) {
    return this.http.post(`${this.base}/${id}/approve`, { approverUserId });
  }

  // ADMIN: POST /api/Redemption/{id}/reject  body: { rejectedByUserId }
  reject(id: number, rejectedByUserId: number) {
    return this.http.post(`${this.base}/${id}/reject`, { rejectedByUserId });
  }

  fulfill(id: number, code: string | null) {
    const body = JSON.stringify(code ?? '');
    return this.http.post(`${this.base}/${id}/fulfill`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
