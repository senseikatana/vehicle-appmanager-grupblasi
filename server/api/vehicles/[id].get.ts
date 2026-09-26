import { db } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const vehicle = await db().vehicle.findUnique({
    where: { id },
    include: {
      assignments: { orderBy: { startAt: 'desc' } },
      maintenances: { orderBy: { date: 'desc' }, take: 10 },
      documents: { orderBy: { expiresAt: 'asc' } },
      incidents: { orderBy: { createdAt: 'desc' }, take: 10 },
      costs: { orderBy: { date: 'desc' }, take: 10 },
    },
  })
  if (!vehicle) throw createError({ statusCode: 404, statusMessage: 'Vehículo no encontrado.' })
  return vehicle
})
