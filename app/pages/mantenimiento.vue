<script setup lang="ts">
const { data: records, refresh } = await useFetch('/api/maintenances')
const { data: vehicles } = await useFetch('/api/vehicles')
const { notifySuccess, notifyError, errorMessage } = useFormFeedback()
const { maintenanceForm, randomVehicle } = useFakeGenerator()
const form = reactive({ vehicleId: '', kind: 'PREVENTIVE', mileage: '', cost: 0, provider: '', notes: '' })

async function create() {
  try {
    await $fetch('/api/maintenances', { method: 'POST', body: form })
    notifySuccess('Intervención registrada.')
    Object.assign(form, { vehicleId: '', kind: 'PREVENTIVE', mileage: '', cost: 0, provider: '', notes: '' })
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al registrar.'))
  }
}

async function autofill() {
  Object.assign(form, await maintenanceForm(), { vehicleId: await randomVehicle(vehicles.value, form.vehicleId) })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Mantenimiento
    </h1>
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold">
          Registrar intervención
        </h2>
      </template>
      <form class="grid gap-3 sm:grid-cols-3" @submit.prevent="create">
        <USelect v-model="form.vehicleId" :items="(vehicles ?? []).map((v) => ({ label: `${v.plate} — ${v.brand}`, value: v.id }))" placeholder="Vehículo" required />
        <USelect v-model="form.kind" :items="[{ label: 'Preventivo', value: 'PREVENTIVE' }, { label: 'Correctivo', value: 'CORRECTIVE' }]" />
        <UInput v-model="form.mileage" type="number" placeholder="Km" />
        <UInput v-model="form.cost" type="number" placeholder="Coste €" />
        <UInput v-model="form.provider" placeholder="Proveedor" />
        <UInput v-model="form.notes" placeholder="Notas" />
        <div class="flex gap-2 sm:col-span-3">
          <UButton type="submit">
            Registrar
          </UButton>
          <UButton type="button" variant="outline" icon="i-lucide-wand-sparkles" @click="autofill">
            Auto-generar
          </UButton>
        </div>
      </form>
    </UCard>
    <UTable
      :data="records ?? []"
      :columns="[
        { accessorKey: 'vehicle', header: 'Vehículo' },
        { accessorKey: 'kind', header: 'Tipo' },
        { accessorKey: 'date', header: 'Fecha' },
        { accessorKey: 'cost', header: 'Coste', cell: ({ row }) => formatEuro(row.original.cost) },
        { accessorKey: 'provider', header: 'Proveedor' },
      ]"
      class="mt-4"
    >
      <template #vehicle-cell="{ row }">
        {{ row.original.vehicle?.plate }}
      </template>
    </UTable>
  </div>
</template>
