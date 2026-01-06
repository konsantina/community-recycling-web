import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.base}/login`, { email, password });
  }

  register(dto: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.base}/register`, dto);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUserIdFromToken(): number {
    const token = this.getToken();
    if (!token) return 0;

    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

    // ASP.NET βάζει NameIdentifier με full uri:
    const key = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    const id = json[key] ?? json['nameid'] ?? json['sub'];

    return Number(id || 0);
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.getPayload(token);
    const roleClaim = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (Array.isArray(roleClaim)) {
      return roleClaim.includes('Admin');
    }

    return roleClaim === 'Admin';
  }

  private getPayload(token: string): any {
    const payloadPart = token.split('.')[1];
    const json = this.base64UrlDecode(payloadPart);
    return JSON.parse(json);
  }

  private base64UrlDecode(input: string): string {
    // JWT uses base64url ( - _ ) not standard base64 ( + / )
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

    // pad with '='
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);

    return atob(base64);
  }

  isModerator(): boolean {
    return this.hasRole('Moderator');
  }

  private hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.getPayload(token);
    if (!payload) return false;

    // 1) ASP.NET Core συνήθως βάζει αυτό το claim
    const schemaRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    // 2) Κάποιες φορές υπάρχει και απλό "role"
    const simpleRole = payload['role'];

    // Μπορεί να είναι string ή array
    const roles = ([] as string[]).concat(schemaRole ?? []).concat(simpleRole ?? []);

    return roles.includes(role);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

export type RegisterRequest = {
  email: string;
  password: string;
  displayName: string; // ✅ required από backend
};

export type RegisterResponse = {
  // βάλε ό,τι επιστρέφει το backend σου (π.χ. message, userId)
  token: string;
  message?: string;
};
