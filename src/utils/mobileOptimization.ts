/**
 * Mobile optimization utilities for performance and user experience
 */

// Type definitions for Web APIs that may not be fully supported in TypeScript
interface NetworkInformation {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g'
  saveData: boolean
  downlink: number
  rtt: number
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
}

/**
 * Lazy load images for better mobile performance
 */
export function setupLazyLoading(): void {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

/**
 * Optimize network requests for mobile
 */
export function optimizeForMobile(): void {
  // Preload critical resources
  const criticalResources = ['/fonts/lato-regular.woff2', '/fonts/lato-bold.woff2']

  criticalResources.forEach((resource) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource
    link.as = resource.includes('font') ? 'font' : 'style'
    if (resource.includes('font')) {
      link.crossOrigin = 'anonymous'
    }
    document.head.appendChild(link)
  })

  // Add resource hints for external domains
  const externalDomains = ['https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com']

  externalDomains.forEach((domain) => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    document.head.appendChild(link)
  })
}

/**
 * Handle touch events for better mobile interaction
 */
export function setupTouchOptimization(): void {
  // Prevent double-tap zoom on buttons
  document.addEventListener(
    'touchend',
    (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        e.preventDefault()
      }
    },
    { passive: false },
  )

  // Optimize scroll performance
  let ticking = false

  function updateScrollPosition() {
    // Update scroll-based animations or effects here
    ticking = false
  }

  document.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition)
        ticking = true
      }
    },
    { passive: true },
  )
}

/**
 * Network-aware loading for mobile
 */
export function setupNetworkAwareLoading(): void {
  const navigatorWithConnection = navigator as NavigatorWithConnection

  if ('connection' in navigator && navigatorWithConnection.connection) {
    const connection = navigatorWithConnection.connection

    const isSlowConnection =
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData

    if (isSlowConnection) {
      // Disable non-essential animations
      document.documentElement.classList.add('reduce-motion')

      // Reduce image quality
      document.querySelectorAll('img').forEach((img) => {
        if (img.src && !img.src.includes('q_auto:low')) {
          img.src = img.src.replace(/q_auto:\w+/, 'q_auto:low')
        }
      })
    }
  }
}

/**
 * Battery-aware optimizations
 */
export function setupBatteryOptimization(): void {
  if ('getBattery' in navigator) {
    interface BatteryManager {
      level: number
      charging: boolean
      addEventListener(type: string, listener: () => void): void
    }

    interface NavigatorWithBattery extends Navigator {
      getBattery(): Promise<BatteryManager>
    }

    const navigatorWithBattery = navigator as NavigatorWithBattery
    navigatorWithBattery.getBattery().then((battery: BatteryManager) => {
      function updateBatteryOptimizations() {
        const isLowBattery = battery.level < 0.2 && !battery.charging

        if (isLowBattery) {
          // Reduce animations and effects
          document.documentElement.classList.add('low-battery')

          // Disable snow animation if enabled
          const snowToggle = document.querySelector('[data-snow-toggle]') as HTMLButtonElement
          if (snowToggle) {
            snowToggle.click()
          }
        }
      }

      battery.addEventListener('levelchange', updateBatteryOptimizations)
      battery.addEventListener('chargingchange', updateBatteryOptimizations)
      updateBatteryOptimizations()
    })
  }
}

/**
 * Cross-browser mobile compatibility fixes
 */
export function applyMobileCompatibilityFixes(): void {
  // iOS Safari fixes
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    // Fix iOS Safari 100vh issue
    const setIOSViewportHeight = () => {
      document.documentElement.style.setProperty('--ios-vh', `${window.innerHeight}px`)
    }

    setIOSViewportHeight()
    window.addEventListener('resize', setIOSViewportHeight)
    window.addEventListener('orientationchange', () => {
      setTimeout(setIOSViewportHeight, 100)
    })

    // Prevent iOS Safari bounce scrolling
    document.addEventListener(
      'touchmove',
      (e) => {
        if (e.target === document.body) {
          e.preventDefault()
        }
      },
      { passive: false },
    )
  }

  // Android Chrome fixes
  if (/Android/.test(navigator.userAgent)) {
    // Fix Android Chrome viewport units
    const setAndroidViewportHeight = () => {
      document.documentElement.style.setProperty('--android-vh', `${window.innerHeight}px`)
    }

    setAndroidViewportHeight()
    window.addEventListener('resize', setAndroidViewportHeight)
  }

  // Samsung Internet fixes
  if (/SamsungBrowser/.test(navigator.userAgent)) {
    document.documentElement.classList.add('samsung-browser')
  }
}

/**
 * Initialize all mobile optimizations
 */
export function initMobileOptimizations(): void {
  setupLazyLoading()
  optimizeForMobile()
  setupTouchOptimization()
  setupNetworkAwareLoading()
  setupBatteryOptimization()
  applyMobileCompatibilityFixes()
}

/**
 * Performance monitoring for mobile
 */
export function monitorMobilePerformance(): void {
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    })

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        interface FirstInputEntry extends PerformanceEntry {
          processingStart: number
        }
        const fidEntry = entry as FirstInputEntry
        console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
      })
    })

    fidObserver.observe({ entryTypes: ['first-input'] })

    // Monitor Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      const entries = list.getEntries()

      entries.forEach((entry) => {
        interface LayoutShiftEntry extends PerformanceEntry {
          hadRecentInput: boolean
          value: number
        }
        const layoutShiftEntry = entry as LayoutShiftEntry
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value
        }
      })

      console.log('CLS:', clsValue)
    })

    clsObserver.observe({ entryTypes: ['layout-shift'] })
  }
}
