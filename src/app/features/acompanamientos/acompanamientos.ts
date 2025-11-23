import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, PRODUCTOS_MOCK } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-acompanamientos',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Acompañamientos</h1>
        <p class="page-subtitle">Complementa tu pedido con deliciosos acompañamientos</p>
      </div>

      <div class="products-grid">
        <app-product-card 
          *ngFor="let producto of acompanamientos"
          [product]="producto"
        />
      </div>

      <div *ngIf="acompanamientos.length === 0" class="empty-state">
        <p>No hay acompañamientos disponibles.</p>
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
export class AcompComponent implements OnInit {
  acompanamientos: Product[] = [];

  ngOnInit() {
    this.cargarAcompanamientos();
  }

  cargarAcompanamientos() {
    this.acompanamientos = PRODUCTOS_MOCK.filter(p => p.categoria === 'acompanamiento');
  }
}