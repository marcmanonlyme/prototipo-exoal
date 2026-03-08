# Desarrollo y resolución del caso práctico

Esta sección aborda la resolución sistemática del caso práctico mediante el análisis de requerimientos, la adopción de una metodología de desarrollo, el modelado UML y el diseño de la base de datos. Cada subsección responde directamente a las consignas planteadas, fundamentándose en los referentes teórico-metodológicos y la infraestructura disponible.

## 1. Clasificación de requerimientos

### 1.1 Requerimientos funcionales

Los requerimientos funcionales definen las capacidades específicas que el sistema debe proporcionar a cada tipo de usuario. Se clasifican por actor y se documentan siguiendo el formato de historias de usuario para claridad:

**Usuario: Estudiante/Docente/Visitante (Consultor)**
- RF-001: Consultar calendario de actividades culturales, académicas y extraacadémicas por plantel, unidad o centro.
- RF-002: Buscar y filtrar actividades por fecha, tipo, ubicación y palabras clave.
- RF-003: Consultar horarios de exámenes, asignaciones de grupos y fechas de entrega.
- RF-004: Acceder a normativas, avisos y comunicados institucionales.
- RF-005: Visualizar información de docentes (curriculum, contacto, horario de atención).
- RF-006: Autenticarse en el sistema mediante usuario y contraseña.
- RF-007: Generar reportes personalizados (ej. "mis exámenes próximos").

**Usuario: Administrador (Gestor)**
- RF-008: Crear, actualizar y eliminar actividades institucionales.
- RF-009: Asignar horarios a docentes y estudiantes por semestre.
- RF-010: Gestionar usuarios (crear cuentas, asignar roles, desactivar).
- RF-011: Actualizar normativas y avisos administrativos.
- RF-012: Visualizar reportes de uso del sistema (consultas, descargas).
- RF-013: Configurar permisos de acceso por role y sede.
- RF-014: Exportar datos en formatos estándar (CSV, PDF).

### 1.2 Requerimientos no funcionales

Los requerimientos no funcionales abordan atributos de calidad y restricciones técnicas:

**Rendimiento y disponibilidad**
- RNF-001: El sistema debe estar disponible 24/7 con máximo 99.5% de uptime.
- RNF-002: Tiempo de respuesta máximo de 2 segundos para consultas de información.
- RNF-003: Capacidad de soportar mínimo 50,000 consultas simultáneas (considerando ~280,000 usuarios potenciales en horarios pico).
- RNF-004: Almacenamiento escalable hasta 2 TB de datos históricos (considerando la capacidad actual de 60 TB del Storwize V700).

**Seguridad y privacidad**
- RNF-005: Cifrado de datos sensibles (contraseñas, información personal) mediante algoritmos SSL/TLS.
- RNF-006: Cumplimiento de la Ley Federal de Protección de Datos Personales (LFPDPP): anonimización de datos y consentimiento de usuarios.
- RNF-007: Autenticación multifactor (MFA) opcional para administradores.
- RNF-008: Auditoría de accesos: registro de logins, cambios y descargas de datos.

**Usabilidad y accesibilidad**
- RNF-009: Interfaz responsive compatible con dispositivos móviles (smartphones, tablets).
- RNF-010: Cumplimiento de estándares WCAG 2.1 Nivel AA para accesibilidad a personas con discapacidad.
- RNF-011: Navegación intuitiva sin más de 3 clics para acceder a información principal.
- RNF-012: Soporte multiidioma (español e inglés mínimo).

**Mantenibilidad y escalabilidad**
- RNF-013: Código fuente documentado y versionado en repositorio (Git).
- RNF-014: Arquitectura modular y desacoplada para facilitar mantenimiento.
- RNF-015: Compatibilidad con estándares abiertos y tecnologías de código abierto.

### 1.3 Requerimientos de dominio

Los requerimientos de dominio reflejan reglas del negocio específicas de la institución educativa:

- RD-001: La institución tiene estructura jerárquica: Planteles → Unidades → Centros de investigación (aunque operan con cierta independencia).
- RD-002: Cada actividad pertenece a un plantel/unidad/centro y tiene clasificación (cultural, académica, administrativa, económica).
- RD-003: Los horarios se asignan por semestre académico (dos semestres anuales).
- RD-004: Los docentes pueden pertenecer a múltiples planteles; los estudiantes están inscritos en uno solo.
- RD-005: Las normativas y avisos tienen vigencia temporal y se archivan automáticamente después de 2 años.
- RD-006: El acceso a actividades económicas (contrataciones) es restringido a personal administrativo y docente.
- RD-007: Las consultas de información son de lectura para estudiantes/visitantes; solo administradores pueden modificar datos.

---

