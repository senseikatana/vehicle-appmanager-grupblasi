import { getPrisma } from '../../lib/prisma'

// Puerto de auditoría: toda acción sobre vehículos, costes o
// documentación legal queda registrada (AGENTS.md, regla 4).
export function audit(agent: string, task: string, result: string): void {
  // eslint-disable-next-line no-console
  console.info(JSON.stringify({
    timestamp: new Date().toISOString(),
    agent,
    task,
    result,
  }))
}

let cached: ReturnType<typeof getPrisma> | undefined

export function db() {
  cached ??= getPrisma()
  return cached
}
