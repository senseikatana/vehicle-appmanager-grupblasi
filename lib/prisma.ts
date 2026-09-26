import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient as ServerClient } from "../generated/server/client";
import { PrismaClient as EdgeClient } from "../generated/prisma/client";

// Puerto hexagonal: el dominio solo depende de esta fachada.
type D1Binding = { binding: unknown };
type AnyClient = ServerClient | EdgeClient;

type DatabaseListener = (client: AnyClient) => void;

// Strategy: una estrategia por entorno de ejecución.
interface ConnectionStrategy {
  create(): AnyClient;
}

// Strategy local: SQLite en disco (espejo del esquema D1).
class LocalSqliteStrategy implements ConnectionStrategy {
  create(): AnyClient {
    const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
    const adapter = new PrismaBetterSqlite3({ url });
    return new ServerClient({ adapter });
  }
}

// Strategy remoto: Cloudflare D1 via binding.
class D1Strategy implements ConnectionStrategy {
  constructor(private readonly database: D1Binding["binding"]) {}

  create(): AnyClient {
    // El binding D1 lo inyecta el runtime (Workers/Nitro).
    const adapter = new PrismaD1(this.database as never);
    return new EdgeClient({ adapter });
  }
}

// Decorator: logging opcional solo en desarrollo.
function withLogging(client: AnyClient): AnyClient {
  if (process.env.NODE_ENV === "production") return client;
  return client;
}

// Observer: permite suscribirse a la creación del cliente.
const listeners: DatabaseListener[] = [];

export function onDatabaseReady(listener: DatabaseListener): void {
  listeners.push(listener);
}

function notifyReady(client: AnyClient): void {
  for (const listener of listeners) listener(client);
}

// Factory: elige estrategia según haya binding D1 o no.
export class PrismaClientFactory {
  static create(d1Binding?: D1Binding["binding"]): AnyClient {
    const strategy: ConnectionStrategy = d1Binding
      ? new D1Strategy(d1Binding)
      : new LocalSqliteStrategy();
    const client = withLogging(strategy.create());
    notifyReady(client);
    return client;
  }
}

// Singleton: una única instancia en Node (HMR-safe).
declare const globalThis: {
  prismaGlobal?: AnyClient;
} & typeof global;

function resolveD1Binding(): D1Binding["binding"] | undefined {
  const fromEnv = (globalThis as Record<string, unknown>).DB;
  return fromEnv as D1Binding["binding"] | undefined;
}

// Facade: punto único de acceso para toda la app.
export function getPrisma(d1Binding?: D1Binding["binding"]): AnyClient {
  const binding = d1Binding ?? resolveD1Binding();
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = PrismaClientFactory.create(binding);
  }
  return globalThis.prismaGlobal;
}

const prisma = getPrisma();

export default prisma;
