import { db, audit } from '../../utils/db'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return db().legalDocument.findMany({
      orderBy: { expiresAt: 'asc' },
      include: { vehicle: { select: { plate: true } } },
    })
  }
  const body = await readBody(event)
  if (!body?.vehicleId || !body?.docType || !body?.expiresAt) {
    throw createError({ statusCode: 400, statusMessage: 'Vehículo, tipo y caducidad son obligatorios.' })
  }
  const record = await db().legalDocument.create({
    data: {
      vehicleId: Number(body.vehicleId),
      docType: String(body.docType).trim(),
      expiresAt: new Date(body.expiresAt),
      notes: body.notes ? String(body.notes).trim() : undefined,
    },
  })
  audit('Sensei Ornyx', 'Registro de documento', `Vehículo ${body.vehicleId} (${body.docType})`)
  return record
})
