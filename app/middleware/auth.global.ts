// Sin sesión: las rutas de app van a /signin. Con sesión: /signin y
// /signup redirigen al dashboard. Landing, about y legal son públicas.
const PUBLIC_PATHS = ["/", "/about", "/signin", "/signup"];

export default defineNuxtRouteMiddleware(async (to) => {
  const isPublic =
    PUBLIC_PATHS.includes(to.path) ||
    to.path.startsWith("/legal/") ||
    to.path.startsWith("/api/") ||
    to.path.startsWith("/_");

  const me = await $fetch("/api/auth/me", {
    headers: useRequestHeaders(["cookie"]),
  }).catch(() => null);

  if (!me && !isPublic) return navigateTo("/signin");
  if (me && (to.path === "/signin" || to.path === "/signup")) {
    return navigateTo("/dashboard");
  }
});
