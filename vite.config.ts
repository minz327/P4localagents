import { defineConfig } from 'vite'

export default defineConfig(async () => {
  // Dynamically import the plugins so ESM-only packages load correctly
  const mod = await import('@vitejs/plugin-react')
  const react = (mod && (mod as any).default) || mod

  return {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 5173,
    },
  }
})
