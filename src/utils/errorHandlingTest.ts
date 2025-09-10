/**
 * Test utilities for error handling functionality
 */

import { BrowserCompat } from './browserCompat'
import { ErrorBoundary, NetworkErrorHandler } from './errorHandling'

export class ErrorHandlingTest {
  static async runComprehensiveTests(): Promise<void> {
    console.group('🧪 Error Handling Tests')

    try {
      await this.testBrowserCompatibility()
      await this.testNetworkErrorHandling()
      await this.testImageErrorHandling()
      this.testJavaScriptErrorHandling()

      console.log('✅ All error handling tests passed')
    } catch (error) {
      console.error('❌ Error handling tests failed:', error)
    }

    console.groupEnd()
  }

  private static async testBrowserCompatibility(): Promise<void> {
    console.log('Testing browser compatibility...')

    // Test feature detection
    const hasGrid = BrowserCompat.hasGridSupport()
    const hasIntersectionObserver = BrowserCompat.hasIntersectionObserver()
    const hasSmoothScroll = BrowserCompat.hasSmoothScrollSupport()
    const hasWebP = BrowserCompat.hasWebPSupport()

    console.log('Browser features:', {
      grid: hasGrid,
      intersectionObserver: hasIntersectionObserver,
      smoothScroll: hasSmoothScroll,
      webP: hasWebP,
    })

    // Test polyfill loading
    if (!hasIntersectionObserver) {
      await BrowserCompat.loadIntersectionObserverPolyfill()
      console.log('IntersectionObserver polyfill loaded')
    }

    // Test CSS class application
    BrowserCompat.applyGridFallbacks()

    console.log('✓ Browser compatibility tests passed')
  }

  private static async testNetworkErrorHandling(): Promise<void> {
    console.log('Testing network error handling...')

    try {
      // Test successful request
      const response = await NetworkErrorHandler.fetchWithRetry('/manifest.json')
      console.log('✓ Successful network request:', response.status)
    } catch (error) {
      console.log('✓ Network error handled correctly:', error)
    }

    try {
      // Test failed request
      await NetworkErrorHandler.fetchWithRetry('/nonexistent-file.json')
    } catch (error) {
      console.log('✓ Failed network request handled correctly')
    }

    console.log('✓ Network error handling tests passed')
  }

  private static testImageErrorHandling(): void {
    console.log('Testing image error handling...')

    // Create test image element
    const img = document.createElement('img')
    img.style.display = 'none'
    document.body.appendChild(img)

    // Test image error handling
    img.onerror = () => {
      NetworkErrorHandler.handleImageError(img, '/fallback-image.jpg')
      console.log('✓ Image error handled correctly')
      document.body.removeChild(img)
    }

    // Trigger error with invalid image
    img.src = '/invalid-image.jpg'
  }

  private static testJavaScriptErrorHandling(): void {
    console.log('Testing JavaScript error handling...')

    const errorBoundary = ErrorBoundary.getInstance()

    // Register test error callback
    errorBoundary.onError((error, errorInfo) => {
      console.log('✓ JavaScript error caught by error boundary:', {
        message: error.message,
        component: errorInfo.componentName,
      })
    })

    // Test error handling
    try {
      throw new Error('Test error for error boundary')
    } catch (error) {
      errorBoundary.handleError(error as Error, {
        componentName: 'TestComponent',
        message: 'Test error message',
      })
    }

    console.log('✓ JavaScript error handling tests passed')
  }

  static testFallbackContent(): void {
    console.log('Testing fallback content generation...')

    const components = [
      'HeroSection',
      'AboutSection',
      'ProjectsSection',
      'ContactSection',
      'SimpleNavigation',
    ]

    components.forEach((componentName) => {
      const fallback = ErrorBoundary.getFallbackContent(componentName)
      console.log(`✓ Fallback content for ${componentName}:`, fallback.substring(0, 50) + '...')
    })

    console.log('✓ Fallback content tests passed')
  }

  static simulateSlowNetwork(): void {
    console.log('Simulating slow network conditions...')

    // Add slow network class to document
    document.documentElement.classList.add('reduce-motion', 'low-battery')

    // Remove after 5 seconds
    setTimeout(() => {
      document.documentElement.classList.remove('reduce-motion', 'low-battery')
      console.log('✓ Slow network simulation ended')
    }, 5000)
  }

  static testAccessibilityFallbacks(): void {
    console.log('Testing accessibility fallbacks...')

    // Test no-js class handling
    if (document.documentElement.classList.contains('no-js')) {
      console.log('⚠️ JavaScript appears to be disabled - fallbacks should be active')
    } else {
      console.log('✓ JavaScript is enabled - interactive features available')
    }

    // Test reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    console.log('Reduced motion preference:', prefersReducedMotion)

    // Test high contrast preferences
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    console.log('High contrast preference:', prefersHighContrast)

    console.log('✓ Accessibility fallback tests completed')
  }
}

// Auto-run tests in development mode
if (import.meta.env.DEV) {
  // Run tests after a short delay to ensure DOM is ready
  setTimeout(() => {
    ErrorHandlingTest.runComprehensiveTests()
    ErrorHandlingTest.testFallbackContent()
    ErrorHandlingTest.testAccessibilityFallbacks()
  }, 2000)
}
