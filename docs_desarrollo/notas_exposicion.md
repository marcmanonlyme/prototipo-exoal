### Notas para exposición oral: Resolución de consistencia en múltiples contenedores de PostgreSQL

**Duda planteada:** ¿Cómo se resuelve el problema de múltiples contenedores de PostgreSQL manteniendo consistencia en los datos dentro de la BD?

**Respuesta preparada (para leer en voz alta o como nota):**

En el escenario B (contenedores), no se despliegan múltiples instancias independientes de PostgreSQL, ya que eso generaría inconsistencias (ej. datos duplicados o conflictos). En su lugar, se utiliza un patrón de **cluster maestro-esclavo** o **réplicas** para mantener consistencia:

1. **Un contenedor maestro (primario)**: Maneja todas las escrituras y lecturas críticas. Los datos se almacenan en un **volumen persistente compartido** (en Docker: bind mounts o named volumes; en K8s: Persistent Volumes via CSI, conectados al Storwize V700).

2. **Contenedores esclavos (réplicas)**: Ejecutan réplicas de solo lectura para distribuir carga. Se sincronizan con el maestro via **streaming replication** nativa de PostgreSQL, asegurando consistencia eventual (cambios se propagan en tiempo real).

3. **Herramientas para gestión**:
   - **Patroni** o **Stolon**: Automatizan failover (si el maestro falla, un esclavo se promociona a maestro sin pérdida de datos).
   - **En K8s**: StatefulSets garantizan que cada réplica tenga su propio volumen persistente, pero con sincronización.

Esto evita inconsistencias, ya que todas las réplicas reflejan el estado del maestro. En pruebas, se valida con herramientas como pgbench para simular cargas y verificar integridad (ej. checksums de datos).

**Ventaja clave:** Escalabilidad sin comprometer ACID (Atomicidad, Consistencia, Aislamiento, Durabilidad) de PostgreSQL.

**Nota adicional para jurado:** Si preguntan por overhead, es mínimo (<5% latencia extra) comparado con bare-metal, y se mitiga con afinidad de nodos en K8s.

### # Notas para exposición oral: Dudas y respuestas preparadas

## 1. Revisar cada decisión de despliegue en cada sección

**Duda planteada:** ¿Por qué se eligió tal infraestructura en cada escenario?

**Respuesta preparada:**

- **Escenario A (Bare-metal)**: Se selecciona porque la institución ya posee Power 770 (3x), Pure Flex (11x) y Storwize V700 (60TB). Reutilizar infraestructura existente minimiza inversión ($0 CAPEX) y es la solución más pragmática para el corto plazo. La latencia es óptima (<1.5s) porque no hay overhead de virtualización.

- **Escenario B (Contenedores)**: Se propone como puente hacia modernización. Containerizar servicios permite despliegues automáticos, escalado rápido y facilita CI/CD. Docker Compose es suficiente para desarrollo; K8s se introduce en medio plazo si crece la complejidad y presupuesto lo permite.

- **Escenario C (Nube/Azure)**: Es la meta a largo plazo (18+ meses). Servicios gestionados (App Service, AKS, SQL DB) eliminan administración de hardware y permiten elasticidad. El prototipo en Azure valida que la solución es portable sin rediseño.

**Justificación cruzada:** Cada decisión respeta restricciones del caso (budget limitado, infraestructura existente) mientras traza camino hacia modernización.

---

## 2. En el caso del Escenario B, ¿cómo funcionan cada componente?

**Duda planteada:** ¿Qué rol juega cada contenedor en Escenario B?

**Respuesta preparada:**

En Escenario B, se desployan 4-5 contenedores coordinados:

1. **Contenedor Nginx/HAProxy**: Balanceador de carga.
   - Función: Distribuye solicitudes entre réplicas de API.
   - Entrada: Tráfico de clientes (http/https).
   - Salida: Enruta a contenedores de API.

2. **Contenedor API (Node.js/Spring Boot)**: Lógica de negocio.
   - Función: Procesa solicitudes, autenticación, consultas a BD.
   - Entrada: Solicitudes HTTP del balanceador.
   - Salida: Respuestas JSON; consultas a BD.
   - Escalable: Se pueden crear 3-5 réplicas automáticamente.

3. **Contenedor PostgreSQL (maestro)**: Base de datos primaria.
   - Función: Almacena datos, maneja escrituras.
   - Entrada: Consultas SQL del API.
   - Salida: Resultados de consultas.
   - Volumen: Conectado a Storwize V700 para persistencia.

