# Secuencia de Comandos Azure CLI Ejecutados - Prototipo EXOAL

Este archivo documenta la secuencia de comandos Azure CLI ejecutados exitosamente durante la configuración del prototipo. Se mantiene actualizado conforme avanzamos.

## Fecha: 2026-03-08

### 1. Login a Azure
```bash
az login --tenant ac82d79c-81f8-4775-8b73-25c301d19a27 --use-device-code
```
**Descripción:** Autenticación en Azure usando device code para el tenant específico.
**Resultado:** Login exitoso con Visual Studio Enterprise Subscription.

### 2. Verificar suscripción activa
```bash
az account show --output table
```
**Descripción:** Mostrar la suscripción Azure activa en formato tabla.
**Resultado:** Confirmó "Visual Studio Enterprise Subscription" en estado "Enabled".

### 3. Crear grupo de recursos
```bash
az group create --name rg-exoal-prototipo --location eastus
```
**Descripción:** Crear grupo de recursos para organizar recursos del prototipo en East US.
**Resultado:** Grupo creado exitosamente (aunque posteriormente se cambió a West US 2).

### 4. Eliminar servidor SQL fallido
```bash
az sql server delete --name sql-exoal-prototipo --resource-group rg-exoal-prototipo --yes
```
**Descripción:** Eliminar servidor SQL creado en East US que falló por restricciones regionales.
**Resultado:** Servidor eliminado exitosamente.

### 5. Crear servidor Azure SQL
```bash
az sql server create --name sql-exoal-prototipo --resource-group rg-exoal-prototipo --location westus2 --admin-user admin_exoal --admin-password P@ssw0rd123! --enable-public-network true
```
**Descripción:** Crear servidor Azure SQL en West US 2 con credenciales de administrador.
**Resultado:** Servidor creado exitosamente con FQDN sql-exoal-prototipo.database.windows.net.

### 6. Crear base de datos Azure SQL
```bash
az sql db create --name db-exoal-prototipo --server sql-exoal-prototipo --resource-group rg-exoal-prototipo --edition Basic --capacity 5 --zone-redundant false
```
**Descripción:** Crear base de datos en el servidor SQL con tier Basic (económico para prototipo).
**Resultado:** Base de datos creada exitosamente con 2GB de espacio.

### 7. Configurar firewall del servidor SQL
```bash
az sql server firewall-rule create --resource-group rg-exoal-prototipo --server sql-exoal-prototipo --name AllowMyIP --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```
**Descripción:** Permitir conexiones desde cualquier IP (temporal para desarrollo).
**Resultado:** Regla de firewall creada exitosamente.

### 8. Obtener cadena de conexión
```bash
az sql db show-connection-string --server sql-exoal-prototipo --name db-exoal-prototipo --client ado.net
```
**Descripción:** Mostrar la cadena de conexión para la base de datos.
**Resultado:** Cadena de conexión generada: Server=tcp:sql-exoal-prototipo.database.windows.net,1433;Initial Catalog=db-exoal-prototipo;...

---

**Notas:**
- Todos los comandos se ejecutaron en PowerShell.
- Las credenciales de BD son: admin_exoal / P@ssw0rd123!
- Próximos comandos se agregarán conforme avancemos (Spring Boot, App Service, etc.).

## Desarrollo del Backend - Spring Boot

### Creación del proyecto Spring Boot
**Método utilizado:** Creación manual de estructura Maven (debido a problemas con Maven archetype)
**Archivos creados:**
- `pom.xml`: Configuración Maven con dependencias Spring Boot 3.2.0, Web, Data JPA, SQL Server, Security
- `src/main/java/com/exoal/prototipo/PrototipoExoalApplication.java`: Clase principal de Spring Boot
- `src/main/resources/application.properties`: Configuración de conexión a Azure SQL Database
- Entidades JPA: `Sede.java`, `Usuario.java`, `Actividad.java`
- Repositorios: `SedeRepository.java`, `UsuarioRepository.java`, `ActividadRepository.java`
- Controlador REST: `SedeController.java` para operaciones CRUD básicas

**Configuración de base de datos:**
```properties
spring.datasource.url=jdbc:sqlserver://exoal-server.database.windows.net:1433;database=exoal-db;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;
spring.datasource.username=admin_exoal
spring.datasource.password=P@ssw0rd123!
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
```

**Estado actual:** Proyecto compilado exitosamente, aplicación iniciándose en background para pruebas de conexión.

## Desarrollo del Frontend - React con TypeScript

### Creación del proyecto React
**Comandos ejecutados:**
```bash
# Creación manual del proyecto React con estructura personalizada
mkdir frontend-exoal
cd frontend-exoal
# Archivos creados: package.json, tsconfig.json, tailwind.config.js
# Estructura: src/, public/, componentes, páginas, servicios, tipos
```

### Dependencias instaladas
```bash
npm install
# Dependencias principales:
# - react, react-dom, react-scripts
# - typescript, @types/react, @types/react-dom
# - axios, react-router-dom
# - tailwindcss, autoprefixer, postcss
```

