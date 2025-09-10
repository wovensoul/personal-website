/**
 * Mobile viewport utilities for handling viewport height issues
 * Addresses iOS Safari and Android Chrome viewport inconsistencies
 */

export function setViewportHeight(): void {
  // Set CSS custom property for viewport height
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

export function handleOrientationChange(): void {
  // Handle orientation changes with a delay to ensure proper viewport calculation
  setTimeout(() => {
    setViewportHeight()
  }, 100)
}

export function initMobileViewport(): void {
  // Initial setup
  setViewportHeight()

  // Listen for resize events
  window.addEventListener('resize', setViewportHeight, { passive: true })

  // Listen for orientation changes
  window.addEventListener('orientationchange', handleOrientationChange, { passive: true })

  // Handle visual viewport API if available (for better mobile support)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportHeight, { passive: true })
  }
}

export function cleanupMobileViewport(): void {
  window.removeEventListener('resize', setViewportHeight)
  window.removeEventListener('orientationchange', handleOrientationChange)

  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', setViewportHeight)
  }
}

/**
 * Detect if the device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detect if the device is iOS
 */
export function isIOSDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * Detect if the device is Android
 */
export function isAndroidDevice(): boolean {
  return /Android/.test(navigator.userAgent)
}

/**
 * Get safe area insets for devices with notches
 */
export function getSafeAreaInsets(): {
  top: number
  right: number
  bottom: number
  left: number
} {
  const style = getComputedStyle(document.documentElement)

  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0', 10),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0', 10),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0', 10),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0', 10),
  }
}

/**
 * Optimize touch scrolling for iOS
 */
export function optimizeTouchScrolling(): void {
  if (isIOSDevice()) {
    interface CSSStyleDeclarationWithWebkit extends CSSStyleDeclaration {
      webkitOverflowScrolling?: string
    }
    const bodyStyle = document.body.style as CSSStyleDeclarationWithWebkit
    bodyStyle.webkitOverflowScrolling = 'touch'
  }
}

/**
 * Prevent zoom on input focus (iOS Safari)
 */
export function preventInputZoom(): void {
  if (isIOSDevice()) {
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach((input) => {
      const element = input as HTMLInputElement
      if (element.style.fontSize === '' || parseFloat(element.style.fontSize) < 16) {
        element.style.fontSize = '16px'
      }
    })
  }
}
