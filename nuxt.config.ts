import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/devtools',
    '@nuxt/ui',
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

   ui: {
    global: true,
    icons: ['heroicons'],
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
  },

  app: {
    head: {
      title: 'xpubhub',
    },
  },
})
