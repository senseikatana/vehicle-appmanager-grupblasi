import { db, audit } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  try {
    const assignment = await db().assignment.update({
      where: { id },
      data: { active: false, endAt: new Date() },
    })
    await db().vehicle.update({ where: { id: assignment.vehicleId }, data: { status: 'AVAILABLE' } })
    audit('Sensei Ornyx', 'Cierre de asignación', `Asignación ${id}`)
    return assignment
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'Asignación no encontrada.' })
  }
})