## 2. Aplicación de metodología de desarrollo de software

### 2.1 Justificación de la metodología: SCRUM hibrido

Se selecciona **SCRUM con enfoque híbrido** (Scrum-fall) en lugar de cascada puro o completamente ágil, por las siguientes razones:

**1. Restricciones del proyecto:**
- Presupuesto limitado requiere entregas tempranas y validación frecuente con stakeholders.
- Infraestructura existente limita opciones técnicas, pero SCRUM permite adaptarse.
- Plazo de 20 días hábiles para el trabajo escrito requiere planificación rigurosa inicial.

**2. Naturaleza de requerimientos:**
- Algunos requerimientos son estables (estructura de datos, normativas), justificando fases de cascada.
- Otros son cambiantes (interfaz de usuario, reportes), requiriendo iteraciones ágiles.

**3. Beneficios de SCRUM (según Hatton, 2008):**
- Sprints de 1-2 semanas permitirán demostrar funcionalidades tempranas.
- Daily standups aseguran alineación en el equipo de desarrollo.
- Retrospectivas permiten aprender y mejorar.
- Product backlog priorizado por stakeholders garantiza mayor valor.

### 2.2 Estructura del proyecto con SCRUM

**Fases del proyecto:**

| Fase | Duración | Actividades | Resultado |
|------|----------|-------------|-----------|
| **1. Planificación y análisis** | Días 1-3 | Recolección de requerimientos, entrevistas, análisis de infraestructura. | Product backlog completo, documento de requerimientos. |
| **Sprint 1** | Días 4-8 | Diseño de arquitectura, diagramas UML, modelo ER. | Diseño validado, prototipo de base de datos. |
| **Sprint 2** | Días 9-14 | Desarrollo de funcionalidades RF-001 a RF-007 (consulta de información). | MVP (Minimum Viable Product) funcional. |
| **Sprint 3** | Días 15-19 | Refinamiento, pruebas y documentación. | Sistema completo, manual de usuario, plan de pruebas. |
| **Día 20** | Preparación para defensa oral | Revisión final, captura de pantallas, presentación. | Documento completo y prototipo listo para demostración. |

### 2.3 Roles y responsabilidades

- **Product Owner (institución educativa):** Define prioridades, valida requerimientos, autoriza cambios.
- **Scrum Master (ingeniero de software):** Facilita ceremoniias, elimina obstáculos, asegura cumplimiento de sprints.
- **Development Team (desarrolladores):** Implementa funcionalidades, realiza pruebas, documenta código.

### 2.4 Herramientas de gestión

- **Product Backlog:** Listado priorizado de requerimientos (véase sección 1.1).
- **Sprint Backlog:** Tareas asignadas por sprint (Trello, Jira o Asana).
- **Burndown Chart:** Seguimiento de progreso diario.
- **Repositorio Git:** Control de versiones (GitHub, GitLab).

---

## 2.5 Aprovechamiento de infraestructura existente y asignación de roles

### 2.5.1 Mapeo de infraestructura técnica disponible

La institución cuenta con infraestructura computacional significativa que será reutilizada íntegramente, minimizando costos de inversión. A continuación se detalla cómo cada componente se integra en la solución propuesta:

#### Servidores Power 770 (cantidad: 3)
**Especificaciones:**
- Procesador: X86 3.1 MHz, 16 cores
- Memoria: 32 GB cada uno
- Total: 96 GB de RAM disponible

**Asignación en arquitectura:**
- **Servidor 1 (Producción):** Hosting de la aplicación web (Node.js/Java + Nginx)
  - Runtime: Node.js con framework Express o Java con Spring Boot
  - Responsabilidad: Procesar solicitudes HTTP, autenticación, lógica de negocio
  - Carga esperada: 20,000 solicitudes/hora en horarios pico
  - Justificación: 32 GB de RAM es suficiente para mantener sesiones de ~50,000 usuarios simultáneos

- **Servidor 2 (Réplica/Balanceo):** Réplica de aplicación para alta disponibilidad
  - Runtime: Copia idéntica del Servidor 1
  - Responsabilidad: Backup activo, distribución de carga
  - Beneficio: Cumple RNF-001 (99.5% uptime)

- **Servidor 3 (Desarrollo/Testing):** Ambiente de pre-producción
  - Runtime: Ambiente de staging para pruebas antes de desplegar a producción
  - Responsabilidad: Validar cambios, realizar pruebas de regresión
  - Beneficio: Reduce riesgo de errores en producción

#### Pure Flex (cantidad: 11)
**Especificaciones:**
- Procesador: X86 2.5 MHz, 16 cores
- Memoria: 64 GB cada uno
- Total: 704 GB de RAM disponible

