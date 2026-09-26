<script setup lang="ts">
const heroImage = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80";
const workshopImage = "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80";
const fleetImage = "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80";
const cityImage = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80";

const modules = [
  { icon: "i-lucide-car", title: "Inventario y asignación", description: "Matrícula, marca, modelo, km y asignación a empleados, departamentos u obras." },
  { icon: "i-lucide-wrench", title: "Mantenimiento", description: "Preventivo y correctivo por km o fecha, con alertas y registro de costes." },
  { icon: "i-lucide-file-text", title: "Documentación", description: "ITV, seguros y permisos con avisos de caducidad." },
  { icon: "i-lucide-siren", title: "Incidencias", description: "Averías y siniestros con estado, aseguradora y responsable." },
  { icon: "i-lucide-wallet", title: "Costes", description: "Coste por vehículo, coste/km y propuestas de ahorro." },
  { icon: "i-lucide-activity", title: "Analítica", description: "Disponibilidad, utilización y eficiencia con exportación." },
  { icon: "i-lucide-refresh-ccw", title: "Ciclo de vida", description: "Alta, renovación, sustitución, venta y baja con historial." },
  { icon: "i-lucide-map-pin", title: "GPS", description: "Kilometraje y rutas, hoy simulado y listo para la API real." },
  { icon: "i-lucide-clipboard-list", title: "Informes", description: "Generación automática e informes exportables en CSV." },
  { icon: "i-lucide-shield-check", title: "Normativa", description: "Tráfico, PRL y auditorías con vencimientos a la vista." },
  { icon: "i-lucide-users", title: "Colaboración", description: "Roles, asignaciones activas y trabajo interdepartamental." },
];

const capabilities = [
  "Gestionar inventario y asignación de vehículos",
  "Planificar mantenimiento preventivo y correctivo",
  "Supervisar documentación legal (ITV, seguros, permisos)",
  "Gestionar incidencias, averías y siniestros",
  "Controlar costes y proponer ahorro",
  "Analizar indicadores (disponibilidad, uso, eficiencia)",
  "Coordinar adquisición, renovación, venta y baja",
  "Gestionar sistemas digitales de seguimiento",
  "Elaborar procedimientos, informes y registros",
  "Velar por el cumplimiento normativo (tráfico, PRL)",
  "Colaborar con otros departamentos",
];

const agents = [
  { icon: "i-lucide-bot", name: "Sensei Ornyx", role: "Titular", description: "Análisis, decisión, diseño y coherencia transversal. Se invoca siempre por defecto." },
  { icon: "i-lucide-zap", name: "Sensei Prime", role: "Paraleliza", description: "Alertas, notificaciones y sincronización en segundo plano. No decide negocio." },
  { icon: "i-lucide-armchair", name: "Draven", role: "Banquillo", description: "Procesos masivos de histórico y relevo ante fallos." },
];

const roles = ["ADMIN", "GESTOR_FLOTA", "TECNICO", "EMPLEADO"];
</script>

<template>
  <div class="-m-6">
    <section class="relative overflow-hidden">
      <img
        :src="heroImage"
        alt="Conductor al volante de un vehículo de flota"
        class="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      >
      <div class="absolute inset-0 bg-gray-950/70" />
      <div class="relative mx-auto max-w-6xl px-4 py-24 text-center text-white sm:py-32">
        <p class="text-sm font-semibold uppercase tracking-widest text-gray-300">
          Grup Blasi · Cambrils
        </p>
        <h1 class="mx-auto mt-3 max-w-2xl text-4xl font-extrabold sm:text-5xl">
          La flota, bajo control desde la oficina técnica
        </h1>
        <p class="mx-auto mt-4 max-w-xl text-gray-200">
          Digitalización del puesto de Gestión de Vehículos y Equipos:
          inventario, mantenimiento, documentación, incidencias y costes en un
          solo panel. Personas en el centro.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <UButton to="/dashboard" size="lg">
            Entrar al dashboard
          </UButton>
          <UButton to="/about" size="lg" variant="outline" color="neutral">
            Sobre la app
          </UButton>
        </div>
        <div class="mt-6 flex items-center justify-center gap-4 text-sm">
          <NuxtLink to="/signin" class="underline">
            Entrar
          </NuxtLink>
          <NuxtLink to="/signup" class="underline">
            Crear cuenta
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16">
      <h2 class="text-2xl font-bold">
        Los 11 módulos del puesto
      </h2>
      <p class="mt-1 text-gray-600 dark:text-gray-300">
        Cada función del administrativo, convertida en sección de la app.
      </p>
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UCard v-for="module in modules" :key="module.title">
          <div class="flex items-start gap-3">
            <UIcon :name="module.icon" class="mt-1 text-xl" />
            <div>
              <h3 class="font-semibold">
                {{ module.title }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ module.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-900">
      <div class="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 lg:grid-cols-2">
        <img
          :src="workshopImage"
          alt="Motor de vehículo en revisión en el taller"
          class="rounded-lg"
          loading="lazy"
        >
        <div>
          <h2 class="text-2xl font-bold">
            Lo que pide el puesto, cubierto
          </h2>
          <ul class="mt-4 space-y-2 text-gray-700 dark:text-gray-200">
            <li v-for="capability in capabilities" :key="capability" class="flex gap-2">
              <UIcon name="i-lucide-check" class="mt-1 shrink-0 text-green-600" />
              <span>{{ capability }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16">
      <h2 class="text-2xl font-bold">
        Tres agentes, un sistema
      </h2>
      <p class="mt-1 text-gray-600 dark:text-gray-300">
        Toda acción queda registrada con agente, tarea, resultado y hora. Las
        decisiones críticas exigen validación humana.
      </p>
      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <UCard v-for="agent in agents" :key="agent.name">
          <div class="flex items-center gap-2">
            <UIcon :name="agent.icon" class="text-xl" />
            <h3 class="font-semibold">
              {{ agent.name }}
            </h3>
          </div>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {{ agent.role }}
          </p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {{ agent.description }}
          </p>
        </UCard>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-900">
      <div class="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 lg:grid-cols-2">
        <div>
          <h2 class="text-2xl font-bold">
            Roles y seguridad desde el día uno
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Cuatro roles con permisos, contraseñas con hash irreversible,
            sesiones personales y auditoría de cada acción sobre vehículos,
            costes y documentación. La normativa vigente manda sobre cualquier
            automatización.
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <UBadge v-for="role in roles" :key="role" variant="subtle">
              {{ role }}
            </UBadge>
          </div>
        </div>
        <img
          :src="fleetImage"
          alt="Vehículo de flota en carretera"
          class="rounded-lg"
          loading="lazy"
        >
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16">
      <div class="grid items-center gap-8 lg:grid-cols-2">
        <img
          :src="cityImage"
          alt="Ciudad con tráfico rodado"
          class="rounded-lg"
          loading="lazy"
        >
        <div>
          <h2 class="text-2xl font-bold">
            Stack real, datos reales
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Nuxt 4 + TypeScript + TailwindCSS, API interna, Prisma ORM con
            Cloudflare D1 y autenticación propia con sesiones. Sin maquetas:
            el dashboard de abajo lee la base de datos.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <UButton to="/dashboard" size="lg">
              Entrar al dashboard
            </UButton>
            <UButton to="/signup" size="lg" variant="outline">
              Crear cuenta
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
