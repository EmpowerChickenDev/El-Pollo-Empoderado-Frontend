import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Local {
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  mapsUrl: string;
  imagen: string;
}

@Component({
  selector: 'app-locales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Nuestros Locales</h1>
        <p class="page-subtitle">Encuéntranos en Lima</p>
      </div>

      <div class="locales-grid">
        <div *ngFor="let local of locales" class="local-card">
          <div class="local-card__image">
            <img [src]="local.imagen" [alt]="local.nombre">
            <div class="local-card__overlay"></div>
          </div>
          
          <div class="local-card__content">
            <h3 class="local-card__name">{{ local.nombre }}</h3>
            
            <div class="local-card__info">
              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <div>
                  <strong>Dirección</strong>
                  <p>{{ local.direccion }}</p>
                </div>
              </div>

              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                <div>
                  <strong>Teléfono</strong>
                  <p>{{ local.telefono }}</p>
                </div>
              </div>

              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <div>
                  <strong>Horario</strong>
                  <p>{{ local.horario }}</p>
                </div>
              </div>
            </div>

            <a [href]="local.mapsUrl" target="_blank" class="local-card__button">
              Ver en Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 60px 20px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 800;
      color: #5D4037;
      margin: 0 0 16px 0;
    }

    .page-subtitle {
      font-size: 1.25rem;
      color: #8D6E63;
      margin: 0;
    }

    .locales-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 36px;
    }

    .local-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(93, 64, 55, 0.12);
      transition: all 0.3s ease;
      border: 3px solid transparent;
    }

    .local-card:hover {
      transform: translateY(-12px);
      box-shadow: 0 16px 40px rgba(211, 47, 47, 0.2);
      border-color: #FFA726;
    }

    .local-card__image {
      position: relative;
      width: 100%;
      height: 240px;
      overflow: hidden;
    }

    .local-card__image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .local-card:hover .local-card__image img {
      transform: scale(1.1);
    }

    .local-card__overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, transparent 0%, rgba(93, 64, 55, 0.7) 100%);
    }

    .local-card__content {
      padding: 32px 28px;
    }

    .local-card__name {
      font-size: 1.75rem;
      font-weight: 700;
      color: #D32F2F;
      text-align: center;
      margin: 0 0 28px 0;
    }

    .local-card__info {
      margin-bottom: 28px;
    }

    .info-item {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      align-items: flex-start;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-icon {
      width: 28px;
      height: 28px;
      color: #FFA726;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-item strong {
      display: block;
      color: #5D4037;
      font-size: 0.95rem;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .info-item p {
      color: #8D6E63;
      line-height: 1.6;
      margin: 0;
      font-size: 0.95rem;
    }

    .local-card__button {
      display: block;
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%);
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 30px;
      font-weight: 700;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
    }

    .local-card__button:hover {
      background: linear-gradient(135deg, #FFA726 0%, #F57C00 100%);
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(255, 167, 38, 0.5);
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 40px 15px;
      }

      .page-title {
        font-size: 2.2rem;
      }

      .locales-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .local-card__image {
        height: 200px;
      }
    }
  `]
})
export class LocalesComponent {
  locales: Local[] = [
    {
      nombre: 'Local Miraflores',
      direccion: 'Av. Larco 1234, Miraflores, Lima',
      telefono: '01 - 611 - 3333',
      horario: 'Lun - Dom: 11:00 AM - 11:00 PM',
      mapsUrl: 'https://maps.google.com',
      imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop'
    },
    {
      nombre: 'Local San Isidro',
      direccion: 'Av. Conquistadores 567, San Isidro, Lima',
      telefono: '01 - 611 - 3334',
      horario: 'Lun - Dom: 11:00 AM - 11:00 PM',
      mapsUrl: 'https://maps.google.com',
      imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop'
    },
    {
      nombre: 'Local Surco',
      direccion: 'Av. Primavera 890, Santiago de Surco, Lima',
      telefono: '01 - 611 - 3335',
      horario: 'Lun - Dom: 11:00 AM - 11:00 PM',
      mapsUrl: 'https://maps.google.com',
      imagen: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop'
    }
  ];
}