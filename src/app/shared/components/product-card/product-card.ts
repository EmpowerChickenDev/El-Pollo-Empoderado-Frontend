import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { resolveImageUrl } from '../../../core/utils/image.util';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card">
      <div class="product-card__image-container">
        <img 
          [src]="imgSrc"
          [alt]="product.nombre"
          class="product-card__image"
          loading="lazy"
          decoding="async"
          (error)="onImgError($event)"
        />
        <div *ngIf="product.precioAnterior" class="product-card__badge">
          ¡OFERTA!
        </div>
      </div>

      <div class="product-card__content">
        <h3 class="product-card__title">{{ product.nombre }}</h3>
        
        <p class="product-card__description">{{ product.descripcion }}</p>

        <div class="product-card__footer">
          <div class="product-card__prices">
            <span class="product-card__price">S/ {{ product.precio | number:'1.2-2' }}</span>
            <span *ngIf="product.precioAnterior" class="product-card__old-price">
              S/ {{ product.precioAnterior | number:'1.2-2' }}
            </span>
          </div>

          <button 
            class="product-card__button"
            [disabled]="!product.disponible"
            (click)="agregarProducto()"
          >
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(93, 64, 55, 0.12);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 2px solid transparent;
    }

    .product-card:hover {
      box-shadow: 0 12px 28px rgba(211, 47, 47, 0.25);
      transform: translateY(-8px);
      border-color: #FFA726;
    }

    .product-card__image-container {
      position: relative;
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFCC80 100%);
    }

    .product-card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .product-card:hover .product-card__image {
      transform: scale(1.1);
    }

    .product-card__badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 25px;
      font-size: 0.75rem;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .product-card__content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      background: white;
    }

    .product-card__title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #5D4037;
      margin: 0 0 12px 0;
      line-height: 1.3;
    }

    .product-card__description {
      font-size: 0.9rem;
      color: #6D4C41;
      line-height: 1.6;
      margin: 0 0 20px 0;
      flex-grow: 1;
    }

    .product-card__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-top: auto;
      flex-wrap: wrap;
    }

    .product-card__prices {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .product-card__price {
      font-size: 1.75rem;
      font-weight: 800;
      color: #D32F2F;
      line-height: 1;
    }

    .product-card__old-price {
      font-size: 0.95rem;
      color: #A1887F;
      text-decoration: line-through;
    }

    .product-card__button {
      background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 30px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
      position: relative;
      overflow: hidden;
    }

    .product-card__button::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .product-card__button:hover::before {
      width: 300px;
      height: 300px;
    }

    .product-card__button:hover:not(:disabled) {
      background: linear-gradient(135deg, #FFA726 0%, #F57C00 100%);
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(255, 167, 38, 0.5);
    }

    .product-card__button:active:not(:disabled) {
      transform: scale(0.98);
    }

    .product-card__button:disabled {
      background: #BCAAA4;
      cursor: not-allowed;
      box-shadow: none;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .product-card__image-container {
        height: 180px;
      }

      .product-card__title {
        font-size: 1.1rem;
      }

      .product-card__price {
        font-size: 1.5rem;
      }

      .product-card__button {
        width: 100%;
        padding: 12px 24px;
      }

      .product-card__footer {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  private cartService = inject(CartService);

  get imgSrc(): string {
    // Prioriza `imageUrl` (backend camelCase), luego `imagen` (mocks/legacy)
    return resolveImageUrl(this.product?.imageUrl || this.product?.imagen);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = '/assets/img/no-image.svg';
  }

  agregarProducto() {
    this.cartService.addItem(this.product);
  }
}