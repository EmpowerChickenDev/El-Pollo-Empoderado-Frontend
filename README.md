# El Pollo Empoderado — Frontend

> Frontend Angular para el proyecto "El Pollo Empoderado" (interfaz pública y panel administrativo).

## Descripción

Interfaz de usuario construida con Angular para gestionar la experiencia pública (home, menú, carrito, pedidos) y paneles administrativos. Proyecto en desarrollo — enfoque en modularidad y separación de features.

## Requisitos

- Node.js (recomendado v14+ / v16+)
- npm (v6+)
- Angular CLI (opcional para comandos `ng`)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/EmpowerChickenDev/El-Pollo-Empoderado-Frontend.git
cd El-Pollo-Empoderado-Frontend
```

2. Instala dependencias:

```bash
npm install
```

## Comandos útiles

- `npm start` o `ng serve` — arranca la aplicación en modo desarrollo. Por defecto la app suele quedar disponible en `http://localhost:4200`.
- `npm test` — ejecuta la suite de tests configurada.

> Si prefieres usar Angular CLI directamente:

```bash
npx ng serve
npx ng test
```

## Estructura principal

- `angular.json` — configuración del workspace Angular.
- `package.json` — scripts y dependencias.
- `src/` — código fuente de la aplicación:
  - `src/main.ts` — punto de entrada.
  - `src/index.html` — HTML principal.
  - `src/styles.css` — estilos globales.
  - `src/app/` — aplicación principal
    - `app.ts`, `app.routes.ts`, `app.config.ts`, `app.html`, `app.css`
    - `core/` — guards, interceptors, services, models
    - `features/` — módulos por feature (auth, home, menu, cart, orders, admin)
    - `layouts/` — layouts reutilizables (admin, blank, public)
    - `shared/` — componentes, directivas, pipes, UI

## Buenas prácticas

- Mantener cada feature en su propio módulo dentro de `src/app/features/`.
- Usar servicios en `core/services/` para lógica compartida y comunicación con APIs.
- Añadir tests unitarios para componentes y servicios nuevos.

## Contribuir

1. Crea una rama con tu cambio: `git checkout -b feat/mi-cambio`
2. Haz commits pequeños y descriptivos.
3. Abre un pull request hacia `main` cuando tu cambio esté listo.

## Convenciones y calidad de código

- **Conventional Commits**: Este repositorio sigue las reglas de Conventional Commits para mensajes de commit (por ejemplo: `feat: agregar componente de menú`, `fix(cart): corregir cálculo de total`). Esto facilita el versionado semántico y la generación de changelogs.
- **Husky**: Se utiliza `husky` para instalar hooks de Git que ejecutan comprobaciones antes de los commits/push. Los hooks típicos incluyen linting y validación de mensajes de commit (commitlint).
- **ESLint**: El proyecto usa `eslint` (configurado con `angular-eslint`) para mantener la calidad y consistencia del código. Ejecuta el linter antes de commits y/o como parte de CI.
