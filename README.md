# Prototipo EXOAL

Sistema de gestión académica desarrollado como prototipo para el proyecto EXOAL. Implementa una arquitectura de tres capas: frontend React en Azure Static Web Apps, backend Spring Boot en Azure App Service y base de datos Azure SQL.

## 🌐 URLs de Producción

| Componente | URL |
|-----------|-----|
| Frontend (SWA) | https://witty-sea-072acca0f.4.azurestaticapps.net |
| Backend (API) | https://app-exoal-prototipo.azurewebsites.net |

## 🚀 Características

**Backend**
- Spring Boot 3.2.0 con Spring Data JPA
- Autenticación JWT stateless (BCrypt + HS256)
- Control de acceso por rol: `administrador`, `docente`, `estudiante`, `visitante`
- Filtrado de actividades económicas por rol (solo docentes y administradores)
- Filtros dinámicos en actividades (sede, tipo, título, fechas, estado)
- CORS configurable vía variable de entorno
- Inicialización automática de usuarios demo al arranque

**Frontend**
- React 18 con TypeScript
- Autenticación con contexto global y rutas protegidas
- Páginas completas para Sedes, Actividades y Usuarios (CRUD)
- 9 pruebas unitarias (Jest + React Testing Library)

**Base de datos**
- Azure SQL Database — 9 sedes, 10 actividades, 3 usuarios demo
- Schema gestionado manualmente (`ddl-auto=none`)

## 📋 Prerrequisitos

- Java 17+
- Maven 3.6+
- Node.js 18+
- Azure CLI (para despliegue)
- Cuenta de Azure con suscripción activa

## 🛠️ Ejecución local

### 1. Clonar el repositorio
```bash
git clone https://github.com/marcmanonlyme/prototipo-exoal.git
cd prototipo-exoal
```

### 2. Backend
```bash
cd prototipo-exoal
mvn spring-boot:run
# API disponible en http://localhost:8080
```

Las variables de entorno necesarias (o sus valores por defecto en `application.properties`):

| Variable | Descripción | Default local |
|----------|-------------|---------------|
| `DB_URL` | JDBC connection string de Azure SQL | instancia demo |
| `DB_USERNAME` | Usuario de BD | `admin_exoal` |
| `DB_PASSWORD` | Contraseña de BD | — |
| `JWT_SECRET` | Clave para firmar tokens (mín. 32 chars) | clave de desarrollo |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos (separados por coma) | `http://localhost:3000` |

### 3. Frontend
```bash
cd frontend-exoal
npm install
npm start
# Disponible en http://localhost:3000
```

### 4. Pruebas
```bash
# Backend (26 pruebas unitarias)
cd prototipo-exoal
mvn test

# Frontend (9 pruebas)
cd frontend-exoal
npm test
```

## 👤 Usuarios demo

Creados automáticamente al arrancar la aplicación:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@demo.edu` | `Admin1234` | administrador |
| `docente@demo.edu` | `Docente123` | docente |
| `estudiante@demo.edu` | `Estudiante123` | estudiante |

## 📚 API Endpoints

### Autenticación
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/auth/login` | público | Login, retorna JWT |

### Sedes
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/sedes` | público | Listar todas las sedes |
| GET | `/api/sedes/{id}` | público | Obtener sede por ID |
| POST | `/api/sedes` | administrador | Crear sede |
| PUT | `/api/sedes/{id}` | administrador | Actualizar sede |
| DELETE | `/api/sedes/{id}` | administrador | Eliminar sede |

### Actividades
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/actividades` | público* | Listar actividades (con filtros opcionales) |
| GET | `/api/actividades/{id}` | público* | Obtener actividad por ID |
| POST | `/api/actividades` | administrador | Crear actividad |
| PUT | `/api/actividades/{id}` | administrador | Actualizar actividad |
| DELETE | `/api/actividades/{id}` | administrador | Eliminar actividad |

> *Las actividades de tipo `economica` solo son visibles para roles `docente` y `administrador`.

Filtros disponibles en `GET /api/actividades`: `sedeId`, `tipo`, `titulo`, `desde`, `hasta`, `estado`.

