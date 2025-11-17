# rightOnTime Frontend

[![CI Pipeline](https://github.com/KevinRamirezAmaya/rightOnTime-Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/KevinRamirezAmaya/rightOnTime-Frontend/actions/workflows/ci.yml)
[![Deploy](https://github.com/KevinRamirezAmaya/rightOnTime-Frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/KevinRamirezAmaya/rightOnTime-Frontend/actions/workflows/deploy.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=KevinRamirezAmaya_rightOnTime-Frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=KevinRamirezAmaya_rightOnTime-Frontend)

Sistema de gestión de asistencias - Frontend desarrollado con React, TypeScript y Vite.

## 🚀 Tecnologías

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Enrutamiento
- **Vitest** - Framework de testing
- **ESLint** - Linter de código

## 📋 Requisitos previos

- Node.js 20 o superior
- npm 9 o superior

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/KevinRamirezAmaya/rightOnTime-Frontend.git

# Instalar dependencias
npm install
```

## 🏃 Comandos disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en http://localhost:5173

# Build
npm run build        # Compila TypeScript y construye para producción

# Preview
npm run preview      # Vista previa del build de producción

# Testing
npm run test         # Ejecuta tests en modo watch
npm run test:coverage # Genera reporte de cobertura

# Linting
npm run lint         # Ejecuta ESLint
```

## 🔄 CI/CD Pipeline

Este proyecto cuenta con 3 workflows de GitHub Actions:

### 1. CI Pipeline (`ci.yml`)
Ejecuta en cada push y PR a `main` y `develop`:
- ✅ **Lint**: Verifica calidad de código con ESLint
- 🧪 **Test**: Ejecuta tests unitarios con cobertura
- 📊 **SonarCloud**: Análisis de calidad y seguridad
- 🏗️ **Build**: Compila el proyecto

### 2. Deploy Pipeline (`deploy.yml`)
Ejecuta en cada push a `main`:
- 🚀 Despliega automáticamente a GitHub Pages
- 📦 Build optimizado para producción

### 3. PR Quality Check (`pr-check.yml`)
Ejecuta en cada Pull Request:
- ✨ Verificación completa de calidad
- 💬 Comentarios automáticos en el PR
- 📈 Reporte de cobertura de tests

## 🔐 Secrets requeridos

Para que los workflows funcionen correctamente, configura estos secrets en GitHub:

```
SONAR_TOKEN           # Token de SonarCloud
SONAR_PROJECT_KEY     # Key del proyecto en SonarCloud
SONAR_ORGANIZATION    # Organización de SonarCloud
```

### Cómo configurar secrets:
1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"
4. Añade cada secret con su valor correspondiente

## 📊 SonarCloud

El proyecto está integrado con SonarCloud para análisis continuo de calidad. La configuración está en `sonar-project.properties`.

## 🌐 Deployment

### GitHub Pages
El proyecto se despliega automáticamente a GitHub Pages en cada push a `main`.

Para habilitar GitHub Pages:
1. Ve a Settings → Pages
2. Source: GitHub Actions
3. La URL será: `https://kevinramirezamaya.github.io/rightOnTime-Frontend/`

### Otros servicios
El build generado en `dist/` puede desplegarse en:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

## 🏗️ Estructura del proyecto

```
src/
├── components/      # Componentes reutilizables
│   ├── forms/      # Componentes de formularios
│   ├── layout/     # Componentes de layout
│   └── shared/     # Componentes compartidos
├── context/        # Context API de React
├── data/           # Datos de seed/mock
├── helpers/        # Funciones auxiliares
├── pages/          # Páginas de la aplicación
├── routes/         # Configuración de rutas
│   └── guards/     # Guards de autenticación
├── types/          # Tipos TypeScript
└── __tests__/      # Tests unitarios
```

## 🧪 Testing

El proyecto usa Vitest con React Testing Library. Los tests incluyen:
- Componentes UI
- Context de la aplicación
- Helpers y utilidades

Cobertura mínima recomendada: 80%

## 🤝 Contribución

1. Crea una rama desde `develop`: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios
3. Asegúrate de que pasen todos los tests: `npm run test`
4. Verifica el linting: `npm run lint`
5. Commit: `git commit -m "feat: descripción del cambio"`
6. Push: `git push origin feature/nueva-funcionalidad`
7. Abre un Pull Request hacia `develop`

### Convención de commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, sin cambios de código
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Cambios en build o dependencias

## 📝 License

Este proyecto es privado y pertenece a rightOnTime.

## 👥 Equipo

Desarrollado por Kevin Ramirez Amaya y equipo.
