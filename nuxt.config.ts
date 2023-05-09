import daisyui from 'daisyui'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/eslint-module'
  ],

  build: {
    transpile: [
      'trpc-nuxt'
    ]
  },

  typescript: {
    shim: false,
    typeCheck: true
  },

  tailwindcss: {
    // @ts-ignore - tailwindcss type isn't working
    config: {
      plugins: [daisyui],
      daisyui: {
        themes: false
      }
    }
  },
  devtools: {
    enabled: false
  }
})
