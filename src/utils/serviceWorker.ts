/**
 * Service Worker registration and management
 */

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return false
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('Service Worker registered successfully:', registration.scope)

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, notify user
            console.log('New content available, please refresh')
            showUpdateNotification()
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return false
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
        console.log('Service Worker unregistered')
      })
      .catch((error) => {
        console.error('Service Worker unregistration failed:', error)
      })
  }
}

// Show update notification to user
function showUpdateNotification() {
  // Create a simple notification banner
  const notification = document.createElement('div')
  notification.className = 'update-notification'
  notification.innerHTML = `
    <div class="update-content">
      <span>New content available!</span>
      <button onclick="window.location.reload()" class="update-button">
        Refresh
      </button>
      <button onclick="this.parentElement.parentElement.remove()" class="dismiss-button">
        ×
      </button>
    </div>
  `

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--myblue);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
  `

  const style = document.createElement('style')
  style.textContent = `
    .update-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .update-button {
      background: white;
      color: var(--myblue);
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .dismiss-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(notification)

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 10000)
}

// Check for service worker updates
export function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.update()
      })
      .catch((error) => {
        console.error('Service Worker update check failed:', error)
      })
  }
}

// Get cache usage information
export async function getCacheUsage() {
  if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
    return null
  }

  try {
    const estimate = await navigator.storage.estimate()
    return {
      used: estimate.usage || 0,
      available: estimate.quota || 0,
      percentage:
        estimate.usage && estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0,
    }
  } catch (error) {
    console.error('Failed to get cache usage:', error)
    return null
  }
}
