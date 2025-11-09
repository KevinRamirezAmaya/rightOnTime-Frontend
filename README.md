# RightOnTime · Registro de asistencia

Front-end en React + TypeScript + Vite para gestionar la asistencia de colaboradores con un estilo minimalista en tonos pastel y métricas operativas para administración.

## Características

- **Autenticación simulada** con flujos de inicio de sesión y registro diferenciados por rol (empleado o administrador).
- **Registro de entradas y salidas** con historial reciente y resumen de la jornada para cada colaborador.
- **Dashboard administrativo** con promedios de entrada/salida, horas trabajadas y pendientes de salida.
- **Estilos con Tailwind CSS** orientados a una UI limpia, pastel y responsiva.
- **Pipeline de calidad** listo para SonarCloud incluyendo métricas clave y cobertura mínima del 60 %.

## Requisitos previos

- Node.js 20.x
- npm 10.x (incluido con Node 20)

## Instalación y ejecución

```bash
npm install
npm run dev
```

El servidor de desarrollo queda disponible normalmente en `http://localhost:5173`.

## Scripts disponibles

- `npm run dev`: levanta el entorno de desarrollo.
- `npm run build`: genera el build optimizado de producción.
- `npm run preview`: sirve el build de producción para validación manual.
- `npm run lint`: ejecuta ESLint sobre todo el proyecto.
- `npm run test`: ejecuta Vitest en modo interactivo.
- `npm run test:coverage`: ejecuta Vitest en modo CLI con reporte `lcov`; aplica umbrales del 60 % para statements, branches, functions y lines.

## SonarCloud y CI/CD

1. Crea los secretos en GitHub (`Settings → Secrets and variables → Actions`):
   - `SONAR_TOKEN`
   - `SONAR_ORGANIZATION`
   - `SONAR_PROJECT_KEY`
2. Ajusta/crea el proyecto en SonarCloud y relaciona el repositorio.
3. Actualiza el archivo `.env` (o usa `.env.example` como plantilla):

   ```env
   SONAR_TOKEN=your-sonar-token
   SONAR_ORGANIZATION=your-sonarcloud-organization
   SONAR_PROJECT_KEY=your-sonarcloud-project-key
   SONAR_HOST_URL=https://sonarcloud.io
   ```

4. El workflow `CI SonarCloud` (`.github/workflows/sonarcloud.yml`) se ejecuta en cada push a `main` y en los pull requests. Realiza `lint`, pruebas con cobertura, build y finalmente el escaneo de SonarCloud.

La configuración de SonarCloud vive en `sonar-project.properties` y utiliza el reporte `coverage/lcov.info` generado por Vitest.

## Estilos y diseño

- Tailwind CSS se configura vía `tailwind.config.js` con una paleta pastel personalizada.
- El CSS base (`src/index.css`) aplica las directivas `@tailwind` y utilidades personalizadas para inputs, botones y tipografía.
- No se requiere `App.css`; toda la UI se arma con clases Tailwind.

## Arquitectura de carpetas

- `src/routes`: rutas protegidas (admin, empleado) y componentes de navegación (`AppRoutes`, guards, redirecciones).
- `src/context`: `AppProvider` centraliza sesión, registros y acciones de autenticación/horarios.
- `src/pages`: páginas separadas (`Login`, `Register`, `Attendance`, `Dashboard`) orientadas a responsabilidades específicas.
- `src/components`: piezas reutilizables (layout, formularios, métricas, resúmenes) con estilos coherentes.
- `src/helpers`: utilidades de formato y cálculo de métricas de asistencia.
- `src/data`: datos semilla (`seededRecords`) para arrancar el front sin backend.

## Estructura principal de vistas

- `LoginView`: acceso por rol, permite saltar a registro.
- `RegisterView`: registro de nuevos colaboradores o administradores, captura opcional del ID interno.
- `AttendanceView`: vista de empleado con registro de jornada y tabla histórica.
- `AdminDashboard`: tablero con métricas agregadas, filtro por colaborador y tabla detallada.

## Pruebas automatizadas

Los tests viven en `src/__tests__/App.test.tsx` y validan los flujos esenciales de navegación de vistas y login. Ejecuta `npm run test:coverage` para obtener el reporte con cobertura mayor al 60 %.

---

¿Siguientes pasos? Integrar backend, persistencia real de registros y autenticación segura según la infraestructura de tu organización.
