import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, WeatherData, ForecastResponse, HistoricoConsulta
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private base = `${environment.apiUrl}/weather`;

  constructor(private http: HttpClient) {}

  getCurrent(cidade: string, pais?: string): Observable<ApiResponse<WeatherData>> {
    let params = new HttpParams().set('cidade', cidade);
    if (pais) params = params.set('pais', pais);
    return this.http.get<ApiResponse<WeatherData>>(this.base, { params });
  }

  getForecast(cidade: string, pais?: string): Observable<ApiResponse<ForecastResponse>> {
    let params = new HttpParams().set('cidade', cidade);
    if (pais) params = params.set('pais', pais);
    return this.http.get<ApiResponse<ForecastResponse>>(`${this.base}/previsao`, { params });
  }

  getByCoords(lat: number, lon: number): Observable<ApiResponse<WeatherData>> {
    const params = new HttpParams().set('lat', lat).set('lon', lon);
    return this.http.get<ApiResponse<WeatherData>>(`${this.base}/coordenadas`, { params });
  }

  getHistorico(limit = 50): Observable<ApiResponse<HistoricoConsulta[]>> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<ApiResponse<HistoricoConsulta[]>>(`${this.base}/historico`, { params });
  }

  limparHistorico(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.base}/historico`);
  }

  exportarHistoricoCSV(): void {
    window.open(`${this.base}/historico/exportar?token=${this.getToken()}`, '_blank');
  }

  getIconUrl(icon: string, size: 2 | 4 = 2): string {
    return `${environment.openWeatherIconUrl}/${icon}@${size}x.png`;
  }

  private getToken(): string | null {
    return localStorage.getItem('wapp_token');
  }
}
