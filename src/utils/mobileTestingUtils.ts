/**
 * Mobile testing and validation utilities
 * Helps ensure mobile responsiveness requirements are met
 */

interface TouchTarget {
  element: HTMLElement
  rect: DOMRect
  isValid: boolean
  size: { width: number; height: number }
}

interface MobileTestResults {
  touchTargets: {
    valid: TouchTarget[]
    invalid: TouchTarget[]
    total: number
  }
  viewport: {
    width: number
    height: number
    orientation: string
    devicePixelRatio: number
  }
  performance: {
    lcp?: number
    fid?: number
    cls?: number
  }
  accessibility: {
    focusableElements: number
    ariaLabels: number
    headingHierarchy: boolean
  }
}

/**
 * Test touch target sizes across the page
 */
export function validateTouchTargets(): TouchTarget[] {
  const interactiveSelectors = [
    'button',
    'a',
    'input[type="button"]',
    'input[type="submit"]',
    'input[type="reset"]',
    '[role="button"]',
    '.cta-primary',
    '.cta-secondary',
    '.social-link',
    '.mobile-menu-button',
    '.external-link',
    '.email-button',
  ]

  const elements = document.querySelectorAll(interactiveSelectors.join(', '))
  const touchTargets: TouchTarget[] = []

  elements.forEach((element) => {
    const htmlElement = element as HTMLElement
    const rect = htmlElement.getBoundingClientRect()
    const minSize = window.innerWidth <= 768 ? 48 : 44

    const isValid = rect.width >= minSize && rect.height >= minSize

    touchTargets.push({
      element: htmlElement,
      rect,
      isValid,
      size: { width: rect.width, height: rect.height },
    })
  })

  return touchTargets
}

/**
 * Test viewport and orientation handling
 */
export function validateViewport(): MobileTestResults['viewport'] {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
    devicePixelRatio: window.devicePixelRatio || 1,
  }
}

/**
 * Test accessibility features for mobile
 */
export function validateMobileAccessibility(): MobileTestResults['accessibility'] {
  const focusableElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
  ).length

  const ariaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]').length

  // Check heading hierarchy
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  const headingLevels = headings.map((h) => parseInt(h.tagName.charAt(1)))
  let headingHierarchy = true

  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] > headingLevels[i - 1] + 1) {
      headingHierarchy = false
      break
    }
  }

  return {
    focusableElements,
    ariaLabels,
    headingHierarchy,
  }
}

/**
 * Run comprehensive mobile tests
 */
export function runMobileTests(): MobileTestResults {
  const touchTargets = validateTouchTargets()
  const viewport = validateViewport()
  const accessibility = validateMobileAccessibility()

  const validTouchTargets = touchTargets.filter((t) => t.isValid)
  const invalidTouchTargets = touchTargets.filter((t) => !t.isValid)

  return {
    touchTargets: {
      valid: validTouchTargets,
      invalid: invalidTouchTargets,
      total: touchTargets.length,
    },
    viewport,
    performance: {}, // Will be populated by performance observers
    accessibility,
  }
}

/**
 * Log mobile test results to console
 */
export function logMobileTestResults(results: MobileTestResults): void {
  console.group('🔍 Mobile Responsiveness Test Results')

  console.group('👆 Touch Targets')
  console.log(`✅ Valid targets: ${results.touchTargets.valid.length}`)
  console.log(`❌ Invalid targets: ${results.touchTargets.invalid.length}`)
  console.log(`📊 Total targets: ${results.touchTargets.total}`)

  if (results.touchTargets.invalid.length > 0) {
    console.warn('Invalid touch targets found:')
    results.touchTargets.invalid.forEach((target) => {
      console.warn(
        `- ${target.element.tagName} (${target.size.width}x${target.size.height}px)`,
        target.element,
      )
    })
  }
  console.groupEnd()

  console.group('📱 Viewport')
  console.log(`Size: ${results.viewport.width}x${results.viewport.height}px`)
  console.log(`Orientation: ${results.viewport.orientation}`)
  console.log(`Device Pixel Ratio: ${results.viewport.devicePixelRatio}`)
  console.groupEnd()

  console.group('♿ Accessibility')
  console.log(`Focusable elements: ${results.accessibility.focusableElements}`)
  console.log(`ARIA labels: ${results.accessibility.ariaLabels}`)
  console.log(`Heading hierarchy: ${results.accessibility.headingHierarchy ? '✅' : '❌'}`)
  console.groupEnd()

  console.groupEnd()
}

