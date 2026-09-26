<script setup lang="ts">
const { data: vehicles } = await useFetch('/api/vehicles')
const { data: costs } = await useFetch('/api/costs')

function downloadCsv() {
  const rows = [['Matrícula', 'Marca', 'Modelo', 'Estado', 'Km']]
  for (const v of vehicles.value ?? []) rows.push([v.plate, v.brand, v.model, v.status, String(v.mileage)])
  const blob = new Blob([rows.map((r) => r.join(';')).join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'flota.csv'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Informes
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      {{ vehicles?.length ?? 0 }} vehículos · {{ costs?.length ?? 0 }} movimientos de coste registrados.
    </p>
    <UButton class="mt-4" @click="downloadCsv">
      Exportar flota (CSV)
    </UButton>
  </div>
</template>
