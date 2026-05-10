// ── User ──────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  nome: string;
  email: string;
  role: 'admin' | 'utilizador';
  criado_em: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    utilizador: User;
    token: string;
  };
}

// ── Favorites ─────────────────────────────────────────────────────────────────
export interface CidadeFavorita {
  id: number;
  utilizador_id: number;
  nome_cidade: string;
  pais: string;
  adicionada_em: string;
}

// ── Weather ───────────────────────────────────────────────────────────────────
export interface WeatherData {
  cidade: string;
  pais: string;
  temperatura: number;
  sensacao: number;
  humidade: number;
  clima: string;
  icone: string;
  vento: number;
  visibilidade: number;
  pressao: number;
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: { name: string; country: string };
}

// ── History ───────────────────────────────────────────────────────────────────
export interface HistoricoConsulta {
  id: number;
  utilizador_id: number;
  cidade_consultada: string;
  temperatura: number;
  clima: string;
  data_consulta: string;
}

// ── API Generic ───────────────────────────────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}
