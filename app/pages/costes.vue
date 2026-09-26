<script setup lang="ts">
const { data: records, refresh } = await useFetch('/api/costs')
const { data: vehicles } = await useFetch('/api/vehicles')
const { data: stats } = await useFetch('/api/stats')
const { notifySuccess, notifyError, errorMessage } = useFormFeedback()
const { costForm, randomVehicle } = useFakeGenerator()
const form = reactive({ vehicleId: '', category: 'Combustible', amount: '', notes: '' })

async function create() {
  try {
    await $fetch('/api/costs', { method: 'POST', body: form })
    notifySuccess('Coste registrado.')
    Object.assign(form, { vehicleId: '', category: 'Combustible', amount: '', notes: '' })
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al registrar.'))
  }
}

async function autofill() {
  Object.assign(form, await costForm(), { vehicleId: await randomVehicle(vehicles.value, form.vehicleId) })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Costes
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      Mantenimiento: {{ formatEuro(stats?.maintenanceCost ?? 0) }} · Otros: {{ formatEuro(stats?.otherCosts ?? 0) }}
    </p>
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold">
          Registrar coste
        </h2>
      </template>
      <form class="grid gap-3 sm:grid-cols-3" @submit.prevent="create">
        <USelect v-model="form.vehicleId" :items="(vehicles ?? []).map((v) => ({ label: `${v.plate} — ${v.brand}`, value: v.id }))" placeholder="Vehículo" required />
        <USelect v-model="form.category" :items="['Combustible', 'Seguro', 'Impuesto', 'Peaje', 'Otro']" />
        <UInput v-model="form.amount" type="number" placeholder="Importe €" required />
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
        { accessorKey: 'category', header: 'Categoría' },
        { accessorKey: 'amount', header: 'Importe', cell: ({ row }) => formatEuro(row.original.amount) },
        { accessorKey: 'date', header: 'Fecha' },
      ]"
      class="mt-4"
    >
      <template #vehicle-cell="{ row }">
        {{ row.original.vehicle?.plate }}
      </template>
    </UTable>
  </div>
</template>
