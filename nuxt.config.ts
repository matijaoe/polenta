import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineNuxtConfig({
  ssr: false,
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
      'models/db/**',
    ],
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
    ],
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
    fonts: ['Inter'],
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'Inter': [400],
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
