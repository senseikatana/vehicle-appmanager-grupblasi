import { db, audit } from '../../utils/db'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const vehicleId = Number(getQuery(event).vehicleId ?? 0)
    return db().maintenance.findMany({
      where: vehicleId ? { vehicleId } : undefined,
      orderBy: { date: 'desc' },
      include: { vehicle: { select: { plate: true } } },
    })
  }
  const body = await readBody(event)
  if (!body?.vehicleId || !body?.kind) {
    throw createError({ statusCode: 400, statusMessage: 'Vehículo y tipo son obligatorios.' })
  }
  if (!['PREVENTIVE', 'CORRECTIVE'].includes(body.kind)) {
    throw createError({ statusCode: 400, statusMessage: 'Tipo no válido.' })
  }
  const record = await db().maintenance.create({
    data: {
      vehicleId: Number(body.vehicleId),
      kind: body.kind,
      mileage: body.mileage !== undefined ? Number(body.mileage) : undefined,
      cost: Number(body.cost ?? 0),
      provider: body.provider ? String(body.provider).trim() : undefined,
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  })
  audit('Sensei Ornyx', 'Registro de mantenimiento', `Vehículo ${body.vehicleId} (${body.kind})`)
  return record
})
