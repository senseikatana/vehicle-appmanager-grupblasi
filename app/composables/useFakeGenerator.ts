// Generación de datos de ejemplo con faker, cargada bajo demanda
// (import dinámico: faker no entra en el bundle inicial).
export function useFakeGenerator() {
  async function faker() {
    const { faker: fake } = await import('@faker-js/faker')
    return fake
  }

  const vehicleBrands = ['Seat', 'Renault', 'Ford', 'Citroën', 'Peugeot', 'Fiat', 'Toyota', 'Mercedes-Benz', 'Volkswagen']
  const vehicleTypes = ['Furgoneta', 'Turismo', 'Camión ligero', 'Pickup', 'Tractor']

  async function vehicleForm() {
    const f = await faker()
    const letters = 'BCDFGHJKLMNPRSTVWXYZ'
    const randomLetter = () => f.string.alpha({ length: 1, casing: 'upper', pool: letters })
    return {
      plate: `${f.number.int({ min: 1000, max: 9999 })}-${randomLetter()}${randomLetter()}${randomLetter()}`,
      brand: f.helpers.arrayElement(vehicleBrands),
      model: `${f.helpers.arrayElement(['Transit', 'Kangoo', 'Berlingo', 'Ducato', 'Daily', 'Master', 'Ibiza', 'Caddy'])} ${f.number.int({ min: 1, max: 5 })}`,
      vehicleType: f.helpers.arrayElement(vehicleTypes),
      year: f.number.int({ min: 2015, max: 2025 }),
      fuel: f.helpers.arrayElement(['Diesel', 'Gasolina', 'Eléctrico', 'Híbrido']),
      mileage: f.number.int({ min: 5000, max: 180000 }),
    }
  }

  async function maintenanceForm() {
    const f = await faker()
    return {
      mileage: f.number.int({ min: 10000, max: 250000 }),
      cost: f.number.int({ min: 40, max: 900 }),
      provider: f.helpers.arrayElement(['Taller Blasi', 'Mecánica Salou', 'Pirelli Service', 'Repsol Taller', 'Norauto Cambrils']),
      notes: f.helpers.arrayElement([
        'Cambio de aceite y filtros',
        'Revisión de frenos',
        'Neumáticos delanteros',
        'Pastillas y discos',
        'Revisión general 100.000 km',
      ]),
    }
  }

  async function incidentForm() {
    const f = await faker()
    return {
      description: f.helpers.arrayElement([
        'Golpe en parachoques trasero',
        'Avería en la iluminación frontal',
        'Problema en la batería',
        'Rotura del retrovisor',
        'Siniestro con daños en puerta',
      ]),
      cost: f.number.int({ min: 50, max: 1500 }),
    }
  }

  async function documentForm() {
    const f = await faker()
    const days = f.helpers.arrayElement([15, 45, 120, 300])
    return {
      expiresAt: new Date(Date.now() + days * 86400000).toISOString().slice(0, 10),
      notes: f.helpers.arrayElement(['Renovación anual', 'Pendiente de revisión', 'En vigor', 'Tramitación en curso']),
    }
  }

  async function costForm() {
    const f = await faker()
    return {
      amount: f.number.int({ min: 20, max: 600 }),
      notes: f.helpers.arrayElement(['Facturado', 'Pendiente de pago', 'Pago con tarjeta gasolinera', 'Recibo trimestral']),
    }
  }

  async function assignmentForm() {
    const f = await faker()
    return {
      assignee: f.person.fullName(),
      department: f.helpers.arrayElement(['OF. Tècnica', 'Manteniment', 'Administració', 'Obra']),
      site: f.helpers.arrayElement(['Cambrils', 'Salou', 'Reus', 'Valls']),
    }
  }

  async function randomVehicle<T extends { id: number }>(vehicles: T[] | null | undefined, current: string | number) {
    if (current || !vehicles?.length) return current
    const f = await faker()
    return String(f.helpers.arrayElement(vehicles).id)
  }

  return { vehicleForm, maintenanceForm, incidentForm, documentForm, costForm, assignmentForm, randomVehicle }
}
