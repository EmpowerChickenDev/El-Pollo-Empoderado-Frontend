export interface Product {
  id: number;
  // Campos en español (usados actualmente en la UI)
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  imagen?: string; // legacy: puede venir como `imagen` desde mocks/legacy

  // Campos alineados con el backend y con convenciones camelCase
  imageUrl?: string; // mapeo recomendado desde `image_url` del backend

  categoria: 'promocion' | 'carta' | 'acompanamiento' | 'bebida';
  disponible: boolean;
}

// Helper para mapear un DTO de backend (snake_case) a la interfaz `Product` usada en la UI.
export function mapDtoToProduct(dto: unknown): Product {
  const d = (dto as Record<string, unknown>) || {};
  const id = Number(d['id'] ?? 0);
  const nombre = String(d['name'] ?? d['nombre'] ?? '');
  const descripcion = String(d['description'] ?? d['descripcion'] ?? '');
  const precio = Number(d['price'] ?? d['precio'] ?? 0);
  const imagen = (d['imagen'] ?? d['image_url'] ?? d['imageUrl']) as string | undefined;
  const imageUrl = (d['image_url'] ?? d['imageUrl'] ?? d['imagen']) as string | undefined;
  const categoriaRaw = d['category'] ?? d['categoria'] ?? d['categoria_name'] ?? 'carta';
  let categoria = 'carta' as 'promocion' | 'carta' | 'acompanamiento' | 'bebida';
  if (categoriaRaw && typeof categoriaRaw === 'object') {
    const cr = categoriaRaw as Record<string, unknown>;
    categoria = String(cr['name'] ?? 'carta') as 'promocion' | 'carta' | 'acompanamiento' | 'bebida';
  } else {
    categoria = String(categoriaRaw) as 'promocion' | 'carta' | 'acompanamiento' | 'bebida';
  }
  const disponible = Boolean(d['available'] ?? d['disponible'] ?? true);
  const precioAnteriorRaw = d['original_price'] ?? d['precio_anterior'] ?? d['precioAnterior'];
  const precioAnterior = typeof precioAnteriorRaw === 'number'
    ? precioAnteriorRaw
    : (typeof precioAnteriorRaw === 'string' ? Number(precioAnteriorRaw) : undefined);

  return {
    id,
    nombre,
    descripcion,
    precio,
    precioAnterior,
    imagen,
    imageUrl,
    categoria,
    disponible,
  };
}

