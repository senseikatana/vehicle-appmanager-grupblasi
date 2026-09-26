import { db, audit } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const active = await db().assignment.count({ where: { vehicleId: id, active: true } })
  if (active > 0) {
    throw createError({ statusCode: 409, statusMessage: 'Tiene asignaciones activas. Ciérralas antes de darlo de baja.' })
  }
  try {
    await db().vehicle.delete({ where: { id } })
    audit('Sensei Ornyx', 'Baja de vehículo', `ID ${id}`)
    return { ok: true }
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'Vehículo no encontrado.' })
  }
})
