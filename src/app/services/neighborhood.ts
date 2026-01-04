import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

export type NeighborhoodItem = {
  id: number;
  name: string;
};

@Injectable({ providedIn: 'root' })
export class NeighborhoodService {
  private base = `${environment.apiUrl}/neighborhood`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<NeighborhoodItem[]>(this.base);
  }
}
