import { defineConfig } from 'vite'

export default defineConfig({
  base: "/m2p-2025",
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
})
