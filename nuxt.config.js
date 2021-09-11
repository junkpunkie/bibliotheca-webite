const type = 'website'
const url = 'https://bibliotheca.com'
const title = 'Bibliotheca (for Loot)'
const description = 'Graphing the Lootverse to allow adventurers to explore.'
const mainImage = '"https://i.ibb.co/fMq60gr/Screenshot-from-2021-09-11-11-45-23.png'

const meta = 
  [
    {
      hid: 'description',
      name: 'description',
      content: description,
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: type,
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: url,
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: title,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: description,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: mainImage,
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: url,
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: title,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content:  description,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: mainImage,
    },
  ]

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Target: https://go.nuxtjs.dev/config-target
  // target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Loot Bibliotheca (for Adventurers)',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      ...meta,
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com'},
      { rel: 'preconnect', href: 'https://fonts.gstatic.com'},
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],
  loadingIndicator: {
    name: 'pulse',
    color: '#FFF',
    background: 'black'
  },
  graphql: {
    /**
     * An Object of your GraphQL clients
     */
    clients: {
      default: {
        /**
         * The client endpoint url
         */
        endpoint: process.env.API ? process.env.API : 'http://localhost:1337/graphql',
        /**
         * Per-client options overrides
         * See: https://github.com/prisma-labs/graphql-request#passing-more-options-to-fetch
         */
        options: {}
      },
      secondClient: {
        // ...client config
      }
      // ...your other clients
    },

    /**
     * Options
     * See: https://github.com/prisma-labs/graphql-request#passing-more-options-to-fetch
     */
    options: {},

    /**
     * Optional
     * default: true (this includes cross-fetch/polyfill before creating the graphql client)
     */
    useFetchPolyfill: true,

    /**
     * Optional
     * default: false (this includes graphql-tag for node_modules folder)
     */
    includeNodeModules: true
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/vue-formulate', '~/plugins/analytics.js', '~/plugins/web3modal.js', '~/plugins/v-click-outside.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: ['~/components/web3', '~/components/modal',  '~/components/navigation',  '~/components',  '~/components/cards',  '~/components/atoms'],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    'nuxt-graphql-request',
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/svg'
  ],
  generate: {
    fallback: true
  },
  serverMiddleware: [
    { path: "/api", handler: "~/serverMiddleware/server.js" },
  ],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /* extend(config) {
      if (config.resolve.extensions) {
        config.resolve.extensions.push('.mjs')
      } else {
        config.resolve.extensions = ['.mjs']
      }
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
      // https://github.com/nuxt/nuxt.js/issues/1142
      config.resolve.alias.vue = 'vue/dist/vue.common'
    }, */
  },
  env:{
    INFURA_ID: process.env.INFURA_ID,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    ETHER_SCAN: process.env.ETHER_SCAN,
    ACTIVE_NETWORKS: process.env.ACTIVE_NETWORKS
  }
}
