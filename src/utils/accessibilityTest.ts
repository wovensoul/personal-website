/**
 * Accessibility testing utilities
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  element: HTMLElement
  message: string
  rule: string
}

/**
 * Run basic accessibility checks on the page
 * @returns Array of accessibility issues found
 */
export function runAccessibilityAudit(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // Check for missing alt text on images
  const images = document.querySelectorAll('img')
  images.forEach((img) => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push({
        type: 'error',
        element: img,
        message: 'Image missing alt text',
        rule: 'WCAG 1.1.1 - Non-text Content',
      })
    }
  })

  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let previousLevel = 0
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1))
    if (level > previousLevel + 1) {
      issues.push({
        type: 'warning',
        element: heading as HTMLElement,
        message: `Heading level skipped from h${previousLevel} to h${level}`,
        rule: 'WCAG 1.3.1 - Info and Relationships',
      })
    }
    previousLevel = level
  })

  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button')
  buttons.forEach((button) => {
    const hasText = button.textContent?.trim()
    const hasAriaLabel = button.getAttribute('aria-label')
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby')

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'error',
        element: button,
        message: 'Button missing accessible name',
        rule: 'WCAG 4.1.2 - Name, Role, Value',
      })
    }
  })

  // Check for links without accessible names
  const links = document.querySelectorAll('a')
  links.forEach((link) => {
    const hasText = link.textContent?.trim()
    const hasAriaLabel = link.getAttribute('aria-label')
    const hasAriaLabelledBy = link.getAttribute('aria-labelledby')

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'error',
        element: link,
        message: 'Link missing accessible name',
        rule: 'WCAG 2.4.4 - Link Purpose',
      })
    }
  })

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input, select, textarea')
  inputs.forEach((input) => {
    const hasLabel = document.querySelector(`label[for="${input.id}"]`)
    const hasAriaLabel = input.getAttribute('aria-label')
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby')

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'error',
        element: input as HTMLElement,
        message: 'Form input missing label',
        rule: 'WCAG 1.3.1 - Info and Relationships',
      })
    }
  })

  // Check color contrast (basic check)
  checkColorContrast(issues)

  // Check for keyboard accessibility
  checkKeyboardAccessibility(issues)

  return issues
}

/**
 * Basic color contrast check
 * @param issues - Array to add issues to
 */
function checkColorContrast(issues: AccessibilityIssue[]): void {
  const elements = document.querySelectorAll('*')

  elements.forEach((element) => {
    const styles = window.getComputedStyle(element)
    const color = styles.color
    const backgroundColor = styles.backgroundColor

    // Skip elements with transparent backgrounds
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      return
    }

    // This is a simplified check - in a real implementation,
    // you would calculate the actual contrast ratio
    if (color === backgroundColor) {
      issues.push({
        type: 'error',
        element: element as HTMLElement,
        message: 'Insufficient color contrast',
        rule: 'WCAG 1.4.3 - Contrast (Minimum)',
      })
    }
  })
}

/**
 * Check keyboard accessibility
 * @param issues - Array to add issues to
 */
function checkKeyboardAccessibility(issues: AccessibilityIssue[]): void {
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]',
  )

  interactiveElements.forEach((element) => {
    const tabIndex = element.getAttribute('tabindex')

    // Check for positive tabindex values (anti-pattern)
    if (tabIndex && parseInt(tabIndex) > 0) {
      issues.push({
        type: 'warning',
        element: element as HTMLElement,
        message: 'Positive tabindex values should be avoided',
        rule: 'WCAG 2.4.3 - Focus Order',
      })
    }

    // Check if interactive elements are keyboard accessible
    const tagName = element.tagName.toLowerCase()
    if (tagName === 'div' || tagName === 'span') {
      const hasRole = element.getAttribute('role')
      const hasTabIndex = element.hasAttribute('tabindex')

      if ((hasRole === 'button' || hasRole === 'link') && !hasTabIndex) {
        issues.push({
          type: 'warning',
          element: element as HTMLElement,
          message: 'Interactive element may not be keyboard accessible',
          rule: 'WCAG 2.1.1 - Keyboard',
        })
      }
    }
  })
}

/**
 * Check if an element meets minimum touch target size
 * @param element - Element to check
 * @returns True if element meets minimum size requirements
 */
export function checkTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  const minSize = 44 // 44px minimum as per WCAG guidelines

  return rect.width >= minSize && rect.height >= minSize
}

/**
 * Generate accessibility report
 * @returns Formatted accessibility report
 */
export function generateAccessibilityReport(): string {
  const issues = runAccessibilityAudit()

  if (issues.length === 0) {
    return 'No accessibility issues found! ✅'
  }

  const errorCount = issues.filter((issue) => issue.type === 'error').length
  const warningCount = issues.filter((issue) => issue.type === 'warning').length
  const infoCount = issues.filter((issue) => issue.type === 'info').length

  let report = `Accessibility Report:\n`
  report += `Errors: ${errorCount}\n`
  report += `Warnings: ${warningCount}\n`
  report += `Info: ${infoCount}\n\n`

  issues.forEach((issue, index) => {
    report += `${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`
    report += `   Rule: ${issue.rule}\n`
    report += `   Element: ${issue.element.tagName.toLowerCase()}`
    if (issue.element.id) report += `#${issue.element.id}`
    if (issue.element.className) report += `.${issue.element.className.split(' ').join('.')}`
    report += '\n\n'
  })

  return report
}

/**
 * Log accessibility report to console
 */
export function logAccessibilityReport(): void {
  console.log(generateAccessibilityReport())
}