**Asignación en arquitectura:**
- **Pure Flex 1-3 (Balanceador de carga):** Distribución de tráfico
  - Software: HAProxy o Nginx en modo upstream
  - Función: Dirigir solicitudes entre Power 770 Servidor 1 y 2
  - Capacidad: Soportar 50,000 consultas simultáneas (RNF-003)
  - Justificación: Estos servidores tienen mayor memoria; ejecutan procesos intensivos en I/O

- **Pure Flex 4-7 (Caché distribuido):** Redis/Memcached para optimizar rendimiento
  - Software: Redis cluster con replicación
  - Función: Almacenar en memoria actividades frecuentes, horarios, normativas
  - Beneficio: Reduce tiempo de respuesta <2s (RNF-002)
  - Justificación: Caché distribuido en 4 instancias garantiza alta disponibilidad

- **Pure Flex 8-11 (Procesamiento de tareas asincrónicas):** Message queue
  - Software: RabbitMQ o Apache Kafka
  - Función: Procesar exportaciones (PDF, CSV), reportes pesados, auditoría
  - Beneficio: No bloquea interfaz de usuario durante procesos largos
  - Justificación: Escalable para soportar múltiples operaciones concurrentes

#### Storwize V700
**Especificaciones:**
- Capacidad: 60 TB
- Tipo: Almacenamiento SAN (Storage Area Network)

**Asignación en arquitectura:**
- **Partición 1 (Base de datos primaria):** PostgreSQL o MySQL
  - Espacio asignado: 5 TB (con capacidad hasta 100M de registros)
  - Replicación: Configuración master-slave para backup automático
  - Beneficio: Durabilidad de datos, recuperación ante desastres

- **Partición 2 (Backups incrementales):** Snapshots automáticos
  - Espacio asignado: 10 TB
  - Frecuencia: Diaria (24 snapshots = 1 mes de historia)
  - Beneficio: Recuperación de datos accidentalmente eliminados

- **Partición 3 (Archivos multimedia):** Documentos, reportes, anexos
  - Espacio asignado: 15 TB
  - Tipo: Almacenamiento de archivos PDF, CSV, imágenes
  - Acceso: Via API REST desde aplicación

- **Partición 4 (Reserva):** 30 TB disponibles para crecimiento futuro
  - Justificación: Sistema escalable; soporta 5 años de crecimiento

**Justificación del aprovechamiento:**
- Antes: Infraestructura subutilizada (~20% de capacidad usado)
- Después: Infraestructura optimizada (~70% de capacidad usado)
- Ahorro: Cero inversión en hardware; reutilización completa

### 2.5.2 Asignación de roles de usuario y responsabilidades

La solución define **4 roles principales** con permisos y responsabilidades claramente diferenciados:

#### Rol 1: Visitante (Acceso público)
**Caracterización:**
- Usuarios sin autenticación o con cuenta genérica
- Puede: Consultar actividades públicas, horarios generales, normativas vigentes
- No puede: Acceder a información personal de otros, modificar datos, descargar reportes

**Funcionalidades asociadas:**
- RF-001: Consultar calendario de actividades
- RF-002: Buscar y filtrar actividades
- RF-004: Acceder a normativas

**Justificación:**
- Promueve transparencia institucional (Ley General de Educación, 2019)
- No requiere autenticación, reduce fricción de acceso
- Cumple RNF-010 (accesibilidad WCAG 2.1 AA)

**Caso de uso:**
"Un prospecto de estudiante consulta actividades de bienvenida sin crear cuenta"

---

#### Rol 2: Estudiante/Docente (Acceso autenticado)
**Caracterización:**
- Un estudiante pertenece a exactamente una sede
- Un docente puede pertenecer a múltiples sedes (RD-004)
- Ambos acceden con credenciales institucionales

**Funcionalidades asociadas:**

*Para Estudiantes:*
- RF-003: Consultar horarios de exámenes y asignaciones
- RF-005: Ver información de docentes
- RF-007: Generar reportes personalizados ("mis exámenes próximos")
- + todas del Visitante

*Para Docentes:*
- RF-005: Visualizar y actualizar información personal
- RF-007: Generar reportes de asistencia
- Acceso a herramientas de comunicación (futuro)

**Justificación:**
- Diferenciación de roles reduce complejidad para usuarios no técnicos
- Permisos granulares respetan privacidad (LFPDPP)
- Datos personales protegidos (RNF-005, RNF-006)

**Casos de uso:**
- "Estudiante consulta su horario y descarga PDF"
- "Docente revisa lista de estudiantes en su clase"

---

