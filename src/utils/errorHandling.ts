/**
 * Error handling utilities for graceful degradation
 */

export interface ErrorInfo {
  componentName?: string
  propsData?: any
  message: string
  stack?: string
}

export class ErrorBoundary {
  private static instance: ErrorBoundary
  private errorCallbacks: Array<(error: Error, errorInfo: ErrorInfo) => void> = []

  static getInstance(): ErrorBoundary {
    if (!ErrorBoundary.instance) {
      ErrorBoundary.instance = new ErrorBoundary()
    }
    return ErrorBoundary.instance
  }

  onError(callback: (error: Error, errorInfo: ErrorInfo) => void): void {
    this.errorCallbacks.push(callback)
  }

  handleError(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    console.error('Vue Component Error:', error, errorInfo)

    // Call registered error callbacks
    this.errorCallbacks.forEach((callback) => {
      try {
        callback(error, errorInfo)
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError)
      }
    })
  }

  // Fallback content for failed components
  static getFallbackContent(componentName: string): string {
    const fallbacks: Record<string, string> = {
      HeroSection: '<div class="hero-fallback"><h1>Jeffrey Chen</h1><p>Software Engineer</p></div>',
      AboutSection:
        '<div class="about-fallback"><h2>About</h2><p>Content temporarily unavailable.</p></div>',
      ProjectsSection:
        '<div class="projects-fallback"><h2>Projects</h2><p>Projects loading...</p></div>',
      ContactSection:
        '<div class="contact-fallback"><h2>Contact</h2><p>Email: contact@jeffreychen.work</p></div>',
      SimpleNavigation:
        '<nav class="nav-fallback"><a href="#hero">Home</a> | <a href="#about">About</a> | <a href="#projects">Projects</a> | <a href="#contact">Contact</a></nav>',
    }

    return (
      fallbacks[componentName] ||
      '<div class="component-fallback">Content temporarily unavailable</div>'
    )
  }
}

// Network error handling
export class NetworkErrorHandler {
  private static retryAttempts = 3
  private static retryDelay = 1000

  static async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    attempts = this.retryAttempts,
  ): Promise<Response> {
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return response
    } catch (error) {
      if (attempts > 1) {
        await this.delay(this.retryDelay)
        return this.fetchWithRetry(url, options, attempts - 1)
      }
      throw error
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static handleImageError(img: HTMLImageElement, fallbackSrc?: string): void {
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc
    } else {
      // Create a placeholder
      img.style.backgroundColor = '#f3f4f6'
      img.style.display = 'flex'
      img.style.alignItems = 'center'
      img.style.justifyContent = 'center'
      img.alt = 'Image unavailable'
    }
  }
}
