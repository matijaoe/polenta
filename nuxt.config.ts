import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineNuxtConfig({
  ssr: true,
  devServer: {
    https: false,
  },
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/devtools',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/fontaine',
    '@vee-validate/nuxt'
  ],

  ui: {
    global: true,
    icons: ['ph', 'simple-icons'],
  },

  experimental: {
    typedPages: true,
  },

  imports: {
    dirs: [
      'composables/**',
      'store/**',
      'models/db/*',
    ],
    imports: [
      {
        from: '@vueuse/core',
        name: 'set',
      },
      {
        from: '@vueuse/core',
        name: 'isClient',
      },
    ],
    presets: [
      {
        from: 'vue-router',
        imports: [
          'RouteLocationRaw',
        ],
        type: true,
      }
    ]
  },

  nitro: {
    experimental: {
      asyncContext: true
    },
    storage: {
      db: {
        driver: 'memory',
      }
    }
  },

  fontMetrics: {
    fonts: [
      // 'Victor Mono'
    ],
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'Victor+Mono': [400, 500, 600, 700],
    },
  },

  vue: {
    defineModel: true,
    propsDestructure: true,
  },

  vite: {
    plugins: [
      NodeGlobalsPolyfillPlugin()
    ],
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    }
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

    timeline: {
      enabled: true,
    },
  },
})
