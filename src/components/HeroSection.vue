<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  showSnow: boolean
}

interface Emits {
  (e: 'toggleSnow'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isVisible = ref(false)
const currentTheme = ref('light')

// Theme functionality
function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  localStorage.setItem('theme', currentTheme.value)
}

// Simple navigation function
function handleNavigate(sectionId: string) {
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
}

function toggleSnow(event?: Event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  console.log('🔥 SNOW BUTTON CLICKED! Current state:', props.showSnow)
  emit('toggleSnow')
  console.log('✅ Snow toggle emitted')
}

onMounted(() => {
  // Initialize theme
  const savedTheme = localStorage.getItem('theme') || 'light'
  currentTheme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)

  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <section
    id="hero"
    class="hero-gradient min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
    role="banner"
    aria-labelledby="hero-heading"
  >
    <div class="max-w-4xl mx-auto text-center w-full">
      <div class="hero-content" :class="{ 'animate-fade-in': isVisible }">
        <h1
          id="hero-heading"
          class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-[var(--textcolor)] uppercase tracking-wide"
        >
          Jeffrey Chen
        </h1>

        <p class="text-xl sm:text-2xl mb-4 text-[var(--myblue)] font-medium">
          Software Engineer & Creative Problem Solver
        </p>

        <p class="text-lg sm:text-xl mb-8 text-[var(--mygray)] max-w-2xl mx-auto leading-relaxed">
          Building meaningful digital experiences with modern web technologies
        </p>

        <!-- Desktop Buttons -->
        <div class="hidden sm:flex flex-row gap-4 justify-center items-center">
          <button
            @click="handleNavigate('projects')"
            class="px-8 py-4 bg-[var(--myblue)] text-white rounded-lg font-medium text-lg hover:opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--myblue)] focus:ring-offset-2"
            aria-label="View Jeffrey's portfolio projects"
          >
            View My Work
          </button>

          <button
            @click="handleNavigate('contact')"
            class="px-8 py-4 border-2 border-[var(--myblue)] text-[var(--myblue)] rounded-lg font-medium text-lg hover:bg-[var(--myblue)] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--myblue)] focus:ring-offset-2"
            aria-label="Get in touch with Jeffrey"
          >
            Get In Touch
          </button>

          <button
            @click="toggleSnow"
            class="px-8 py-4 border-2 border-[var(--mygray)] text-[var(--mygray)] rounded-lg font-medium text-lg hover:bg-[var(--mygray)] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--mygray)] focus:ring-offset-2"
            :aria-label="`${showSnow ? 'Disable' : 'Enable'} snow animation`"
          >
            {{ showSnow ? '❄️ Snow Off' : '❄️ Snow On' }}
          </button>
        </div>

        <!-- Mobile - Snow and Theme Toggles -->
        <div class="flex sm:hidden justify-center gap-4">
          <button
            @click="toggleSnow"
            @touchstart="toggleSnow"
            class="mobile-toggle-btn"
            :aria-label="`${showSnow ? 'Disable' : 'Enable'} snow animation`"
          >
            {{ showSnow ? '❄️ Snow Off' : '❄️ Snow On' }}
          </button>

          <button
            @click="toggleTheme"
            @touchstart="toggleTheme"
            class="mobile-toggle-btn inline-block text-center"
            :aria-label="`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`"
          >
            {{ currentTheme === 'light' ? '🌙 Dark' : '☀️ Light' }}
          </button>
        </div>
        <div class="flex sm:hidden justify-center mt-4">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            class="mobile-toggle-btn"
            aria-label="View or download Jeffrey's resume"
          >
            📄 Resume
          </a>
        </div>

        <!-- Mobile scroll hint -->
        <div class="flex sm:hidden justify-center mt-6">
          <p class="text-sm text-[var(--mygray)] italic">Scroll down to explore my portfolio</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero gradient background */
.hero-gradient {
  position: relative;
  z-index: 2;
}
.hero-gradient::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.12) 0%,
    rgba(147, 51, 234, 0.08) 25%,
    rgba(236, 72, 153, 0.06) 50%,
    rgba(59, 130, 246, 0.08) 75%,
    rgba(16, 185, 129, 0.1) 100%
  );
  z-index: -1;
  pointer-events: none;
} /* Dark mode gradient */
[data-theme='dark'] .hero-gradient::before {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.09) 0%,
    rgba(147, 51, 234, 0.07) 25%,
    rgba(236, 72, 153, 0.06) 50%,
    rgba(59, 130, 246, 0.07) 75%,
    rgba(16, 185, 129, 0.08) 100%
  );
}
.hero-content {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out;
}
.animate-fade-in {
  opacity: 1;
  transform: translateY(0);
}
button {
  transition:
    transform 0.3s ease,
    background-color 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease;
}
/* Mobile toggle buttons */
.mobile-toggle-btn {
  padding: 16px 24px !important;
  border: 2px solid var(--mygray) !important;
  color: var(--mygray) !important;
  background: transparent !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  min-height: 56px !important;
  min-width: 140px !important;
  -webkit-tap-highlight-color: transparent !important;
  touch-action: manipulation !important;
  user-select: none !important;
  -webkit-user-select: none !important;
}
.mobile-toggle-btn:hover,
.mobile-toggle-btn:active {
  background: var(--mygray) !important;
  color: white !important;
  transform: scale(0.98) !important;
} /* Responsive adjustments */
@media (max-width: 640px) {
  .hero-content {
    padding: 0 1rem;
  }
  button:not(.mobile-toggle-btn) {
    width: 100%;
    max-width: 300px;
  }
}
</style>