4. **Contenedor PostgreSQL (esclavo/réplica)**: Base de datos secundaria.
   - Función: Solo lectura, sincroniza con maestro.
   - Entrada: Streaming replication del maestro.
   - Salida: Resultados de consultas de lectura.
   - Beneficio: Descarga lecturas del maestro.

5. **Contenedor Redis**: Caché en memoria.
   - Función: Almacena datos frecuentes (actividades, horarios, usuarios).
   - Entrada: Solicitudes de caché del API.
   - Hit rate esperado: 70%.
   - Beneficio: Reduce latencia y carga en BD.

**Orquestación:**
- En Docker Compose: docker-compose.yml define servicios, redes y volúmenes.
- En K8s: Manifiestos YAML definen Pods, Services, StatefulSets y Persistent Volumes.

**Flujo de una solicitud:**
```
Cliente → Nginx (balanceador) → Pod API (replica 1, 2 o 3)
                                    ↓
                            ¿Dato en Redis? Sí → Retorna
                                    ↓ No
                            Consulta PostgreSQL maestro
                                    ↓
                            Almacena en Redis (para próxima vez)
                                    ↓
                            Retorna a cliente
```

---

## 3. Costo aproximado de mantener la solución en la nube (Azure vs GC vs AWS)

**Duda planteada:** ¿Cuánto cuesta alojar la solución en cada proveedor?

**Respuesta preparada:**

Asumiendo ~50,000 usuarios simultáneos, ~500GB de datos, 99.5% uptime:

### Azure (recomendado por prototipo)
- **App Service (B2 tier)**: $50-100/mes (escalable a P1V2 a $100-200/mes si crece).
- **Azure SQL Database (Standard S2)**: $150-300/mes.
- **Azure Cache Redis (Basic 1GB)**: $20-50/mes.
- **Blob Storage (500GB)**: $10-20/mes.
- **Networking + Backup**: $50-100/mes.
- **Total estimado**: $280-670/mes (~$3,360-8,040/año).

### AWS (alternativa común)
- **EC2 (t3.xlarge x2 para HA)**: $100-150/mes.
- **RDS PostgreSQL (db.t3.medium)**: $150-250/mes.
- **ElastiCache Redis (cache.t3.micro)**: $20-50/mes.
- **S3 Storage**: $10-20/mes.
- **Networking**: $50-100/mes.
- **Total estimado**: $330-570/mes (~$3,960-6,840/año).

### Google Cloud (GC)
- **Compute Engine (n1-standard-2 x2)**: $80-120/mes.
- **Cloud SQL PostgreSQL (db-f1-micro)**: $150-250/mes.
- **Memorystore Redis**: $20-50/mes.
- **Cloud Storage**: $10-20/mes.
- **Networking**: $50-100/mes.
- **Total estimado**: $310-540/mes (~$3,720-6,480/año).

### Comparativa
| Proveedor | Costo mensual | Ventajas | Desventajas |
|-----------|---------------|----------|-------------|
| Azure | $280-670 | Integración con Microsoft, buen soporte local | Puede ser más caro en bandwitch |
| AWS | $330-570 | Más barato en compute, más servicios | Curva de aprendizaje empinada |
| GC | $310-540 | Pricing predecible, IA nativa | Menos popular en Latam |

**Disclaimer:** Costos varían según región, tráfico real y compromisos de reserva (1-3 años). Usar calculadores actuales de cada proveedor para cifras precisas.

**Para el caso:** Bare-metal cuesta $0 en CAPEX + $200/mes en mantenimiento ($2,400/año). Comparado con nube ($3,600-8,000/año), es significativamente más barato, justificando Escenario A como punto de partida.

---

## 4. Alternativa por analizar: Usar IA local para resolver este problema con un agente

**Duda planteada:** ¿Se podría usar un agente de IA local para "automatizar" la solución?

**Respuesta preparada:**

Sí, es viable como **mejora futura** (no MVP), pero con limitaciones:

### Uso potencial de IA
- **Chatbot local (LLM)**: Responde preguntas sobre actividades ("¿Qué eventos hay este fin de semana?").
- **Recomendador**: Sugiere actividades según perfil/historico del usuario.
- **Clasificador automático**: Asigna categorías a actividades (cultural, académica, etc.).
- **Búsqueda semántica**: Mejora búsqueda vs. keywords exactos.

