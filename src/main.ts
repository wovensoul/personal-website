import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { ErrorBoundary } from './utils/errorHandling'
import { BrowserCompat } from './utils/browserCompat'
import './utils/errorHandlingTest'

const app = createApp(App)

// Initialize error handling
const errorBoundary = ErrorBoundary.getInstance()

// Global error handler for Vue
app.config.errorHandler = (err: unknown, instance, info: string) => {
  const error = err instanceof Error ? err : new Error(String(err))
  errorBoundary.handleError(error, {
    componentName: instance?.$options.name || instance?.$?.type?.name || 'Unknown',
    propsData: instance?.$props,
    message: error.message,
    stack: error.stack,
  })
  console.error('Vue error info:', info)
}

// Global error handler for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  errorBoundary.handleError(new Error(event.reason), {
    message: 'Unhandled promise rejection',
    componentName: 'Global',
  })
})

// Global error handler for JavaScript errors
window.addEventListener('error', (event) => {
  console.error('Global JavaScript error:', event.error)
  errorBoundary.handleError(event.error || new Error(event.message), {
    message: event.message,
    componentName: 'Global',
  })
})

// Initialize browser compatibility features
BrowserCompat.initialize()
  .then(() => {
    console.log('Browser compatibility features initialized')
  })
  .catch((error) => {
    console.warn('Failed to initialize some browser compatibility features:', error)
  })

// Add no-js class removal (for JavaScript-enabled environments)
document.documentElement.classList.remove('no-js')

app.mount('#app')
