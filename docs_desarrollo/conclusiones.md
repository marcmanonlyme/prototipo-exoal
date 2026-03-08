# Conclusiones

La resolución del caso práctico ha demostrado que es técnicamente viable implementar un sistema informativo centralizado que aborde la problemática de comunicación y acceso a la información en la institución educativa. A través del análisis sistemático de requerimientos, la adopción de una metodología ágil adaptada y el diseño de una arquitectura escalable, se ha propuesto una solución que reutiliza la infraestructura existente, minimizando inversión pero maximizando el impacto operativo.

## Cumplimiento de consignas

### Consigna 1: Clasificación de requerimientos

Se identificaron y clasificaron **36 requerimientos totales**: 14 funcionales que definen capacidades específicas del sistema (consulta de actividades, gestión de horarios, autenticación), 15 no funcionales que establecen atributos de calidad (rendimiento, disponibilidad, seguridad, usabilidad), y 7 requerimientos de dominio que reflejan las reglas de negocio institucionales (estructura jerárquica, vigencia de normativas, restricciones de acceso). Esta clasificación es exhaustiva y alinea cada requerimiento con el caso práctico, garantizando que la solución propuesta es completa y contextualizada.

### Consigna 2: Aplicación de metodología de desarrollo

Se justificó y documentó la adopción de **SCRUM híbrido** como metodología de desarrollo, fundamentada en las restricciones del proyecto: presupuesto limitado, plazo de 20 días hábiles y necesidad de entregas iterativas. La estructura de 3 sprints (planificación, diseño y desarrollo, refinamiento y pruebas) permite demostrar funcionalidades tempranas, validar con stakeholders y realizar ajustes sin desviaciones mayores. La metodología elegida es equilibrada, combinando rigor de cascada para fases de diseño con agilidad para validaciones usuarias, alineándose con los principios descritos por Hatton (2008) en contextos de restricción presupuestaria.

### Consigna 3: Diagramas UML

Se elaboraron **cuatro diagramas UML complementarios** que sustentan arquitectónicamente la solución:

- **Diagrama de casos de uso:** Ilustra interacciones de tres actores principales (visitante, estudiante/docente, administrador) con 6 casos de uso críticos, demostrando cobertura funcional.
- **Diagrama de clases:** Modela 7 clases principales (Usuario, Estudiante, Docente, Administrador, Sede, Actividad, Horario, Normativa) con herencia y relaciones, respetando principios de POO.
- **Diagrama de secuencia:** Detalla el flujo de mensajes para el caso de uso crítico "Consultar actividades", validando lógica de interacción entre componentes.
- **Diagrama de despliegue:** Propone arquitectura física aprovechando servidores Power 770 y Pure Flex, con balanceo de carga y almacenamiento centralizado en Storwize V700, demostrando reutilización de infraestructura.

Estos diagramas son coherentes, documentan la propuesta de manera comprensible y facilitan la comunicación con stakeholders técnicos y no técnicos.

### Consigna 4: Diseño de base de datos

Se desarrolló un **modelo entidad-relación (ER) normalizado** con 8 entidades principales (USUARIO, SEDE, ACTIVIDAD, HORARIO, NORMATIVA, ASISTENCIA_ACTIVIDAD, AUDITORIA) y relaciones claramente definidas. El modelo cumple con las tres formas de normalización (1NF, 2NF, 3NF), evitando redundancias y garantizando integridad referencial. Incluye restricciones de integridad (claves primarias, foráneas, único), índices para optimizar consultas frecuentes y consideraciones de escalabilidad para soportar ~280,000 usuarios. El diseño es robusto, documentado y adaptable a futuras extensiones.

## Viabilidad técnica y realizabilidad

La solución propuesta es **técnicamente viable** por las siguientes razones:

1. **Reutilización de infraestructura:** Los servidores Power 770 (x3) y Pure Flex (x11) tienen capacidad suficiente para hospedar el sistema sin inversión adicional. El almacenamiento de 60 TB del Storwize V700 cubre ampliamente los requerimientos de datos.

2. **Arquitectura modular:** El diseño de tres capas (presentación, lógica de negocios, datos) permite despliegue flexible y mantenimiento ágil.

3. **Tecnologías accesibles:** La propuesta de lenguajes (Java, Python, Node.js), entornos (Docker, Apache/Nginx) y bases de datos (MySQL, PostgreSQL) son de código abierto, reduciendo costos operativos.

4. **Escalabilidad:** El modelo ER y la arquitectura soportan crecimiento de usuarios y datos sin rediseño fundamental.