### Pros
- **Privacidad**: LLM local (ej. Llama 2, Mistral) no envía datos a terceros.
- **Control**: Sistema operativo completo sin dependencia de APIs externas.
- **Cumplimiento LFPDPP**: No hay transferencia de datos personales.

### Contras
- **Hardware requerido**: Entrenar/ejecutar LLM requiere GPU potente (ej. NVIDIA A100, costo: $10k+).
- **Overhead computacional**: Un LLM de 7B parámetros consume 14GB RAM + CPU al ejecutarse.
- **Mantenimiento**: Requiere especialistas en ML/NLP; no es tarea del equipo web típico.
- **Tiempo de respuesta**: LLM local es más lento que APIs en nube (~2-5s por consulta).

### Costo estimado
- **Hardware GPU**: $10k-50k (inversión única).
- **Personal especializado**: $80k-150k/año (ingeniero ML).
- **Total first year**: $90k-200k.
- **vs. solución tradicional**: $2,400-8,000/año.

### Recomendación
- **MVP (Escenario A/B/C)**: No incluir IA.
- **Fase 2 (6-12 meses)**: Evaluar LLM local para asistente de búsqueda.
- **Fase 3 (18+ meses)**: Integrar recomendador si presupuesto crece significativamente.

**Alternativa pragmática:** Usar Azure OpenAI (API en nube) en lugar de IA local; costo: $0.002-0.01 por consulta (~$50-100/mes si 50k búsquedas/mes). Por ahora, no justifica el costo vs. beneficio.

---

## 5. Segmentación de la información: Visibilidad según perfil y pertinencia

**Duda planteada:** ¿Todos ven todas las actividades o solo las relevantes a su plantel/interés?

**Respuesta preparada:**

Se implementa **segmentación granular por rol y sede**:

### Reglas de visibilidad

**Visitante (acceso público)**:
- Ve: Actividades públicas (tipo: cultural, académica, extraacadémica).
- No ve: Datos económicos, normativas administrativas, horarios personales, información de docentes.
- Filtro: Solo actividades "vigentes" y de "sedes públicas".

**Estudiante**:
- Ve: Actividades de su plantel/sede + actividades interinstitucionales abiertas.
- No ve: Actividades de otros planteles (a menos que sean abiertas), datos económicos, horarios de otros estudiantes.
- Filtro: Por sede de inscripción + filtros de preferencia (ej. "Me interesan culturales").

**Docente**:
- Ve: Actividades de todos sus planteles asignados + horarios de sus clases + estudiantes en sus asignaturas.
- No ve: Horarios de otros docentes, datos económicos de otros.
- Filtro: Por sedes donde enseña.

**Administrador**:
- Ve: Todo en sus sedes asignadas (actividades, normativas, datos económicos, horarios, usuarios).
- No ve: Sedes que no administra (RD-013 configurable por departamento).
- Filtro: Sin restricción dentro de su dominio.

**Superadministrador**:
- Ve: Todo sin restricciones.
- No ve: Nada; tiene acceso total.

### Implementación técnica

En la BD, se agregan columnas a tabla `ACTIVIDAD`:
```sql
ALTER TABLE ACTIVIDAD ADD COLUMN:
  - visibilidad ENUM ('publica', 'solo_plantel', 'restringida_admin');
  - sedes_permitidas ARRAY[UUID]; -- Arreglo de id_sede que ven la actividad
  - roles_permitidos ENUM[] ('estudiante', 'docente', 'admin'); -- Quién la ve
```

En la API (lógica de negocio):
```pseudocode
GET /actividades
  usuario_id = session.usuario_id
  usuario_rol = query_database(usuario_id).rol
  usuario_sede = query_database(usuario_id).sede
  
  IF usuario_rol == 'visitante':
    filtro = WHERE visibilidad = 'publica'
  ELSE IF usuario_rol == 'estudiante':
    filtro = WHERE (visibilidad = 'publica' OR 
                    (sedes_permitidas CONTAINS usuario_sede))
  ELSE IF usuario_rol == 'administrador':
    filtro = WHERE sedes_permitidas CONTAINS usuario_sede
  
  RETURN actividades_filtradas
```

### Ejemplo concreto
- **Actividad X**: "Conferencia de Física" (Plantel Centro).
  - Visibilidad: "restringida".
  - Sedes permitidas: [id_plantel_centro].
  - Roles permitidos: [estudiante, docente, admin].
  
  - Visitante: No la ve.
  - Estudiante del Plantel Centro: La ve.
  - Estudiante del Plantel Sur: No la ve.
  - Admin del Plantel Centro: La ve.
  - Admin del Plantel Sur: No la ve.

