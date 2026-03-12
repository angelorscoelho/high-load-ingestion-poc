import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve and build under /blip/ so this app integrates as a sub-page of
  // angelorscoelho.dev (i.e. https://www.angelorscoelho.dev/blip).
  base: '/blip/',
})