### Usuarios
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/usuarios` | autenticado | Listar usuarios |
| GET | `/api/usuarios/{id}` | autenticado | Obtener usuario por ID |
| POST | `/api/usuarios` | administrador | Crear usuario |
| PUT | `/api/usuarios/{id}` | administrador | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | administrador | Eliminar usuario |

## 🏗️ Estructura del proyecto

```
EXOAL/
├── prototipo-exoal/                   # Backend Spring Boot
│   ├── src/main/java/com/exoal/prototipo/
│   │   ├── config/
│   │   │   ├── DataInitializer.java   # Siembra usuarios demo al arranque
│   │   │   └── SecurityConfig.java    # JWT, CORS y reglas de acceso
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── SedeController.java
│   │   │   ├── ActividadController.java
│   │   │   └── UsuarioController.java
│   │   ├── dto/
│   │   │   ├── LoginRequest.java
│   │   │   └── LoginResponse.java
│   │   ├── entity/
│   │   │   ├── Sede.java
│   │   │   ├── Usuario.java
│   │   │   └── Actividad.java
│   │   ├── repository/
│   │   │   ├── SedeRepository.java
│   │   │   ├── UsuarioRepository.java
│   │   │   ├── ActividadRepository.java
│   │   │   └── ActividadSpecification.java
│   │   └── security/
│   │       ├── JwtUtil.java
│   │       └── JwtAuthFilter.java
│   └── src/main/resources/
│       ├── application.properties
│       └── application-prod.properties
│
├── frontend-exoal/                    # Frontend React + TypeScript
│   └── src/
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── SedesPage.tsx
│       │   ├── ActividadesPage.tsx
│       │   └── UsuariosPage.tsx
│       ├── contexts/AuthContext.tsx
│       ├── components/
│       │   ├── PrivateRoute.tsx
│       │   ├── ErrorBanner.tsx
│       │   └── LoadingSpinner.tsx
│       ├── services/api.ts
│       └── types/index.ts
│
├── .github/workflows/
│   ├── deploy-backend.yml             # CI/CD → Azure App Service
│   └── deploy-frontend.yml            # CI/CD → Azure Static Web Apps
│
├── create_tables.sql                  # Script DDL de creación de tablas
├── migrate_schema_v1.sql              # Migración: agrega id_institucional
└── comandos_azure_cli.md              # Registro de comandos Azure CLI
```

## 🗄️ Modelo de Datos

| Entidad | Tabla | Descripción |
|---------|-------|-------------|
| `Sede` | `sede` | Planteles, unidades y centros (3 tipos) |
| `Usuario` | `usuario` | Roles: administrador, docente, estudiante, visitante |
| `Actividad` | `actividad` | Tipos: cultural, académica, extraacadémica, administrativa, económica |

## ☁️ Infraestructura Azure

| Recurso | Nombre | Propósito |
|---------|--------|-----------|
| Resource Group | `rg-exoal-prototipo` | Contenedor de todos los recursos |
| App Service | `app-exoal-prototipo` | Backend Spring Boot (Java 17, Linux) |
| Azure SQL Server | `sql-exoal-prototipo` | Servidor de base de datos |
| Azure SQL Database | `db-exoal-prototipo` | Base de datos de la aplicación |
| Static Web App | `swa-exoal-frontend` | Hosting del frontend React |

### CI/CD

Los pipelines se disparan automáticamente en push a `master`:
- `deploy-backend.yml` — compila con Maven y despliega el JAR al App Service
- `deploy-frontend.yml` — compila con Node.js y despliega al Static Web App

Secrets requeridos en GitHub: `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_STATIC_WEB_APPS_API_TOKEN`.

## 📝 Documentación adicional

- `comandos_azure_cli.md` — Registro completo de comandos Azure CLI ejecutados
- `create_tables.sql` — Script DDL para recrear el schema desde cero
- `migrate_schema_v1.sql` — Migración v1 (agrega `id_institucional` a `usuario`)
- `docs_desarrollo/` — Documentación académica del proyecto

## 👥 Autor

Marcos Rivas Bermúdez para la Acreditación de la Ingeniería de Software, bajo el Acuerdo 286.

## 📄 Licencia

Este proyecto es de uso académico.