/**
 * Bundle optimization and analysis utilities
 */

export interface BundleAnalysis {
  totalSize: number
  jsSize: number
  cssSize: number
  imageSize: number
  recommendations: string[]
}

/**
 * Analyze current bundle performance
 */
export function analyzeBundlePerformance(): BundleAnalysis {
  const analysis: BundleAnalysis = {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    recommendations: [],
  }

  // Analyze loaded resources
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

  resources.forEach((resource) => {
    const size = resource.transferSize || 0
    analysis.totalSize += size

    if (resource.name.endsWith('.js')) {
      analysis.jsSize += size
    } else if (resource.name.endsWith('.css')) {
      analysis.cssSize += size
    } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) {
      analysis.imageSize += size
    }
  })

  // Generate recommendations
  if (analysis.jsSize > 500000) {
    // 500KB
    analysis.recommendations.push('Consider code splitting to reduce JavaScript bundle size')
  }

  if (analysis.cssSize > 100000) {
    // 100KB
    analysis.recommendations.push('Consider purging unused CSS or splitting CSS files')
  }

  if (analysis.imageSize > 1000000) {
    // 1MB
    analysis.recommendations.push(
      'Optimize images with modern formats (WebP, AVIF) and compression',
    )
  }

  const unusedCSS = findUnusedCSS()
  if (unusedCSS.length > 0) {
    analysis.recommendations.push(`Found ${unusedCSS.length} potentially unused CSS rules`)
  }

  return analysis
}

/**
 * Find potentially unused CSS rules
 */
export function findUnusedCSS(): string[] {
  const unusedRules: string[] = []

  try {
    // Get all stylesheets
    const stylesheets = Array.from(document.styleSheets)

    stylesheets.forEach((stylesheet) => {
      try {
        const rules = Array.from(stylesheet.cssRules || [])

        rules.forEach((rule) => {
          if (rule instanceof CSSStyleRule) {
            const selector = rule.selectorText

            // Skip pseudo-selectors and media queries for this basic check
            if (selector.includes(':') || selector.includes('@')) {
              return
            }

            try {
              const elements = document.querySelectorAll(selector)
              if (elements.length === 0) {
                unusedRules.push(selector)
              }
            } catch (e) {
              // Invalid selector, skip
            }
          }
        })
      } catch (e) {
        // Cross-origin stylesheet, skip
      }
    })
  } catch (e) {
    console.warn('Could not analyze CSS rules:', e)
  }

  return unusedRules
}

/**
 * Optimize images by adding lazy loading and modern formats
 */
export function optimizeImages(): void {
  const images = document.querySelectorAll('img:not([loading])')

  images.forEach((img) => {
    // Add lazy loading to images not in viewport
    const rect = img.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

    if (!isInViewport) {
      img.setAttribute('loading', 'lazy')
    }

    // Add decoding hint for better performance
    img.setAttribute('decoding', 'async')
  })
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(): void {
  const criticalResources = [
    // Add critical fonts, CSS, or JS files
    '/fonts/inter.woff2',
    // Add other critical resources as needed
  ]

  criticalResources.forEach((resource) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource

    if (resource.endsWith('.woff2') || resource.endsWith('.woff')) {
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
    } else if (resource.endsWith('.css')) {
      link.as = 'style'
    } else if (resource.endsWith('.js')) {
      link.as = 'script'
    }

    document.head.appendChild(link)
  })
}

/**
 * Monitor Core Web Vitals
 */
export function monitorCoreWebVitals(): void {
  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any

        console.log('LCP:', lastEntry.startTime + 'ms')

        if (lastEntry.startTime > 2500) {
          console.warn('⚠️ LCP is above 2.5s threshold')
        } else {
          console.log('✅ LCP is within acceptable range')
        }
      })

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('Could not observe LCP:', e)
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          console.log('FID:', entry.processingStart - entry.startTime + 'ms')

          if (entry.processingStart - entry.startTime > 100) {
            console.warn('⚠️ FID is above 100ms threshold')
          } else {
            console.log('✅ FID is within acceptable range')
          }
        })
      })

      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.warn('Could not observe FID:', e)
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })

        console.log('CLS:', clsValue)

        if (clsValue > 0.1) {
          console.warn('⚠️ CLS is above 0.1 threshold')
        } else {
          console.log('✅ CLS is within acceptable range')
        }
      })

      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('Could not observe CLS:', e)
    }
  }
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(): string {
  const analysis = analyzeBundlePerformance()

  let report = '📊 Performance Analysis Report\n\n'
  report += `Total Bundle Size: ${(analysis.totalSize / 1024).toFixed(2)} KB\n`
  report += `JavaScript: ${(analysis.jsSize / 1024).toFixed(2)} KB\n`
  report += `CSS: ${(analysis.cssSize / 1024).toFixed(2)} KB\n`
  report += `Images: ${(analysis.imageSize / 1024).toFixed(2)} KB\n\n`

  if (analysis.recommendations.length > 0) {
    report += '💡 Recommendations:\n'
    analysis.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`
    })
  } else {
    report += '✅ No performance issues detected\n'
  }

  return report
}

/**
 * Run comprehensive performance optimization
 */
export function runPerformanceOptimization(): void {
  console.group('⚡ Performance Optimization')

  // Optimize images
  optimizeImages()
  console.log('✅ Image optimization applied')

  // Preload critical resources
  preloadCriticalResources()
  console.log('✅ Critical resources preloaded')

  // Monitor Core Web Vitals
  monitorCoreWebVitals()
  console.log('✅ Core Web Vitals monitoring started')

  // Generate and log performance report
  setTimeout(() => {
    const report = generatePerformanceReport()
    console.log(report)
  }, 2000)

  console.groupEnd()
}
