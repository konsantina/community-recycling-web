import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

export type MaterialItem = {
  id: number;
  name: string;
  isActive?: boolean;
};

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private base = `${environment.apiUrl}/material`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<MaterialItem[]>(this.base);
  }
}
