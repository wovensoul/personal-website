<script setup lang="ts">
// Skip links for screen reader users
const skipLinks = [
  { href: '#main-content', text: 'Skip to main content' },
  { href: '#navigation', text: 'Skip to navigation' },
  { href: '#hero', text: 'Skip to hero section' },
  { href: '#about', text: 'Skip to about section' },
  { href: '#projects', text: 'Skip to projects section' },
  { href: '#contact', text: 'Skip to contact section' },
]
</script>

<template>
  <div class="skip-links" role="navigation" aria-label="Skip links">
    <a
      v-for="link in skipLinks"
      :key="link.href"
      :href="link.href"
      class="skip-link focus-visible:outline-2 focus-visible:outline-[var(--snowcolor)] focus-visible:outline-offset-2"
      @click="handleSkipLinkClick"
    >
      {{ link.text }}
    </a>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    handleSkipLinkClick(event: Event) {
      const target = event.target as HTMLAnchorElement
      const targetId = target.getAttribute('href')?.substring(1)

      if (targetId) {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          // Ensure the target element is focusable
          if (!targetElement.hasAttribute('tabindex')) {
            targetElement.setAttribute('tabindex', '-1')
          }

          // Focus the target element after a short delay
          setTimeout(() => {
            targetElement.focus()
          }, 100)
        }
      }
    },
  },
}
</script>

<style scoped>
.skip-links {
  position: absolute;
  top: -100vh;
  left: 0;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -100vh;
  left: 0;
  background: var(--myblue);
  color: white;
  padding: 0.75rem 1rem;
  text-decoration: none;
  font-weight: 500;
  border-radius: 0 0 0.375rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 10000;
}

.skip-link:focus-visible {
  top: 0;
}

.skip-link:hover:focus-visible {
  background: color-mix(in srgb, var(--myblue) 90%, black 10%);
  transform: translateY(2px);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .skip-link {
    border: 2px solid white;
  }

  .skip-link:focus-visible {
    outline: 3px solid yellow;
    background: black;
    color: white;
  }
}
</style>