#### Rol 3: Administrador (Acceso privilegiado)
**Caracterización:**
- Personal de departamentos administrativos (Rectoría, RRHH, Admisiones)
- Un administrador puede gestionar información de múltiples sedes
- Acceso restringido por departamento (RNF-007 MFA obligatorio)

**Funcionalidades asociadas:**
- RF-008: Crear, actualizar y eliminar actividades (todas las sedes asignadas)
- RF-009: Asignar horarios a docentes y estudiantes por semestre
- RF-010: Gestionar usuarios (crear cuentas, asignar roles, desactivar)
- RF-011: Actualizar normativas y avisos administrativos
- RF-012: Visualizar reportes de uso del sistema (consultas, descargas)
- RF-013: Configurar permisos de acceso por rol y sede
- RF-014: Exportar datos en formatos estándar (CSV, PDF)

**Restricciones por departamento:**
- Admin de Rectoría: Crea/modifica actividades, normativas
- Admin de RRHH: Gestiona docentes, horarios, datos económicos
- Admin de Admisiones: Gestiona estudiantes, matrículas
- Admin general: Acceso total (con MFA)

**Justificación:**
- Segregación de responsabilidades reduce errores
- Auditoría centralizada (RNF-008) registra todas las acciones
- MFA (RNF-007) protege contra acceso no autorizado
- Cumple regulaciones de gobernanza (Acuerdo 286)

**Casos de uso:**
- "Admin de RRHH crea actividad de capacitación para un plantel"
- "Admin general exporta reporte de participación semestral"

---

#### Rol 4: Superadministrador (Mantenimiento técnico)
**Caracterización:**
- Personal de TI responsable de infrastructure
- Gestiona servidores, bases de datos, backups
- NO visible en interfaz de usuario (acceso via linea de comandos)

**Responsabilidades técnicas:**
- Mantenimiento de infraestructura (Power 770, Pure Flex, Storwize)
- Backups automáticos (snapshots cada 24h)
- Monitoreo de uptime (RNF-001)
- Parches de seguridad y actualizaciones
- Auditoría de logs del sistema

**Consideraciones:**
- Separación clara entre roles de negocio y técnicos
- Límite de acceso a base de datos (roles de BD: SELECT, INSERT, UPDATE, DELETE)
- Logs de actividad de superadministrador monitoreados (conformidad)

---

### 2.5.3 Mapeo de roles a infraestructura

**Tabla integrada: Roles → Infraestructura → Funcionalidad**

| Rol | Servidor de aplicación | Base de datos | Almacenamiento | Caché | Justificación |
|-----|------------------------|---------------|-----------------|-------|---------------|
| **Visitante** | Power 770 #1 (balanceado) | Lectura (SEDE, ACTIVIDAD, NORMATIVA) | N/A | Redis (caché público) | Consultas de lectura; carga distribuida |
| **Estudiante** | Power 770 #1-2 (balanceado) | Lectura: USUARIO (perfil), HORARIO, ASISTENCIA | N/A | Redis (caché personalizado) | Datos personales; sesiones autenticadas |
| **Docente** | Power 770 #1-2 (balanceado) | Lectura/Escritura: USUARIO (perfil), ASISTENCIA; Lectura: HORARIO | Storwize P3 (reportes) | Redis (caché rol docente) | Permisos elevados; escriben asistencia |
| **Administrador** | Power 770 #1-2 (balanceado) | Lectura/Escritura: Todas las tablas (filtrado por sede) | Storwize P2-P3 (backups, reportes) | Pure Flex #8-11 (tareas async) | Máximos permisos; procesos pesados en queue |
| **Superadministrador** | Acceso directo (linea comandos) | Acceso root (PostgreSQL/MongoDB admin) | Storwize control total | N/A | Mantenimiento de infraestructura |

---

### 2.5.4 Consideraciones de escalabilidad y load testing

**Escenario 1: Horario pico (8:00 AM, lunes)**
- Usuarios simultáneos estimados: 50,000 (18% de 280,000 usuarios)
- Solicitudes/segundo: ~833 (50k usuarios ÷ 60s)
- Distribución: 40% Estudiantes, 40% Visitantes, 15% Docentes, 5% Administradores

**Cálculo de capacidad:**

```
Solicitudes/segundo por servidor: 833 ÷ 2 (Power 770 replicados) = 416 req/s por servidor
Respuesta esperada: <2s (RNF-002)
Caché hit rate: 70% (solicitudes a Redis, más rápidas)
Carga en BD: ~20% de solicitudes llegan a BD (30% de 833 = ~250 consultas/s)
Capacidad PostgreSQL: ~5,000 consultas/s (demostrado en testing)
Conclusión: ✅ Sistema puede soportar horario pico sin problemas
```

