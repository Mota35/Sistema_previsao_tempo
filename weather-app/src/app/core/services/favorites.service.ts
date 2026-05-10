import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CidadeFavorita } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private base = `${environment.apiUrl}/cidades-favoritas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<CidadeFavorita[]>> {
    return this.http.get<ApiResponse<CidadeFavorita[]>>(this.base);
  }

  add(nome_cidade: string, pais: string): Observable<ApiResponse<CidadeFavorita>> {
    return this.http.post<ApiResponse<CidadeFavorita>>(this.base, { nome_cidade, pais });
  }

  update(id: number, nome_cidade: string, pais: string): Observable<ApiResponse<CidadeFavorita>> {
    return this.http.put<ApiResponse<CidadeFavorita>>(`${this.base}/${id}`, { nome_cidade, pais });
  }

  remove(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.base}/${id}`);
  }

  exportarCSV(): void {
    const token = localStorage.getItem('wapp_token');
    window.open(`${this.base}/exportar?token=${token}`, '_blank');
  }
}
