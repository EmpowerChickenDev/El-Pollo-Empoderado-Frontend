import { environment } from '../../../environments/environment';

/**
 * Resuelve una URL de imagen recibida desde el backend.
 * - Si `image` es una URL absoluta, la devuelve tal cual.
 * - Si es un path relativo, lo concatena con `environment.apiUrl`.
 * - Si es falsy, devuelve un fallback local.
 */
export function resolveImageUrl(image?: string): string {
  const fallback = '/assets/img/no-image.svg';
  if (!image) return fallback;
  const trimmed = image.trim();
  if (trimmed.startsWith('http') || trimmed.startsWith('//')) return trimmed;
  // evita duplicar barras
  const base = environment.apiUrl?.replace(/\/$/, '') || '';
  const path = trimmed.startsWith('/') ? trimmed : '/' + trimmed;
  const result = base + path;
  if (environment.enableDebug) {
    console.debug(`[ImageUtil] Resolved image URL:`, {
      input: image,
      resolved: result,
      base,
      path
    });
  }
  return base + path;
}
