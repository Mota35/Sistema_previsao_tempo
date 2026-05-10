import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'wapp_token';
  private readonly USER_KEY  = 'wapp_user';
  private base = `${environment.apiUrl}/auth`;

  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get currentUser(): User | null { return this.userSubject.value; }
  get token(): string | null     { return localStorage.getItem(this.TOKEN_KEY); }
  get isLoggedIn(): boolean      { return !!this.token; }
  get isAdmin(): boolean         { return this.currentUser?.role === 'admin'; }

  login(email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, { email, senha }).pipe(
      tap(res => { if (res.success) this.saveSession(res.data.token, res.data.utilizador); })
    );
  }

  register(nome: string, email: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, { nome, email, senha }).pipe(
      tap(res => { if (res.success) this.saveSession(res.data.token, res.data.utilizador); })
    );
  }

  logout(): void {
    this.http.post(`${this.base}/logout`, {}).subscribe();
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  me(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/me`).pipe(
      tap(res => { if (res.success) this.userSubject.next(res.data); })
    );
  }

  recuperarSenha(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/recuperar-senha`, { email });
  }

  redefinirSenha(token: string, nova_senha: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/redefinir-senha`, { token, nova_senha });
  }

  private saveSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
