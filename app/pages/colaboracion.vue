<script setup lang="ts">
const { data: assignments } = await useFetch('/api/assignments')
const active = computed(() => (assignments.value ?? []).filter((a) => a.active))
const roles = ['Admin', 'Gestor de flota', 'Técnico', 'Empleado']
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Colaboración
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      Roles y permisos: {{ roles.join(' · ') }}. La autenticación con roles llega con Cloudflare + InsForge.
    </p>
    <h2 class="mt-4 font-semibold">
      Asignaciones activas ({{ active.length }})
    </h2>
    <UTable
      :data="active"
      :columns="[{ accessorKey: 'vehicle', header: 'Vehículo' }, { accessorKey: 'assignee', header: 'Asignado' }, { accessorKey: 'department', header: 'Depto.' }, { accessorKey: 'site', header: 'Obra' }]"
      class="mt-2"
    >
      <template #vehicle-cell="{ row }">
        {{ row.original.vehicle?.plate }}
      </template>
    </UTable>
  </div>
</template>
