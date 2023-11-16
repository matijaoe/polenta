export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/devtools',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/fontaine',
  ],

  ui: {
    global: true,
    icons: ['ph', 'simple-icons'],
  },

  experimental: {
    typedPages: true,
  },

  fontMetrics: {
    fonts: ['Inter'],
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      Inter: [400, 500, 600, 700],
    },
  },

  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },

  postcss: {
    plugins: {
      'postcss-nesting': {},
    },
  },

  app: {
    head: {
      title: 'Nuxt UI Starter',
    },
  },

  devtools: {
    enabled: true,
  },
})
