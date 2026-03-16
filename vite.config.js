import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        rozovakristina: resolve(__dirname, 'rozovakristina/index.html'),
        assistantmp: resolve(__dirname, 'assistantmp/index.html'),
      },
    },
  },
})
