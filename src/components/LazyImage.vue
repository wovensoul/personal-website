<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { generatePlaceholder } from '@/utils/lazyLoading'

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  placeholder?: string
  fallbackSrc?: string
  blurAmount?: number
  class?: string
  loading?: 'lazy' | 'eager'
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200,
  blurAmount: 10,
  loading: 'lazy',
})

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const isError = ref(false)
const isIntersecting = ref(false)

let observer: IntersectionObserver | null = null

// Generate placeholder if not provided
const placeholderSrc = props.placeholder || generatePlaceholder(props.width, props.height)

onMounted(() => {
  if (!imageRef.value) return

  // Set up intersection observer for lazy loading
  if (props.loading === 'lazy' && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true
            loadImage()
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      },
    )

    observer.observe(imageRef.value)
  } else {
    // Load immediately for eager loading or fallback
    isIntersecting.value = true
    loadImage()
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

function loadImage() {
  if (!isIntersecting.value) return

  const img = new Image()

  img.onload = () => {
    isLoaded.value = true
  }

  img.onerror = () => {
    // Try fallback image if provided
    if (props.fallbackSrc && img.src !== props.fallbackSrc) {
      img.src = props.fallbackSrc
      return
    }

    isError.value = true
    console.warn(`Failed to load image: ${props.src}`)
    // ✅ No removeChild needed here
  }

  img.src = props.src
}
</script>

<template>
  <div
    class="lazy-image-container"
    :class="[
      props.class,
      {
        loaded: isLoaded,
        error: isError,
        loading: !isLoaded && !isError && isIntersecting,
      },
    ]"
  >
    <!-- Placeholder image -->
    <img
      v-if="!isLoaded && !isError"
      :src="placeholderSrc"
      :alt="alt"
      :width="width"
      :height="height"
      class="placeholder-image"
      :style="{ filter: `blur(${blurAmount}px)` }"
      aria-hidden="true"
    />

    <!-- Main image -->
    <img
      v-if="isIntersecting"
      ref="imageRef"
      :src="isLoaded ? src : placeholderSrc"
      :alt="alt"
      :width="width"
      :height="height"
      class="main-image"
      :class="{ 'fade-in': isLoaded }"
      @load="isLoaded = true"
      @error="isError = true"
    />

    <!-- Error state -->
    <div
      v-if="isError"
      class="error-placeholder"
      :style="{ width: `${width}px`, height: `${height}px` }"
      role="img"
      :aria-label="`Failed to load image: ${alt}`"
    >
      <div class="error-content">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
        <span class="sr-only">Image failed to load</span>
      </div>
    </div>

    <!-- Loading indicator -->
    <div
      v-if="!isLoaded && !isError && isIntersecting"
      class="loading-indicator"
      aria-hidden="true"
    >
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.lazy-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: var(--mygray, #f3f4f6);
  border-radius: 8px;
}

.placeholder-image,
.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder-image {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.main-image {
  position: relative;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image.fade-in {
  opacity: 1;
}

.error-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--mygray, #f3f4f6);
  color: var(--text-secondary, #6b7280);
  border: 2px dashed currentColor;
  border-radius: 8px;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  text-align: center;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--mygray, #f3f4f6);
  border-top: 2px solid var(--myblue, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .main-image {
    transition: none;
  }

  .loading-spinner {
    animation: none;
    border-top-color: transparent;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .error-placeholder {
    border-width: 3px;
  }
}
</style>
