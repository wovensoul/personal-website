/**
 * Final validation utilities for task 14 completion
 */

export interface ValidationResults {
  singlePageIntegration: boolean
  anchorLinks: boolean
  smoothScrolling: boolean
  accessibility: boolean
  performance: boolean
  userJourney: boolean
  mobileResponsiveness: boolean
}

/**
 * Validate single-page integration
 */
export function validateSinglePageIntegration(): boolean {
  // Check that all sections are present in App.vue
  const requiredSections = ['hero', 'about', 'projects', 'contact']
  const presentSections = requiredSections.filter((id) => document.getElementById(id))

  // Check that navigation exists
  const navigation = document.querySelector('nav')

  // Check that there's no router-view (confirming single-page structure)
  const routerView = document.querySelector('router-view')

  return presentSections.length === requiredSections.length && !!navigation && !routerView
}

/**
 * Validate all anchor links work correctly
 */
export function validateAnchorLinks(): boolean {
  const sections = ['hero', 'about', 'projects', 'contact']
  let allLinksValid = true

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    if (!section) {
      console.error(`❌ Section ${sectionId} not found`)
      allLinksValid = false
      return
    }

    // Check if section is visible and has content
    const rect = section.getBoundingClientRect()
    if (rect.height === 0) {
      console.warn(`⚠️ Section ${sectionId} has no height`)
    }

    // Check if navigation link exists for this section
    const navLink = document.querySelector(`[href="#${sectionId}"], [data-section="${sectionId}"]`)
    if (!navLink) {
      console.error(`❌ Navigation link for ${sectionId} not found`)
      allLinksValid = false
    }
  })

  return allLinksValid
}

/**
 * Validate smooth scrolling behavior
 */
export function validateSmoothScrolling(): boolean {
  // Check CSS scroll-behavior
  const htmlStyles = window.getComputedStyle(document.documentElement)
  const hasCSSScrollBehavior = htmlStyles.scrollBehavior === 'smooth'

  // Check for JavaScript smooth scrolling implementation
  const hasJSScrolling = typeof window.scrollTo === 'function'

  // Check navigation click handlers
  const navButtons = document.querySelectorAll('nav button, nav a[href^="#"]')
  const hasClickHandlers = navButtons.length > 0

  return hasCSSScrollBehavior && hasJSScrolling && hasClickHandlers
}

/**
 * Validate accessibility compliance
 */
export function validateAccessibility(): boolean {
  let isAccessible = true

  // Check for skip links
  const skipLinks = document.querySelector('a[href="#main-content"], [class*="skip"]')
  if (!skipLinks) {
    console.warn('⚠️ Skip links not found')
    isAccessible = false
  }

  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  if (headings.length === 0) {
    console.error('❌ No headings found')
    isAccessible = false
  }

  // Check for ARIA landmarks
  const landmarks = document.querySelectorAll(
    '[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]',
  )
  if (landmarks.length < 3) {
    console.warn('⚠️ Insufficient ARIA landmarks')
  }

  // Check for alt text on images
  const images = document.querySelectorAll('img:not([alt]):not([aria-hidden="true"])')
  if (images.length > 0) {
    console.warn(`⚠️ ${images.length} images missing alt text`)
  }

  // Check for keyboard accessibility
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea')
  let keyboardAccessible = 0

  interactiveElements.forEach((element) => {
    const tabIndex = element.getAttribute('tabindex')
    if (tabIndex !== '-1') {
      keyboardAccessible++
    }
  })

  if (keyboardAccessible < interactiveElements.length * 0.9) {
    console.warn('⚠️ Some interactive elements may not be keyboard accessible')
  }

  return isAccessible
}

/**
 * Validate performance metrics
 */
export function validatePerformance(): boolean {
  let performanceGood = true

  // Check load time
  const loadTime = performance.timing
    ? performance.timing.loadEventEnd - performance.timing.navigationStart
    : 0

  if (loadTime > 3000) {
    console.warn(`⚠️ Load time is ${loadTime}ms (should be < 3000ms)`)
    performanceGood = false
  }

  // Check for lazy loading
  const images = document.querySelectorAll('img')
  const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-lazy]')

  if (images.length > 0 && lazyImages.length === 0) {
    console.warn('⚠️ No lazy loading detected for images')
  }

  // Check for service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length === 0) {
        console.info('ℹ️ No service worker registered (optional for development)')
      }
    })
  }

  return performanceGood
}

