import { db, audit } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const vehicleId = Number(body?.vehicleId ?? 0)
  if (!vehicleId || !body?.assignee) {
    throw createError({ statusCode: 400, statusMessage: 'Vehículo y asignado son obligatorios.' })
  }
  const vehicle = await db().vehicle.findUnique({ where: { id: vehicleId } })
  if (!vehicle) throw createError({ statusCode: 404, statusMessage: 'Vehículo no encontrado.' })
  if (vehicle.status === 'RETIRED') {
    throw createError({ statusCode: 409, statusMessage: 'El vehículo está de baja.' })
  }
  const assignment = await db().$transaction(async (tx) => {
    await tx.assignment.updateMany({ where: { vehicleId, active: true }, data: { active: false, endAt: new Date() } })
    return tx.assignment.create({
      data: {
        vehicleId,
        assignee: String(body.assignee).trim(),
        department: body.department ? String(body.department).trim() : undefined,
        site: body.site ? String(body.site).trim() : undefined,
      },
    })
  })
  await db().vehicle.update({ where: { id: vehicleId }, data: { status: 'IN_USE' } })
  audit('Sensei Ornyx', 'Asignación de vehículo', `Vehículo ${vehicleId} → ${assignment.assignee}`)
  return assignment
})