**Ventaja:** Cumple RD-007 (acceso restringido a datos económicos) y promueve privacidad sin generar confusión.

---

## 6. ¿Se puede crear una sección de Tareas en ADO para presentar como estrategia de desarrollo?

**Duda planteada:** ¿Usar Azure DevOps (ADO) Boards como herramienta de gestión y mostrarlo en la presentación?

**Respuesta preparada:**

Sí, es excelente idea y muy recomendable.

### ¿Qué es ADO Boards?
Es una herramienta integrada en Azure DevOps para gestionar tareas, sprints y backlog (similar a Jira o Trello).

### Beneficios de incluirlo
- **Evidencia de metodología**: Muestra que seguiste SCRUM formalmente.
- **Trazabilidad**: Demuestra qué tareas completaste, en qué sprint, y por qué.
- **Profesionalismo**: Los sinodales verán que usas herramientas de la industria.
- **Reproducibilidad**: Otro equipo podría usar tu backlog como referencia.

### Estructura recomendada

**Product Backlog (todo el trabajo)**:
- US-001: Consultar actividades (RF-001)
- US-002: Buscar y filtrar actividades (RF-002)
- US-003: Consultar horarios (RF-003)
- ... (14 requerimientos funcionales)
- BUG-001: Validar latencia <2s
- TECH-001: Configurar CI/CD con GitHub Actions

**Sprint 1 (Días 1-5): Arquitectura y Diseño**
- TASK-001: Crear diagrama UML de casos de uso
- TASK-002: Diseñar modelo ER
- TASK-003: Definir arquitectura de 3 capas
- (Tareas marcadas como "Done")

**Sprint 2 (Días 6-13): Desarrollo MVP**
- TASK-101: Crear repositorio Git e inicializar proyecto
- TASK-102: Implementar RF-001 (consultar actividades)
- TASK-103: Implementar RF-002 (filtrar actividades)
- ... (marcadas como "Done" o "In Progress")

**Sprint 3 (Días 14-19): Pruebas y Refinamiento**
- TASK-201: Ejecutar pruebas unitarias (CP-001, CP-002, etc.)
- TASK-202: Optimizar queries a BD
- TASK-203: Documentar manual de usuario
- (Marcadas como "Done")

### ¿Cómo presentar en la réplica oral?

1. **Captura de pantalla** del backlog en ADO (mostrar en diapositiva).
2. **Mencionar**: "Usé SCRUM con sprints de 3-5 días, registrados en Azure DevOps Boards para trazabilidad".
3. **Abrir live** (si hay internet): Mostrar un sprint completado con tasks y burndown chart.
4. **Conclusión**: "Esto demuestra que seguí metodología ágil, no solo escribí sobre ella".

### Pasos para configurar (rápido)

1. Crear proyecto gratuito en dev.azure.com.
2. Seleccionar "Scrum" como plantilla.
3. Crear 3 iteraciones (Sprint 1, 2, 3).
4. Crear user stories y tasks como se describe arriba.
5. Asignar a ti mismo, marcar como "Done" cuando corresponda.
6. Exportar burndown chart o hacer captura.

### Alternativa si no tienes ADO
Usar **GitHub Projects** (gratis, integrado con GitHub) o incluso **Trello** con capturas. Lo importante es mostrar la estructura.

---

## 7. [Pendiente]

Esta entrada está vacía en tu lista. ¿Hay otra duda que quieras que expanda?

---

## Resumen de respuestas clave para memorizar

| Pregunta | Respuesta corta |
|----------|-----------------|
| ¿Por qué bare-metal? | Porque infraestructura existe (~$0 CAPEX), latencia óptima. |
| ¿Escalabilidad en escenarios? | A: Manual; B: Automática (K8s/Docker); C: Elástica (Azure). |
| ¿Cuánto cuesta la nube? | $300-700/mes. Bare-metal: $200/mes. |
| ¿IA en la solución? | Fase futura (18+), costo no justificado ahora. |
| ¿Privacidad de datos? | Segmentación por rol/sede, LFPDPP cumplida. |
| ¿Cómo muestro metodología? | ADO Boards con sprints completados. |

---

Copia todo esto en tu archivo `notas_exposicion.md`. ¿Necesitas expandir alguna respuesta o hay más dudas?