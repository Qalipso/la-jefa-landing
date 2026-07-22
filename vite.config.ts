import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from /<repo>/ — keep in sync with the repo name.
  base: process.env.DEPLOY_BASE ?? '/',
  plugins: [react()],
})
