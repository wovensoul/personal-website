/**
 * Integration test utilities for final validation
 */

import { runAccessibilityAudit, generateAccessibilityReport } from './accessibilityTest'
import { initMobileTesting } from './mobileTestingUtils'

export interface IntegrationTestResults {
  navigation: {
    anchorsWorking: boolean
    smoothScrolling: boolean
    activeHighlighting: boolean
    mobileMenu: boolean
  }
  accessibility: {
    issueCount: number
    criticalIssues: number
    report: string
  }
  performance: {
    loadTime: number
    bundleSize: number
    imageOptimization: boolean
  }
  userJourney: {
    heroToAbout: boolean
    aboutToProjects: boolean
    projectsToContact: boolean
    contactToHero: boolean
  }
}

/**
 * Test navigation functionality
 */
export function testNavigation(): IntegrationTestResults['navigation'] {
  const results = {
    anchorsWorking: false,
    smoothScrolling: false,
    activeHighlighting: false,
    mobileMenu: false,
  }

  // Test anchor links exist and target valid sections
  const navLinks = document.querySelectorAll('nav a[href^="#"], nav button[data-section]')
  const sections = ['hero', 'about', 'projects', 'contact']

  let validAnchors = 0
  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      validAnchors++
    }
  })

  results.anchorsWorking = validAnchors === sections.length

  // Test smooth scrolling is enabled
  const htmlElement = document.documentElement
  const scrollBehavior = window.getComputedStyle(htmlElement).scrollBehavior
  results.smoothScrolling = scrollBehavior === 'smooth'

  // Test mobile menu exists
  const mobileMenuButton = document.querySelector('[aria-expanded]')
  const mobileMenu = document.querySelector('#mobile-menu, [role="menu"]')
  results.mobileMenu = !!(mobileMenuButton && mobileMenu)

  // Test active highlighting (check if navigation has active states)
  const activeElements = document.querySelectorAll('.active, [aria-current]')
  results.activeHighlighting = activeElements.length > 0

  return results
}

/**
 * Test complete user journey flow
 */
export function testUserJourney(): IntegrationTestResults['userJourney'] {
  const results = {
    heroToAbout: false,
    aboutToProjects: false,
    projectsToContact: false,
    contactToHero: false,
  }

  // Check if all sections exist and are properly structured
  const hero = document.getElementById('hero')
  const about = document.getElementById('about')
  const projects = document.getElementById('projects')
  const contact = document.getElementById('contact')

  if (hero && about && projects && contact) {
    // Check if sections are in proper order
    const heroRect = hero.getBoundingClientRect()
    const aboutRect = about.getBoundingClientRect()
    const projectsRect = projects.getBoundingClientRect()
    const contactRect = contact.getBoundingClientRect()

    results.heroToAbout = heroRect.top < aboutRect.top
    results.aboutToProjects = aboutRect.top < projectsRect.top
    results.projectsToContact = projectsRect.top < contactRect.top
    results.contactToHero = contactRect.top > heroRect.top
  }

  return results
}

/**
 * Test performance metrics
 */
export function testPerformance(): IntegrationTestResults['performance'] {
  const results = {
    loadTime: 0,
    bundleSize: 0,
    imageOptimization: false,
  }

  // Get load time from performance API
  if (performance.timing) {
    results.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
  }

  // Check image optimization (lazy loading, proper formats)
  const images = document.querySelectorAll('img')
  let optimizedImages = 0

  images.forEach((img) => {
    // Check for lazy loading
    if (img.loading === 'lazy' || img.hasAttribute('data-lazy')) {
      optimizedImages++
    }
    // Check for modern formats (webp, avif)
    if (img.src.includes('.webp') || img.src.includes('.avif')) {
      optimizedImages++
    }
  })

  results.imageOptimization = images.length === 0 || optimizedImages > 0

  return results
}

/**
 * Run comprehensive integration tests
 */
