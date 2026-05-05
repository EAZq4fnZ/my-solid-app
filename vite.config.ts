// vite.config.ts
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite' // 追加

export default defineConfig({
  plugins: [
    tailwindcss(), // 追加（solidの前に入れる）
    solid()
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@f': '/src/features'
    },
  },
})