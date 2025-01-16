// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/supabase'],
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
      title: 'BOE Analytics',
    },
  },
  colorMode: {
    preference: 'dark',
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
    },
  },
  tailwindcss: {
    exposeConfig: true,
  },
});