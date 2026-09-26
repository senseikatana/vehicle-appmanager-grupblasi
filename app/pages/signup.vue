<script setup lang="ts">
definePageMeta({ layout: "auth" });

const form = reactive({ name: "", email: "", password: "" });
const { notifyError, errorMessage } = useFormFeedback();

async function signup() {
  try {
    await $fetch("/api/auth/signup", { method: "POST", body: form });
    await navigateTo("/dashboard");
  } catch (e: unknown) {
    notifyError(errorMessage(e, "No se pudo crear la cuenta (¿email ya registrado?)."));
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm">
    <h1 class="text-2xl font-bold">
      Crear cuenta
    </h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
      Las altas entran como Empleado; un admin asigna el rol después.
    </p>
    <form class="mt-4 grid gap-3" @submit.prevent="signup">
      <UInput v-model="form.name" placeholder="Nombre" required autocomplete="name" />
      <UInput v-model="form.email" type="email" placeholder="Email" required autocomplete="email" />
      <UInput v-model="form.password" type="password" placeholder="Contraseña (mínimo 6)" required autocomplete="new-password" />
      <UButton type="submit" block>
        Registrarme
      </UButton>
    </form>
    <p class="mt-4 text-sm">
      ¿Ya tienes cuenta?
      <NuxtLink to="/signin" class="underline">
        Entra
      </NuxtLink>
    </p>
  </div>
</template>
