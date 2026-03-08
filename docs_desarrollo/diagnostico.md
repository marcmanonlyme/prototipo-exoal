# Diagnóstico

La institución educativa enfrenta una problemática de comunicación y acceso a la información, derivada de la falta de un sistema centralizado que permita a su comunidad (estudiantes, docentes, administrativos y visitantes) consultar actividades y trámites en tiempo real. Esta situación genera desconexión entre los planteles, unidades y centros de investigación, lo que impacta negativamente en la participación comunitaria y la eficiencia operativa. A continuación, se analiza la problemática mediante la identificación de causas y efectos, el uso de herramientas metodológicas y el marco regulatorio aplicable, con el fin de fundamentar la propuesta de solución.

## Causas y efectos

La principal causa de la problemática radica en la **ausencia de un sistema informativo integrado**, lo que impide que la información sobre actividades culturales, académicas, extraacadémicas, administrativas y económicas se difunda de manera accesible y oportuna. Por ejemplo, los horarios de exámenes, normativas y asignaciones de docentes se manejan de forma fragmentada en cada sede, lo que genera inconsistencias y sobrecarga administrativa. Según Sommerville (2015), en sistemas de software complejos como este, la falta de integración de requerimientos funcionales y no funcionales puede llevar a "efectos en cascada" donde un problema inicial (como la desconexión de datos) amplifica otros, como la baja participación en actividades o errores en trámites.

Como consecuencia, se observa una **reducción en la participación comunitaria**, ya que los estudiantes y docentes no pueden acceder fácilmente a información relevante, lo que afecta la calidad educativa y la cohesión institucional. Además, la infraestructura computacional existente (como los servidores Power 770 y Pure Flex) no se aprovecha plenamente, lo que implica un desperdicio de recursos y limita la escalabilidad. Otras repercusiones incluyen posibles incumplimientos regulatorios, como la falta de transparencia en la gestión de datos personales, y un aumento en los costos operativos debido a la duplicación de esfuerzos administrativos. Para resolverlo, se propone implementar un sistema informático que centralice la información, reutilizando la infraestructura actual para minimizar inversiones, y asignando roles claros a los usuarios (administradores para gestión, docentes y estudiantes para consulta). Esta solución no solo mitigaría los efectos inmediatos, sino que promovería una cultura de accesibilidad, alineada con principios de usabilidad descritos por Nielsen (2024), quienes enfatizan que los sistemas deben ser intuitivos para fomentar la adopción.

## Uso de herramientas

Para elaborar este diagnóstico, se emplearon diversas herramientas metodológicas que permitieron un análisis sistemático y fundamentado. En primer lugar, se realizó una **revisión documental** de la infraestructura organizacional y computacional proporcionada en el caso práctico, cruzando datos poblacionales con las capacidades de hardware para identificar brechas (por ejemplo, la capacidad de almacenamiento de 60 TB en el Storwize V700 versus la demanda de consultas simultáneas). Esta herramienta, recomendada por Wiegers y Hokanson (2023) en el análisis de requerimientos, ayudó a cuantificar la problemática y proponer reutilización de recursos.

Adicionalmente, se aplicaron **entrevistas simuladas** a representantes hipotéticos de la institución (un administrador, un docente y un estudiante), basadas en escenarios reales del caso, para recopilar percepciones sobre las dificultades actuales. Estas entrevistas, estructuradas con preguntas abiertas sobre acceso a información y trámites, revelaron patrones comunes de frustración, como la dependencia de correos electrónicos o avisos físicos. Por último, se utilizó un **análisis SWOT** (fortalezas, oportunidades, debilidades y amenazas) para evaluar la viabilidad de la solución, destacando la oportunidad de aprovechar la infraestructura existente como fortaleza, pero identificando la baja inversión como debilidad que requiere enfoques eficientes. Estas herramientas, combinadas con referencias teóricas, aseguraron un diagnóstico objetivo y orientado a la resolución práctica del caso.

## Marco regulatorio

El diagnóstico se enmarca en normativas educativas y de protección de datos que regulan el manejo de información en instituciones públicas o privadas de educación superior. En México, la **Ley General de Educación** (DOF, 2019) establece la obligación de promover la transparencia y el acceso a la información educativa, lo que justifica la necesidad de un sistema que facilite la consulta de actividades y trámites administrativos. Asimismo, la **Ley Federal de Protección de Datos Personales en Posesión de Particulares** (DOF, 2010) y su Reglamento (DOF, 2011) exigen el manejo seguro de datos sensibles, como los de estudiantes y docentes, para evitar brechas de privacidad. La implementación de la solución debe cumplir con estos marcos para garantizar la legalidad y evitar sanciones, alineándose con principios de ética en el desarrollo de software (Pressman & Maxim, 2020). Este contexto regulatorio refuerza la urgencia de centralizar la información, ya que la falta de cumplimiento podría derivar en responsabilidades legales y pérdida de confianza institucional.

## Conclusión del diagnóstico

En resumen, la problemática se origina en deficiencias operativas y regulatorias, cuyas consecuencias afectan la eficiencia institucional. Las herramientas utilizadas proporcionaron una base sólida para proponer una solución viable, que se desarrollará en las siguientes secciones del trabajo.

## Referencias

Diario Oficial de la Federación. (2010, abril 26). *Ley Federal de Protección de Datos Personales en Posesión de Particulares*. https://www.dof.gob.mx/nota_detalle.php?codigo=5141935&fecha=26/04/2010

Diario Oficial de la Federación. (2011, diciembre 21). *Reglamento de la Ley Federal de Protección de Datos Personales en Posesión de Particulares*. https://www.dof.gob.mx/nota_detalle.php?codigo=5228594&fecha=21/12/2011

Diario Oficial de la Federación. (2019, julio 19). *Ley General de Educación*. https://www.dof.gob.mx/nota_detalle.php?codigo=5564068&fecha=19/07/2019

Nielsen, J. (2024). *10 usability heuristics for user interface design*. Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/

Pressman, R. S., & Maxim, B. (2020). *Software engineering: A practitioner’s approach* (9a ed.). McGraw Hill.

Sommerville, I. (2015). *Software engineering* (10a ed.). Pearson.

Wiegers, K., & Hokanson, C. (2023). *Software requirements: Core practices for successful business analysis*. Addison-Wesley.