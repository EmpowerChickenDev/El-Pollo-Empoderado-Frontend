import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { DishService } from '../../core/services/dish.service';
import { Dish } from '../../core/models/dish.model';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Promociones</h1>
        <p class="page-subtitle">¡Las mejores ofertas del Pollo Empoderado!</p>
      </div>

      <div class="products-grid">
        <app-product-card 
          *ngFor="let producto of promociones"
          [product]="producto"
        />
      </div>

      <div *ngIf="promociones.length === 0" class="empty-state">
        <p>No hay promociones disponibles en este momento.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 20px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      font-size: 1.125rem;
      color: #7f8c8d;
      margin: 0;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #95a5a6;
      font-size: 1.125rem;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }

      .products-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class PromocionesComponent implements OnInit {
  promociones: Product[] = [];
  private dishService = inject(DishService);
  isLoading = false;

  ngOnInit() {
    this.cargarPromociones();
  }

  cargarPromociones() {
    this.isLoading = true;
    this.dishService.getDishesByCategoryName('promocion').subscribe({
      next: (dishes) => {
        this.promociones = dishes.map(dish => this.dishToProduct(dish));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar promociones:', err);
        this.isLoading = false;
        this.promociones = [];
      }
    });
  }

  private dishToProduct(dish: Dish): Product {
    return {
      id: dish.id || 0,
      nombre: dish.name,
      descripcion: dish.description,
      precio: dish.price,
      precioAnterior: dish.originalPrice,
      imagen: dish.imageUrl,
      imageUrl: dish.imageUrl,
      categoria: 'promocion',
      disponible: true
    };
  }
}