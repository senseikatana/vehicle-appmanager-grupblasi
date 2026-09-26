import { db, audit } from '../../utils/db'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const vehicleId = Number(getQuery(event).vehicleId ?? 0)
    return db().costEntry.findMany({
      where: vehicleId ? { vehicleId } : undefined,
      orderBy: { date: 'desc' },
      include: { vehicle: { select: { plate: true } } },
    })
  }
  const body = await readBody(event)
  if (!body?.vehicleId || !body?.category || body?.amount === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'Vehículo, categoría e importe son obligatorios.' })
  }
  const record = await db().costEntry.create({
    data: {
      vehicleId: Number(body.vehicleId),
      category: String(body.category).trim(),
      amount: Number(body.amount),
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  })
  audit('Sensei Ornyx', 'Registro de coste', `Vehículo ${body.vehicleId}: ${body.amount} €`)
  return record
})
