# Prototipo EXOAL

Sistema de gestión académica desarrollado como prototipo para el proyecto EXOAL. Implementa una arquitectura de 3 capas con Spring Boot en el backend y Azure SQL Database.

## 🚀 Características

- **Backend**: Spring Boot 3.2.0 con Spring Data JPA
- **Base de datos**: Azure SQL Database
- **Seguridad**: Spring Security
- **API REST**: Endpoints para gestión de sedes, usuarios y actividades
- **Arquitectura**: Patrón MVC con separación de capas

## 📋 Prerrequisitos

- Java 17 o superior
- Maven 3.6+
- Azure CLI (para despliegue)
- Cuenta de Azure con suscripción activa

## 🛠️ Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/marcmanonlyme/prototipo-exoal.git
cd prototipo-exoal
```

### 2. Configurar la base de datos
- Crear Azure SQL Database (ver comandos en `comandos_azure_cli.md`)
- Ejecutar el script `create_tables.sql` para crear las tablas
- Actualizar `application.properties` con la cadena de conexión correcta

### 3. Ejecutar la aplicación
```bash
mvn spring-boot:run
```

La aplicación estará disponible en `http://localhost:8080`

## 📚 API Endpoints

### Sedes
- `GET /api/sedes` - Listar todas las sedes
- `GET /api/sedes/{id}` - Obtener sede por ID
- `POST /api/sedes` - Crear nueva sede
- `PUT /api/sedes/{id}` - Actualizar sede
- `DELETE /api/sedes/{id}` - Eliminar sede

## 🏗️ Arquitectura

```
prototipo-exoal/
├── src/main/java/com/exoal/prototipo/
│   ├── PrototipoExoalApplication.java
│   ├── controller/
│   │   └── SedeController.java
│   ├── entity/
│   │   ├── Sede.java
│   │   ├── Usuario.java
│   │   └── Actividad.java
│   └── repository/
│       ├── SedeRepository.java
│       ├── UsuarioRepository.java
│       └── ActividadRepository.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## 🗄️ Modelo de Datos

- **Sede**: Información de sedes académicas
- **Usuario**: Usuarios del sistema (estudiantes, docentes, administradores)
- **Actividad**: Actividades académicas y eventos

## ☁️ Despliegue en Azure

Ver `comandos_azure_cli.md` para instrucciones completas de despliegue en Azure App Service.

## 📝 Documentación

- `comandos_azure_cli.md`: Log completo de comandos Azure CLI ejecutados
- `create_tables.sql`: Script de creación de base de datos

## 👥 Autor

Marcos Rivas Bermúdez para la Acreditación de la Ingeniería de Software, bajo el Acuerdo 286.

## 📄 Licencia

Este proyecto es de uso académico.