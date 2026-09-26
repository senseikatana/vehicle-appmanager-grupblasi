<template>
  <div class="mx-auto max-w-2xl">
    <h1 class="text-2xl font-bold">
      Sobre la app
    </h1>
    <p class="mt-3 text-gray-700 dark:text-gray-200">
      Vehicle AppManager digitaliza el puesto de Administrativo/a de Gestión de
      Vehículos y Equipos de la OF. Tècnica i Ef. En. Hídrica de Grup Blasi
      (Cambrils): inventario y asignación, mantenimiento, documentación legal,
      incidencias, costes, analítica, ciclo de vida, GPS, informes, normativa
      y colaboración interdepartamental.
    </p>
    <p class="mt-3 text-gray-700 dark:text-gray-200">
      Stack: Nuxt 4 + TypeScript + TailwindCSS, API interna, Prisma ORM con
      Cloudflare D1 y autenticación propia con roles.
    </p>
    <UButton to="/dashboard" class="mt-6">
      Entrar al dashboard
    </UButton>
  </div>
</template>
