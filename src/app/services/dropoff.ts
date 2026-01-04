import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth';
import { environment } from '../../enviroments/enviroment';

export type DropoffListItem = {
  id: number;
  materialId: number;
  materialName: string;

  neighborhoodId: number;
  neighborhoodName: string | null;

  quantity: number;
  unit: number | string;

  status: number;
  pointsAwarded: number;

  location: string;
  createdAt: string;
};

export type DropoffCreateDto = {
  userId: number;
  materialId: number;
  neighborhoodId: number;
  quantity: number;
  unit: number; // enum int
  location: string;
};

export type DropoffUpdateDto = {
  materialId: number;
  neighborhoodId: number;
  quantity: number;
  unit: number; // enum int
  location: string;
};

@Injectable({ providedIn: 'root' })
export class DropoffService {
  private base = `${environment.apiUrl}/dropoff`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  my() {
    return this.http.get<DropoffListItem[]>(`${this.base}/my`, { headers: this.headers() });
  }

  create(dto: DropoffCreateDto) {
    return this.http.post<any>(this.base, dto, { headers: this.headers() });
  }

  pending() {
    return this.http.get<any[]>(`${this.base}/pending`, { headers: this.headers() });
  }

  verify(id: number) {
    return this.http.post(`${this.base}/${id}/verify`, {}, { headers: this.headers() });
  }

  reject(id: number) {
    return this.http.post(
      `${this.base}/${id}/reject`,
      { verifierUserId: 0 },
      { headers: this.headers() }
    );
  }

  private headers(): HttpHeaders {
    const token = this.auth.getToken();

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  update(id: number, dto: DropoffUpdateDto) {
    return this.http.put(`${this.base}/${id}`, dto, { headers: this.headers() });
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`, { headers: this.headers() });
  }

  // ✅ για να φορτώσουμε ένα dropoff by id (ιδανικό)
  getById(id: number) {
    return this.http.get<DropoffListItem>(`${this.base}/${id}`, { headers: this.headers() });
  }
}
