import { db, audit } from '../../utils/db'

const STATUSES = ['AVAILABLE', 'IN_USE', 'WORKSHOP', 'RETIRED'] as const

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body?.plate || !body?.brand || !body?.model || !body?.vehicleType || !body?.year || !body?.fuel) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos obligatorios del vehículo.' })
  }
  if (body.status && !STATUSES.includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Estado no válido.' })
  }
  try {
    const vehicle = await db().vehicle.create({
      data: {
        plate: String(body.plate).toUpperCase().trim(),
        brand: String(body.brand).trim(),
        model: String(body.model).trim(),
        vehicleType: String(body.vehicleType).trim(),
        year: Number(body.year),
        fuel: String(body.fuel).trim(),
        mileage: Number(body.mileage ?? 0),
        status: body.status ?? 'AVAILABLE',
      },
    })
    audit('Sensei Ornyx', 'Alta de vehículo', `Matrícula ${vehicle.plate}`)
    return vehicle
  }
  catch {
    throw createError({ statusCode: 409, statusMessage: 'La matrícula ya existe.' })
  }
})
