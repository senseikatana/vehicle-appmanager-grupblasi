import { db, audit } from '../../utils/db'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const vehicleId = Number(getQuery(event).vehicleId ?? 0)
    return db().incident.findMany({
      where: vehicleId ? { vehicleId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { vehicle: { select: { plate: true } } },
    })
  }
  const body = await readBody(event)
  if (!body?.vehicleId || !body?.description) {
    throw createError({ statusCode: 400, statusMessage: 'Vehículo y descripción son obligatorios.' })
  }
  const record = await db().incident.create({
    data: {
      vehicleId: Number(body.vehicleId),
      description: String(body.description).trim(),
      cost: Number(body.cost ?? 0),
      status: ['OPEN', 'IN_PROGRESS', 'CLOSED'].includes(body.status) ? body.status : 'OPEN',
    },
  })
  audit('Sensei Ornyx', 'Registro de incidencia', `Vehículo ${body.vehicleId}`)
  return record
})
