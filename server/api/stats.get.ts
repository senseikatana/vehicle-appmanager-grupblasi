import { db } from '../utils/db'

export default defineEventHandler(async () => {
  const [vehicles, activeAssignments, openIncidents, maintenances, costs] = await Promise.all([
    db().vehicle.groupBy({ by: ['status'], _count: true }),
    db().assignment.count({ where: { active: true } }),
    db().incident.count({ where: { status: { not: 'CLOSED' } } }),
    db().maintenance.aggregate({ _sum: { cost: true }, _count: true }),
    db().costEntry.aggregate({ _sum: { amount: true } }),
  ])
  const byStatus: Record<string, number> = {}
  for (const row of vehicles) byStatus[row.status] = row._count
  return {
    vehiclesByStatus: byStatus,
    totalVehicles: Object.values(byStatus).reduce((a, b) => a + b, 0),
    activeAssignments,
    openIncidents,
    maintenanceCount: maintenances._count,
    maintenanceCost: maintenances._sum.cost ?? 0,
    otherCosts: costs._sum.amount ?? 0,
  }
})
