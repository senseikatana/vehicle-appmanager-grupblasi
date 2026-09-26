<script setup lang="ts">
const { data: documents } = await useFetch('/api/documents')
const { data: incidents } = await useFetch('/api/incidents')
const now = new Date()
const expiring = computed(() => (documents.value ?? []).filter((d) => new Date(d.expiresAt) < new Date(now.getTime() + 30 * 86400000)))
const open = computed(() => (incidents.value ?? []).filter((i) => i.status !== 'CLOSED'))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Normativa
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      Tráfico, transporte, seguridad y PRL: documentos que caducan en 30 días e incidencias abiertas.
    </p>
    <h2 class="mt-4 font-semibold">
      Próximos vencimientos ({{ expiring.length }})
    </h2>
    <UTable
      :data="expiring"
      :columns="[{ accessorKey: 'vehicle', header: 'Vehículo' }, { accessorKey: 'docType', header: 'Tipo' }, { accessorKey: 'expiresAt', header: 'Caduca' }]"
      class="mt-2"
    >
      <template #vehicle-cell="{ row }">
        {{ row.original.vehicle?.plate }}
      </template>
    </UTable>
    <h2 class="mt-6 font-semibold">
      Incidencias abiertas ({{ open.length }})
    </h2>
    <UTable
      :data="open"
      :columns="[{ accessorKey: 'vehicle', header: 'Vehículo' }, { accessorKey: 'description', header: 'Descripción' }, { accessorKey: 'status', header: 'Estado' }]"
      class="mt-2"
    >
      <template #vehicle-cell="{ row }">
        {{ row.original.vehicle?.plate }}
      </template>
    </UTable>
  </div>
</template>
