import { db } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const vehicleId = Number(getQuery(event).vehicleId ?? 0)
  return db().assignment.findMany({
    where: vehicleId ? { vehicleId } : undefined,
    orderBy: { startAt: 'desc' },
    include: { vehicle: { select: { plate: true, brand: true, model: true } } },
  })
})
