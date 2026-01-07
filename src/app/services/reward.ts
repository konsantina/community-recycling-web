import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export interface Reward {
  id: number;
  title: string;
  description: string;
  costPoints: number;
  stock: number | null;
  validFrom: string | null;
  validTo: string | null;
  termsUrl: string;
  isActive: boolean;
}

export interface RewardCreateRequest {
  title: string;
  description?: string | null;
  costPoints: number;
  stock: number;               // αφού το έκανες required
  validFrom?: string | null;
  validTo?: string | null;
  termsUrl?: string | null;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class RewardService {
  private base = `${environment.apiUrl}/Reward`; // -> https://localhost:7063/api/Reward

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reward[]> {
    return this.http.get<Reward[]>(this.base); // GET /api/Reward
  }

  getById(id: number): Observable<Reward> {
    return this.http.get<Reward>(`${this.base}/${id}`); // GET /api/Reward/{id}
  }

  create(dto: RewardCreateRequest) {
    return this.http.post(this.base, dto, { observe: 'response' }); // POST /api/Reward
  }

  update(id: number, dto: RewardCreateRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, dto); // PUT /api/Reward/{id}
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`); // DELETE /api/Reward/{id}
  }
}
