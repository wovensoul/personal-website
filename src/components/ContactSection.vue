<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SectionHeader from './SectionHeader.vue'

// Contact state
const emailCopied = ref(false)
const isVisible = ref(false)
const contactRef = ref<HTMLElement>()

// Contact information
const contactInfo = {
  email: 'jeffrey@jeffrey.work',
  location: 'New York, NY',
  timezone: 'EST (UTC-5)',
  social: {
    github: {
      url: 'https://github.com/wovensoul',
      username: '@wovensoul',
      label: 'GitHub Profile',
    },
    linkedin: {
      url: 'https://www.linkedin.com/in/jffrychn/',
      username: 'Jeffrey Chen',
      label: 'LinkedIn Profile',
    },
    twitter: {
      url: 'https://twitter.com/jffrychn', // Placeholder - replace if available
      username: '@jffrychn',
      label: 'Twitter Profile',
    },
  },
}

// Contact information - structured data is handled centrally in App.vue

// Email copying functionality
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(contactInfo.email)
    emailCopied.value = true
    setTimeout(() => (emailCopied.value = false), 3000)
  } catch (err) {
    console.error('Failed to copy email: ', err)
    // Fallback for browsers that don't support clipboard API
    fallbackCopyEmail()
  }
}

// Fallback email copying for older browsers
function fallbackCopyEmail() {
  const textArea = document.createElement('textarea')
  textArea.value = contactInfo.email
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
    emailCopied.value = true
    setTimeout(() => (emailCopied.value = false), 3000)
  } catch (err) {
    console.error('Fallback copy failed: ', err)
  }

  document.body.removeChild(textArea)
}

// Animation setup
onMounted(() => {
  if (!contactRef.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px',
    },
  )

  observer.observe(contactRef.value)
})
</script>

