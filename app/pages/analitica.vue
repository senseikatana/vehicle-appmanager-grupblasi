<script setup lang="ts">
const { data: stats } = await useFetch('/api/stats')
const { data: vehicles } = await useFetch('/api/vehicles')
const totalCost = computed(() => (stats.value?.maintenanceCost ?? 0) + (stats.value?.otherCosts ?? 0))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Analítica
    </h1>
    <div class="mt-4 grid gap-4 sm:grid-cols-3">
      <UCard>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Flota total
        </p>
        <p class="text-2xl font-bold">
          {{ stats?.totalVehicles ?? 0 }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Asignaciones activas
        </p>
        <p class="text-2xl font-bold">
          {{ stats?.activeAssignments ?? 0 }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Incidencias abiertas
        </p>
        <p class="text-2xl font-bold">
          {{ stats?.openIncidents ?? 0 }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Coste total
        </p>
        <p class="text-2xl font-bold">
          {{ formatEuro(totalCost) }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Intervenciones
        </p>
        <p class="text-2xl font-bold">
          {{ stats?.maintenanceCount ?? 0 }}
        </p>
      </UCard>
    </div>
    <h2 class="mt-6 font-semibold">
      Estado de la flota
    </h2>
    <UTable
      :data="(vehicles ?? []).map((v) => ({ plate: v.plate, status: v.status, mileage: v.mileage }))"
      :columns="[
        { accessorKey: 'plate', header: 'Matrícula' },
        { accessorKey: 'status', header: 'Estado' },
        { accessorKey: 'mileage', header: 'Km', cell: ({ row }) => formatKm(row.original.mileage) },
      ]"
      class="mt-2"
    />
  </div>
</template>
