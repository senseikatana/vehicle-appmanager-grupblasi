<script setup lang="ts">
// Navbar mínimo: las cards del dashboard llevan a los módulos.
import { useKatanaWatch } from "katanakit-js/adapters/nuxt";

const route = useRoute();
const menuOpen = ref(false);
const { data: me, refresh } = await useFetch("/api/auth/me");

// El menú móvil se cierra solo al navegar (adapter Nuxt de katanakit-js).
useKatanaWatch(
  () => route.path,
  () => {
    menuOpen.value = false;
  },
);

const links = [
  { to: "/", label: "Inicio" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
];

const legal = [
  { to: "/legal/privacidad", label: "Privacidad" },
  { to: "/legal/aviso-legal", label: "Aviso legal" },
  { to: "/legal/cookies", label: "Cookies" },
];

const PUBLIC_PREFIXES = ["/legal/"];
const PUBLIC_PATHS = ["/", "/about", "/signin", "/signup"];

// El botón de volver solo en páginas internas del dashboard.
const showBack = computed(
  () =>
    !PUBLIC_PATHS.includes(route.path) &&
    !PUBLIC_PREFIXES.some((p) => route.path.startsWith(p)),
);

function goBack() {
  // En SPA history.length crece al navegar; si es 1 no hay atrás posible.
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  // Acceso directo: sin historial previo, volvemos al panel.
  navigateTo("/dashboard");
}

async function signout() {
  await $fetch("/api/auth/signout", { method: "POST" });
  await refresh();
  await navigateTo("/");
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <UButton
          v-if="showBack"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          aria-label="Volver a la página anterior"
          @click="goBack"
        />
        <NuxtLink to="/" class="text-lg font-bold">
          Grup Blasi · Flota
        </NuxtLink>
        <nav class="hidden flex-1 items-center gap-1 lg:flex">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            active-class="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <div class="flex flex-1 items-center justify-end gap-2 lg:flex-none">
          <span v-if="me" class="hidden text-sm text-gray-600 sm:inline dark:text-gray-300">
            {{ me.name }}
          </span>
          <UButton v-if="me" size="xs" variant="outline" @click="signout">
            Salir
          </UButton>
          <NuxtLink v-else to="/signin" class="hidden text-sm underline sm:inline">
            Entrar
          </NuxtLink>
          <ThemeSwitcher />
          <UButton
            :icon="menuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            color="neutral"
            variant="ghost"
            aria-label="Abrir menú de navegación"
            class="lg:hidden"
            @click="menuOpen = !menuOpen"
          />
        </div>
      </div>
      <nav v-if="menuOpen" class="border-t border-gray-200 px-4 py-2 lg:hidden dark:border-gray-800">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200"
          active-class="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
    <footer class="border-t border-gray-200 dark:border-gray-800">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
        <span>Grup Blasi · Gestión de flota</span>
        <NuxtLink
          v-for="item in legal"
          :key="item.to"
          :to="item.to"
          class="underline"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>
