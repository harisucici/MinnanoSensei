import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  server: {
    port: 3000,
    open: true // Automatically open the browser
  },
  build: {
    outDir: 'dist'
  },
  envPrefix: 'VUE_APP_', // Ensure VUE_APP_ prefixed variables are exposed
})