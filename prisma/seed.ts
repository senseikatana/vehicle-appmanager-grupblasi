import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/server/client";
import { hashPassword } from "../lib/password";

// Seed local idempotente: un usuario por rol (AGENTS.md, módulo 11).
// Las contraseñas solo viven aquí para desarrollo; en DB solo va el hash.
const SEED_USERS = [
  { email: "admin@grupblasi.cat", name: "Admin", password: "admin123", role: "ADMIN" },
  { email: "gestor@grupblasi.cat", name: "Gestor de flota", password: "gestor123", role: "GESTOR_FLOTA" },
  { email: "tecnico@grupblasi.cat", name: "Técnico", password: "tecnico123", role: "TECNICO" },
  { email: "empleado@grupblasi.cat", name: "Empleado", password: "empleado123", role: "EMPLEADO" },
] as const;

async function main() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        passwordHash: hashPassword(user.password),
        role: user.role,
      },
    });
    // eslint-disable-next-line no-console
    console.log(`seed: ${user.email} (${user.role})`);
  }
  await prisma.$disconnect();
}

await main();
