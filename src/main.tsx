import React from 'react'
import { createRoot } from 'react-dom/client'
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider theme={teamsLightTheme}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </FluentProvider>
  </React.StrictMode>
)
