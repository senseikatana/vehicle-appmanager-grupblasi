import { db } from "../../utils/db";
import { hashPassword, newSessionToken } from "../../../lib/password";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const name = String(body?.name ?? "").trim();
  const password = String(body?.password ?? "");
  if (!email || !name || password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: "Nombre, email y contraseña (mínimo 6 caracteres)." });
  }
  const existing = await db().user.findUnique({ where: { email } });
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: "Ese email ya está registrado." });
  }
  // El alta siempre entra como EMPLEADO; el rol lo asigna un admin después.
  const user = await db().user.create({
    data: { email, name, passwordHash: hashPassword(password), role: "EMPLEADO" },
  });
  const token = newSessionToken();
  await db().session.create({
    data: { id: token, userId: user.id, expiresAt: new Date(Date.now() + THIRTY_DAYS_MS) },
  });
  setCookie(event, "session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS_MS / 1000,
  });
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
});
