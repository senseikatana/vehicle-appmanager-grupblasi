import { db } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "session");
  if (token) await db().session.deleteMany({ where: { id: token } });
  deleteCookie(event, "session");
  return { ok: true };
});