export const PRODUCTOS_MOCK: Product[] = [
  // ========== PROMOCIONES (6 productos) ==========
  {
    id: 1,
    nombre: 'Brasa Personal',
    descripcion: '1/4 pollo, papas fritas, gaseosa 500ml y salsas.',
    precio: 15.90,
    precioAnterior: 31.90,
    imagen: 'https://www.donbelisario.com.pe/media/catalog/product/p/d/pdp_brasa-days_personal_1000x1000px_1__1.png',
    categoria: 'promocion',
    disponible: true
  },
  {
    id: 2,
    nombre: 'Combo Familiar',
    descripcion: 'Pollo entero, papas familiares, ensalada y gaseosa 1.5L.',
    precio: 49.90,
    precioAnterior: 65.90,
    imagen: 'https://www.donbelisario.com.pe/media/catalog/product/s/e/semana-dorada-promo-familiar.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
    categoria: 'promocion',
    disponible: true
  },
  {
    id: 3,
    nombre: 'Promo Pareja',
    descripcion: '1/2 pollo, papas medianas, 2 gaseosas 500ml.',
    precio: 29.90,
    precioAnterior: 42.90,
    imagen: 'https://www.donbelisario.com.pe/media/catalog/product/c/a/card-duopatrio-1000x1000_1.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=300&width=300&canvas=300:300&format=jpeg',
    categoria: 'promocion',
    disponible: true
  },
  {
    id: 4,
    nombre: 'Super Combo',
    descripcion: '1/2 pollo, papas grandes, ensalada, 4 cremas y gaseosa 1L.',
    precio: 35.90,
    precioAnterior: 48.90,
    imagen: 'https://www.donbelisario.com.pe/media/catalog/product/c/a/card-armatumedio-1000x1000.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
    categoria: 'promocion',
    disponible: true
  },
  {
    id: 5,
    nombre: 'Mega Familiar',
    descripcion: 'Pollo entero, papas jumbo, ensalada grande, 8 cremas y gaseosa 2L.',
    precio: 69.90,
    precioAnterior: 89.90,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQEbEu74AgIgYOIsLCNorxX1P3DqKaaAf1tw&s',
    categoria: 'promocion',
    disponible: true
  },
  {
    id: 6,
    nombre: 'Promo Express',
    descripcion: '1/4 pollo con papas pequeñas y gaseosa.',
    precio: 19.90,
    precioAnterior: 28.90,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfGCgyIYg0hBdcFsoDwlALFoaJmYatLaH1ZfQ1NwEIexLjUdFSTW44gwfzAe1MhMVc2u0&usqp=CAU',
    categoria: 'promocion',
    disponible: true
  },

  // ========== CARTA (6 productos) ==========
  {
    id: 11,
    nombre: '1/4 de Pollo',
    descripcion: 'Cuarto de pollo a la brasa con papas y cremas.',
    precio: 18.90,
    imagen: 'https://www.donbelisario.com.pe/media/catalog/product/p/d/pdp_un-cuarto_papas_ensalada_1000x1000px.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
    categoria: 'carta',
    disponible: true
  },
  {
    id: 12,
    nombre: '1/2 Pollo',
    descripcion: 'Medio pollo a la brasa con papas y ensalada.',
    precio: 32.90,
    imagen: 'https://www.donbelisario.com.pe/media/catalog/product/p/d/pdp_medio_papas_ensalada_1000x1000px.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
    categoria: 'carta',
    disponible: true
  },
  {
    id: 13,
    nombre: 'Pollo Entero',
    descripcion: 'Pollo entero a la brasa con papas grandes y ensalada.',
    precio: 58.90,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-ZJLt0lzXGiORU3jEcQ-ZVCGTk7wiUEJKg&s',
    categoria: 'carta',
    disponible: true
  },
  {
    id: 14,
    nombre: '1/4 Pollo + Arroz',
    descripcion: 'Cuarto de pollo con arroz chaufa y cremas.',
    precio: 22.90,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX0erA8DO1Q2oE0KDLWjlEZAG6fjslIegU7w&s',
    categoria: 'carta',
    disponible: true
  },
  {
    id: 15,
    nombre: 'Pechuga a la Plancha',
    descripcion: 'Pechuga de pollo a la plancha con ensalada y papas.',
    precio: 24.90,
    imagen: 'https://www.donbelisario.com.pe/media/wysiwyg/Pechuga-a-la-parrilla_categoria_desktop_384x320px.jpg',
    categoria: 'carta',
    disponible: true
  },
  {
    id: 16,
    nombre: 'Pierna con Encuentro',
    descripcion: 'Pierna con encuentro, papas y cremas.',
    precio: 20.90,
    imagen: 'https://wongfood.vtexassets.com/arquivos/ids/537243-800-auto?v=637853285619400000&width=800&height=auto&aspect=true',
    categoria: 'carta',
    disponible: true
  },

  // ========== ACOMPAÑAMIENTOS (6 productos) ==========
  {
    id: 21,
    nombre: 'Papas Fritas Personal',
    descripcion: 'Porción personal de papas fritas doradas.',
    precio: 6.90,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqnj22FJq4nKKofaGxUoG1zMC6m_kA1pZQ4g&s',
    categoria: 'acompanamiento',
    disponible: true
  },
  {
    id: 22,
    nombre: 'Papas Fritas Familiar',
    descripcion: 'Porción familiar de papas fritas.',
    precio: 12.90,
    imagen: 'https://3a448acea9.cbaul-cdnwnd.com/3028317500cc029705bed36b22f47f88/200000026-961e0961e2/image-crop-200000025.jpeg?ph=3a448acea9',
    categoria: 'acompanamiento',
    disponible: true
  },
  {
    id: 23,
    nombre: 'Ensalada Fresca',
    descripcion: 'Ensalada de lechuga, tomate, cebolla y limón.',
    precio: 7.90,
    imagen: 'https://www.donbelisario.com.pe/media/catalog/product/2/1/2146462468.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
    categoria: 'acompanamiento',
    disponible: true
  },
  {
    id: 24,
    nombre: 'Choclo con Queso',
    descripcion: 'Choclo desgranado con queso fresco peruano.',
    precio: 8.50,
    imagen: 'https://media-cdn.tripadvisor.com/media/photo-s/0d/eb/07/46/papitas-con-queso-buenisimas.jpg',
    categoria: 'acompanamiento',
    disponible: true
  },
  {
    id: 25,
    nombre: 'Arroz Chaufa',
    descripcion: 'Arroz chaufa estilo peruano.',
    precio: 9.90,
    imagen: 'https://www.laylita.com/recetas/wp-content/uploads/2022/12/Receta-del-arroz-chaufa-peruano.jpg',
    categoria: 'acompanamiento',
    disponible: true
  },
  {
    id: 26,
    nombre: 'Yucas Fritas',
    descripcion: 'Porción de yucas fritas crujientes.',
    precio: 7.50,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRirUIwhLJENkznQP6W7UaR1ZWN8KfRwQsqQ&s',
    categoria: 'acompanamiento',
    disponible: true
  },

  // ========== BEBIDAS (6 productos) ==========
  {
    id: 31,
    nombre: 'Inca Kola 500ml',
    descripcion: 'Gaseosa Inca Kola personal.',
    precio: 4.50,
    imagen: 'https://www.donbelisario.com.pe/media/catalog/product/2/1/2146463135.png?optimize=medium&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700&format=jpeg',
    categoria: 'bebida',
    disponible: true
  },
  {
    id: 32,
    nombre: 'Coca Cola 1.5L',
    descripcion: 'Gaseosa Coca Cola familiar.',
    precio: 7.90,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR_ibdVmpUfO6Wdmi1inPag7wfeHQNI6EhKQ&s',
    categoria: 'bebida',
    disponible: true
  },
  {
    id: 33,
    nombre: 'Chicha Morada 1L',
    descripcion: 'Chicha morada natural preparada al día.',
    precio: 8.50,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Aed0SQ-WDDrdJJfMwnFaj0MTkKsAJwiihA&s',
    categoria: 'bebida',
    disponible: true
  },
  {
    id: 34,
    nombre: 'Inca Kola 1.5L',
    descripcion: 'Gaseosa Inca Kola familiar.',
    precio: 7.90,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwwnZXu9IZWSRnIRTCiTXcbPnRLiQz-heLvA&s',
    categoria: 'bebida',
    disponible: true
  },
  {
    id: 35,
    nombre: 'Agua Mineral',
    descripcion: 'Agua mineral sin gas 625ml.',
    precio: 3.50,
    imagen: 'https://media.falabella.com/tottusPE/10225059_1/w=1500,h=1500,fit=pad',
    categoria: 'bebida',
    disponible: true
  },
  {
    id: 36,
    nombre: 'Limonada Frozen',
    descripcion: 'Limonada frozen natural 500ml.',
    precio: 9.90,
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi0jkzpccVi4vvRWUQabc-kGL76oMCdSNjKA&s',
    categoria: 'bebida',
    disponible: true
  }
];