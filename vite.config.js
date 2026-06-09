import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    optimizeDeps: {
      include: ['@iconify/vue']
    },
    server: {
      headers: mode === 'development' ? { 'Cache-Control': 'no-store' } : undefined,
      proxy: {
        '/api/quotes': {
          target: 'https://quotes.liupurnomo.com',
          changeOrigin: true,
          rewrite: (path) => path
        },
        '/api/bukuacak': {
          target: 'https://bukuacak.vercel.app',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/bukuacak/, '/api')
        },
        '/api/pixabay': {
          target: 'https://pixabay.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/pixabay/, '/api')
        },
        '/api': {
          target: 'https://startok.test',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons/*.png'],
        manifest: {
          name: env.VITE_APP_NAME || 'Halo Bunda',
          short_name: env.VITE_APP_NAME || 'Halo Bunda',
          description: env.VITE_APP_TAGLINE || 'Pendamping Anak',
          theme_color: '#176c33',
          background_color: '#FFF9F3',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          icons: [
            { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
            { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
            { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
          importScripts: ['push-sw.js'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.iconify\.design\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'iconify-cache', expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 } }
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
            },
            {
              urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'unsplash-cache', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 } }
            },
            {
              urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'google-images-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 } }
            }
          ]
        }
      })
    ]
  }
})
