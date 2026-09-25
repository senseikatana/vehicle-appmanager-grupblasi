# AGENTS.md

> Este archivo prevalece sobre cualquier otro archivo del proyecto,
> incluidos AGENTS y SKILLS.

---

## Proyecto

**Puesto de trabajo:** Administrativo/va de Gestión de Vehículos y Equipos  
**Departamento:** OF. TÈCNICA I EF.EN.I HÍDRICA — Grup Blasi (Cambrils)

**Objetivo:** Digitalizar y automatizar las funciones del puesto
"Administrativo/va de Gestión de Vehículos y Equipos".

---

## Sistema de Bots Agénticos

Tres agentes locales: uno titular por defecto, uno que paraleliza y
uno en banquillo para trabajo pesado.

### 🎯 IG008 — Sensei Ornyx (Titular, por defecto)

- Multipropósito. Análisis, decisión, diseño, review, debug, rendimiento.
- Se invoca **siempre** por defecto.
- Responsable de la coherencia transversal del sistema.

### ⚡ IG010 — Sensei Prime (Subagente, paraleliza)

- Se activa solo cuando **Sensei Ornyx** delega o necesita paralelizar.
- Tareas secundarias, batch, repetitivas, ejecución en background.
- No rompe la coherencia del sistema.

---

## Reglas de enrutado

| Situación | Agente |
|---|---|
| Petición por defecto | 🎯 Sensei Ornyx |
| Tarea paralelizable o secundaria | ⚡ Sensei Prime |
| Tarea pesada o ante fallo del sistema activo | 🪑 Draven |

---

## Módulos funcionales de la app

Cada módulo se corresponde con una función del puesto de trabajo.
Los agentes se invocan según el tipo de tarea dentro de cada módulo.

### 1. Inventario y asignación de vehículos

- Registro: matrícula, marca, modelo, tipo, año, combustible, km.
- Asignación a empleados, departamentos u obras. *(Screen App)*
- Historial de asignaciones y estado (disponible, en uso, taller, baja).
- **Agente por defecto:** 🎯 Sensei Ornyx (CRUD + reglas de asignación).

### 2. Mantenimiento preventivo y correctivo

- Calendario por km o fecha.
- Alertas automáticas de revisiones próximas.
- Registro de reparaciones, averías e intervenciones con coste y proveedor.
- **Agentes:** ⚡ Sensei Prime (alertas en background) + 🎯 Sensei Ornyx (análisis de patrones).

### 3. Documentación administrativa y legal

- ITV, seguros, permisos y autorizaciones con caducidad.
- Alertas automáticas de vencimientos.
- Repositorio de documentos adjuntos.
- **Agentes:** ⚡ Sensei Prime (scheduler de avisos) + 🎯 Sensei Ornyx (validación normativa).

### 4. Incidencias, averías y siniestros

- Registro con estado (abierta, en curso, cerrada).
- Gestión de siniestros con aseguradora.
- Notificación al responsable.
- **Agentes:** 🎯 Sensei Ornyx (decisión y priorización) + ⚡ Sensei Prime (notificaciones).

### 5. Control de costes

- Coste por vehículo: mantenimiento, combustible, seguros, impuestos.
- Dashboard: coste total, coste/km, comparativas.
- Propuestas de optimización y ahorro.
- **Agente:** 🎯 Sensei Ornyx (análisis y propuestas).

### 6. Analítica y KPIs

- Disponibilidad, utilización, eficiencia, costes por vehículo/departamento.
- Gráficos interactivos y exportación (PDF/Excel).
- **Agente:** 🎯 Sensei Ornyx (interpretación y resúmenes narrativos).

### 7. Ciclo de vida del vehículo

- Alta, renovación, sustitución, venta y baja.
- Historial completo por vehículo.
- **Agentes:** 🎯 Sensei Ornyx (decisión) + 🪑 Draven (procesos masivos de histórico).

### 8. Seguimiento digital (GPS)

- Integración con GPS (API real o simulada).
- Control de kilometraje y rutas.
- **Agente:** ⚡ Sensei Prime (sincronización periódica).

### 9. Informes, procedimientos y registros