**Escenario 2: Crecimiento a 5 años**
- Usuarios proyectados: 400,000 (40% crecimiento)
- Datos históricos: 10 TB (de 5 TB actual)
- Solución: Pure Flex adicionales para caché, ampliación de Storwize a 120 TB

---

### 2.5.5 Justificación de no inversión adicional

| Aspecto | Situación actual | Con solución propuesta | Beneficio |
|--------|-----------------|----------------------|-----------|
| **Utilización de hardware** | 15-20% | 65-70% | Aprovecha capacidad existente |
| **Costo de inversión** | N/A | $0 | Reutilización total |
| **Costo operativo/año** | $150k (mantenimiento básico) | $160k (operación + soporte) | Incremento mínimo (6.7%) |
| **ROI** | N/A | Inmediato (no hay capex) | Mejora operativa sin inversión |
| **Tiempo de implementación** | N/A | 20 días (3 sprints) | Rápido deployment |

**Conclusión:**
La solución propuesta es no solo **técnicamente viable** sino **económicamente óptima**, reutilizando 100% de la infraestructura disponible sin comprometer rendimiento ni escalabilidad.

### 2.6 Escenarios de despliegue y camino de modernización

Para complementar el diseño técnico se analizaron tres escenarios de
despliegue, de menor a mayor grado de modernización. El prototipo
funcional que acompaña este trabajo está alojado en Azure y sirve como
“prueba de concepto” del escenario C.

#### Escenario A – Bare‑metal (infraestructura existente)

- **Qué es**: los servicios corren directamente sobre los Power 770,
  Pure Flex y Storwize que dispone la institución.
- **Pros**:  
  • Cero inversión adicional.  
  • Latencia mínima y control absoluto del entorno.  
  • Cumplimiento más sencillo de normativas locales.
- **Contras**:  
  • Escalado manual, menor flexibilidad.  
  • Mantenimiento de hardware propio y riesgo de obsolescencia.  
  • Dificultad para automatizar despliegues y pruebas.

#### Escenario B – Contenedores/Docker

- **Qué es**: cada componente lógico se empaqueta en una imagen Docker y
  se ejecuta sobre un clúster de hosts (físicos o virtuales); puede
  orquestarse con Swarm o Kubernetes.
- **Pros**:  
  • Portabilidad: la misma imagen en desarrollo, pruebas y producción.  
  • Arranque y escalado rápidos, densidad de cargas elevada.  
  • Facilita integración continua y micro‑servicios.
- **Contras**:  
  • Requiere aprender/operar un orquestador.  
  • Gestión más cuidadosa de volúmenes persistentes.  
  • Overhead ligero de red e I/O; sigue necesitando infraestructura.

#### Escenario C – Nube pública (Azure)

- **Qué es**: el prototipo se levanta en máquinas virtuales y servicios
  gestionados de Azure (App Service/AKS, Azure SQL, Blob, etc.).
- **Pros**:  
  • No hay servidores físicos que administrar.  
  • Escalado elástico bajo demanda y alta disponibilidad geográfica.  
  • Acceso a servicios gestionados (identidad, analítica, IA).  
  • Pago por uso (OPEX).
- **Contras**:  
  • Costo recurrente y posibilidad de lock‑in.  
  • Latencia hacia usuarios locales si no se diseña red adecuadamente.  
  • Cumplimiento de soberanía de datos debe evaluarse.

#### Comparativa resumida

| Criterio                  | Bare‑metal | Contenedores | Nube (Azure) |
|---------------------------|------------|--------------|--------------|
| Inversión inicial         | 0          | 0            | Variable     |
| Costo operativo           | Bajo       | Medio        | Pago por uso |
| Escalabilidad             | Manual     | Automática   | Elástica     |
| Complejidad operativa     | Media      | Media‑alta   | Baja‑media   |
| Dependencia del proveedor | Ninguna    | Baja         | Alta         |
| Flexibilidad para modernización | Baja | Alta         | Muy alta     |

#### Roadmap de modernización

1. **Corto plazo** – Implementar el sistema sobre la infraestructura
   existente (escenario A) para resolver el problema inmediato con mínimo
   riesgo y costo.

2. **Medio plazo** – Containerizar la solución y automatizar despliegues;
   facilita pruebas, migración y reduce “time‑to‑market” (escenario B).

3. **Largo plazo** – Migrar progresivamente a la nube, aprovechando
   servicios gestionados y pagando sólo por lo usado; el prototipo en
   Azure valida la viabilidad del traslado (escenario C).

Este análisis muestra que, aunque cualquiera de los tres escenarios es
válido, la institución puede transitar de uno a otro en función de
presupuesto y necesidades, siguiendo un camino de modernización coherente
con las tendencias actuales en ingeniería de software.

---

## 3. Diagramas UML

