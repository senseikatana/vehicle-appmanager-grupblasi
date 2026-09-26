<script setup lang="ts">
definePageMeta({ layout: "auth" });

const form = reactive({ email: "", password: "" });
const { notifyError, errorMessage } = useFormFeedback();

// Cuentas del seed local. Solo desarrollo: en producción no se renderiza.
const demoAccounts = [
  { email: "admin@grupblasi.cat", password: "admin123", role: "ADMIN" },
  { email: "gestor@grupblasi.cat", password: "gestor123", role: "GESTOR_FLOTA" },
  { email: "tecnico@grupblasi.cat", password: "tecnico123", role: "TECNICO" },
  { email: "empleado@grupblasi.cat", password: "empleado123", role: "EMPLEADO" },
];

function fillDemo(account: { email: string; password: string }) {
  form.email = account.email;
  form.password = account.password;
}

async function signin() {
  try {
    await $fetch("/api/auth/signin", { method: "POST", body: form });
    await navigateTo("/dashboard");
  } catch (e: unknown) {
    notifyError(errorMessage(e, "Credenciales no válidas."));
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm">
    <h1 class="text-2xl font-bold">
      Entrar
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      Accede al panel de gestión de flota.
    </p>
    <form class="mt-4 grid gap-3" @submit.prevent="signin">
      <UInput v-model="form.email" type="email" placeholder="Email" required autocomplete="email" />
      <UInput v-model="form.password" type="password" placeholder="Contraseña" required autocomplete="current-password" />
      <UButton type="submit" block>
        Entrar
      </UButton>
    </form>
    <UCard v-if="$config.public.demoAccounts" class="mt-4">
      <template #header>
        <h2 class="text-sm font-semibold">
          Acceso de demo (solo desarrollo)
        </h2>
      </template>
      <div class="grid gap-2">
        <button
          v-for="account in demoAccounts"
          :key="account.email"
          type="button"
          class="rounded-md border border-gray-200 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          @click="fillDemo(account)"
        >
          <span class="font-mono">{{ account.email }}</span>
          <span class="ml-2 text-xs text-gray-500">{{ account.role }}</span>
        </button>
      </div>
    </UCard>
    <p class="mt-4 text-sm">
      ¿Sin cuenta?
      <NuxtLink to="/signup" class="underline">
        Regístrate
      </NuxtLink>
    </p>
  </div>
</template>
