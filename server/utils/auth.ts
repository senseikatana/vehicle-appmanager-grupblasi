import type { H3Event } from "h3";
import { db } from "./db";

// Lee la sesión de la cookie y devuelve el usuario (sin hash) o null.
export async function getSessionUser(event: H3Event) {
  const token = getCookie(event, "session");
  if (!token) return null;
  const session = await db().session.findUnique({
    where: { id: token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  const { passwordHash: _passwordHash, ...user } = session.user;
  return user;
}

export async function requireUser(event: H3Event) {
  const user = await getSessionUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "No autenticado." });
  return user;
}