/**
 * Validate complete user journey
 */
export function validateUserJourney(): boolean {
  const sections = ['hero', 'about', 'projects', 'contact']
  let journeyValid = true

  // Check section order
  let previousTop = -1
  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const rect = section.getBoundingClientRect()
      const currentTop = rect.top + window.scrollY

      if (previousTop !== -1 && currentTop <= previousTop) {
        console.error(`❌ Section ${sectionId} is not in correct order`)
        journeyValid = false
      }

      previousTop = currentTop
    }
  })

  // Check that each section has meaningful content
  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const textContent = section.textContent?.trim() || ''
      if (textContent.length < 50) {
        console.warn(`⚠️ Section ${sectionId} may have insufficient content`)
      }
    }
  })

  return journeyValid
}

/**
 * Validate mobile responsiveness
 */
export function validateMobileResponsiveness(): boolean {
  let mobileReady = true

  // Check viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]')
  if (!viewport) {
    console.error('❌ Viewport meta tag missing')
    mobileReady = false
  }

  // Check mobile menu
  const mobileMenu = document.querySelector('[aria-expanded], .mobile-menu')
  if (!mobileMenu) {
    console.warn('⚠️ Mobile menu not detected')
  }

  // Check touch target sizes
  const buttons = document.querySelectorAll('button, a')
  let validTouchTargets = 0

  buttons.forEach((button) => {
    const rect = button.getBoundingClientRect()
    if (rect.width >= 44 && rect.height >= 44) {
      validTouchTargets++
    }
  })

  const touchTargetRatio = buttons.length > 0 ? validTouchTargets / buttons.length : 1
  if (touchTargetRatio < 0.8) {
    console.warn(
      `⚠️ Only ${Math.round(touchTargetRatio * 100)}% of touch targets meet size requirements`,
    )
  }

  return mobileReady
}

/**
 * Run complete final validation
 */
export function runFinalValidation(): ValidationResults {
  console.group('🔍 Final Integration Validation')

  const results: ValidationResults = {
    singlePageIntegration: validateSinglePageIntegration(),
    anchorLinks: validateAnchorLinks(),
    smoothScrolling: validateSmoothScrolling(),
    accessibility: validateAccessibility(),
    performance: validatePerformance(),
    userJourney: validateUserJourney(),
    mobileResponsiveness: validateMobileResponsiveness(),
  }

  // Log results
  console.log('Single-page integration:', results.singlePageIntegration ? '✅' : '❌')
  console.log('Anchor links:', results.anchorLinks ? '✅' : '❌')
  console.log('Smooth scrolling:', results.smoothScrolling ? '✅' : '❌')
  console.log('Accessibility:', results.accessibility ? '✅' : '❌')
  console.log('Performance:', results.performance ? '✅' : '❌')
  console.log('User journey:', results.userJourney ? '✅' : '❌')
  console.log('Mobile responsiveness:', results.mobileResponsiveness ? '✅' : '❌')

  const allPassed = Object.values(results).every((result) => result)

  if (allPassed) {
    console.log('🎉 All validation tests passed!')
  } else {
    console.warn('⚠️ Some validation tests failed. Check the logs above.')
  }

  console.groupEnd()

  return results
}

/**
 * Test navigation by simulating clicks (for automated testing)
 */
export async function testNavigationFlow(): Promise<boolean> {
  const sections = ['hero', 'about', 'projects', 'contact']
  let allNavigationWorks = true

  for (const sectionId of sections) {
    try {
      // Find navigation button for this section
      const navButton = document.querySelector(
        `[onclick*="${sectionId}"], [data-section="${sectionId}"]`,
      ) as HTMLElement

      if (navButton) {
        // Simulate click
        navButton.click()

        // Wait for scroll to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if section is in viewport
        const section = document.getElementById(sectionId)
        if (section) {
          const rect = section.getBoundingClientRect()
          const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight

          if (!isInViewport) {
            console.warn(`⚠️ Navigation to ${sectionId} may not be working correctly`)
            allNavigationWorks = false
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error testing navigation to ${sectionId}:`, error)
      allNavigationWorks = false
    }
  }

  return allNavigationWorks
}

// Auto-run validation in development
if (import.meta.env.DEV) {
  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        runFinalValidation()
      }, 4000) // Run after other tests
    })
  } else {
    setTimeout(() => {
      runFinalValidation()
    }, 4000)
  }
}
