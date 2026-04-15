import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  constructor(private http: HttpClient) {}

  my() {
    return this.http.get<DropoffListItem[]>(`${this.base}/my`);
  }

  create(dto: DropoffCreateDto) {
    return this.http.post<any>(this.base, dto);
  }

  pending() {
    return this.http.get<any[]>(`${this.base}/pending`);
  }

  verify(id: number) {
    return this.http.post(`${this.base}/${id}/verify`, {});
  }

  reject(id: number) {
    return this.http.post(`${this.base}/${id}/reject`, {});
  }

  update(id: number, dto: DropoffUpdateDto) {
    return this.http.put(`${this.base}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getById(id: number) {
    return this.http.get<DropoffListItem>(`${this.base}/${id}`);
  }
}
