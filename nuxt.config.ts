import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/critters',
    '@nuxt/devtools',
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

  unocss: {
    preflight: true,
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

  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },

  colorMode: {
    classSuffix: '',
  },

  app: {
    head: {
      title: 'xpubhub',
    },
  },
})