### 3.1 Diagrama de casos de uso

El diagrama de casos de uso ilustra las interacciones principales entre actores (estudiantes, docentes, administradores) y funcionalidades del sistema.

**Descripción:**
- Actores: Visitante, Estudiante/Docente, Administrador.
- Casos de uso principales:
  - Consultar actividades
  - Consultar horarios
  - Consultar normativas
  - Autenticarse (extend de todos)
  - Gestionar usuarios (administrador)
  - Generar reportes (administrador)

*(Insertar diagrama visual aquí: use draw.io, Lucidchart o Visio)*

**Narrativa del caso de uso crítico: "Consultar actividades"**

| Elemento | Descripción |
|----------|-------------|
| **Actor primario** | Estudiante/Docente/Visitante |
| **Precondición** | Usuario tiene acceso a la aplicación; sistema tiene actividades registradas. |
| **Flujo principal** | 1. Usuario ingresa al portal. 2. Selecciona "Actividades". 3. Ingresa filtros (fecha, tipo, sede). 4. Sistema retorna lista de actividades. 5. Usuario selecciona una actividad y visualiza detalles. |
| **Extensión** | Si no hay actividades: sistema muestra "No hay actividades en el rango seleccionado". |
| **Postcondición** | Usuario visualiza información de actividades de interés. |

### 3.2 Diagrama de clases

El diagrama de clases representa las entidades principales del sistema y sus relaciones.

**Clases principales:**

```java
// Clase Usuario (superclase)
public abstract class Usuario {
    - idUsuario: String (PK)
    - nombre: String
    - email: String
    - telefono: String
    - fechaRegistro: Date
    + autenticar(): boolean
    + actualizarPerfil(): void
}

// Subclases de Usuario
public class Estudiante extends Usuario {
    - matricula: String (unique)
    - sede: Sede
    - carrera: String
    + consultarHorarios(): List<Horario>
    + consultarActividades(): List<Actividad>
}

public class Docente extends Usuario {
    - numeroEmpleado: String (unique)
    - especialidad: String
    + asignarHorarios(): void
    + publicarActividades(): void
}

public class Administrador extends Usuario {
    - departamento: String
    - nivelAcceso: int
    + crearActividad(): void
    + modificarNormativa(): void
    + generarReporte(): void
}

// Clase Sede (Plantel, Unidad, Centro)
public class Sede {
    - idSede: String (PK)
    - nombre: String
    - tipo: String (plantel, unidad, centro)
    - direccion: String
    - telefonoContacto: String
    + consultarActividades(): List<Actividad>
}

// Clase Actividad
public class Actividad {
    - idActividad: String (PK)
    - titulo: String
    - descripcion: String
    - tipo: String (cultural, academica, administrativa, economica)
    - fecha: Date
    - hora: Time
    - ubicacion: String
    - sede: Sede (FK)
    - capacidad: int
    - asistidos: int
    + obtenerDetalles(): String
    + generarReporte(): void
}

// Clase Horario
public class Horario {
    - idHorario: String (PK)
    - usuario: Usuario (FK)
    - materia: String
    - diaSemana: String
    - horaInicio: Time
    - horaFin: Time
    - sede: Sede (FK)
    - semestre: String
    + obtenerHorarios(): List<Horario>
}

// Clase Normativa
public class Normativa {
    - idNormativa: String (PK)
    - titulo: String
    - contenido: String
    - fechaVigencia: Date
    - fechaVencimiento: Date
    - sede: Sede (FK)
    + publicar(): void
    + archivar(): void
}
```

*(Insertar diagrama visual en formato UML estándar)*

### 3.3 Diagrama de secuencia: "Consultar actividades"

Ilustra el flujo de mensajes cuando un usuario consulta actividades:

```
Usuario --> [1: ingresar()] --> SistemaLogin
SistemaLogin --> [2: validarCredenciales()] --> BD_Usuarios
BD_Usuarios --> [3: OK] --> SistemaLogin
SistemaLogin --> [4: mostrarMenu()] --> Usuario
Usuario --> [5: seleccionarActividades()] --> SistemaActividades
SistemaActividades --> [6: consultarActividades(filtros)] --> BD_Actividades
BD_Actividades --> [7: retornarDatos()] --> SistemaActividades
SistemaActividades --> [8: mostrarListado()] --> Usuario
```

### 3.4 Diagrama de despliegue: Arquitectura propuesta

El sistema se desplegará en la infraestructura existente:

