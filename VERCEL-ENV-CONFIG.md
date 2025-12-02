# Configuración de Variables de Entorno en Vercel

## 🚨 SOLUCIÓN AL PROBLEMA: Preview carga localhost

Si tus preview deployments en Vercel cargan `localhost` en lugar de staging, sigue estos pasos:

### ✅ Checklist de Configuración

1. **Build Command en Vercel:**
   - Ve a **Settings** → **General** → **Build & Development Settings**
   - Build Command: `npm run build:dev`
   - Output Directory: `dist/frontend/browser`

2. **Variables de Entorno:**
   - Ve a **Settings** → **Environment Variables**
   - Agrega cada variable **DOS VECES**: una para Preview, otra para Production
   - **CRÍTICO:** Verifica que `API_URL` para Preview apunte a staging

3. **Re-deploy después de cambios:**
   - Después de agregar variables, haz un nuevo commit o re-deploy manual
   - Vercel necesita re-ejecutar el build para usar las nuevas variables

### 📋 Configuración Paso a Paso

## 🌍 Ambientes

El proyecto soporta tres ambientes:

1. **Local** → Desarrollo en tu máquina (`localhost:8080`)
2. **Preview/Staging** → Preview deployments de Vercel (backend develop/staging)
3. **Production** → Producción real (backend main)

## 📋 Variables de Entorno Requeridas

### ⚠️ IMPORTANTE: Cómo agregar las variables

Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

Para CADA variable que agregues, debes seleccionar en qué ambientes aplica:
- ☑️ **Production** (para production)
- ☑️ **Preview** (para pull requests)
- ☐ **Development** (generalmente no se usa)

### Para Preview Deployments (Pull Requests)

Agrega estas variables y **MARCA SOLO "Preview"**:

| Variable | Valor | Ambiente |
|----------|-------|----------|
| `API_URL` | `https://el-pollo-empoderado-backend-staging.up.railway.app` | ☑️ Preview |
| `API_PREFIX` | `/api` | ☑️ Preview |
| `API_VERSION` | (vacío) | ☑️ Preview |
| `APP_NAME` | `El Pollo Empoderado [DEV]` | ☑️ Preview |
| `ENABLE_DEBUG` | `true` | ☑️ Preview |
| `TOKEN_KEY` | `admin_token` | ☑️ Preview |
| `PRODUCTION` | `false` | ☑️ Preview |

### Para Production

Agrega estas **MISMAS variables** pero **MARCA SOLO "Production"**:

| Variable | Valor | Ambiente |
|----------|-------|----------|
| `API_URL` | `https://el-pollo-empoderado-backend-production.up.railway.app` | ☑️ Production |
| `API_PREFIX` | `/api` | ☑️ Production |
| `API_VERSION` | (vacío) | ☑️ Production |
| `APP_NAME` | `El Pollo Empoderado` | ☑️ Production |
| `ENABLE_DEBUG` | `false` | ☑️ Production |
| `TOKEN_KEY` | `admin_token` | ☑️ Production |
| `PRODUCTION` | `true` | ☑️ Production |

### 📸 Ejemplo Visual

```
┌─────────────────────────────────────────────────────────────┐
│ Environment Variables                                        │
├─────────────────────────────────────────────────────────────┤
│ Name: API_URL                                               │
│ Value (Preview): https://...backend-staging.up.railway.app │
│ Value (Production): https://...backend-production...        │
│                                                             │
│ Environments:                                               │
│ ☑️ Production    ☑️ Preview    ☐ Development               │
└─────────────────────────────────────────────────────────────┘
```

**NOTA:** Vercel permite tener **diferentes valores** para la misma variable en diferentes ambientes.

## 🔧 Build Command en Vercel

### Configuración CRÍTICA

Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **General**

#### Para TODOS los ambientes (Production y Preview):

**Build Command:**
```bash
npm run build:dev
```

**¿Por qué `build:dev` para todo?**
- Ejecuta `config:dev` que usa `.env.dev` (staging)
- Si el archivo `.env.dev` NO existe (en Vercel), lee `process.env`
- En Vercel configuras las variables diferentes por ambiente (Preview vs Production)
- El script es inteligente y usa las variables correctas según el ambiente

**Output Directory:**
```
dist/frontend/browser
```

### Alternativa: Dos Build Commands (Recomendado)

Si quieres mayor control, configura comandos diferentes:

1. **Settings** → **General** → Scroll hasta **Build & Development Settings**
2. Activa **Override** en Build Command

**Para Production:**
- Build Command: `npm run build`
- Genera `environment.prod.ts` con variables de Production

**Para Preview:**
- Vercel no permite configurar build command diferente por ambiente en el UI
- Por eso es mejor usar **siempre** `npm run build:dev`
- Y controlar el ambiente con las **variables de entorno** en Vercel

## 🏗️ Arquitectura del Backend

### Railway Environments

Debes tener dos ambientes en Railway:

1. **Staging/Develop**
   - URL: `https://el-pollo-empoderado-backend-staging.up.railway.app`
   - Branch: `develop` o `staging`
   - Base de datos: Separada (para no afectar producción)

2. **Production**
   - URL: `https://el-pollo-empoderado-backend-production.up.railway.app`
   - Branch: `main`
   - Base de datos: Producción

## 🚀 Flujo de Trabajo

### Pull Request (Preview)
1. Creas un PR hacia `main`
2. Vercel crea un preview deployment automáticamente
3. Usa las variables de **Preview** (backend staging)
4. Ejecuta: `npm run build:dev`

### Merge a Main (Production)
1. El PR se mergea
2. Vercel hace deploy a producción
3. Usa las variables de **Production** (backend production)
4. Ejecuta: `npm run build`

## 📝 Scripts Disponibles

```bash
# Desarrollo local (localhost:8080)
npm start

# Desarrollo con backend staging
npm run start:dev

# Build para producción
npm run build

# Build para staging/preview
npm run build:dev

# Build local
npm run build:local
```

## ⚠️ Importante

1. **NUNCA** commitees archivos `.env*` al repositorio
2. Los archivos `.env`, `.env.dev`, `.env.prod` están en `.gitignore`
3. En Vercel, las variables se configuran en el dashboard, NO en archivos
4. El script `set-env.js` genera automáticamente los archivos `environment.ts` en build time

## 🔍 Verificación

Para verificar qué ambiente está usando tu deploy:

1. Abre la consola del navegador
2. Busca logs que digan `[DishService]` o `[HomeComponent]`
3. Verifica la URL del API en Network tab
4. El título de la app mostrará `[DEV]` en staging

## 🐛 Troubleshooting

### Preview usa localhost en lugar de staging
- Verifica que las variables estén marcadas como **Preview** en Vercel
- Revisa que el build command sea `npm run build:dev`

### Production carga datos de staging
- Verifica que las variables de **Production** tengan la URL correcta
- Limpia el cache de Vercel y redeploy

### No carga datos del backend
- Verifica que el backend esté corriendo
- Revisa CORS en el backend
- Chequea la consola del navegador para errores
