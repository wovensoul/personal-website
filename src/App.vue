<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Snowfall from './components/SnowFall.vue'
import SimpleNavigation from './components/SimpleNavigation.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import SkipLinks from './components/SkipLinks.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import {
  initMobileViewport,
  cleanupMobileViewport,
  optimizeTouchScrolling,
  preventInputZoom,
} from './utils/mobileViewport'
import { initMobileOptimizations, monitorMobilePerformance } from './utils/mobileOptimization'
import { initMobileTesting } from './utils/mobileTestingUtils'
import { setupMainPageSEO, cleanupSEO } from './utils/seo'
import {
  setupImageLazyLoading,
  setupSectionLazyLoading,
  preloadCriticalImages,
} from './utils/lazyLoading'
import { registerServiceWorker } from './utils/serviceWorker'
import {
  initPerformanceMonitoring,
  optimizeForSlowConnection,
  addResourceHints,
  analyzeBundleSize,
} from './utils/performance'
import { runIntegrationTests } from './utils/integrationTest'
import { runPerformanceOptimization } from './utils/bundleOptimization'
import { runFinalValidation } from './utils/finalValidation'

// Snow toggle functionality
const showSnow = ref(true)

function toggleSnow() {
  showSnow.value = !showSnow.value
  applyShowSnow(showSnow.value)
}

function applyShowSnow(value: boolean) {
  localStorage.setItem('showSnow', value.toString())
}

function navigateToSection(sectionId: string) {
  console.log('🎯 App.vue navigateToSection called with:', sectionId)
  const element = document.getElementById(sectionId)
  if (!element) {
    console.error('❌ Element not found:', sectionId)
    return
  }

  // Use getBoundingClientRect for more accurate positioning
  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + window.scrollY
  const navHeight = 80
  const targetPosition = Math.max(0, absoluteElementTop - navHeight)

  console.log('📍 Element found:', element)
  console.log('📍 Element rect:', elementRect)
  console.log('📍 Absolute top:', absoluteElementTop)
  console.log('📍 Target position:', targetPosition)
  console.log('📍 Current scroll:', window.scrollY)

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  })

  console.log('✅ Scroll initiated to', sectionId)
}

onMounted(async () => {
  // Initialize performance monitoring first
  initPerformanceMonitoring()

  // Add resource hints for better loading
  addResourceHints()

  // Optimize for slow connections
  optimizeForSlowConnection()

  // Run performance optimization
  runPerformanceOptimization()

  // Setup comprehensive SEO and structured data
  setupMainPageSEO()

  // Load snow preference
  const saved = localStorage.getItem('showSnow')
  console.log('Loaded snow state from storage:', saved)
  showSnow.value = saved ? saved === 'true' : true
  applyShowSnow(showSnow.value)

  // Initialize mobile viewport optimizations
  initMobileViewport()
  optimizeTouchScrolling()
  preventInputZoom()

  // Initialize comprehensive mobile optimizations
  initMobileOptimizations()

  // Monitor performance on mobile devices
  if (import.meta.env.DEV) {
    monitorMobilePerformance()
    initMobileTesting()

    // Analyze bundle size in development
    setTimeout(() => {
      analyzeBundleSize()
    }, 2000)

    // Run comprehensive integration tests
    setTimeout(() => {
      runIntegrationTests()
    }, 3000)

    // Run final validation
    setTimeout(() => {
      runFinalValidation()
    }, 4000)
  }

  // Add mobile-specific meta tags for better mobile experience
  const viewport = document.querySelector('meta[name="viewport"]')
  if (viewport) {
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover',
    )
  }

  // Add mobile web app capabilities
  const metaTags = [
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'theme-color', content: '#75a6bb' },
    { name: 'msapplication-TileColor', content: '#75a6bb' },
  ]

  metaTags.forEach((tag) => {
    const existingTag = document.querySelector(`meta[name="${tag.name}"]`)
    if (!existingTag) {
      const meta = document.createElement('meta')
      meta.name = tag.name
      meta.content = tag.content
      document.head.appendChild(meta)
    }
  })

  // Initialize lazy loading for images and sections
  setupImageLazyLoading()
  setupSectionLazyLoading()

  // Preload critical images (hero section, etc.)
  const criticalImages: string[] = [
    // Add any critical images that should load immediately
  ]
  if (criticalImages.length > 0) {
    preloadCriticalImages(criticalImages)
  }

  // Register service worker for caching
  if (import.meta.env.PROD) {
    try {
      await registerServiceWorker()
    } catch (error) {
      console.warn('Service worker registration failed:', error)
    }
  }
})

onUnmounted(() => {
  // Cleanup mobile viewport listeners
  cleanupMobileViewport()

  // Cleanup SEO data
  cleanupSEO()
})
</script>

<template>
  <div class="bg-[var(--obgcolor)] text-[var(--textcolor)] duration-300">
    <!-- Skip Links for Screen Readers -->
    <SkipLinks />

    <!-- Decorative Background Animation -->
    <ErrorBoundary v-if="showSnow">
      <Snowfall aria-hidden="true" />
    </ErrorBoundary>

    <!-- Site Header with Navigation -->
    <header role="banner">
      <ErrorBoundary>
        <SimpleNavigation />
      </ErrorBoundary>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="pt-0 md:pt-20" tabindex="-1" role="main">
      <!-- Hero/Introduction Section - Critical, load immediately -->
      <ErrorBoundary>
        <HeroSection :show-snow="showSnow" @toggle-snow="toggleSnow" />
      </ErrorBoundary>

      <!-- About Section -->
      <ErrorBoundary>
        <AboutSection />
      </ErrorBoundary>

      <!-- Projects Portfolio Section -->
      <ErrorBoundary>
        <ProjectsSection />
      </ErrorBoundary>

      <!-- Contact Information Section -->
      <ErrorBoundary>
        <ContactSection />
      </ErrorBoundary>
    </main>

    <!-- Site Footer -->
    <footer role="contentinfo" class="py-8 px-4 sm:px-6 lg:px-8 border-t border-[var(--mygray)]/20">
      <div class="max-w-6xl mx-auto text-center">
        <p class="text-sm text-[var(--mygray)]">
          © {{ new Date().getFullYear() }} Jeffrey Chen. Built with
          <span class="text-[var(--myblue)]">Vue 3</span>,
          <span class="text-[var(--myblue)]">TypeScript</span>, and
          <span class="text-[var(--myblue)]">Tailwind CSS</span>.
        </p>
        <p class="text-xs text-[var(--mygray)] mt-2">
          Designed and developed with accessibility and performance in mind.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
span:after {
  opacity: 0;
}
button {
  position: relative;
  text-decoration: none;
  transition:
    color 0.3s ease,
    text-shadow 0.3s ease;
  cursor: pointer;
}

button:hover {
  color: var(--snowcolor);
}

button:active {
  color: color-mix(in srgb, var(--snowcolor) 60%, rgb(19, 24, 93) 40%);
}
/* Removed button underline hover effects for cleaner design */
</style>