- Generación automática de informes.
- Plantillas de procedimientos internos.
- **Agentes:** 🎯 Sensei Ornyx (redacción) + ⚡ Sensei Prime (envío y archivado).

### 10. Cumplimiento normativo

- Checklist tráfico, transporte, seguridad y PRL.
- Registro de auditorías y validaciones.
- **Agentes:** 🎯 Sensei Ornyx (validación) + ⚡ Sensei Prime (recordatorios).

### 11. Colaboración interdepartamental

- Roles y permisos: admin, gestor de flota, técnico, empleado.
- Comentarios, tareas compartidas, notificaciones.
- **Agentes:** 🎯 Sensei Ornyx (coordinación) + ⚡ Sensei Prime (distribución de tareas).

---

## Capacidades que pide el puesto y su agente responsable

| Función del puesto | Agente |
|---|---|
| Gestionar inventario y asignación de vehículos | 🎯 Sensei Ornyx |
| Planificar mantenimiento preventivo/correctivo | ⚡ Sensei Prime |
| Supervisar documentación legal (ITV, seguros, permisos) | ⚡ Sensei Prime |
| Gestionar incidencias, averías y siniestros | 🎯 Sensei Ornyx |
| Controlar costes y proponer ahorro | 🎯 Sensei Ornyx |
| Analizar indicadores (disponibilidad, uso, eficiencia) | 🎯 Sensei Ornyx |
| Coordinar adquisición, renovación, venta y baja | 🎯 Sensei Ornyx |
| Gestionar sistemas digitales de seguimiento | ⚡ Sensei Prime |
| Elaborar procedimientos, informes y registros | 🎯 Sensei Ornyx + ⚡ Sensei Prime |
| Velar por cumplimiento normativo (tráfico, PRL) | 🎯 Sensei Ornyx |
| Colaborar con otros departamentos | 🎯 Sensei Ornyx + ⚡ Sensei Prime |

---

## Stack técnico

- **Frontend:** Nuxt + TypeScript + TailwindCSS + 3rd Party.
- **Backend:** Nuxt Internal API (Node.js + Express).
- **Base de datos:** Insforge o Cloudflare (Full Stack Environment).
- **Autenticación:** JWT o Supabase Auth con roles.
- **Agentes:** orquestador propio + workers.

---

## Registro y trazabilidad

- Toda acción de un agente se registra con: agente, tarea, prompt usado,
  resultado, timestamp.
- Los logs son consultables desde la app.
- Las decisiones críticas (bajas, ventas, siniestros) requieren
  validación humana antes de ejecutarse.

---

## Reglas globales

1. **Sensei Ornyx** por defecto. Nunca se invoca a Sensei Prime o Draven sin motivo.
2. Sensei Prime solo paraleliza. No toma decisiones de negocio.
3. Draven solo entra en tareas pesadas o ante fallo del sistema activo.
4. Toda acción sobre vehículos, costes o documentación legal queda auditada.
5. La normativa vigente (tráfico, transporte, seguridad, PRL) prevalece
   sobre cualquier automatización.
6. La app trabaja desde la proximidad y la empatía, alineada con la
   cultura de Grup Blasi: personas en el centro.

---

## Convenciones de código

- Responde de manera corta y concisa.
- Código en inglés (nombres de variables, funciones, clases, todo).
- Comentarios en español, solo cuando aporten valor.
- Prioriza simplicidad: código fácil de leer, funciones pequeñas, sin duplicación (DRY).
- Sigue principios SOLID donde aplique.
- Sin comentarios superfluos — el código debe ser auto-documentado en lo posible.
- Sin magia: evita expresiones crípticas, prefiere claridad.
- Buenas prácticas de seguridad cuando corresponda.
- Arquitectura Hexagonal, patrón SOLID.
- Archivos `.ts` siempre con los 6 patrones de diseño (Singleton, Facade, Factory, Observer, Strategy, Decorator) según convenga.
- No inventes y no hagas nada que no se te haya indicado, aunque el prompt sea muy largo o extenso.
- Este archivo va por encima de todos, AGENTS y SKILLS incluidos.
