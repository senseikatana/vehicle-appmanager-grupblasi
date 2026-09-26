<script setup lang="ts">
const { data: stats } = await useFetch("/api/stats");
const totalCost = computed(() => (stats.value?.maintenanceCost ?? 0) + (stats.value?.otherCosts ?? 0));

const sections = [
  { to: "/vehiculos", title: "Vehículos", description: "Inventario, asignación y estado de la flota." },
  { to: "/mantenimiento", title: "Mantenimiento", description: "Preventivo y correctivo, alertas y costes." },
  { to: "/documentacion", title: "Documentación", description: "ITV, seguros y permisos con vencimientos." },
  { to: "/incidencias", title: "Incidencias", description: "Averías y siniestros con su estado." },
  { to: "/costes", title: "Costes", description: "Coste por vehículo, total y por km." },
  { to: "/analitica", title: "Analítica", description: "Disponibilidad, uso y eficiencia." },
  { to: "/ciclo-vida", title: "Ciclo de vida", description: "Alta, renovación, venta y baja." },
  { to: "/gps", title: "GPS", description: "Kilometraje y rutas." },
  { to: "/informes", title: "Informes", description: "Informes y procedimientos internos." },
  { to: "/normativa", title: "Normativa", description: "Tráfico, PRL y auditorías." },
  { to: "/colaboracion", title: "Colaboración", description: "Roles, tareas y notificaciones." },
];
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Dashboard
    </h1>
    <div class="mt-4 grid gap-4 sm:grid-cols-4">
      <UCard>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Vehículos
        </p>
        <p class="text-2xl font-bold">
          {{ stats?.totalVehicles ?? 0 }}
        </p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          En uso
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
    </div>
    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="section in sections"
        :key="section.to"
        :to="section.to"
        class="rounded-lg border border-gray-200 bg-white p-4 hover:shadow dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 class="font-semibold">
          {{ section.title }}
        </h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {{ section.description }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
