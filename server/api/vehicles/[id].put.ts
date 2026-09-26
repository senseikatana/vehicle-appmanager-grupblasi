import { db, audit } from '../../utils/db'

const STATUSES = ['AVAILABLE', 'IN_USE', 'WORKSHOP', 'RETIRED'] as const

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  if (body.status && !STATUSES.includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Estado no válido.' })
  }
  const data: Record<string, unknown> = {}
  if (body.status) data.status = body.status
  if (body.mileage !== undefined) data.mileage = Number(body.mileage)
  if (body.brand) data.brand = String(body.brand).trim()
  if (body.model) data.model = String(body.model).trim()
  if (body.vehicleType) data.vehicleType = String(body.vehicleType).trim()
  if (body.year) data.year = Number(body.year)
  if (body.fuel) data.fuel = String(body.fuel).trim()
  try {
    const vehicle = await db().vehicle.update({ where: { id }, data })
    audit('Sensei Ornyx', 'Actualización de vehículo', `ID ${id}: ${JSON.stringify(data)}`)
    return vehicle
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: 'Vehículo no encontrado.' })
  }
})
