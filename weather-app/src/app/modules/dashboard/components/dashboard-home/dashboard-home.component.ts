import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../../../core/services/weather.service';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { WeatherData, ForecastResponse, CidadeFavorita } from '../../../../core/models/models';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  searchQuery  = '';
  weather: WeatherData | null = null;
  forecast: ForecastResponse | null = null;
  favorites: CidadeFavorita[] = [];
  loading      = false;
  loadingFore  = false;
  error        = '';
  successMsg   = '';
  geoLoading   = false;

  constructor(
    public weatherSvc: WeatherService,
    private favSvc: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  search(): void {
    if (!this.searchQuery.trim()) return;
    this.loading = true; this.error = ''; this.weather = null; this.forecast = null;
    this.weatherSvc.getCurrent(this.searchQuery).subscribe({
      next: (r) => {
        this.weather = r.data;
        this.loading = false;
        this.loadForecast(this.searchQuery);
      },
      error: (e) => { this.error = e.error?.message ?? 'Cidade não encontrada.'; this.loading = false; },
    });
  }

  loadForecast(city: string): void {
    this.loadingFore = true;
    this.weatherSvc.getForecast(city).subscribe({
      next:  (r) => { this.forecast = r.data; this.loadingFore = false; },
      error: ()  => this.loadingFore = false,
    });
  }

  searchByCity(city: CidadeFavorita): void {
    this.searchQuery = city.nome_cidade;
    this.search();
  }

  addToFavorites(): void {
    if (!this.weather) return;
    this.favSvc.add(this.weather.cidade, this.weather.pais).subscribe({
      next: () => { this.successMsg = 'Cidade adicionada aos favoritos!'; this.loadFavorites(); },
      error: (e) => this.error = e.error?.message ?? 'Erro ao adicionar.',
    });
  }

  loadFavorites(): void {
    this.favSvc.getAll().subscribe({ next: (r) => this.favorites = r.data ?? [] });
  }

  useGeolocation(): void {
    if (!navigator.geolocation) { this.error = 'Geolocalização não suportada.'; return; }
    this.geoLoading = true;
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.geoLoading = false;
        this.weatherSvc.getByCoords(pos.coords.latitude, pos.coords.longitude).subscribe({
          next: (r) => {
            this.weather = r.data;
            this.searchQuery = r.data.cidade;
            this.loadForecast(r.data.cidade);
          },
          error: () => this.error = 'Erro ao obter clima por localização.',
        });
      },
      () => { this.geoLoading = false; this.error = 'Permissão de localização negada.'; }
    );
  }

  isFavorite(): boolean {
    return !!this.weather && this.favorites.some(
      f => f.nome_cidade.toLowerCase() === this.weather!.cidade.toLowerCase()
    );
  }
}
