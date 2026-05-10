import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.base}/auth/users`);
  }

  deleteUser(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.base}/auth/users/${id}`);
  }

  updateRole(id: number, role: 'admin' | 'utilizador'): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.base}/auth/users/${id}/role`, { role });
  }

  getAllHistory(limit = 200): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.base}/weather/historico?limit=${limit}`
    );
  }
}
