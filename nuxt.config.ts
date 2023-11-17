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

  imports: {
    dirs: [
      'composables/**',
      'store/**',
    ],
  },

  experimental: {
    typedPages: true,
  },

  fontMetrics: {
    fonts: ['Manrope', 'Victor Mono'],
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'Manrope': true,
      'Victor+Mono': true,
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
