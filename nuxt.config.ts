// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@ant-design-vue/nuxt',
    '@formkit/nuxt',
    '@kgierke/nuxt-basic-auth',
    '@nuxtjs/google-fonts',
    '@nuxtjs/hanko',
    '@nuxtjs/harlem',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    // Auth: se cableará con Cloudflare + InsForge en el Módulo 11 (@sidebase/nuxt-auth desactivado: sin handler rompía /api/auth/*)
  ],
  // Prisma se gestiona manual con lib/prisma.ts (@prisma/nuxt es v6-only e incompatible con Prisma 7 + D1)
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})