# Guía de Deployment

## Despliegue en Vercel

Este proyecto está configurado para desplegarse automáticamente en Vercel cuando se hace push a la rama principal.

### Configuración de Variables de Entorno en Vercel

Para que el build funcione correctamente en Vercel, debes configurar las siguientes variables de entorno en el dashboard de Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

#### Variables Requeridas

| Variable | Valor de Ejemplo | Descripción |
|----------|------------------|-------------|
| `API_URL` | `https://api.tudominio.com` | URL del backend API |
| `API_PREFIX` | `/api` | Prefijo de la API |
| `API_VERSION` | `` | Versión de la API (opcional) |
| `APP_NAME` | `El Pollo Empoderado` | Nombre de la aplicación |
| `ENABLE_DEBUG` | `false` | Habilitar modo debug en producción |
| `TOKEN_KEY` | `admin_token` | Clave para almacenar el token |
| `PRODUCTION` | `true` | Modo producción |

#### Cómo Agregar Variables en Vercel

```bash
# Opción 1: Usar Vercel CLI
vercel env add API_URL production
vercel env add API_PREFIX production
vercel env add APP_NAME production
# ... etc

# Opción 2: Usar el Dashboard Web
# 1. Settings → Environment Variables
# 2. Add New → Key/Value
# 3. Selecciona los entornos (Production, Preview, Development)
```

### Proceso de Build

El comando de build en `package.json` ya está configurado:

```json
"build": "npm run config:prod && ng build"
```

Este comando:
1. Ejecuta `node scripts/set-env.js prod`
2. Genera `src/environments/environment.prod.ts` con las variables de entorno
3. Construye la aplicación Angular

### Verificar el Build Localmente

Para simular el build de producción localmente:

```bash
# Asegúrate de tener las variables en .env.prod
npm run build

# O prueba sin archivos .env (como en Vercel)
# Necesitas exportar las variables de entorno primero
export API_URL=https://api.tudominio.com
export API_PREFIX=/api
export APP_NAME="El Pollo Empoderado"
export ENABLE_DEBUG=false
export TOKEN_KEY=admin_token
export PRODUCTION=true

# Luego ejecuta el build
npm run build
```

### Troubleshooting

#### Error: "Cannot find module '../../../environments/environment'"

**Causa**: Las variables de entorno no están configuradas en Vercel.

**Solución**: 
1. Verifica que todas las variables estén configuradas en Vercel Dashboard
2. Asegúrate de que `API_URL` esté definida (es obligatoria)
3. Redeploy el proyecto después de agregar las variables

#### Error: "Cannot find module 'dotenv'"

**Causa**: El paquete `dotenv` no está instalado.

**Solución**: Ya está en `devDependencies`, Vercel lo instalará automáticamente.

### Configuración de Build en Vercel

En el dashboard de Vercel, asegúrate de que la configuración sea:

- **Framework Preset**: Angular
- **Build Command**: `npm run build`
- **Output Directory**: `dist/frontend`
- **Install Command**: `npm install`

### Branches y Environments

- **Production**: rama `main` → https://tu-app.vercel.app
- **Preview**: otras ramas → https://branch-name-tu-app.vercel.app
- **Development**: usa `.env` local

## Despliegue en Otros Servicios

### Netlify

Similar a Vercel, configura las variables de entorno en:
- Site Settings → Build & Deploy → Environment Variables

### Azure Static Web Apps

Configura las variables en:
- Configuration → Application Settings

### Firebase Hosting

Las variables de entorno deben estar en `.env.prod` antes del build.

## Notas de Seguridad

⚠️ **IMPORTANTE**: 
- Nunca subas archivos `.env` o `.env.prod` al repositorio
- Las variables sensibles deben estar solo en el dashboard de tu plataforma de deployment
- Usa valores diferentes para desarrollo y producción
- No incluyas tokens o secrets en el código
