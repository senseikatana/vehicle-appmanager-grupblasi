import { getSessionUser } from "../utils/auth";

// Toda la API (salvo /api/auth/*) exige sesión. Un solo punto de control.
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith("/api/") || event.path.startsWith("/api/auth/")) return;
  event.context.user = await getSessionUser(event);
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "No autenticado." });
  }
});
