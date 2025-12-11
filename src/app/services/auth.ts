import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dni: string;
  birthDate: string;
  address?: string;
}

interface AuthResponse {
  token: string;
  type?: string;
  email: string;
  roles: string[]; // Cambiado de 'role' a 'roles' (array)
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = '';
  private tokenKey = environment.tokenKey;
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // normalize apiUrl and apiPrefix to avoid accidental double slashes
  private normalizeApi() {
    const base = (environment.apiUrl || '').replace(/\/+$/g, '');
    const prefix = (environment.apiPrefix || '').replace(/^\/+|\/+$/g, '');
    this.apiUrl = prefix ? `${base}/${prefix}/auth` : `${base}/auth`;
  }

  /**
   * Login del usuario
   * POST /api/auth/login
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const loginData: LoginRequest = { email, password };
    // ensure apiUrl normalized
    if (!this.apiUrl) {
      this.normalizeApi();
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (environment.enableDebug) {
            console.log('[AuthService] Login exitoso:', response);
          }
          
          this.setToken(response.token);
          localStorage.setItem('user_email', response.email);
          localStorage.setItem('user_roles', JSON.stringify(response.roles));
          
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  /**
   * Registro de nuevo usuario
   * POST /api/auth/register
   */
  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dni: string,
    birthDate: string,
    address?: string
  ): Observable<AuthResponse> {
    const registerData: RegisterRequest = {
      firstName,
      lastName,
      email,
      password,
      dni,
      birthDate,
      address
    };
    if (environment.enableDebug) {
      console.debug('[AuthService] register payload:', registerData);
    }
    // ensure apiUrl normalized
    if (!this.apiUrl) {
      this.normalizeApi();
    }

    // Do not auto-login on register: backend may not return a token or
    // the UX expects the user to explicitly login after registration.
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => {
          if (environment.enableDebug) {
            console.log('[AuthService] Registro exitoso (no auto-login):', response);
          }
          // Intentionally do not call setToken() or change isAuthenticatedSubject
          // so the user is required to login explicitly after registering.
        })
      );
  }

  /**
   * Logout del usuario
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_roles');
    
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
    
    if (environment.enableDebug) {
      console.log('[AuthService] Logout completado');
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  getCurrentUserRoles(): string[] {
    const rolesStr = localStorage.getItem('user_roles');
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  isAdmin(): boolean {
    const roles = this.getCurrentUserRoles();
    return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}