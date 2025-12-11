import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DishService } from '../../core/services/dish.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { Dish } from '../../core/models/dish.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  private router = inject(Router);
  private dishService = inject(DishService);

  recomendaciones: Product[] = [];

  ngOnInit() {
    this.cargarRecomendaciones();
  }

  cargarRecomendaciones() {
    // Mock recommendations for static view as requested
    this.recomendaciones = [
      {
        id: 101,
        nombre: 'Papas Fritas',
        descripcion: 'Porción grande de papas fritas crocantes.',
        precio: 8.90,
        imageUrl: 'https://www.donbelisario.com.pe/media/catalog/product/p/a/papas-fritas-tumbay_1.png',
        categoria: 'acompanamiento',
        disponible: true
      },
      {
        id: 102,
        nombre: 'Ensalada Fresca',
        descripcion: 'Mix de lechugas, tomate, pepino y palta.',
        precio: 12.50,
        imageUrl: 'https://www.donbelisario.com.pe/media/catalog/product/e/n/ensalada-fresca_1_1.png',
        categoria: 'acompanamiento',
        disponible: true
      },
      {
        id: 103,
        nombre: 'Inca Kola 1.5L',
        descripcion: 'La bebida del sabor nacional.',
        precio: 10.00,
        imageUrl: 'https://www.donbelisario.com.pe/media/catalog/product/i/n/inca-kola-1_5l_1.png',
        categoria: 'bebida',
        disponible: true
      },
      {
        id: 104,
        nombre: 'Tequeños de Pollo',
        descripcion: '6 unidades con salsa de guacamole.',
        precio: 14.90,
        imageUrl: 'https://www.donbelisario.com.pe/media/catalog/product/t/e/tequenos-brasa_1.png',
        categoria: 'acompanamiento',
        disponible: true
      }
    ];
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
      categoria: 'acompanamiento',
      disponible: true
    };
  }

  navegarAEnvio() {
    this.router.navigate(['/envio']);
  }
}
