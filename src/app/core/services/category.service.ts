// src/app/services/category.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}${environment.apiPrefix}/categories`;
  private http = inject(HttpClient);

  /**
   * Obtiene los headers con el token de autenticación
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(environment.tokenKey) || localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Obtiene todas las categorías
   * GET /api/categories
   */
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  /**
   * Obtiene una categoría por ID
   * GET /api/categories/{id}
   */
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva categoría (requiere autenticación admin)
   * POST /api/categories
   */
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(
      this.apiUrl, 
      category, 
      { headers: this.getHeaders() }
    );
  }

  /**
   * Actualiza una categoría existente (requiere autenticación admin)
   * PUT /api/categories/{id}
   */
  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiUrl}/${id}`, 
      category, 
      { headers: this.getHeaders() }
    );
  }

  /**
   * Elimina una categoría (requiere autenticación admin)
   * DELETE /api/categories/{id}
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders() }
    );
  }
}