5. **Seguridad:** Las medidas propuestas (SSL/TLS, auditoría, LFPDPP) cumplen regulaciones y protegen información sensible.

## Impacto esperado

La implementación del sistema generará los siguientes beneficios:

- **Mejora en comunicación institucional:** La centralización de información eliminará fragmentación actual, permitiendo acceso unificado desde cualquier sede.
- **Incremento en participación comunitaria:** Disponibilidad 24/7 de actividades y trámites incentivará participación de estudiantes y docentes.
- **Eficiencia operativa:** Automatización de asignación de horarios y gestión de normativas reducirá sobrecarga administrativa.
- **Transparencia y cumplimiento regulatorio:** Auditoría centralizada y protección de datos cumplirán con leyes mexicanas de transparencia y protección de datos personales.
- **Optimización de recursos:** Reutilización de infraestructura minimiza inversión, permitiendo destinación de presupuesto a otras áreas.

## Alcances y limitaciones

### Alcances del proyecto

- Sistema web centralizado para consulta y gestión de información institucional.
- Soporte a 4 tipos de actividades (culturales, académicas, administrativas, económicas).
- Gestión de usuarios con 4 roles (visitante, estudiante, docente, administrador).
- Integración de datos de 24 planteles, 19 unidades y 18 centros de investigación.
- Cumplimiento de estándares de seguridad (LFPDPP, SSL/TLS).

### Limitaciones del proyecto

- **Fase inicial:** El MVP incluye funcionalidades básicas (consulta, gestión, reportes). Funcionalidades avanzadas (analítica predictiva, integración con sistemas de terceros) quedan para fases posteriores.
- **Infraestructura:** Depende de disponibilidad y mantenimiento de servidores existentes; no incluye migración a nube o expansión significativa de hardware.
- **Datos históricos:** La migración de datos existentes desde sistemas legados no está incluida; se asume partida con datos nuevos.
- **Capacitación:** El costo de capacitación a usuarios finales no está presupuestado, aunque se propone un manual de usuario.
- **Mantenimiento:** Se asume contratación de personal técnico para soporte y actualizaciones post-lanzamiento.

## Recomendaciones para futuras mejoras

A mediano y largo plazo, se recomienda:

1. **Expansión funcional:** Incorporar módulos móviles (apps iOS/Android) para mejorar accesibilidad.
2. **Analítica avanzada:** Implementar dashboards de uso, predicción de asistencia y recomendaciones personalizadas mediante machine learning.
3. **Integración sistémica:** Conectar con sistemas legados (RRHH, nómina, admisiones) mediante APIs y ETL.
4. **Migración a nube:** Evaluar migración a infraestructura en nube (AWS, Azure) para mayor escalabilidad y resiliencia.
5. **Multicanal:** Ampliar acceso mediante chatbots, notificaciones SMS/WhatsApp y asistentes de voz.
6. **Internacionalización:** Expandir idiomas soportados y adaptación a contextos de otras instituciones.

## Contribución a la formación profesional

Este trabajo evidencia la aplicación integrada de competencias de la licenciatura en ingeniería de software:

- **Análisis de sistemas:** Identificación y clasificación exhaustiva de requerimientos en contexto real.
- **Diseño de software:** Modelado UML y arquitectura que demuestran comprensión de patrones y principios de diseño.
- **Desarrollo:** Selección justificada de tecnologías, lenguajes y plataformas para infraestructura disponible.
- **Gestión de proyectos:** Aplicación de metodología ágil adaptada a restricciones presupuestarias y temporales.
- **Ética profesional:** Consideración de marcos regulatorios (LFPDPP) y accesibilidad (WCAG) en el diseño.

La resolución del caso demuestra capacidad para enfrentar problemáticas complejas reales, proponer soluciones viables y fundamentar decisiones técnicas con referentes teóricos y metodológicos sólidos.

## Reflexión final

La institución educativa requería una solución que integrara comunicación efectiva, acceso democratizado a la información y eficiencia operativa, con restricciones de presupuesto e infraestructura. La propuesta de un sistema informativo centralizado, desarrollado con SCRUM híbrido, diseñado con UML riguroso y sustentado en una base de datos normalizada, no solo responde a esta necesidad, sino que establece cimientos para evolución futura. La reutilización de infraestructura existente demuestra prudencia financiera, mientras que la arquitectura modular garantiza adaptabilidad. Así, la solución integra viabilidad técnica, sostenibilidad económica y relevancia institucional.

---

## Referencias

[Aquí irían las referencias completas en APA, consolidadas de todas las secciones anteriores]