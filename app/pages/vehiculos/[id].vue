<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)
const { data: vehicle, refresh } = await useFetch(`/api/vehicles/${id}`)
const { notifySuccess, notifyError, errorMessage } = useFormFeedback()
const { assignmentForm } = useFakeGenerator()
const assignForm = reactive({ assignee: '', department: '', site: '' })
const STATUSES = ['AVAILABLE', 'IN_USE', 'WORKSHOP', 'RETIRED']

async function setStatus(status: string) {
  try {
    await $fetch(`/api/vehicles/${id}`, { method: 'PUT', body: { status } })
    notifySuccess(`Estado actualizado: ${status}.`)
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al actualizar el estado.'))
  }
}

async function assign() {
  try {
    await $fetch('/api/assignments', { method: 'POST', body: { vehicleId: id, ...assignForm } })
    notifySuccess(`Asignado a ${assignForm.assignee}.`)
    Object.assign(assignForm, { assignee: '', department: '', site: '' })
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al asignar.'))
  }
}

async function autofill() {
  Object.assign(assignForm, await assignmentForm())
}

async function closeAssignment(assignmentId: number) {
  try {
    await $fetch(`/api/assignments/${assignmentId}`, { method: 'PUT' })
    notifySuccess('Asignación cerrada.')
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al cerrar la asignación.'))
  }
}

async function remove() {
  try {
    await $fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
    notifySuccess('Vehículo dado de baja.')
    await navigateTo('/vehiculos')
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al dar de baja.'))
  }
}
</script>

<template>
  <div v-if="vehicle">
    <h1 class="text-2xl font-bold">
      {{ vehicle.plate }} — {{ vehicle.brand }} {{ vehicle.model }}
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      {{ vehicle.vehicleType }} · {{ vehicle.year }} · {{ vehicle.fuel }} · {{ vehicle.mileage }} km
    </p>
    <div class="mt-4 flex flex-wrap items-center gap-2">
      <span class="text-sm">Estado: <strong>{{ vehicle.status }}</strong></span>
      <UButton v-for="status in STATUSES" :key="status" size="xs" variant="outline" @click="setStatus(status)">
        {{ status }}
      </UButton>
      <UButton size="xs" color="red" variant="outline" @click="remove">
        Dar de baja
      </UButton>
    </div>
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold">
          Nueva asignación
        </h2>
      </template>
      <form class="grid gap-3 sm:grid-cols-3" @submit.prevent="assign">
        <UInput v-model="assignForm.assignee" placeholder="Empleado" required />
        <UInput v-model="assignForm.department" placeholder="Departamento" />
        <UInput v-model="assignForm.site" placeholder="Obra" />
        <div class="flex gap-2 sm:col-span-3">
          <UButton type="submit">
            Asignar
          </UButton>
          <UButton type="button" variant="outline" icon="i-lucide-wand-sparkles" @click="autofill">
            Auto-generar
          </UButton>
        </div>
      </form>
    </UCard>
    <h2 class="mt-6 font-semibold">
      Historial de asignaciones
    </h2>
    <UTable
      :data="vehicle.assignments ?? []"
      :columns="[{ accessorKey: 'assignee', header: 'Asignado' }, { accessorKey: 'department', header: 'Depto.' }, { accessorKey: 'site', header: 'Obra' }, { accessorKey: 'startAt', header: 'Inicio' }, { accessorKey: 'active', header: 'Activa' }, { id: 'actions' }]"
      class="mt-2"
    >
      <template #active-cell="{ row }">
        {{ row.original.active ? 'Sí' : 'No' }}
      </template>
      <template #actions-cell="{ row }">
        <UButton v-if="row.original.active" size="xs" variant="outline" @click="closeAssignment(row.original.id)">
          Cerrar
        </UButton>
      </template>
    </UTable>
  </div>
  <p v-else>
    Vehículo no encontrado.
  </p>
</template>
