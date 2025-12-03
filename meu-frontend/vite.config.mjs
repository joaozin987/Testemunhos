// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/", // <-- ISSO É MUITO IMPORTANTE NO RENDER
  plugins: [react()],
})
