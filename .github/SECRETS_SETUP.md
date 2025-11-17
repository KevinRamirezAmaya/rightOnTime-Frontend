# Configuración de Secrets para CI/CD

Este documento explica cómo configurar los secrets necesarios para que los pipelines funcionen correctamente.

## 🔑 Secrets Requeridos

### 1. SONAR_TOKEN
Token de autenticación para SonarCloud.

**Cómo obtenerlo:**
1. Ve a [SonarCloud](https://sonarcloud.io/)
2. Inicia sesión con tu cuenta de GitHub
3. Click en tu avatar → My Account → Security
4. En "Generate Tokens", ingresa un nombre: `rightOnTime-Frontend`
5. Click en "Generate"
6. Copia el token generado

### 2. SONAR_PROJECT_KEY
Identificador único del proyecto en SonarCloud.

**Cómo obtenerlo:**
1. En SonarCloud, ve a tu organización
2. Click en "+" → "Analyze new project"
3. Selecciona el repositorio `rightOnTime-Frontend`
4. El Project Key se mostrará (generalmente es: `KevinRamirezAmaya_rightOnTime-Frontend`)
5. Copia el valor

### 3. SONAR_ORGANIZATION
Nombre de tu organización en SonarCloud.

**Cómo obtenerlo:**
1. En SonarCloud, ve al dropdown de organizaciones (arriba a la izquierda)
2. El nombre de tu organización aparece ahí
3. También puedes verlo en la URL: `https://sonarcloud.io/organizations/TU-ORGANIZACION`

## 📝 Cómo Configurar los Secrets en GitHub

### Paso a Paso:

1. **Ve a tu repositorio en GitHub**
   ```
   https://github.com/KevinRamirezAmaya/rightOnTime-Frontend
   ```

2. **Navega a Settings**
   - Click en la pestaña "Settings" (⚙️)

3. **Accede a Secrets**
   - En el menú lateral izquierdo, busca "Secrets and variables"
   - Click en "Actions"

4. **Añade cada secret**
   - Click en "New repository secret"
   - Name: `SONAR_TOKEN`
   - Value: Pega el token copiado
   - Click en "Add secret"
   - Repite para los otros 2 secrets

### Verificación de Variables

Los secrets deberían verse así en GitHub:

```
SONAR_TOKEN           ••••••••
SONAR_PROJECT_KEY     ••••••••
SONAR_ORGANIZATION    ••••••••
```

## 🚀 Habilitar GitHub Pages

Para que el deployment funcione:

1. Ve a **Settings** → **Pages**
2. En "Source", selecciona: **GitHub Actions**
3. Guarda los cambios

La aplicación se desplegará en:
```
https://kevinramirezamaya.github.io/rightOnTime-Frontend/
```

## 🧪 Probar el Pipeline

Una vez configurados los secrets:

1. Haz un cambio pequeño en el código
2. Commit y push:
   ```bash
   git add .
   git commit -m "test: verificar pipeline"
   git push origin main
   ```
3. Ve a la pestaña "Actions" en GitHub
4. Verifica que los workflows se ejecuten correctamente

## 🔍 Solución de Problemas

### Error: "SONAR_TOKEN not found"
- Verifica que el secret esté escrito exactamente como `SONAR_TOKEN`
- Los nombres de secrets son case-sensitive

### Error: "Project not found in SonarCloud"
- Verifica que el proyecto esté creado en SonarCloud
- Verifica que `SONAR_PROJECT_KEY` coincida exactamente

### Error: "GitHub Pages deployment failed"
- Verifica que GitHub Pages esté habilitado
- Verifica que esté configurado en modo "GitHub Actions"
- Verifica los permisos del workflow en Settings → Actions → General

### Tests fallan en CI pero no localmente
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que no hay variables de entorno locales que falten en CI

## 📧 Soporte

Si encuentras problemas, revisa:
- [GitHub Actions Logs](https://github.com/KevinRamirezAmaya/rightOnTime-Frontend/actions)
- [SonarCloud Dashboard](https://sonarcloud.io/)
- Documentación del proyecto en el README.md
