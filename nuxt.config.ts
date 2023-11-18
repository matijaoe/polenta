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
    presets: [
      {
        imports: [
          {
            from: '@vueuse/core',
            name: 'set',
            as: 'set'
          }
        ]
      }
    ]
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
      'Manrope': [400, 500, 600, 700],
      'Victor+Mono': [400, 500, 600, 700],
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
      title: 'Polenta',
    },
  },

  devtools: {
    enabled: true,
  },
})
