import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineNuxtConfig({

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
          },
          {
            from: 'zod',
            name: 'z',
            as: 'z'
          }
        ]
      }
    ]
  },

  experimental: {
    typedPages: true,
  },

  nitro: {
    experimental: {
      asyncContext: true
    }
  },

  fontMetrics: {
    fonts: ['Manrope'],
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
  },
})
