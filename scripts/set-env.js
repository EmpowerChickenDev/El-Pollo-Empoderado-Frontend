const fs = require('fs');
const dotenv = require('dotenv');

// Determina el ambiente: local (default), dev (staging/preview), prod (production)
const environment = process.argv[2] || 'local';
const isProd = environment === 'prod';
const isDev = environment === 'dev';

// Nombres de archivo esperados
const envFile = isProd ? '.env.prod' : isDev ? '.env.dev' : '.env';

let envConfig = {};

// Intentar cargar archivo .env SOLO si existe (local/staging/prod)
if (fs.existsSync(envFile)) {
  console.log(`✔ Archivo ${envFile} encontrado. Cargando variables...`);
  envConfig = dotenv.parse(fs.readFileSync(envFile));
} else {
  // Si NO existe (ej: Vercel/Railway), usar process.env con valores por defecto
  console.log(`⚠ Archivo ${envFile} NO encontrado. Usando variables de entorno del sistema.`);

  envConfig = {
    PRODUCTION: process.env.PRODUCTION || (isProd ? 'true' : 'false'),
    API_URL: process.env.API_URL || (isProd 
      ? 'https://el-pollo-empoderado-backend-production.up.railway.app/' 
      : isDev 
        ? 'https://el-pollo-empoderado-backend-staging.up.railway.app/'
        : 'http://localhost:8080'),
    API_PREFIX: process.env.API_PREFIX || '/api',
    API_VERSION: process.env.API_VERSION || '',
    APP_NAME: process.env.APP_NAME || `El Pollo Empoderado${isDev ? ' [DEV]' : ''}`,
    ENABLE_DEBUG: process.env.ENABLE_DEBUG || (isProd ? 'false' : 'true'),
    TOKEN_KEY: process.env.TOKEN_KEY || 'admin_token',
  };

  // Advertencia si se está usando la API por defecto en producción
  if (isProd && envConfig.API_URL.includes('localhost')) {
    console.warn(`\n⚠️  ADVERTENCIA: Usando API_URL por defecto (localhost) en modo PRODUCCIÓN`);
    console.warn(`   Configura API_URL en tu plataforma de deployment para usar el backend correcto.\n`);
  }
}

// Crear el contenido de environment.ts
const environmentFileContent = `// Este archivo es generado automáticamente
// NO EDITAR MANUALMENTE
// Ambiente: ${environment.toUpperCase()}

export const environment = {
  production: ${envConfig.PRODUCTION === "true" || isProd},
  apiUrl: '${envConfig.API_URL || 'http://localhost:8080'}',
  apiPrefix: '${envConfig.API_PREFIX || '/api'}',
  apiVersion: '${envConfig.API_VERSION || ''}',
  appName: '${envConfig.APP_NAME || 'El Pollo Empoderado'}',
  enableDebug: ${envConfig.ENABLE_DEBUG === "false" ? "false" : "true"},
  tokenKey: '${envConfig.TOKEN_KEY || 'admin_token'}',
};
`;

// Archivo de salida
const outputFile = isProd
  ? 'src/environments/environment.prod.ts'
  : 'src/environments/environment.ts';

// Escribir archivo
fs.writeFileSync(outputFile, environmentFileContent);

console.log(`✓ Archivo ${outputFile} generado correctamente para ambiente: ${environment.toUpperCase()}`);
