// src/app/services/dish.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish, MenuResponse } from '../models/dish.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private apiUrl = `${environment.apiUrl}${environment.apiPrefix}/dishes`;
  private menuUrl = `${environment.apiUrl}${environment.apiPrefix}/menu`;
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
   * Obtiene todos los platos
   * GET /api/dishes
   */
  getAllDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.apiUrl);
  }

  /**
   * Obtiene un plato por ID
   * GET /api/dishes/{id}
   */
  getDishById(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene platos filtrados por categoría
   * GET /api/dishes/category/{categoryId}
   */
  getDishesByCategory(categoryId: number): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  /**
   * Obtiene el menú completo (todas las categorías con sus platos)
   * GET /api/menu
   */
  getFullMenu(): Observable<MenuResponse> {
    return this.http.get<MenuResponse>(this.menuUrl);
  }

  /**
   * Crea un nuevo plato (requiere autenticación admin)
   * POST /api/dishes
   */
  createDish(dish: Dish): Observable<Dish> {
    const dishData = {
      name: dish.name,
      description: dish.description,
      price: dish.price,
      imageUrl: dish.imageUrl || '',
      categoryId: dish.categoryId
    };
    
    return this.http.post<Dish>(
      this.apiUrl, 
      dishData, 
      { headers: this.getHeaders() }
    );
  }

  /**
   * Actualiza un plato existente (requiere autenticación admin)
   * PUT /api/dishes/{id}
   */
  updateDish(id: number, dish: Dish): Observable<Dish> {
    const dishData = {
      name: dish.name,
      description: dish.description,
      price: dish.price,
      imageUrl: dish.imageUrl || '',
      categoryId: dish.categoryId
    };
    
    return this.http.put<Dish>(
      `${this.apiUrl}/${id}`, 
      dishData, 
      { headers: this.getHeaders() }
    );
  }

  /**
   * Elimina un plato (requiere autenticación admin)
   * DELETE /api/dishes/{id}
   */
  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders() }
    );
  }
}