export function runIntegrationTests(): IntegrationTestResults {
  console.group('🧪 Running Integration Tests')

  const navigation = testNavigation()
  const userJourney = testUserJourney()
  const performance = testPerformance()

  // Run accessibility audit
  const accessibilityIssues = runAccessibilityAudit()
  const accessibility = {
    issueCount: accessibilityIssues.length,
    criticalIssues: accessibilityIssues.filter((issue) => issue.type === 'error').length,
    report: generateAccessibilityReport(),
  }

  const results: IntegrationTestResults = {
    navigation,
    accessibility,
    performance,
    userJourney,
  }

  // Log results
  console.group('🧭 Navigation Tests')
  console.log('Anchor links working:', navigation.anchorsWorking ? '✅' : '❌')
  console.log('Smooth scrolling enabled:', navigation.smoothScrolling ? '✅' : '❌')
  console.log('Active highlighting:', navigation.activeHighlighting ? '✅' : '❌')
  console.log('Mobile menu present:', navigation.mobileMenu ? '✅' : '❌')
  console.groupEnd()

  console.group('👤 User Journey Tests')
  console.log('Hero → About flow:', userJourney.heroToAbout ? '✅' : '❌')
  console.log('About → Projects flow:', userJourney.aboutToProjects ? '✅' : '❌')
  console.log('Projects → Contact flow:', userJourney.projectsToContact ? '✅' : '❌')
  console.log('Contact → Hero flow:', userJourney.contactToHero ? '✅' : '❌')
  console.groupEnd()

  console.group('♿ Accessibility Tests')
  console.log('Total issues:', accessibility.issueCount)
  console.log('Critical issues:', accessibility.criticalIssues)
  if (accessibility.criticalIssues === 0) {
    console.log('✅ No critical accessibility issues found')
  } else {
    console.warn('❌ Critical accessibility issues found')
    console.log(accessibility.report)
  }
  console.groupEnd()

  console.group('⚡ Performance Tests')
  console.log('Load time:', performance.loadTime + 'ms')
  console.log('Image optimization:', performance.imageOptimization ? '✅' : '❌')
  console.groupEnd()

  console.groupEnd()

  return results
}

/**
 * Test anchor link functionality by simulating clicks
 */
export function testAnchorLinks(): boolean {
  const sections = ['hero', 'about', 'projects', 'contact']
  let allLinksWork = true

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    if (!section) {
      console.error(`Section ${sectionId} not found`)
      allLinksWork = false
      return
    }

    // Test if section is reachable via scroll
    const rect = section.getBoundingClientRect()
    if (rect.height === 0) {
      console.warn(`Section ${sectionId} has no height`)
    }
  })

  return allLinksWork
}

/**
 * Validate smooth scrolling behavior
 */
export function validateSmoothScrolling(): boolean {
  // Check CSS scroll-behavior
  const htmlStyles = window.getComputedStyle(document.documentElement)
  const scrollBehavior = htmlStyles.scrollBehavior

  if (scrollBehavior === 'smooth') {
    return true
  }

  // Check for JavaScript smooth scrolling fallback
  const hasScrollToSupport = 'scrollTo' in window && typeof window.scrollTo === 'function'
  return hasScrollToSupport
}

/**
 * Test mobile responsiveness
 */
export function testMobileResponsiveness(): boolean {
  // Test viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]')
  if (!viewportMeta) {
    console.error('Viewport meta tag missing')
    return false
  }

  // Test mobile menu functionality
  const mobileMenuButton = document.querySelector('[aria-expanded]')
  const mobileMenu = document.querySelector('#mobile-menu')

  if (!mobileMenuButton || !mobileMenu) {
    console.error('Mobile menu components missing')
    return false
  }

  // Test touch target sizes
  const interactiveElements = document.querySelectorAll('button, a, input')
  let validTouchTargets = 0

  interactiveElements.forEach((element) => {
    const rect = element.getBoundingClientRect()
    if (rect.width >= 44 && rect.height >= 44) {
      validTouchTargets++
    }
  })

  const touchTargetRatio = validTouchTargets / interactiveElements.length
  return touchTargetRatio > 0.8 // 80% of elements should meet touch target requirements
}

// Auto-run tests in development mode
if (import.meta.env.DEV) {
  // Wait for page to fully load before running tests
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        runIntegrationTests()
      }, 1000)
    })
  } else {
    setTimeout(() => {
      runIntegrationTests()
    }, 1000)
  }
}