<template>
  <section
    id="contact"
    ref="contactRef"
    class="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
    :class="{ 'animate-fade-in': isVisible }"
    role="region"
    aria-labelledby="contact-heading"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Standardized Section Header -->
      <SectionHeader
        title="Get In Touch"
        subtitle="I'm always open to discussing new opportunities, collaborations, or just having a chat about technology and projects"
        :centered="true"
        :level="2"
        id="contact-heading"
      />

      <div class="contact-section grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">
        <!-- Contact Information -->
        <div class="space-y-6 sm:space-y-8">
          <div class="contact-card">
            <h3 class="text-xl font-semibold mb-6 text-[var(--myblue)]">Contact Information</h3>

            <!-- Email -->
            <div class="contact-item mb-6">
              <div class="flex items-center mb-2">
                <svg
                  class="w-5 h-5 mr-3 text-[var(--myblue)]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  ></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span class="font-medium">Email</span>
              </div>
              <div class="ml-8 relative">
                <button
                  @click="copyEmail"
                  class="email-button text-[var(--myblue)] cursor-pointer transition-all duration-300 hover:text-[var(--snowcolor)] rounded px-2 py-1 min-h-touch touch-optimized underline focus-visible:outline-2 focus-visible:outline-[var(--myblue)] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(117,166,187,0.2)]"
                  :aria-label="`Copy email address ${contactInfo.email} to clipboard`"
                >
                  {{ contactInfo.email }}
                  <span class="text-xs text-[var(--mygray)] ml-1 no-underline"
                    >(click to copy)</span
                  >
                </button>
                <div
                  v-if="emailCopied"
                  class="absolute top-full left-0 mt-0 text-sm text-[var(--myblue)] animate-fade-in font-medium"
                  role="status"
                  aria-live="polite"
                >
                  ✓ Email copied to clipboard!
                </div>
              </div>
            </div>

            <!-- Location -->
            <div class="contact-item mb-6 mt-8">
              <div class="flex items-center mb-2">
                <svg
                  class="w-5 h-5 mr-3 text-[var(--myblue)]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="font-medium">Location</span>
              </div>
              <div class="ml-8">
                <span class="text-[var(--textcolor)]">{{ contactInfo.location }}</span>
                <span class="text-sm text-[var(--mygray)] ml-2">({{ contactInfo.timezone }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media Links -->
        <div class="space-y-6 sm:space-y-8">
          <div class="contact-card">
            <h3 class="text-xl font-semibold mb-6 text-[var(--myblue)]">Connect With Me</h3>

            <div class="space-y-4">
              <!-- GitHub -->
              <a
                :href="contactInfo.social.github.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link flex items-center p-4 rounded-lg border border-[var(--myblue)]/20 hover:border-[var(--myblue)]/40 hover:bg-[var(--myblue)]/5 transition-all duration-300 group focus-visible:outline-2 focus-visible:outline-[var(--myblue)] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(117,166,187,0.2)]"
                :aria-label="contactInfo.social.github.label"
              >
                <svg
                  class="w-6 h-6 mr-4 text-[var(--myblue)] transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                <div>
                  <div
                    class="font-medium text-[var(--textcolor)] group-hover:text-[var(--myblue)] transition-colors duration-300"
                  >
                    GitHub
                  </div>
                  <div class="text-sm text-[var(--mygray)]">
                    {{ contactInfo.social.github.username }}
                  </div>
                </div>
                <svg
                  class="w-4 h-4 ml-auto text-[var(--mygray)] group-hover:text-[var(--myblue)] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </a>

              <!-- LinkedIn -->
              <a
                :href="contactInfo.social.linkedin.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link flex items-center p-4 rounded-lg border border-[var(--myblue)]/20 hover:border-[var(--myblue)]/40 hover:bg-[var(--myblue)]/5 transition-all duration-300 group focus-visible:outline-2 focus-visible:outline-[var(--myblue)] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(117,166,187,0.2)]"
                :aria-label="contactInfo.social.linkedin.label"
              >
                <svg
                  class="w-6 h-6 mr-4 text-[var(--myblue)] transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
                <div>
                  <div
                    class="font-medium text-[var(--textcolor)] group-hover:text-[var(--myblue)] transition-colors duration-300"
                  >
                    LinkedIn
                  </div>
                  <div class="text-sm text-[var(--mygray)]">
                    {{ contactInfo.social.linkedin.username }}
                  </div>
                </div>
                <svg
                  class="w-4 h-4 ml-auto text-[var(--mygray)] group-hover:text-[var(--myblue)] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </a>
            </div>

            <!-- Call to Action -->
            <div class="mt-8 p-6 bg-[var(--myblue)]/10 rounded-lg border border-[var(--myblue)]/20">
              <h4 class="font-semibold text-[var(--myblue)] mb-2">Let's Work Together</h4>
              <p class="text-sm text-[var(--mygray)] mb-4">
                Whether you have a project in mind, want to collaborate, or just want to say hello,
                I'd love to hear from you!
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <a
                  :href="`mailto:${contactInfo.email}?subject=Let's%20work%20together`"
                  class="cta-primary inline-flex items-center justify-center px-4 py-2 bg-[var(--myblue)] text-white rounded-lg font-medium hover:opacity-90 hover:transform hover:scale-105 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[var(--myblue)] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(117,166,187,0.2)]"
                  aria-label="Send email to start a conversation"
                >
                  <svg
                    class="w-8 h-8 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    style="min-width: 24px; min-height: 24px"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Send Message
                </a>
                <a
                  :href="contactInfo.social.linkedin.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cta-secondary inline-flex items-center justify-center px-4 py-2 border-2 border-[var(--myblue)] text-[var(--myblue)] rounded-lg font-medium hover:bg-[var(--myblue)] hover:text-white hover:transform hover:scale-105 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[var(--myblue)] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(117,166,187,0.2)]"
                  aria-label="Connect on LinkedIn"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    />
                  </svg>
                  Connect
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-card {
  background: var(--bgcolor);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid color-mix(in srgb, var(--myblue) 20%, transparent 80%);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.contact-item {
  position: relative;
}

.email-button {
  position: relative;
  display: inline-block;
}

/* Removed underline effect for cleaner look */

.social-link {
  min-height: 44px; /* Touch-friendly minimum */
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(117, 166, 187, 0.1), transparent);
  transition: left 0.5s;
}

.social-link:hover::before {
  left: 100%;
}

/* Focus styles are handled by focus-visible classes in template */

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
  }

  .contact-card:hover {
    transform: none;
  }

  .social-link:hover {
    transform: none;
  }

  .social-link::before {
    display: none;
  }

  @keyframes fadeInUp {
    from,
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .contact-card {
    border-width: 2px;
    border-color: var(--myblue);
  }

  .social-link {
    border-width: 2px;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .contact-card {
    padding: 1.5rem;
    border-radius: 1rem;
  }

  .social-link {
    padding: 1rem;
    min-height: 48px;
    border-radius: 0.75rem;
  }

  .social-link:active {
    transform: scale(0.98);
    background-color: var(--myblue);
    color: white;
  }

  .email-button {
    min-height: 44px;
    padding: 0.75rem 1rem;
    display: inline-flex;
    align-items: center;
    border-radius: 0.5rem;
  }

  .email-button:active {
    transform: scale(0.98);
    background-color: var(--myblue);
    color: white;
  }

  .contact-item {
    margin-bottom: 2rem;
  }

  /* Improve CTA buttons on mobile */
  .contact-card a[class*='inline-flex'] {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    white-space: nowrap;
  }

  .contact-card a[class*='inline-flex']:active {
    transform: scale(0.98);
  }
}

/* CTA Button Styles with Glint Effect */
.cta-primary,
.cta-secondary {
  position: relative;
  overflow: hidden;
  height: auto;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

/* Primary button (Send Message) */
.cta-primary {
  background-color: var(--myblue) !important;
  color: white !important;
  border: none;
}

.cta-primary:hover {
  background-color: color-mix(in srgb, var(--myblue) 85%, black 15%) !important;
  color: white !important;
  opacity: 1 !important;
}

/* Secondary button (Connect) */
.cta-secondary {
  background-color: transparent !important;
  border: 2px solid var(--myblue) !important;
  color: var(--myblue) !important;
}

.cta-secondary:hover {
  background-color: var(--myblue) !important;
  color: white !important;
  border-color: var(--myblue) !important;
}

/* Glint effect for both buttons */
.cta-primary::before,
.cta-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
  z-index: 1;
  pointer-events: none;
}

.cta-primary:hover::before,
.cta-secondary:hover::before {
  left: 100%;
}

/* Ensure text is above the glint effect */
.cta-primary > *,
.cta-secondary > * {
  position: relative;
  z-index: 2;
}

/* Dark theme adjustments */
[data-theme='dark'] .contact-card {
  background: var(--bgcolor);
  border-color: color-mix(in srgb, var(--myblue) 30%, transparent 70%);
}

[data-theme='dark'] .social-link {
  border-color: color-mix(in srgb, var(--myblue) 30%, transparent 70%);
}

[data-theme='dark'] .social-link:hover {
  background: color-mix(in srgb, var(--myblue) 10%, transparent 90%);
}
</style>
