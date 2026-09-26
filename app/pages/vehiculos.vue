<script setup lang="ts">
const { data: vehicles, refresh } = await useFetch('/api/vehicles')
const { notifySuccess, notifyError, errorMessage } = useFormFeedback()
const { vehicleForm } = useFakeGenerator()
const form = reactive({ plate: '', brand: '', model: '', vehicleType: '', year: new Date().getFullYear(), fuel: '', mileage: 0 })

async function create() {
  try {
    await $fetch('/api/vehicles', { method: 'POST', body: form })
    notifySuccess(`Vehículo ${form.plate} dado de alta.`)
    Object.assign(form, { plate: '', brand: '', model: '', vehicleType: '', year: new Date().getFullYear(), fuel: '', mileage: 0 })
    await refresh()
  }
  catch (e: unknown) {
    notifyError(errorMessage(e, 'Error al dar de alta.'))
  }
}

async function autofill() {
  Object.assign(form, await vehicleForm())
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Vehículos
    </h1>
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold">
          Alta de vehículo
        </h2>
      </template>
      <form class="grid gap-3 sm:grid-cols-3" @submit.prevent="create">
        <UInput v-model="form.plate" placeholder="Matrícula" required />
        <UInput v-model="form.brand" placeholder="Marca" required />
        <UInput v-model="form.model" placeholder="Modelo" required />
        <UInput v-model="form.vehicleType" placeholder="Tipo" required />
        <UInput v-model="form.year" type="number" placeholder="Año" required />
        <UInput v-model="form.fuel" placeholder="Combustible" required />
        <UInput v-model="form.mileage" type="number" placeholder="Km" />
        <div class="flex gap-2 sm:col-span-3">
          <UButton type="submit">
            Dar de alta
          </UButton>
          <UButton type="button" variant="outline" icon="i-lucide-wand-sparkles" @click="autofill">
            Auto-generar
          </UButton>
        </div>
      </form>
    </UCard>
    <UTable
      :data="vehicles ?? []"
      :columns="[
        { accessorKey: 'plate', header: 'Matrícula' },
        { accessorKey: 'brand', header: 'Marca' },
        { accessorKey: 'model', header: 'Modelo' },
        { accessorKey: 'status', header: 'Estado' },
        { accessorKey: 'mileage', header: 'Km', cell: ({ row }) => formatKm(row.original.mileage) },
        { id: 'actions' },
      ]"
      class="mt-4"
    >
      <template #actions-cell="{ row }">
        <NuxtLink :to="`/vehiculos/${row.original.id}`" class="text-sm underline">
          Ver
        </NuxtLink>
      </template>
    </UTable>
  </div>
</template>
