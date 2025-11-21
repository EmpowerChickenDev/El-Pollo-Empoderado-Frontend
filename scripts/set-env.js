const fs = require('fs');
const dotenv = require('dotenv');

// Determina si estamos en producción
const isProd = process.argv[2] === 'prod';

// Nombres de archivo esperados (solo para entorno local)
const envFile = isProd ? '.env.prod' : '.env';

let envConfig = {};

// 1️⃣ Intentar cargar archivo .env SOLO si existe (local)
if (fs.existsSync(envFile)) {
  console.log(`✔ Archivo ${envFile} encontrado. Cargando variables...`);
  envConfig = dotenv.parse(fs.readFileSync(envFile));
} else {
  // 2️⃣ Si NO existe (ej: Vercel), usar process.env con valores por defecto
  console.log(`⚠ Archivo ${envFile} NO encontrado. Usando variables de entorno del sistema (Vercel).`);

  envConfig = {
    PRODUCTION: process.env.PRODUCTION || (isProd ? 'true' : 'false'),
    API_URL: process.env.API_URL || 'https://el-pollo-empoderado-backend-production.up.railway.app/',
    API_PREFIX: process.env.API_PREFIX || '/api',
    API_VERSION: process.env.API_VERSION || '',
    APP_NAME: process.env.APP_NAME || 'El Pollo Empoderado',
    ENABLE_DEBUG: process.env.ENABLE_DEBUG || (isProd ? 'false' : 'true'),
    TOKEN_KEY: process.env.TOKEN_KEY || 'admin_token',
  };

  // Advertencia si se está usando la API por defecto en producción
  if (isProd && envConfig.API_URL === 'http://localhost:8080') {
    console.warn(`\n⚠️  ADVERTENCIA: Usando API_URL por defecto (localhost) en modo PRODUCCIÓN`);
    console.warn(`   Configura API_URL en tu plataforma de deployment para usar el backend correcto.\n`);
  }
}

// Crear el contenido de environment.ts
const environmentFileContent = `// Este archivo es generado automáticamente
// NO EDITAR MANUALMENTE

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

console.log(`✓ Archivo ${outputFile} generado correctamente.`);
