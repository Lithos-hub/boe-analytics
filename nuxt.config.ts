// https://nuxt.com/docs/api/configuration/nuxt-config

import { getCurrentDate } from './utils/dates';

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/supabase', '@pinia/nuxt'],
  devtools: { enabled: true },
  // When the user is on the home page, must be redirected to /:current-date route
  routeRules: {
    '/': {
      redirect: `/${getCurrentDate().dateRaw}`,
    },
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/logo.png' }],
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
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },
});