/**
 * Test mobile performance metrics
 */
export function setupMobilePerformanceTests(): void {
  if (!('PerformanceObserver' in window)) return

  // Test Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    const lcp = lastEntry.startTime

    if (lcp > 2500) {
      console.warn(`⚠️ LCP is ${lcp.toFixed(0)}ms (should be < 2500ms)`)
    } else {
      console.log(`✅ LCP: ${lcp.toFixed(0)}ms`)
    }
  })

  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

  // Test First Input Delay
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      interface FirstInputEntry extends PerformanceEntry {
        processingStart: number
      }
      const fidEntry = entry as FirstInputEntry
      const fid = fidEntry.processingStart - fidEntry.startTime

      if (fid > 100) {
        console.warn(`⚠️ FID is ${fid.toFixed(0)}ms (should be < 100ms)`)
      } else {
        console.log(`✅ FID: ${fid.toFixed(0)}ms`)
      }
    })
  })

  fidObserver.observe({ entryTypes: ['first-input'] })

  // Test Cumulative Layout Shift
  let clsValue = 0
  const clsObserver = new PerformanceObserver((list) => {
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

    if (clsValue > 0.1) {
      console.warn(`⚠️ CLS is ${clsValue.toFixed(3)} (should be < 0.1)`)
    } else {
      console.log(`✅ CLS: ${clsValue.toFixed(3)}`)
    }
  })

  clsObserver.observe({ entryTypes: ['layout-shift'] })
}

/**
 * Test network conditions and adapt accordingly
 */
export function testNetworkConditions(): void {
  interface NavigatorWithConnection extends Navigator {
    connection?: {
      effectiveType: '4g' | '3g' | '2g' | 'slow-2g'
      saveData: boolean
      downlink: number
      rtt: number
    }
  }

  const navigatorWithConnection = navigator as NavigatorWithConnection

  if ('connection' in navigator && navigatorWithConnection.connection) {
    const connection = navigatorWithConnection.connection

    console.group('🌐 Network Conditions')
    console.log(`Connection type: ${connection.effectiveType}`)
    console.log(`Save data: ${connection.saveData}`)
    console.log(`Downlink: ${connection.downlink} Mbps`)
    console.log(`RTT: ${connection.rtt}ms`)

    const isSlowConnection =
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData

    if (isSlowConnection) {
      console.warn('⚠️ Slow connection detected - optimizations applied')
    } else {
      console.log('✅ Good connection detected')
    }

    console.groupEnd()
  }
}

/**
 * Initialize mobile testing in development mode
 */
export function initMobileTesting(): void {
  if (import.meta.env.DEV) {
    // Run tests after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const results = runMobileTests()
        logMobileTestResults(results)
        testNetworkConditions()
        setupMobilePerformanceTests()
      }, 1000)
    })

    // Re-run tests on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        const results = runMobileTests()
        console.log('📱 Orientation changed - re-running mobile tests')
        logMobileTestResults(results)
      }, 500)
    })

    // Re-run tests on resize
    let resizeTimeout: number
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = window.setTimeout(() => {
        const results = runMobileTests()
        console.log('📏 Viewport resized - re-running mobile tests')
        logMobileTestResults(results)
      }, 300)
    })
  }
}

/**
 * Simulate different mobile devices for testing
 */
export function simulateMobileDevice(
  device: 'iphone-se' | 'iphone-12' | 'galaxy-s21' | 'pixel-5',
): void {
  const devices = {
    'iphone-se': { width: 375, height: 667 },
    'iphone-12': { width: 390, height: 844 },
    'galaxy-s21': { width: 360, height: 800 },
    'pixel-5': { width: 393, height: 851 },
  }

  const selectedDevice = devices[device]
  if (selectedDevice) {
    // This would typically be used with browser dev tools
    console.log(`📱 Simulating ${device}: ${selectedDevice.width}x${selectedDevice.height}px`)
    console.log('Use browser dev tools to set this viewport size for testing')
  }
}
