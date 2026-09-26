import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { faker } from "@faker-js/faker/locale/es";
import { PrismaClient } from "../generated/server/client";
import { hashPassword } from "../lib/password";

// Seed local idempotente: usuarios por rol + datos de ejemplo de la flota.
// Las contraseñas solo viven aquí para desarrollo; en DB solo va el hash.
const SEED_USERS = [
  { email: "admin@grupblasi.cat", name: "Admin", password: "admin123", role: "ADMIN" },
  { email: "gestor@grupblasi.cat", name: "Gestor de flota", password: "gestor123", role: "GESTOR_FLOTA" },
  { email: "tecnico@grupblasi.cat", name: "Técnico", password: "tecnico123", role: "TECNICO" },
  { email: "empleado@grupblasi.cat", name: "Empleado", password: "empleado123", role: "EMPLEADO" },
] as const;

const VEHICLES = [
  { plate: "4521-KLM", brand: "Seat", model: "Ibiza", vehicleType: "Turismo", year: 2019, fuel: "Gasolina", mileage: 84312 },
  { plate: "8304-RTV", brand: "Renault", model: "Kangoo", vehicleType: "Furgoneta", year: 2020, fuel: "Diesel", mileage: 121450 },
  { plate: "1276-BCD", brand: "Citroën", model: "Berlingo", vehicleType: "Furgoneta", year: 2018, fuel: "Diesel", mileage: 156780 },
  { plate: "6688-JXP", brand: "Ford", model: "Transit", vehicleType: "Furgoneta", year: 2021, fuel: "Diesel", mileage: 67230 },
  { plate: "3941-HGN", brand: "Peugeot", model: "Partner", vehicleType: "Furgoneta", year: 2017, fuel: "Diesel", mileage: 189210 },
  { plate: "7150-DLW", brand: "Fiat", model: "Ducato", vehicleType: "Camión ligero", year: 2022, fuel: "Diesel", mileage: 41200 },
  { plate: "2845-MQB", brand: "Toyota", model: "Hilux", vehicleType: "Pickup", year: 2023, fuel: "Diesel", mileage: 23450 },
  { plate: "5067-FST", brand: "Volkswagen", model: "Caddy", vehicleType: "Furgoneta", year: 2016, fuel: "Gasolina", mileage: 174890 },
] as const;

const DEPARTMENTS = ["OF. Tècnica", "Manteniment", "Administració", "Obra"];
const SITES = ["Cambrils", "Salou", "Reus", "Valls"];
const PROVIDERS = ["Taller Blasi", "Mecánica Salou", "Norauto Cambrils", "Repsol Taller"];

async function seedDemo(prisma: PrismaClient) {
  // Alta por matrícula: no pisa lo que ya exista (incluidas altas manuales).
  const vehicles = [];
  for (const v of VEHICLES) {
    vehicles.push(
      await prisma.vehicle.upsert({
        where: { plate: v.plate },
        update: {},
        create: { ...v },
      }),
    );
  }

  if ((await prisma.assignment.count()) > 0) {
    // eslint-disable-next-line no-console
    console.log("seed: datos relacionados ya presentes, demo no se duplica");
    return;
  }

  for (let i = 0; i < 10; i++) {
    const vehicle = faker.helpers.arrayElement(vehicles);
    const closed = i >= 6;
    await prisma.assignment.create({
      data: {
        vehicleId: vehicle.id,
        assignee: faker.person.fullName(),
        department: faker.helpers.arrayElement(DEPARTMENTS),
        site: faker.helpers.arrayElement(SITES),
        startAt: faker.date.past({ years: 2 }),
        endAt: closed ? faker.date.recent({ days: 60 }) : null,
        active: !closed,
      },
    });
  }

  for (let i = 0; i < 12; i++) {
    const vehicle = faker.helpers.arrayElement(vehicles);
    await prisma.maintenance.create({
      data: {
        vehicleId: vehicle.id,
        kind: faker.helpers.arrayElement(["PREVENTIVE", "CORRECTIVE"]),
        date: faker.date.past({ years: 1 }),
        mileage: vehicle.mileage - faker.number.int({ min: 0, max: 20000 }),
        cost: faker.number.int({ min: 45, max: 890 }),
        provider: faker.helpers.arrayElement(PROVIDERS),
        notes: faker.helpers.arrayElement([
          "Cambio de aceite y filtros",
          "Revisión de frenos",
          "Neumáticos delanteros",
          "Revisión general",
        ]),
      },
    });
  }

  const docTypes = ["ITV", "Seguro", "Permiso", "Autorización"];
  for (let i = 0; i < 10; i++) {
    const vehicle = faker.helpers.arrayElement(vehicles);
    const days = i < 3 ? faker.number.int({ min: 5, max: 25 }) : faker.number.int({ min: 60, max: 400 });
    await prisma.legalDocument.create({
      data: {
        vehicleId: vehicle.id,
        docType: faker.helpers.arrayElement(docTypes),
        expiresAt: new Date(Date.now() + days * 86400000),
        notes: faker.helpers.arrayElement(["Renovación anual", "En vigor", "Tramitación en curso"]),
      },
    });
  }

  for (let i = 0; i < 8; i++) {
    const vehicle = faker.helpers.arrayElement(vehicles);
    const status = faker.helpers.arrayElement(["OPEN", "OPEN", "IN_PROGRESS", "CLOSED"]);
    await prisma.incident.create({
      data: {
        vehicleId: vehicle.id,
        status,
        description: faker.helpers.arrayElement([
          "Golpe en parachoques trasero",
          "Avería en la iluminación frontal",
          "Problema en la batería",
          "Rotura del retrovisor",
        ]),
        cost: faker.number.int({ min: 60, max: 1400 }),
        createdAt: faker.date.past({ years: 1 }),
        closedAt: status === "CLOSED" ? faker.date.recent({ days: 30 }) : null,
      },
    });
  }

  const categories = ["Combustible", "Seguro", "Impuesto", "Peaje", "Otro"];
  for (let i = 0; i < 20; i++) {
    const vehicle = faker.helpers.arrayElement(vehicles);
    await prisma.costEntry.create({
      data: {
        vehicleId: vehicle.id,
        category: faker.helpers.arrayElement(categories),
        amount: faker.number.int({ min: 20, max: 540 }),
        date: faker.date.past({ years: 1 }),
        notes: faker.helpers.arrayElement(["Facturado", "Pago con tarjeta", "Recibo trimestral"]),
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(`seed: demo creada (${VEHICLES.length} vehículos + asignaciones, mantenimientos, documentos, incidencias y costes)`);
}

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
  await seedDemo(prisma);
  await prisma.$disconnect();
}

await main();
