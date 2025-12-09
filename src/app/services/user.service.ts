import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth';
import { environment } from '../../environments/environment';

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthDate: string;
  address?: string;
  roles: string[];
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl: string;
  private adminApiUrl: string;

  constructor() {
    // Normalize base URL and prefix to avoid accidental double slashes
    const base = (environment.apiUrl || '').replace(/\/+$/g, '');
    const prefix = (environment.apiPrefix || '').replace(/^\/+|\/+$/g, '');
    this.apiUrl = prefix ? `${base}/${prefix}/user` : `${base}/user`;
    this.adminApiUrl = prefix ? `${base}/${prefix}/users` : `${base}/users`;
  }

  getCurrentUserProfile(): Observable<UserDTO> {
    if (environment.enableDebug) {
      console.log('[UserService] GET /api/user/me');
    }
    
    return this.http.get<UserDTO>(`${this.apiUrl}/me`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(user => {
        if (environment.enableDebug) {
          console.log('[UserService] Usuario obtenido:', user);
        }
      })
    );
  }

  updateProfile(userData: UpdateUserRequest): Observable<UserDTO> {
    if (environment.enableDebug) {
      console.log('[UserService] PUT /api/user/me', userData);
    }
    
    return this.http.put<UserDTO>(`${this.apiUrl}/me`, userData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(user => {
        if (environment.enableDebug) {
          console.log('[UserService] Perfil actualizado:', user);
        }
        
        if (userData.email) {
          localStorage.setItem('user_email', userData.email);
        }
      })
    );
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<{ message: string }> {
    if (environment.enableDebug) {
      console.log('[UserService] PUT /api/user/me/password');
    }
    
    return this.http.put<{ message: string }>(`${this.apiUrl}/me/password`, passwordData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (environment.enableDebug) {
          console.log('[UserService] Contraseña cambiada:', response);
        }
      })
    );
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.adminApiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getAllUsers(page = 0, size = 10): Observable<unknown> {
    return this.http.get(`${this.adminApiUrl}?page=${page}&size=${size}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}