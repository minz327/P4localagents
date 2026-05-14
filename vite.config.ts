import { defineConfig } from 'vite'

export default defineConfig(async () => {
  // Dynamically import the plugins so ESM-only packages load correctly
  const mod = await import('@vitejs/plugin-react')
  const react = (mod && (mod as any).default) || mod

  return {
    base: '/P4localagents/',
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 5173,
    },
    optimizeDeps: {
      include: [
        '@sfe/react-composite-datagrid',
        '@sfe/react-datagrid',
        '@sfe/react-in-page-filter',
        '@sfe/react-layout-grid',
        '@sfe/react-theme',
        '@fluentui-copilot/react-copilot',
        '@fluentui-copilot/react-provider',
        '@fluentui/react-components',
        '@fluentui/react-timepicker-compat',
        '@fluentui/react-datepicker-compat',
        'react',
        'react-dom',
      ],
    },
  }
})
