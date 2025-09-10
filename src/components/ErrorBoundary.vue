<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <h3>Something went wrong</h3>
      <p>{{ errorMessage }}</p>
      <button
        @click="retry"
        class="retry-button focus-visible:outline-2 focus-visible:outline-[#dc2626] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(220,38,38,0.2)]"
      >
        Try Again
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, nextTick } from 'vue'
import { ErrorBoundary } from '@/utils/errorHandling'

interface Props {
  fallbackComponent?: string
  showRetry?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRetry: true,
})

const hasError = ref(false)
const errorMessage = ref('')
const errorBoundary = ErrorBoundary.getInstance()

onErrorCaptured((error: Error, instance, info: string) => {
  hasError.value = true
  errorMessage.value = error.message || 'An unexpected error occurred'

  errorBoundary.handleError(error, {
    componentName: instance?.$options.name || 'Unknown',
    message: error.message,
    stack: error.stack,
  })

  // Prevent the error from propagating further
  return false
})

const retry = async () => {
  hasError.value = false
  errorMessage.value = ''
  await nextTick()
}
</script>

<style scoped>
.error-boundary {
  padding: 1.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  text-align: center;
  margin: 1rem 0;
}

.error-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 0.5rem;
}

.error-content p {
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #b91c1c;
}

/* Focus styles are handled by focus-visible classes in template */

/* Dark mode support */
[data-theme='dark'] .error-boundary {
  background-color: rgba(127, 29, 29, 0.2);
  border-color: #dc2626;
}

[data-theme='dark'] .error-content h3 {
  color: #fca5a5;
}

[data-theme='dark'] .error-content p {
  color: #f87171;
}

[data-theme='dark'] .retry-button {
  background-color: #b91c1c;
}

[data-theme='dark'] .retry-button:hover {
  background-color: #991b1b;
}
</style>