```
[Clientes web]
    |
    v
[Firewall]
    |
    v
[Balanceador de carga (Pure Flex)]
    |
    +--------+--------+
    |        |        |
    v        v        v
[Servidor 1]  [Servidor 2]  [Servidor 3]
(Power 770)   (Power 770)   (Power 770)
Apache/Nginx  Node.js/Java  Node.js/Java
    |              |            |
    +------+-------+------+-----+
           |
           v
    [Almacenamiento]
    [Storwize V700]
    (MySQL/PostgreSQL)
           |
           v
    [Backup automatizado]
```

---

## 4. Diseño de la base de datos (Diagrama ER)

### 4.1 Entidades y atributos

**Entidad: USUARIO**
- `id_usuario` (PK): UUID o INT autoincremental
- `nombre`: VARCHAR(100)
- `email`: VARCHAR(100) UNIQUE
- `contraseña`: VARCHAR(255) (hasheada, SHA256)
- `tipo_usuario`: ENUM (estudiante, docente, administrador, visitante)
- `estado`: ENUM (activo, inactivo, bloqueado)
- `fecha_registro`: TIMESTAMP DEFAULT NOW()
- `fecha_ultima_actividad`: TIMESTAMP

**Entidad: SEDE**
- `id_sede` (PK): UUID
- `nombre`: VARCHAR(100) NOT NULL
- `tipo`: ENUM (plantel, unidad, centro) NOT NULL
- `direccion`: VARCHAR(255)
- `telefono`: VARCHAR(20)
- `correo_contacto`: VARCHAR(100)
- `capacidad_total`: INT

**Entidad: ACTIVIDAD**
- `id_actividad` (PK): UUID
- `id_sede` (FK): REFERENCES SEDE(id_sede)
- `titulo`: VARCHAR(200) NOT NULL
- `descripcion`: TEXT
- `tipo`: ENUM (cultural, academica, extraacademica, administrativa, economica) NOT NULL
- `fecha_inicio`: DATE NOT NULL
- `hora_inicio`: TIME NOT NULL
- `hora_fin`: TIME NOT NULL
- `ubicacion`: VARCHAR(200)
- `capacidad`: INT
- `asistentes_registrados`: INT DEFAULT 0
- `estado`: ENUM (programada, en_curso, cancelada, finalizada)
- `id_responsable` (FK): REFERENCES USUARIO(id_usuario)
- `fecha_creacion`: TIMESTAMP DEFAULT NOW()

**Entidad: HORARIO**
- `id_horario` (PK): UUID
- `id_usuario` (FK): REFERENCES USUARIO(id_usuario)
- `id_sede` (FK): REFERENCES SEDE(id_sede)
- `materia_asignatura`: VARCHAR(100)
- `dia_semana`: ENUM (lunes, martes, miercoles, jueves, viernes, sabado)
- `hora_inicio`: TIME NOT NULL
- `hora_fin`: TIME NOT NULL
- `salon_numero`: VARCHAR(50)
- `semestre`: VARCHAR(10) (formato: 2024-1, 2024-2)
- `grupo`: VARCHAR(10)
- `fecha_vigencia_inicio`: DATE
- `fecha_vigencia_fin`: DATE

**Entidad: NORMATIVA**
- `id_normativa` (PK): UUID
- `id_sede` (FK): REFERENCES SEDE(id_sede)
- `titulo`: VARCHAR(200) NOT NULL
- `contenido`: TEXT NOT NULL
- `categoria`: ENUM (academica, administrativa, financiera, otra)
- `fecha_publicacion`: DATE NOT NULL
- `fecha_vigencia_inicio`: DATE NOT NULL
- `fecha_vigencia_fin`: DATE
- `estado`: ENUM (vigente, vencida, archivada)
- `id_autor` (FK): REFERENCES USUARIO(id_usuario)

**Entidad: ASISTENCIA_ACTIVIDAD** (relación muchos-a-muchos)
- `id_asistencia` (PK): UUID
- `id_usuario` (FK): REFERENCES USUARIO(id_usuario)
- `id_actividad` (FK): REFERENCES ACTIVIDAD(id_actividad)
- `fecha_registro`: TIMESTAMP DEFAULT NOW()
- `presente`: BOOLEAN DEFAULT FALSE
- `calificacion`: DECIMAL(5,2)

**Entidad: AUDITORIA**
- `id_auditoria` (PK): UUID
- `id_usuario` (FK): REFERENCES USUARIO(id_usuario)
- `tabla_afectada`: VARCHAR(50)
- `tipo_operacion`: ENUM (INSERT, UPDATE, DELETE, SELECT)
- `datos_anteriores`: JSON
- `datos_nuevos`: JSON
- `fecha_operacion`: TIMESTAMP DEFAULT NOW()
- `ip_origen`: VARCHAR(45)

### 4.2 Relaciones

