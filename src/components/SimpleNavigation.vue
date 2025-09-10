<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('hero')

const currentTheme = ref('light')

// Theme functionality
function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  localStorage.setItem('theme', currentTheme.value)
}

// Navigation sections
const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

// Simple scroll function
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (!element) return

  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + window.scrollY
  const navHeight = 80
  const targetPosition = Math.max(0, absoluteElementTop - navHeight)

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  })

  activeSection.value = sectionId
}

// Update active section on scroll
function updateActiveSection() {
  const scrollPosition = window.scrollY + 100

  for (const section of sections) {
    const element = document.getElementById(section.id)
    if (!element) continue

    const rect = element.getBoundingClientRect()
    const top = rect.top + window.scrollY

    if (scrollPosition >= top && scrollPosition < top + element.offsetHeight) {
      activeSection.value = section.id
      break
    }
  }
}

function handleScroll() {
  updateActiveSection()
}

onMounted(() => {
  // Initialize theme
  const savedTheme = localStorage.getItem('theme') || 'light'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)

  // Add scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav class="nav-container">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-center h-16">
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="scrollToSection(section.id)"
            :class="[
              'nav-btn',
              activeSection === section.id ? 'nav-btn-active' : 'nav-btn-inactive',
            ]"
          >
            {{ section.label }}
          </button>

          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" class="nav-link">
            Resume
          </a>

          <button @click="toggleTheme" class="nav-btn nav-btn-inactive">
            {{ currentTheme === 'light' ? 'Dark' : 'Light' }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Navigation container */
.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-primary, #e5e7eb);

  /* Light mode */
  background: rgba(255, 255, 255, 0.95);
}

/* Hide navbar completely on mobile */
@media (max-width: 767px) {
  .nav-container {
    display: none;
  }
}

/* Dark mode navigation */
[data-theme='dark'] .nav-container {
  background: rgba(0, 0, 0, 0.95);
  border-bottom-color: #374151;
}

/* Navigation buttons */
.nav-btn {
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Light mode button styles */
.nav-btn-inactive {
  color: #1f2937;
  background: transparent;
}

.nav-btn-inactive:hover {
  color: #2563eb;
  background: #f3f4f6;
}

.nav-btn-active {
  color: #2563eb;
  background: #dbeafe;
}

/* Navigation link (Resume) */
.nav-link {
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 700;
  background: transparent;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  /* Light mode - same as inactive buttons */
  color: #1f2937;
}

.nav-link:hover {
  color: #2563eb;
  background: #f3f4f6;
}

.nav-link:visited {
  color: #1f2937;
}

.nav-link:visited:hover {
  color: #2563eb;
}

/* Dark mode button styles */
[data-theme='dark'] .nav-btn-inactive {
  color: #9ca3af;
  background: transparent;
}

[data-theme='dark'] .nav-btn-inactive:hover {
  color: #f3f4f6;
  background: #374151;
}

[data-theme='dark'] .nav-btn-active {
  color: #f3f4f6;
  background: #374151;
}

/* Dark mode resume link */
[data-theme='dark'] .nav-link {
  color: #9ca3af;
}

[data-theme='dark'] .nav-link:hover {
  color: #f3f4f6;
  background: #374151;
}

[data-theme='dark'] .nav-link:visited {
  color: #9ca3af;
}

[data-theme='dark'] .nav-link:visited:hover {
  color: #f3f4f6;
}

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

[data-theme='dark'] button:focus-visible,
[data-theme='dark'] a:focus-visible {
  outline-color: #60a5fa;
}
</style>
