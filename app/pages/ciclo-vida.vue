<script setup lang="ts">
const { data: vehicles, refresh } = await useFetch('/api/vehicles')
const { notifySuccess, notifyError, errorMessage } = useFormFeedback()

async function retire(id: number) {
  try {
    await $fetch(`/api/vehicles/${id}`, { method: 'PUT', body: { status: 'RETIRED' } })
    notifySuccess('Vehículo dado de baja.')
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al dar de baja.'))
  }
}

async function reactivate(id: number) {
  try {
    await $fetch(`/api/vehicles/${id}`, { method: 'PUT', body: { status: 'AVAILABLE' } })
    notifySuccess('Vehículo reactivado.')
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al reactivar.'))
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Ciclo de vida
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      Alta, renovación, sustitución, venta y baja. La baja exige cerrar asignaciones activas.
    </p>
    <UTable
      :data="vehicles ?? []"
      :columns="[{ accessorKey: 'plate', header: 'Matrícula' }, { accessorKey: 'brand', header: 'Marca' }, { accessorKey: 'year', header: 'Año' }, { accessorKey: 'status', header: 'Estado' }, { id: 'actions' }]"
      class="mt-4"
    >
      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UButton v-if="row.original.status !== 'RETIRED'" size="xs" variant="outline" @click="retire(row.original.id)">
            Baja
          </UButton>
          <UButton v-if="row.original.status === 'RETIRED'" size="xs" variant="outline" @click="reactivate(row.original.id)">
            Reactivar
          </UButton>
          <NuxtLink :to="`/vehiculos/${row.original.id}`" class="text-sm underline">
            Historial
          </NuxtLink>
        </div>
      </template>
    </UTable>
  </div>
</template>
