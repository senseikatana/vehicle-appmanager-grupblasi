<script setup lang="ts">
const { data: vehicles, refresh } = await useFetch('/api/vehicles')
const { notifySuccess, notifyError, errorMessage } = useFormFeedback()
const mileage = reactive<Record<number, number>>({})

async function updateMileage(id: number) {
  const value = mileage[id]
  if (value === undefined) return
  try {
    await $fetch(`/api/vehicles/${id}`, { method: 'PUT', body: { mileage: value } })
    notifySuccess('Kilometraje actualizado.')
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al actualizar el kilometraje.'))
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      GPS y kilometraje
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      Control de kilometraje por vehículo (integración GPS simulada hasta conectar la API real).
    </p>
    <UTable
      :data="vehicles ?? []"
      :columns="[{ accessorKey: 'plate', header: 'Matrícula' }, { accessorKey: 'mileage', header: 'Km actual' }, { id: 'actions' }]"
      class="mt-4"
    >
      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <UInput v-model="mileage[row.original.id]" type="number" placeholder="Nuevo km" size="xs" />
          <UButton size="xs" variant="outline" @click="updateMileage(row.original.id)">
            Actualizar
          </UButton>
        </div>
      </template>
    </UTable>
  </div>
</template>
