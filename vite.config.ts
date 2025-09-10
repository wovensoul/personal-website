import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Enable code splitting and optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router'],
          utils: [
            './src/utils/lazyLoading.ts',
            './src/utils/serviceWorker.ts',
            './src/utils/seo.ts',
            './src/utils/mobileViewport.ts',
            './src/utils/mobileOptimization.ts',
          ],
          // Component chunks
          components: [
            './src/components/ProjectCard.vue',
            './src/components/TechIconGrid.vue',
            './src/components/SectionHeader.vue',
          ],
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const name = facadeModuleId.split('/').pop()?.replace('.vue', '') || 'chunk'
            return `assets/${name}-[hash].js`
          }
          return 'assets/[name]-[hash].js'
        },
      },
    },
    // Optimize bundle size
    minify: 'esbuild',
    // Enable source maps for debugging in production
    sourcemap: false,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'vue-router'],
    exclude: ['@vueuse/core'],
  },
  // ESBuild optimizations
  esbuild: {
    drop: ['console', 'debugger'],
  },
  // Performance optimizations
  server: {
    host: true,
    fs: {
      // Optimize file system access
      strict: true,
    },
  },
})
