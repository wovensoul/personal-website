/**
 * Accessibility utilities for keyboard navigation and focus management
 */

/**
 * Trap focus within a container element
 * @param container - The container element to trap focus within
 * @returns Function to remove the focus trap
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container)

  if (focusableElements.length === 0) return () => {}

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  // Focus the first element
  firstElement.focus()

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Get all focusable elements within a container
 * @param container - The container element to search within
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ')

  const elements = container.querySelectorAll(focusableSelectors) as NodeListOf<HTMLElement>
  return Array.from(elements).filter((element) => {
    return element.offsetWidth > 0 && element.offsetHeight > 0 && !element.hidden
  })
}

/**
 * Manage focus for single-page navigation
 * @param targetId - The ID of the target section
 * @param announceToScreenReader - Whether to announce the navigation to screen readers
 */
export function manageFocusForNavigation(
  targetId: string,
  announceToScreenReader: boolean = true,
): void {
  const targetElement = document.getElementById(targetId)
  if (!targetElement) return

  // Make the target element focusable if it isn't already
  if (!targetElement.hasAttribute('tabindex')) {
    targetElement.setAttribute('tabindex', '-1')
  }

  // Focus the target element after scrolling
  setTimeout(() => {
    targetElement.focus()

    // Announce to screen readers if requested
    if (announceToScreenReader) {
      announceToScreenReaders(`Navigated to ${getReadableTitle(targetId)} section`)
    }
  }, 300) // Allow time for smooth scrolling
}

/**
 * Announce text to screen readers
 * @param message - The message to announce
 * @param priority - The priority level (polite or assertive)
 */
export function announceToScreenReaders(
  message: string,
  priority: 'polite' | 'assertive' = 'polite',
): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove the announcement after it's been read
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Convert section ID to readable title
 * @param sectionId - The section ID
 * @returns Human-readable section title
 */
function getReadableTitle(sectionId: string): string {
  const titles: Record<string, string> = {
    hero: 'Hero',
    about: 'About Me',
    projects: 'Projects',
    contact: 'Contact',
  }

  return titles[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
}

/**
 * Check if user prefers reduced motion
 * @returns True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if user prefers high contrast
 * @returns True if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Add keyboard navigation support to an element
 * @param element - The element to add keyboard support to
 * @param callback - Function to call when Enter or Space is pressed
 */
export function addKeyboardSupport(element: HTMLElement, callback: () => void): void {
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  })
}

/**
 * Ensure minimum touch target size for mobile accessibility
 * @param element - The element to check and adjust
 * @param minSize - Minimum size in pixels (default: 44px)
 */
export function ensureMinimumTouchTarget(element: HTMLElement, minSize: number = 44): void {
  const rect = element.getBoundingClientRect()

  if (rect.width < minSize || rect.height < minSize) {
    element.style.minWidth = `${minSize}px`
    element.style.minHeight = `${minSize}px`
    element.style.display = element.style.display || 'inline-flex'
    element.style.alignItems = 'center'
    element.style.justifyContent = 'center'
  }
}

/**
 * Create a live region for dynamic content announcements
 * @param id - Unique ID for the live region
 * @param priority - The aria-live priority level
 * @returns The created live region element
 */
export function createLiveRegion(
  id: string,
  priority: 'polite' | 'assertive' = 'polite',
): HTMLElement {
  let liveRegion = document.getElementById(id)

  if (!liveRegion) {
    liveRegion = document.createElement('div')
    liveRegion.id = id
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    document.body.appendChild(liveRegion)
  }

  return liveRegion
}

/**
 * Update live region content
 * @param id - ID of the live region
 * @param message - Message to announce
 */
export function updateLiveRegion(id: string, message: string): void {
  const liveRegion = document.getElementById(id)
  if (liveRegion) {
    liveRegion.textContent = message
  }
}
