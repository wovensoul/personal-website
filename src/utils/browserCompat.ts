/**
 * Browser compatibility utilities and feature detection
 */

export class BrowserCompat {
  // Feature detection
  static hasIntersectionObserver(): boolean {
    return 'IntersectionObserver' in window
  }

  static hasGridSupport(): boolean {
    return CSS.supports('display', 'grid')
  }

  static hasSmoothScrollSupport(): boolean {
    return 'scrollBehavior' in document.documentElement.style
  }

  static hasWebPSupport(): boolean {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  // Polyfill loading
  static async loadIntersectionObserverPolyfill(): Promise<void> {
    if (!this.hasIntersectionObserver()) {
      try {
        // Load polyfill dynamically
        // @ts-expect-error - intersection-observer polyfill
        await import('intersection-observer')
        console.log('IntersectionObserver polyfill loaded')
      } catch (error) {
        console.warn('Failed to load IntersectionObserver polyfill:', error)
      }
    }
  }

  // Smooth scroll fallback
  static smoothScrollTo(element: Element, options: ScrollIntoViewOptions = {}): void {
    if (this.hasSmoothScrollSupport()) {
      element.scrollIntoView({ behavior: 'smooth', ...options })
    } else {
      // Fallback for browsers without smooth scroll
      this.animatedScrollTo(element)
    }
  }

  private static animatedScrollTo(element: Element): void {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    const duration = 800
    let start: number | null = null

    function animation(currentTime: number) {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration)
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    function easeInOutQuad(t: number, b: number, c: number, d: number): number {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    requestAnimationFrame(animation)
  }

  // CSS Grid fallback
  static applyGridFallbacks(): void {
    if (!this.hasGridSupport()) {
      document.documentElement.classList.add('no-grid')
    }
  }

  // Initialize all compatibility features
  static async initialize(): Promise<void> {
    // Load polyfills
    await this.loadIntersectionObserverPolyfill()

    // Apply CSS fallbacks
    this.applyGridFallbacks()

    // Add browser classes for CSS targeting
    const html = document.documentElement

    if (!this.hasSmoothScrollSupport()) {
      html.classList.add('no-smooth-scroll')
    }

    if (!this.hasWebPSupport()) {
      html.classList.add('no-webp')
    }
  }
}

// Image format fallback utility
export function getOptimalImageSrc(basePath: string, extension = 'jpg'): string {
  if (BrowserCompat.hasWebPSupport()) {
    return `${basePath}.webp`
  }
  return `${basePath}.${extension}`
}
