import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-icon',
    '@nuxt/devtools',
    '@nuxthq/ui',
  ],

  experimental: {
    typedPages: true,
  },

  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },

  devtools: {
    enabled: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },

  imports: {
    dirs: [
      'composables/**',
      'store/**',
    ],
    presets: [
      'pinia',
    ],
  },

  app: {
    head: {
      title: 'xpubhub',
    },
  },
})
