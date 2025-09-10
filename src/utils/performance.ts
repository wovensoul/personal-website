/**
 * Performance monitoring and optimization utilities
 */

// Core Web Vitals monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Monitor Largest Contentful Paint (LCP)
  observeLCP()

  // Monitor First Input Delay (FID)
  observeFID()

  // Monitor Cumulative Layout Shift (CLS)
  observeCLS()

  // Monitor Time to First Byte (TTFB)
  observeTTFB()
}

// Largest Contentful Paint
function observeLCP() {
  if (!('PerformanceObserver' in window)) return

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]

      console.log('LCP:', lastEntry.startTime)

      // Report to analytics if needed
      reportMetric('LCP', lastEntry.startTime)
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (error) {
    console.warn('LCP observation failed:', error)
  }
}

// First Input Delay
function observeFID() {
  if (!('PerformanceObserver' in window)) return

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime
        console.log('FID:', fid)

        reportMetric('FID', fid)
      })
    })

    observer.observe({ entryTypes: ['first-input'] })
  } catch (error) {
    console.warn('FID observation failed:', error)
  }
}

// Cumulative Layout Shift
function observeCLS() {
  if (!('PerformanceObserver' in window)) return

  let clsValue = 0
  let sessionValue = 0
  let sessionEntries: PerformanceEntry[] = []

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0]
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value
            sessionEntries.push(entry)
          } else {
            sessionValue = entry.value
            sessionEntries = [entry]
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue
            console.log('CLS:', clsValue)
            reportMetric('CLS', clsValue)
          }
        }
      })
    })

    observer.observe({ entryTypes: ['layout-shift'] })
  } catch (error) {
    console.warn('CLS observation failed:', error)
  }
}

// Time to First Byte
function observeTTFB() {
  if (!('PerformanceObserver' in window)) return

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.name === location.href) {
          const ttfb = entry.responseStart - entry.requestStart
          console.log('TTFB:', ttfb)
          reportMetric('TTFB', ttfb)
        }
      })
    })

    observer.observe({ entryTypes: ['navigation'] })
  } catch (error) {
    console.warn('TTFB observation failed:', error)
  }
}

// Report metrics (can be extended to send to analytics)
function reportMetric(name: string, value: number) {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`Performance Metric - ${name}:`, value)
  }

  // In production, you could send to analytics service
  // Example: analytics.track('performance', { metric: name, value })
}

// Bundle size analysis
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return

  // Analyze loaded resources
  const resources = performance.getEntriesByType('resource')
  const jsResources = resources.filter((r) => r.name.includes('.js'))
  const cssResources = resources.filter((r) => r.name.includes('.css'))

  const totalJSSize = jsResources.reduce((sum, r: any) => sum + (r.transferSize || 0), 0)
  const totalCSSSize = cssResources.reduce((sum, r: any) => sum + (r.transferSize || 0), 0)

  console.log('Bundle Analysis:', {
    jsFiles: jsResources.length,
    cssFiles: cssResources.length,
    totalJSSize: formatBytes(totalJSSize),
    totalCSSSize: formatBytes(totalCSSSize),
    totalSize: formatBytes(totalJSSize + totalCSSSize),
  })
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (!('memory' in performance)) return

  const memory = (performance as any).memory

  console.log('Memory Usage:', {
    used: formatBytes(memory.usedJSHeapSize),
    total: formatBytes(memory.totalJSHeapSize),
    limit: formatBytes(memory.jsHeapSizeLimit),
  })
}

// Network information
export function getNetworkInfo() {
  if (!('connection' in navigator)) return null

  // Type assertion for Network Information API
  const nav = navigator as unknown
  const connection = nav.connection

  return {
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  }
}

// Optimize for slow connections
export function optimizeForSlowConnection() {
  const networkInfo = getNetworkInfo()

  if (networkInfo?.effectiveType === '2g' || networkInfo?.saveData) {
    // Disable non-essential features
    document.body.classList.add('slow-connection')

    // Reduce animation duration
    document.documentElement.style.setProperty('--animation-duration', '0.1s')

    console.log('Optimizing for slow connection')
    return true
  }

  return false
}

// Utility function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Resource hints for preloading
export function addResourceHints() {
  // Preconnect to external domains
  const preconnectDomains = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']

  preconnectDomains.forEach((domain) => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Prefetch next page resources
export function prefetchResources(urls: string[]) {
  urls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
  })
}
