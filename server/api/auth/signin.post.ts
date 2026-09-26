import type { H3Event } from "h3";
import { db } from "../../utils/db";
import { newSessionToken, verifyPassword } from "../../../lib/password";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function setSessionCookie(event: H3Event, token: string) {
  setCookie(event, "session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS_MS / 1000,
  });
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Email y contraseña son obligatorios." });
  }
  const user = await db().user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: "Credenciales no válidas." });
  }
  const token = newSessionToken();
  await db().session.create({
    data: { id: token, userId: user.id, expiresAt: new Date(Date.now() + THIRTY_DAYS_MS) },
  });
  setSessionCookie(event, token);
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
});
