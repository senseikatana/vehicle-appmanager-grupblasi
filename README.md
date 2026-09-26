# Vehicle AppManager — Grup Blasi

Digitalización del puesto **Administrativo/a de Gestión de Vehículos y Equipos**
(OF. Tècnica i Ef. En. Hídrica — Grup Blasi, Cambrils).

## Módulos

1. Inventario y asignación de vehículos
2. Mantenimiento preventivo y correctivo
3. Documentación administrativa y legal
4. Incidencias, averías y siniestros
5. Control de costes
6. Analítica y KPIs
7. Ciclo de vida del vehículo
8. Seguimiento digital (GPS)
9. Informes, procedimientos y registros
10. Cumplimiento normativo
11. Colaboración interdepartamental

Ver `AGENTS.md` para el detalle funcional, agentes responsables y reglas globales.

## Stack

Nuxt 4 + TypeScript + TailwindCSS v4 + @nuxt/ui · API interna Nuxt ·
Prisma ORM 7 + Cloudflare D1 (SQLite) · Auth propia con sesiones y roles.

## Setup

```bash
bun install
```

## Desarrollo

```bash
bun run dev        # http://localhost:3000
bun run db:seed    # usuarios de demo (solo desarrollo)
```

## Base de datos

```bash
bunx prisma generate                                   # regenerar clientes
bun run db:apply:local                                 # aplicar migración a D1 local
bunx wrangler d1 execute vehicle-appmanager-d1 --remote --file=./prisma/migrations/XXXX.sql
```

Las migraciones se generan con `prisma migrate diff` y se aplican con
`wrangler d1 execute`. Nunca `migrate dev` contra D1.

## Credenciales de demo (solo desarrollo)

El panel de `/signin` las muestra y las rellena con un clic:

| Email | Contraseña | Rol |
|---|---|---|
| admin@grupblasi.cat | admin123 | ADMIN |
| gestor@grupblasi.cat | gestor123 | GESTOR_FLOTA |
| tecnico@grupblasi.cat | tecnico123 | TECNICO |
| empleado@grupblasi.cat | empleado123 | EMPLEADO |

En producción se regeneran y el panel de demo no se renderiza.

## Build

```bash
bun run build
```
