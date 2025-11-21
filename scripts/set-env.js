const fs = require('fs');
const dotenv = require('dotenv');

// Determinar qué archivo .env usar basado en el argumento
const envFile = process.argv[2] === 'prod' ? '.env.prod' : '.env';

// Cargar variables de entorno
const envConfig = dotenv.parse(fs.readFileSync(envFile));

// Crear el contenido del archivo environment.ts
const environmentFileContent = `// Este archivo es generado automáticamente desde ${envFile}
// NO EDITAR MANUALMENTE

export const environment = {
  production: ${envConfig.PRODUCTION || 'false'},
  apiUrl: '${envConfig.API_URL || 'http://localhost:8080'}',
  apiPrefix: '${envConfig.API_PREFIX || '/api'}',
  apiVersion: '${envConfig.API_VERSION || ''}',
  appName: '${envConfig.APP_NAME || 'El Pollo Empoderado'}',
  enableDebug: ${envConfig.ENABLE_DEBUG || 'true'},
  tokenKey: '${envConfig.TOKEN_KEY || 'admin_token'}',
};
`;

// Determinar el archivo de salida
const outputFile = process.argv[2] === 'prod' 
  ? 'src/environments/environment.prod.ts' 
  : 'src/environments/environment.ts';

// Escribir el archivo
fs.writeFileSync(outputFile, environmentFileContent);

console.log(`✓ Archivo ${outputFile} generado desde ${envFile}`);
