import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

export type MeDto = {
  id: number;
  email: string;
  displayName: string;
  role: string;

  neighborhoodId?: number | null;
  neighborhoodName?: string | null;

  totalPoints?: number;
  level?: number;
};

@Injectable({ providedIn: 'root' })
export class MeService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get<MeDto>(`${this.base}/me`);
  }
}
