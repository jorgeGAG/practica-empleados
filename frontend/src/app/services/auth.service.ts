import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly URL_AUTH = 'http://localhost:3000/api/v1/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  registro(datos: { nombre: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL_AUTH}/registro`, datos).pipe(
      tap((res) => {
        if (res && res.token) {
          this.guardarSesion(res.token, res.usuario);
        }
      })
    );
  }

  login(credenciales: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL_AUTH}/login`, credenciales).pipe(
      tap((res) => {
        if (res && res.token) {
          this.guardarSesion(res.token, res.usuario);
        }
      })
    );
  }

  guardarSesion(token: string, usuario: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    }
  }

  obtenerToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  obtenerUsuario(): any {
    if (isPlatformBrowser(this.platformId)) {
      const u = localStorage.getItem(this.USER_KEY);
      return u ? JSON.parse(u) : null;
    }
    return null;
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.router.navigate(['/login']);
  }
}
