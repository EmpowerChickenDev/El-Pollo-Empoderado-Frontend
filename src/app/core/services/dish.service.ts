// src/app/services/dish.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish, MenuResponse } from '../models/dish.model';
import { map, tap } from 'rxjs/operators';
import { resolveImageUrl } from '../utils/image.util';
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
    if (environment.enableDebug) console.log(`[DishService] GET ${this.apiUrl} -> getAllDishes()`);
    return this.http.get<unknown[]>(this.apiUrl).pipe(
      tap(list => { if (environment.enableDebug) console.log(`[DishService] response from ${this.apiUrl}:`, { count: Array.isArray(list)? list.length : 'unknown' }); }),
      map(list => (list || []).map(dto => this.mapDtoToDish(dto)))
    );
  }

  /**
   * Obtiene un plato por ID
   * GET /api/dishes/{id}
   */
  getDishById(id: number): Observable<Dish> {
    const url = `${this.apiUrl}/${id}`;
    if (environment.enableDebug) console.log(`[DishService] GET ${url} -> getDishById(${id})`);
    return this.http.get<unknown>(url).pipe(
      tap(dto => { if (environment.enableDebug) console.log(`[DishService] response from ${url}:`, dto); }),
      map(dto => this.mapDtoToDish(dto))
    );
  }

  /**
   * Obtiene platos filtrados por categoría
   * GET /api/dishes/category/{categoryId}
   */
  getDishesByCategory(categoryId: number): Observable<Dish[]> {
    const url = `${this.apiUrl}/category/${categoryId}`;
    if (environment.enableDebug) console.log(`[DishService] GET ${url} -> getDishesByCategory(${categoryId})`);
    return this.http.get<unknown[]>(url).pipe(
      tap(list => { if (environment.enableDebug) console.log(`[DishService] response from ${url}:`, { count: Array.isArray(list)? list.length : 'unknown' }); }),
      map(list => (list || []).map(dto => this.mapDtoToDish(dto)))
    );
  }

  /**
   * Obtiene el menú completo (todas las categorías con sus platos)
   * GET /api/menu
   */
  getFullMenu(): Observable<MenuResponse> {
    if (environment.enableDebug) console.log(`[DishService] GET ${this.menuUrl} -> getFullMenu()`);
    return this.http.get<unknown>(this.menuUrl).pipe(
      tap(menu => { if (environment.enableDebug) console.log(`[DishService] response from ${this.menuUrl}:`, menu); }),
      map((menu: unknown) => {
        const m = (menu as Record<string, unknown>) || {};
        const categoriesRaw = (m['categories'] as unknown) || [];
        const categoriesArr = (Array.isArray(categoriesRaw) ? categoriesRaw as unknown[] : []) as unknown[];
        if (!categoriesArr.length) return menu as MenuResponse;
        const mapped = {
          categories: categoriesArr.map((catRaw) => {
            const cat = (catRaw as Record<string, unknown>) || {};
            const catInfo = (cat['category'] as Record<string, unknown> | undefined) ?? undefined;
            const dishesRaw = (cat['dishes'] as unknown) || [];
            const dishesArr = Array.isArray(dishesRaw) ? dishesRaw as unknown[] : [];
            return {
              category: catInfo ? { id: Number(catInfo['id'] ?? undefined), name: String(catInfo['name'] ?? ''), description: String(catInfo['description'] ?? '') } : undefined,
              dishes: dishesArr.map(d => this.mapDtoToDish(d))
            };
          })
        };
        return mapped as MenuResponse;
      })
    );
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
    if (environment.enableDebug) console.log(`[DishService] POST ${this.apiUrl} -> createDish()`, dishData);
    return this.http.post<Dish>(
      this.apiUrl, 
      dishData, 
      { headers: this.getHeaders() }
    ).pipe(tap(res => { if (environment.enableDebug) console.log(`[DishService] createDish response:`, res); }));
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
    const url = `${this.apiUrl}/${id}`;
    if (environment.enableDebug) console.log(`[DishService] PUT ${url} -> updateDish(${id})`, dishData);
    return this.http.put<Dish>(
      url, 
      dishData, 
      { headers: this.getHeaders() }
    ).pipe(tap(res => { if (environment.enableDebug) console.log(`[DishService] updateDish response:`, res); }));
  }

  /**
   * Elimina un plato (requiere autenticación admin)
   * DELETE /api/dishes/{id}
   */
  deleteDish(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    if (environment.enableDebug) console.log(`[DishService] DELETE ${url} -> deleteDish(${id})`);
    return this.http.delete<void>(
      url, 
      { headers: this.getHeaders() }
    ).pipe(tap(() => { if (environment.enableDebug) console.log(`[DishService] deleteDish (${id}) completed`); }));
  }

  /**
   * Mapea un DTO del backend a la interfaz `Dish` del frontend
   */
  private mapDtoToDish(dto: unknown): Dish {
    if (!dto) return {} as Dish;
    const d = (dto as Record<string, unknown>) || {};
    const categoryObj = (d['category'] as Record<string, unknown> | undefined) ?? undefined;
    const dish: Dish = {
      id: Number(d['id'] ?? 0),
      name: String(d['name'] ?? d['nombre'] ?? ''),
      description: String(d['description'] ?? d['descripcion'] ?? ''),
      price: Number(d['price'] ?? d['precio'] ?? 0),
      imageUrl: resolveImageUrl(String(d['image_url'] ?? d['imageUrl'] ?? d['imagen'] ?? '')),
      categoryId: Number(d['category_id'] ?? d['categoryId'] ?? (categoryObj ? Number(categoryObj['id'] ?? 0) : undefined)),
      category: categoryObj ? { id: Number(categoryObj['id'] ?? undefined), name: String(categoryObj['name'] ?? ''), description: String(categoryObj['description'] ?? '') } : undefined,
    };
    return dish;
  }
}