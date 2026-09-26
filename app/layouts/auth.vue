<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="text-lg font-bold">
          Grup Blasi · Flota
        </NuxtLink>
        <ThemeSwitcher />
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
