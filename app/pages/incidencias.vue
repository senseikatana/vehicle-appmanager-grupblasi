<script setup lang="ts">
const { data: records, refresh } = await useFetch('/api/incidents')
const { data: vehicles } = await useFetch('/api/vehicles')
const { notifySuccess, notifyError, errorMessage } = useFormFeedback()
const { incidentForm, randomVehicle } = useFakeGenerator()
const form = reactive({ vehicleId: '', description: '', cost: 0 })

async function create() {
  try {
    await $fetch('/api/incidents', { method: 'POST', body: form })
    notifySuccess('Incidencia abierta.')
    Object.assign(form, { vehicleId: '', description: '', cost: 0 })
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al registrar.'))
  }
}

async function autofill() {
  Object.assign(form, await incidentForm(), { vehicleId: await randomVehicle(vehicles.value, form.vehicleId) })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Incidencias
    </h1>
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold">
          Abrir incidencia
        </h2>
      </template>
      <form class="grid gap-3 sm:grid-cols-3" @submit.prevent="create">
        <USelect v-model="form.vehicleId" :items="(vehicles ?? []).map((v) => ({ label: `${v.plate} — ${v.brand}`, value: v.id }))" placeholder="Vehículo" required />
        <UInput v-model="form.description" placeholder="Descripción" required />
        <UInput v-model="form.cost" type="number" placeholder="Coste €" />
        <div class="flex gap-2 sm:col-span-3">
          <UButton type="submit">
            Abrir
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
        { accessorKey: 'description', header: 'Descripción' },
        { accessorKey: 'status', header: 'Estado' },
        { accessorKey: 'cost', header: 'Coste', cell: ({ row }) => formatEuro(row.original.cost) },
      ]"
      class="mt-4"
    >
      <template #vehicle-cell="{ row }">
        {{ row.original.vehicle?.plate }}
      </template>
    </UTable>
  </div>
</template>
