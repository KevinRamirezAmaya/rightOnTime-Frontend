# Guía Rápida: Pipeline CI/CD

## ✅ Lo que se instaló

### Workflows de GitHub Actions:

1. **`.github/workflows/ci.yml`** - Pipeline principal de CI
   - Lint con ESLint
   - Tests con Vitest + cobertura
   - Análisis de SonarCloud
   - Build del proyecto

2. **`.github/workflows/deploy.yml`** - Deployment automático
   - Despliega a GitHub Pages en cada push a `main`

3. **`.github/workflows/pr-check.yml`** - Verificación de PRs
   - Ejecuta checks de calidad
   - Comenta resultados en el PR

4. **`.github/dependabot.yml`** - Actualizaciones automáticas
   - Mantiene dependencias actualizadas
   - Crea PRs semanales

## 🚀 Primeros pasos

### 1. Configurar Secrets (IMPORTANTE)
Sigue las instrucciones en `.github/SECRETS_SETUP.md` para configurar:
- `SONAR_TOKEN`
- `SONAR_PROJECT_KEY`
- `SONAR_ORGANIZATION`

### 2. Habilitar GitHub Pages
- Settings → Pages → Source: "GitHub Actions"

### 3. Hacer un commit para probar
```bash
git add .
git commit -m "ci: setup CI/CD pipeline"
git push origin main
```

### 4. Verificar
- Ve a la pestaña "Actions" en GitHub
- Deberías ver los workflows ejecutándose

## 📊 Flujos de trabajo

### Push a main o develop:
```
push → Lint → Test → SonarCloud → Build → Deploy (solo main)
```

### Pull Request:
```
PR abierto → Lint → Test → Build → Comentario en PR
```

## 🔧 Personalización

### Cambiar rama de deploy
En `.github/workflows/deploy.yml`, línea 4:
```yaml
branches: [ main ]  # Cambia a tu rama de producción
```

### Cambiar URL de deploy
Si no usas GitHub Pages, modifica `.github/workflows/deploy.yml` según tu proveedor:
- **Vercel**: Usa `vercel-action`
- **Netlify**: Usa `netlify-cli-deploy-action`
- **AWS**: Usa `aws-actions/configure-aws-credentials`

### Ajustar coverage mínima
En `vitest.config.ts`, añade:
```typescript
coverage: {
  thresholds: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

## 🆘 Troubleshooting

### El pipeline falla con "SONAR_TOKEN not found"
→ Configura los secrets (ver `.github/SECRETS_SETUP.md`)

### Tests pasan localmente pero fallan en CI
→ Verifica variables de entorno y dependencias

### Deploy falla
→ Verifica que GitHub Pages esté habilitado con source "GitHub Actions"

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [SonarCloud Docs](https://docs.sonarcloud.io/)
- [Vitest Docs](https://vitest.dev/)
- Guía completa: `README.md`
- Setup de secrets: `.github/SECRETS_SETUP.md`
