/**
 * Lazy loading utilities for images and components
 */

// Image lazy loading with Intersection Observer
export function setupImageLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers - load all images immediately
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach((img) => {
      const imgElement = img as HTMLImageElement
      if (imgElement.dataset.src) {
        imgElement.src = imgElement.dataset.src
        imgElement.removeAttribute('data-src')
      }
    })
    return
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          loadImage(img)
          observer.unobserve(img)
        }
      })
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    },
  )

  // Observe all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]')
  lazyImages.forEach((img) => imageObserver.observe(img))
}

// Load individual image with progressive enhancement
function loadImage(img: HTMLImageElement) {
  const src = img.dataset.src
  if (!src) return

  // Create a new image to preload
  const imageLoader = new Image()

  imageLoader.onload = () => {
    // Image loaded successfully
    img.src = src
    img.classList.add('loaded')
    img.removeAttribute('data-src')
  }

  imageLoader.onerror = () => {
    // Handle image load error
    img.classList.add('error')
    img.alt = 'Image failed to load'
  }

  imageLoader.src = src
}

// Section lazy loading for non-critical content
export function setupSectionLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    return
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target as HTMLElement
          section.classList.add('loaded')

          // Trigger any lazy-loaded content within the section
          const lazyContent = section.querySelectorAll('[data-lazy]')
          lazyContent.forEach((element) => {
            element.classList.add('load-content')
          })
        }
      })
    },
    {
      rootMargin: '100px 0px',
      threshold: 0.1,
    },
  )

  // Observe sections marked for lazy loading
  const lazySections = document.querySelectorAll('[data-lazy-section]')
  lazySections.forEach((section) => sectionObserver.observe(section))
}

// Progressive image loading with blur-up effect
export function createProgressiveImage(
  src: string,
  placeholder: string,
  alt: string = '',
): HTMLImageElement {
  const img = document.createElement('img')

  // Set up placeholder
  img.src = placeholder
  img.alt = alt
  img.classList.add('progressive-image', 'loading')

  // Set up data attribute for lazy loading
  img.dataset.src = src

  return img
}

// Utility to generate placeholder images
export function generatePlaceholder(
  width: number,
  height: number,
  color: string = '#f3f4f6',
): string {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `)}`
}

// Preload critical images
export function preloadCriticalImages(urls: string[]) {
  urls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}
