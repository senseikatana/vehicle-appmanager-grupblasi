# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto usa [Versionado Semántico](https://semver.org/lang/es/).

## [0.1.0] - 2026-09-26

Base de datos con Prisma 7 + Cloudflare D1 y limpieza del toolchain de build.
Incluye trabajo ya integrado en `dev` (setup Prisma/D1, schema, `lib/prisma.ts`,
`wrangler.jsonc`, fix Tailwind v4) más la limpieza de dependencias pendiente
en el árbol (`@sidebase/nuxt-auth`, `@nuxtjs/eslint-module`, pin de TS/ESLint).

### Added

- Setup Prisma 7 con `prisma.config.ts` (schema en `prisma/schema.prisma`,
  migraciones en `prisma/migrations`, `datasource.url = env("DATABASE_URL")`).
- Schema SQLite compatible con D1 con 6 modelos: `Vehicle`, `Assignment`,
  `Maintenance`, `LegalDocument`, `Incident` y `CostEntry`, con enums
  `VehicleStatus`, `MaintenanceKind`, `IncidentStatus` e índices por
  vehículo/fecha, vencimientos y estado.
- Migración inicial `prisma/migrations/0001_init.sql` (tablas + índices).
- `lib/prisma.ts` como fachada hexagonal: `PrismaClientFactory` con
  `LocalSqliteStrategy` (better-sqlite3, espejo local del esquema D1) y
  `D1Strategy` (binding de Cloudflare), singleton HMR-safe, `getPrisma()`,
  observer `onDatabaseReady` y decorador de logging solo en desarrollo.
- `wrangler.jsonc` con binding D1 `DB` (`vehicle-appmanager-d1`).
- Scripts: `postinstall` / `prisma:generate`, `prisma:diff`,
  `db:apply:local` y `db:apply:remote` (aplican `0001_init.sql` con
  `wrangler d1 execute --local/--remote`).
- Dependencias: `prisma@7`, `wrangler@4`, `@prisma/adapter-d1`,
  `@prisma/adapter-better-sqlite3`, `better-sqlite3`, `dotenv`,
  `playwright-core`, `@tailwindcss/vite`.
- Plantilla `.env.example` (SQLite local `file:./prisma/dev.db` + placeholders
  D1 remoto pendientes de credenciales) y `app/assets/css/main.css`.
- `.gitignore`: cubre `.env`, `.dev.vars`, `*.db`, `.wrangler/` y `generated/`
  (ni secretos ni datos locales se versionan).

### Changed

- Tailwind v4 vía plugin `@tailwindcss/vite` + `css: ['~/assets/css/main.css']`
  en `nuxt.config.ts` (fix del build).
- `typescript` fijado a `^5.9.3` y `eslint` a `^9.0.0` (se acotan los rangos
  abiertos `|| ^10`, `|| ^6 || ^7` para builds reproducibles).
- Fijadas versiones menores: `@nuxt/content` `^3.16.1`, `@tiptap/*` `^3.31.3`,
  `vue` `^3.5.43`, `tailwindcss` `^4.3.3`. `bun.lock` regenerado.

### Removed

- `@prisma/nuxt` (v6-only, incompatible con Prisma 7 + D1; Prisma se gestiona
  manual con `lib/prisma.ts`).
- `@nuxtjs/tailwindcss` (sustituido por `@tailwindcss/vite`).
- `@sidebase/nuxt-auth`: sin handler rompía `/api/auth/*`; el auth se cableará
  con Cloudflare + InsForge en el Módulo 11 (roles y permisos).
- `@nuxtjs/eslint-module` (limpieza; se usa `@nuxt/eslint`).

### Fixed

- `database_id` de D1 en `wrangler.jsonc`.

### Security

- Verificado: `.env`, `.dev.vars`, `*.db`, `.wrangler/` y `generated/` están
  ignorados y no entran en este release.