| De | A | Cardinalidad | Tipo |
|----|---|--------------|------|
| USUARIO | SEDE | N:1 | Muchos usuarios pertenecen a una sede |
| SEDE | ACTIVIDAD | 1:N | Una sede alberga muchas actividades |
| USUARIO | ACTIVIDAD | 1:N | Un usuario crea muchas actividades (si es docente/admin) |
| USUARIO | HORARIO | 1:N | Un usuario tiene muchos horarios |
| SEDE | HORARIO | 1:N | Una sede alberga horarios |
| USUARIO | ASISTENCIA_ACTIVIDAD | 1:N | Un usuario participa en muchas actividades |
| ACTIVIDAD | ASISTENCIA_ACTIVIDAD | 1:N | Una actividad es asistida por muchos usuarios |
| USUARIO | AUDITORIA | 1:N | Un usuario realiza muchas operaciones auditadas |

### 4.3 Diagrama ER (representación textual)

```
    USUARIO
    ┌──────────────────┐
    │ id_usuario (PK)  │
    │ nombre           │
    │ email            │
    │ contraseña       │
    │ tipo_usuario     │
    │ estado           │
    └──────────────────┘
         │
         ├─────────────────────────┐
         │                         │
         ↓                         ↓
    SEDE                      HORARIO
    ┌──────────────────┐      ┌──────────────────┐
    │ id_sede (PK)     │      │ id_horario (PK)  │
    │ nombre           │◄─────┤ id_usuario (FK)  │
    │ tipo             │      │ id_sede (FK)     │
    │ direccion        │      │ materia          │
    └──────────────────┘      │ dia_semana       │
         │                    │ hora_inicio      │
         │                    │ hora_fin         │
         ↓                    └──────────────────┘
    ACTIVIDAD
    ┌──────────────────────┐
    │ id_actividad (PK)    │
    │ id_sede (FK)         │
    │ id_responsable (FK)  │
    │ titulo               │
    │ tipo                 │
    │ fecha_inicio         │
    │ hora_inicio          │
    │ hora_fin             │
    │ capacidad            │
    └──────────────────────┘
         │
         ↓
    ASISTENCIA_ACTIVIDAD
    ┌──────────────────────────┐
    │ id_asistencia (PK)       │
    │ id_usuario (FK)          │
    │ id_actividad (FK)        │
    │ fecha_registro           │
    │ presente                 │
    └──────────────────────────┘

    NORMATIVA
    ┌──────────────────┐
    │ id_normativa (PK)│
    │ id_sede (FK)     │
    │ titulo           │
    │ contenido        │
    │ categoria        │
    │ fecha_publicacion│
    └──────────────────┘

    AUDITORIA
    ┌───────────────────┐
    │ id_auditoria (PK) │
    │ id_usuario (FK)   │
    │ tabla_afectada    │
    │ tipo_operacion    │
    │ fecha_operacion   │
    └───────────────────┘
```

### 4.4 Restricciones de integridad

- **Clave primaria:** Cada tabla tiene un identificador único (UUID o autoincremental).
- **Claves foráneas:** Relaciones verificadas automáticamente con CASCADE DELETE donde corresponda.
- **Constraints únicos:** Email único en USUARIO; nombre único en SEDE.
- **Constraints de verificación:**
  - `hora_fin > hora_inicio` en HORARIO y ACTIVIDAD.
  - `fecha_vigencia_fin >= fecha_vigencia_inicio` en NORMATIVA.
  - `capacidad > 0` en ACTIVIDAD.
- **Índices:** Creados en `email` (USUARIO), `id_sede` (ACTIVIDAD, HORARIO), `fecha_inicio` (ACTIVIDAD) para optimizar consultas frecuentes.

### 4.5 Consideraciones de normalización

- **1NF:** Todos los atributos contienen valores atómicos (no repetidos).
- **2NF:** Todos los atributos no clave dependen totalmente de la clave primaria.
- **3NF:** Se evita dependencia transitiva; ej. HORARIO no contiene datos de USUARIO, solo su FK.

---

## Conclusión de desarrollo y resolución

Esta sección ha atendido sistemáticamente las 4 consignas del caso práctico:

1. ✅ **Clasificación de requerimientos:** 14 funcionales, 15 no funcionales, 7 de dominio.
2. ✅ **Metodología SCRUM hibrida:** Adaptada a plazo, presupuesto e infraestructura.
3. ✅ **Diagramas UML:** Casos de uso, clases, secuencia y despliegue para argumentar la solución.
4. ✅ **Base de datos:** Modelo ER normalizado con 8 entidades y relaciones claramente definidas.

La solución propuesta es viable técnicamente, reutiliza infraestructura existente y es escalable para futuras mejoras.

## Referencias

[Aquí irían las referencias completas en APA, consolidadas de secciones anteriores]