// https://nuxt.com/docs/api/configuration/nuxt-config
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
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-fonts',
    '@nuxtjs/hanko',
    '@nuxtjs/harlem',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@prisma/nuxt',
    '@sidebase/nuxt-auth',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})