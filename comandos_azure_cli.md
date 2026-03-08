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