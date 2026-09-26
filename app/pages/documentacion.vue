<script setup lang="ts">
const { data: records, refresh } = await useFetch('/api/documents')
const { data: vehicles } = await useFetch('/api/vehicles')
const { notifySuccess, notifyError, errorMessage } = useFormFeedback()
const { documentForm, randomVehicle } = useFakeGenerator()
const form = reactive({ vehicleId: '', docType: 'ITV', expiresAt: '', notes: '' })

async function create() {
  try {
    await $fetch('/api/documents', { method: 'POST', body: form })
    notifySuccess('Documento registrado.')
    Object.assign(form, { vehicleId: '', docType: 'ITV', expiresAt: '', notes: '' })
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al registrar.'))
  }
}

async function autofill() {
  Object.assign(form, await documentForm(), { vehicleId: await randomVehicle(vehicles.value, form.vehicleId) })
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Documentación
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      ITV, seguros y permisos ordenados por caducidad.
    </p>
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold">
          Registrar documento
        </h2>
      </template>
      <form class="grid gap-3 sm:grid-cols-3" @submit.prevent="create">
        <USelect v-model="form.vehicleId" :items="(vehicles ?? []).map((v) => ({ label: `${v.plate} — ${v.brand}`, value: v.id }))" placeholder="Vehículo" required />
        <USelect v-model="form.docType" :items="['ITV', 'Seguro', 'Permiso', 'Autorización']" />
        <UInput v-model="form.expiresAt" type="date" required />
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
      :columns="[{ accessorKey: 'vehicle', header: 'Vehículo' }, { accessorKey: 'docType', header: 'Tipo' }, { accessorKey: 'expiresAt', header: 'Caduca' }, { accessorKey: 'notes', header: 'Notas' }]"
      class="mt-4"
    >
      <template #vehicle-cell="{ row }">
        {{ row.original.vehicle?.plate }}
      </template>
    </UTable>
  </div>
</template>
