# Referentes teórico-metodológicos

Esta sección establece los fundamentos teóricos y metodológicos que sustentan la resolución del caso práctico, alineados con las áreas temáticas de análisis, diseño, desarrollo y gestión de sistemas de software. El marco teórico aborda conceptos clave para comprender la problemática y proponer soluciones, mientras que el marco metodológico describe el enfoque adoptado para aplicar dichos conceptos de manera sistemática y eficiente.

## Marco teórico

El marco teórico se basa en principios de ingeniería de software que permiten analizar y resolver la necesidad de un sistema informativo centralizado para la institución educativa. En el ámbito del **análisis de sistemas de software**, se destacan los tipos de requerimientos y técnicas de documentación. Según Wiegers y Hokanson (2023), los requerimientos funcionales describen qué debe hacer el sistema (ej. consultar actividades o asignar horarios), mientras que los no funcionales abordan atributos como rendimiento, seguridad y usabilidad. Los requerimientos de dominio, por su parte, reflejan reglas específicas de la institución, como la jerarquía entre planteles, unidades y centros de investigación. Para documentarlos, se emplean herramientas como historias de usuario (Patton & Economy, 2014), que facilitan la comunicación con stakeholders no técnicos.

En el **diseño de sistemas de software**, el enfoque se centra en la arquitectura, que define la estructura del sistema para garantizar escalabilidad y reutilización de recursos. Clements et al. (2010) proponen vistas arquitectónicas (lógica, física y de procesos) para modelar sistemas complejos, como el propuesto aquí, que debe integrar datos de 24 planteles, 19 unidades y 18 centros. Este diseño considera patrones como el de tres capas (presentación, lógica de negocios y datos), optimizando el uso de la infraestructura existente (servidores Power 770 y Pure Flex).

Para el **desarrollo de sistemas de software**, se seleccionan lenguajes, entornos y plataformas adecuados. Según Sommerville (2015), lenguajes como Java o Python son ideales para aplicaciones web robustas, mientras que entornos de desarrollo integrado (IDE) como Eclipse o Visual Studio Code facilitan la codificación colaborativa. Las plataformas de desarrollo, como contenedores Docker o servidores web Apache, permiten desplegar el sistema en la infraestructura disponible, priorizando la reutilización para minimizar costos (Brown, 2020).

Finalmente, en la **gestión de proyectos de software**, se enfatiza la aplicación de metodologías ágiles para manejar la incertidumbre de requerimientos. Kerzner (2022) destaca la importancia de la planificación en proyectos con restricciones presupuestarias, mientras que Usman et al. (2015) abordan la estimación de esfuerzo en entornos ágiles, crucial para dimensionar la infraestructura y asignar roles a usuarios.

## Marco metodológico

El marco metodológico adopta un enfoque híbrido basado en metodologías ágiles, específicamente SCRUM, justificado por la necesidad de entregas iterativas en un proyecto con baja inversión y requerimientos cambiantes. Según Hatton (2008), SCRUM permite priorizar funcionalidades críticas (como consulta de información) mediante sprints cortos, adaptándose a la complejidad de integrar datos de múltiples sedes. Esta elección se alinea con las subáreas del caso (4.3 Metodologías de desarrollo), priorizando la agilidad sobre modelos tradicionales como el cascada, que serían rígidos para este contexto.

Para la recolección de requerimientos, se utilizarán técnicas mixtas: entrevistas estructuradas a stakeholders (administradores, docentes y estudiantes) para identificar necesidades funcionales y no funcionales, y análisis documental de la infraestructura proporcionada. Wiegers y Hokanson (2023) recomiendan estas técnicas para validar requerimientos, asegurando que el sistema cubra actividades culturales, administrativas y económicas.

En el modelado, se aplicarán diagramas UML para representar el diseño. Casos de uso principales ilustrarán interacciones (ej. "usuario consulta calendario"), diagramas de clases definirán entidades (Usuario, Actividad, Plantel), y diagramas de secuencia mostrarán flujos críticos. Según Booch et al. (2005), UML facilita la comunicación y documentación, argumentando la arquitectura propuesta.

Para el diseño de la base de datos, se empleará el modelo entidad-relación (ER), definiendo entidades con atributos y relaciones (ej. un plantel tiene muchos estudiantes). Date (2006) enfatiza la normalización para evitar redundancias, optimizando el almacenamiento en el Storwize V700.

La arquitectura se propondrá mediante diagramas de despliegue, reutilizando hardware existente y sugiriendo software como MySQL para la base de datos y Node.js para el backend. Cervantes et al. (2016) apoyan este enfoque para sistemas escalables.

Finalmente, el plan de pruebas seguirá estándares de Pressman y Maxim (2020), con pruebas unitarias (JUnit), de integración (para módulos como autenticación) y de sistema (simulando cargas de usuarios). El prototipo se desarrollará en un entorno local, demostrando funcionalidades básicas para la evaluación oral.

Este marco asegura una resolución fundamentada, ética y alineada con los lineamientos del EXOAL.

## Referencias

Booch, G., Rumbaugh, J., & Jacobson, I. (2005). *The unified modeling language user guide* (2a ed.). Addison-Wesley Professional.

Brown, S. (2020). *Software architecture for developers: A developer-friendly guide to software architecture, technical leadership and the balance with agility* (2a ed.). Autor.

Cervantes, H., Velasco-Elizondo, P., & Castro, L. (2016). *Arquitectura de software, conceptos y ciclo de desarrollo*. Cengage Learning.

Clements, P., Bachmann, F., Bass, L., Garlan, D., Ivers, J., Little, R., Merson, P., Nord, R., & Stafford, J. (2010). *Documenting software architectures, views and beyond* (2a ed.). Addison Wesley.

Date, C. J. (2006). *Introducción a los sistemas de bases de datos* (7a ed.). Pearson Educación; Prentice Hall.

Hatton, S. (2008). Choosing the right prioritisation method. En *Proceedings of the Australian Software Engineering Conference, 19th Australian Software Engineering Conference, ASWEC 2008* (pp. 517-526). https://doi.ieeecomputersociety.org/10.1109/ASWEC.2008.22

Kerzner, H. (2022). *Project management: A systems approach to planning, scheduling, and controlling* (13a ed.). Wiley.

Patton, J., & Economy, P. (2014). *User story mapping: Discover the whole story, build the right product*. O’Reilly.

Pressman, R. S., & Maxim, B. (2020). *Software engineering: A practitioner’s approach* (9a ed.). McGraw Hill.

Sommerville, I. (2015). *Software engineering* (10a ed.). Pearson.

Usman, M., Mendes, E., & Börstler, J. (2015). Effort estimation in agile software development: A survey on the state of the practice. En *EASE ‘15: Proceedings of the 19th International Conference on Evaluation and Assessment in Software Engineering* (pp. 1-10). ACM Digital Library. https://doi.org/10.1145/2745802.2745813

Wiegers, K., & Hokanson, C. (2023). *Software requirements: Core practices for successful business analysis*. Addison-Wesley.