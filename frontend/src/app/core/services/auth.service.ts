import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IApiResponse } from '../../shared/interfaces/response.interface'; // Alineado con el Response Wrapper

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'https://44.216.80.64/api/v1/auth';
  private TOKEN_KEY = 'access_token';

  // Flujo reactivo interno del estado de autenticación (Única fuente de verdad en UI)
  private currentUserSubject = new BehaviorSubject<any | null>(this.getUserFromStorage());
  public currentUser$: Observable<any | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Ejecuta el login transaccional contra el backend modular.
   * Almacena el JWT mediante efectos secundarios controlados (tap).
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<IApiResponse>(`${this.API_URL}/login`, credentials).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data; // Desempaqueta la envoltura estándar del Backend
        }
        throw new Error(response.error?.message || response.message || 'Fallo de autenticación estructural.');
      }),
      tap(data => {
        // Almacenamiento seguro del token
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.TOKEN_KEY, data.token);
          if (data.user) {
            localStorage.setItem('user_info', JSON.stringify(data.user));
          }
        }
        // Emisión reactiva del nuevo estado del usuario para toda la app
        this.currentUserSubject.next(data.user);
      })
    );
  }

  /**
   * Registro transaccional de nuevos usuarios.
   */
  registro(credentials: { email: string; password: string; nombre?: string; rol?: string }): Observable<any> {
    return this.http.post<IApiResponse>(`${this.API_URL}/registro`, credentials).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error?.message || response.message || 'Fallo al registrar usuario.');
      }),
      tap(data => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.TOKEN_KEY, data.token);
        }
        this.currentUserSubject.next(data.user);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('user_info');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private getUserFromStorage(): any | null {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {}
      }
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token ? { rol: 'alumno' } : null; // Lógica simplificada o parseo de Claims JWT
    }
    return null;
  }

  public estaAutenticado(): boolean {
    return !!this.getToken();
  }

  public obtenerUsuario(): any | null {
    return this.currentUserSubject.getValue();
  }
}
