<script setup lang="ts">
// Botón sol/luna con la preferencia de @nuxt/ui (persiste en localStorage).
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value: boolean) => {
    colorMode.preference = value ? 'dark' : 'light'
  },
})
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="neutral"
      variant="ghost"
      aria-label="Cambiar entre tema claro y oscuro"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <UButton icon="i-lucide-sun" color="neutral" variant="ghost" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>
