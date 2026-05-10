import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';
export type Lang  = 'pt' | 'en';

// ── Theme ─────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'wapp_theme';
  private _theme$ = new BehaviorSubject<Theme>(
    (localStorage.getItem(this.KEY) as Theme) ?? 'dark'
  );
  theme$ = this._theme$.asObservable();

  get current(): Theme { return this._theme$.value; }

  toggle(): void {
    const next: Theme = this.current === 'dark' ? 'light' : 'dark';
    this.set(next);
  }

  set(theme: Theme): void {
    this._theme$.next(theme);
    localStorage.setItem(this.KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  init(): void {
    document.documentElement.setAttribute('data-theme', this.current);
  }
}

// ── i18n ──────────────────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  pt: {
    'nav.dashboard':    'Painel',
    'nav.favorites':    'Favoritos',
    'nav.history':      'Histórico',
    'nav.admin':        'Administração',
    'nav.logout':       'Sair',
    'auth.login':       'Entrar',
    'auth.register':    'Registar',
    'auth.email':       'Email',
    'auth.password':    'Senha',
    'auth.name':        'Nome',
    'auth.forgot':      'Esqueceu a senha?',
    'auth.noAccount':   'Não tem conta?',
    'auth.hasAccount':  'Já tem conta?',
    'weather.search':   'Pesquisar cidade...',
    'weather.feels':    'Sensação',
    'weather.humidity': 'Humidade',
    'weather.wind':     'Vento',
    'weather.pressure': 'Pressão',
    'weather.visibility':'Visibilidade',
    'weather.forecast': 'Previsão',
    'weather.addFav':   'Adicionar aos favoritos',
    'history.title':    'Histórico de Consultas',
    'history.clear':    'Limpar histórico',
    'history.export':   'Exportar CSV',
    'history.city':     'Cidade',
    'history.temp':     'Temperatura',
    'history.climate':  'Clima',
    'history.date':     'Data',
    'favorites.title':  'Cidades Favoritas',
    'favorites.add':    'Adicionar cidade',
    'favorites.remove': 'Remover',
    'admin.title':      'Logs de Administração',
    'admin.user':       'Utilizador',
    'export.csv':       'Exportar CSV',
    'export.pdf':       'Exportar PDF',
    'common.loading':   'A carregar...',
    'common.error':     'Ocorreu um erro',
    'common.save':      'Guardar',
    'common.cancel':    'Cancelar',
    'common.delete':    'Eliminar',
    'common.search':    'Pesquisar',
    'common.noData':    'Sem dados disponíveis',
  },
  en: {
    'nav.dashboard':    'Dashboard',
    'nav.favorites':    'Favorites',
    'nav.history':      'History',
    'nav.admin':        'Administration',
    'nav.logout':       'Log out',
    'auth.login':       'Sign in',
    'auth.register':    'Register',
    'auth.email':       'Email',
    'auth.password':    'Password',
    'auth.name':        'Name',
    'auth.forgot':      'Forgot password?',
    'auth.noAccount':   'No account?',
    'auth.hasAccount':  'Have an account?',
    'weather.search':   'Search city...',
    'weather.feels':    'Feels like',
    'weather.humidity': 'Humidity',
    'weather.wind':     'Wind',
    'weather.pressure': 'Pressure',
    'weather.visibility':'Visibility',
    'weather.forecast': 'Forecast',
    'weather.addFav':   'Add to favorites',
    'history.title':    'Search History',
    'history.clear':    'Clear history',
    'history.export':   'Export CSV',
    'history.city':     'City',
    'history.temp':     'Temperature',
    'history.climate':  'Climate',
    'history.date':     'Date',
    'favorites.title':  'Favorite Cities',
    'favorites.add':    'Add city',
    'favorites.remove': 'Remove',
    'admin.title':      'Admin Logs',
    'admin.user':       'User',
    'export.csv':       'Export CSV',
    'export.pdf':       'Export PDF',
    'common.loading':   'Loading...',
    'common.error':     'An error occurred',
    'common.save':      'Save',
    'common.cancel':    'Cancel',
    'common.delete':    'Delete',
    'common.search':    'Search',
    'common.noData':    'No data available',
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly KEY = 'wapp_lang';
  private _lang$ = new BehaviorSubject<Lang>(
    (localStorage.getItem(this.KEY) as Lang) ?? 'pt'
  );
  lang$ = this._lang$.asObservable();

  get current(): Lang { return this._lang$.value; }

  toggle(): void { this.set(this.current === 'pt' ? 'en' : 'pt'); }

  set(lang: Lang): void {
    this._lang$.next(lang);
    localStorage.setItem(this.KEY, lang);
    document.documentElement.setAttribute('lang', lang);
  }

  t(key: string): string {
    return TRANSLATIONS[this.current][key] ?? key;
  }
}