### Ejecución del frontend
```bash
npm start
# Servidor de desarrollo ejecutándose en http://localhost:3000
```

### Características implementadas
- **Interfaz completa de gestión de sedes** con operaciones CRUD
- **Navegación responsive** con React Router
- **Diseño moderno** con Tailwind CSS
- **Consumo de API REST** del backend Spring Boot
- **Manejo de estados** y errores
- **TypeScript** para tipado fuerte
- **Estructura modular** con componentes reutilizables

## Repositorio GitHub

### Creación del repositorio
```bash
gh repo create prototipo-exoal --public --description "Prototipo EXOAL - Sistema de gestión académica con Spring Boot y Azure SQL" --source . --push
```
**Resultado:** Repositorio creado exitosamente en https://github.com/marcmanonlyme/prototipo-exoal
- Repositorio público con código fuente completo
- Incluye: código Spring Boot, React frontend, configuración Azure, documentación de comandos
- Excluye: documentación interna del proyecto académico

---

## Fecha: 2026-03-11

## Fase 3 - Variables de Entorno y CORS

### Git: commit y push Fase 3
```bash
git add -A
git commit -m "feat: fase 3 - parametrize credentials and CORS with env vars"
git push
```
**Descripción:** Commit de los cambios de Fase 3: credenciales parametrizadas con variables de entorno (application.properties), perfil prod (application-prod.properties), CORS dinámico vía @Value en SecurityConfig.java, REACT_APP_API_URL en api.ts, y .env.example para referencia.
**Resultado:** Commit `b34fbb7c` pusheado a origin/master.

### Git: fix .gitignore (untrack cache files)
```bash
# Eliminar archivos de caché del tracking de git
git rm --cached "frontend-exoal/node_modules/.cache/.eslintcache"
git rm --cached "frontend-exoal/node_modules/.cache/tsconfig.tsbuildinfo"

git add .gitignore
git commit -m "chore: add node_modules and env.local to gitignore, untrack cache files"
git push
```
**Descripción:** Se agrega `node_modules/`, `frontend-exoal/build/`, `.env.local` y `.env.*.local` al `.gitignore` raíz del repo (ubicado en `EXOAL/`), y se eliminan del tracking los archivos de caché que se habían colado.
**Resultado:** Commit `03a9928d` pusheado. Los archivos de caché ya no aparecen en `git status`.

---

## Fase 4 - Deploy a Azure App Service

### 9. Build del JAR (Spring Boot)
```bash
cd prototipo-exoal
mvn package -DskipTests -q
```
**Descripción:** Generar el artefacto JAR ejecutable para deploy en Azure App Service, omitiendo tests para agilizar el build.
**Resultado:** `target/prototipo-exoal-0.0.1-SNAPSHOT.jar` generado (48 MB).

### 10. Verificar suscripción y recursos existentes
```bash
az account show --query "{subscription:name, id:id}" -o table
az group list --query "[].{name:name, location:location}" -o table
az resource list -g rg-exoal-prototipo --query "[].{name:name, type:type}" -o table
```
**Descripción:** Confirmar cuenta activa y auditar recursos existentes antes del deploy.
**Resultado:** Suscripción "Visual Studio Enterprise Subscription". Recursos existentes: servidor SQL `sql-exoal-prototipo` y BD `db-exoal-prototipo`.

### 11. Crear App Service Plan (Linux B1)
```bash
# Nota: eastus, westus2 y F1 fallaron por cuota insuficiente (Basic VMs: 0)
# centralus tiene disponibilidad
az appservice plan create \
  --name asp-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --location centralus \
  --sku B1 \
  --is-linux
```
**Descripción:** Crear plan de App Service Linux con tier Basic 1 (1 vCore, 1.75 GB RAM). Se intentó primero eastus y westus2 pero ambas regiones tenían cuota 0 para VMs Basic y Free. `centralus` fue la primera región con disponibilidad.
**Resultado:** Plan `asp-exoal-prototipo` creado en Central US, estado `Ready`.

### 12. Crear Web App (Java 17)
```bash
az webapp create \
  --name app-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --plan asp-exoal-prototipo \
  --runtime "JAVA:17-java17"
```
**Descripción:** Crear la Web App con runtime Java 17 sobre el plan Linux B1.
**Resultado:** App `app-exoal-prototipo` creada, estado `Running`. URL: https://app-exoal-prototipo.azurewebsites.net

### 13. Configurar App Settings (variables de entorno del backend)
```bash
az webapp config appsettings set \
  --name app-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --settings \
    DB_URL="jdbc:sqlserver://sql-exoal-prototipo.database.windows.net:1433;database=db-exoal-prototipo;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;" \
    DB_USERNAME="admin_exoal" \
    DB_PASSWORD="P@ssw0rd123!" \
    CORS_ALLOWED_ORIGINS="http://localhost:3000" \
    SPRING_PROFILES_ACTIVE="prod"
```
**Descripción:** Inyectar las credenciales y configuración como variables de entorno en App Service. `CORS_ALLOWED_ORIGINS` se actualizará con la URL real del Static Web App una vez creado. `SPRING_PROFILES_ACTIVE=prod` activa `application-prod.properties` (show-sql=false).
**Resultado:** 5 settings configurados correctamente (SlotSetting: False = aplica a todos los slots).

