# Configuración de Variables de Entorno

Este proyecto utiliza archivos `.env` para manejar las variables de configuración.

## Estructura

```
raíz-del-proyecto/
├── .env           ← Variables de desarrollo
├── .env.prod      ← Variables de producción
├── .env.example   ← Plantilla de ejemplo
├── scripts/
│   └── set-env.js ← Script que genera los archivos environment.ts
└── src/
    └── environments/
        ├── environment.ts      ← Generado automáticamente desde .env
        └── environment.prod.ts ← Generado automáticamente desde .env.prod
```

## Configuración Inicial

1. Copia el archivo `.env.example` como `.env`:
   ```bash
   cp .env.example .env
   ```

2. Ajusta los valores en `.env` según tu entorno de desarrollo

3. Para producción, edita `.env.prod` con los valores correctos

## Variables Disponibles

- `API_URL`: URL del backend API
- `API_PREFIX`: Prefijo de la API (ej: /api)
- `API_VERSION`: Versión de la API
- `APP_NAME`: Nombre de la aplicación
- `ENABLE_DEBUG`: Habilitar modo debug (true/false)
- `TOKEN_KEY`: Clave para almacenar el token
- `PRODUCTION`: Modo producción (true/false)

## Uso

Los scripts de npm ahora generan automáticamente los archivos de environment:

```bash
# Desarrollo (usa .env)
npm start

# Producción (usa .env.prod)
npm run build

# Desarrollo con build (usa .env)
npm run build:dev
```

## Scripts Adicionales

```bash
# Generar environment.ts desde .env manualmente
npm run config:dev

# Generar environment.prod.ts desde .env.prod manualmente
npm run config:prod
```

## Seguridad

⚠️ **IMPORTANTE**: Los archivos `.env` y `.env.prod` están incluidos en `.gitignore` y NO deben ser subidos al repositorio.

Solo el archivo `.env.example` debe estar en el control de versiones como plantilla.

## Agregar Nuevas Variables

1. Agrega la variable en `.env` y `.env.prod`
2. Agrega la variable en `.env.example`
3. Actualiza `scripts/set-env.js` para incluir la nueva variable
4. Actualiza la interfaz del objeto `environment` si es necesario