### 14. Configurar startup command de la Web App
```bash
az webapp config set \
  --name app-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --startup-file "java -jar /home/site/wwwroot/app.jar"
```
**Descripción:** Especificar el comando de arranque de la JVM. Azure App Service Linux con runtime JAVA:17 coloca el JAR en `/home/site/wwwroot/app.jar`.
**Resultado:** Startup command configurado.

### 15. Deploy del JAR a Azure App Service
```bash
az webapp deploy \
  --name app-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --src-path "prototipo-exoal/target/prototipo-exoal-0.0.1-SNAPSHOT.jar" \
  --type jar \
  --async false
```
**Descripción:** Subir el JAR de 48 MB a App Service usando la API OneDeploy de Kudu (reemplaza FTP/Zip deploy). `--async false` hace polling hasta que el deploy completa.
**Resultado:** Deploy exitoso (`status: 4, complete: true`). App arrancó en ~65s (cold start). HTTP 200 en `/api/sedes` confirmado.
**URL backend:** https://app-exoal-prototipo.azurewebsites.net

### 16. Crear Azure Static Web App
```bash
az staticwebapp create \
  --name swa-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --location "eastus2" \
  --sku Free
```
**Descripción:** Crear el recurso SWA en East US 2 (soporte Free tier). Se separa la creación del recurso del setup de CI/CD para mayor control. La integración con GitHub se hace vía GitHub Actions + deployment token.
**Resultado:** SWA creada. URL: https://witty-sea-072acca0f.4.azurestaticapps.net

### 17. Obtener deployment token del SWA
```bash
az staticwebapp secrets list \
  --name swa-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --query "properties.apiKey" -o tsv
```
**Descripción:** Obtener el token de deploy para configurarlo como GitHub Secret y usarlo en el workflow de CI/CD.
**Resultado:** Token obtenido exitosamente.

### 18. Configurar REACT_APP_API_URL en SWA
```bash
az staticwebapp appsettings set \
  --name swa-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --setting-names REACT_APP_API_URL="https://app-exoal-prototipo.azurewebsites.net/api"
```
**Descripción:** Inyectar la URL del backend como variable de entorno en el Static Web App.
**Resultado:** Setting configurado exitosamente.

### 19. Actualizar CORS del backend con URL del SWA
```bash
az webapp config appsettings set \
  --name app-exoal-prototipo \
  --resource-group rg-exoal-prototipo \
  --settings CORS_ALLOWED_ORIGINS="https://witty-sea-072acca0f.4.azurestaticapps.net,http://localhost:3000"
```
**Descripción:** Agregar la URL real del SWA al CORS permitido del backend para que las peticiones cross-origin sean aceptadas.
**Resultado:** Setting actualizado en el App Service backend.

### 20. Configurar GitHub Secret para el token SWA
```bash
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN \
  --body "<token>" \
  --repo marcmanonlyme/prototipo-exoal
```
**Descripción:** Almacenar el deployment token de SWA como GitHub Actions secret para que el workflow pueda deployar de forma segura sin exponer el token en el código.
**Resultado:** Secret configurado ✓

### 21. CI/CD - GitHub Actions workflow para frontend
**Archivo creado:** `.github/workflows/deploy-frontend.yml`
**Descripción:** Workflow que buildea el frontend con Node 18 en el runner de GitHub (evita el bug de permisos de Oryx) y sube el output al SWA. Se activa en push a `frontend-exoal/**` o manualmente.

**Notas sobre resolución de problema:**
- Error inicial: Oryx retornaba `react-scripts: Permission denied` porque los binarios de `node_modules/.bin/` pierden el bit de ejecución con `npm install` en el entorno Oryx.
- Solución: pre-buildear con `npm ci && npm run build` en el runner ubuntu-latest, y usar `skip_app_build: true` + `app_location: "frontend-exoal/build"` para que Oryx solo suba los archivos estáticos ya compilados.

**Resultado:** 3er intento exitoso. `conclusion: success`. HTTP 200 en https://witty-sea-072acca0f.4.azurestaticapps.net confirmado → sirve el `index.html` del frontend React compilado.

---

## Resumen de recursos Azure en producción

| Recurso | Nombre | URL / FQDN |
|---------|--------|------------|
| Resource Group | rg-exoal-prototipo | eastus |
| Azure SQL Server | sql-exoal-prototipo | sql-exoal-prototipo.database.windows.net |
| Azure SQL DB | db-exoal-prototipo | - |
| App Service Plan | asp-exoal-prototipo | centralus, B1 Linux |
| App Service (backend) | app-exoal-prototipo | https://app-exoal-prototipo.azurewebsites.net |
| Static Web App (frontend) | swa-exoal-prototipo | https://witty-sea-072acca0f.4.azurestaticapps.net |