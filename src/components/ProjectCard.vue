<script setup lang="ts">
import type { Project } from '@/types/project'

defineProps<{
  project: Project
}>()
</script>

<template>
  <article
    class="card card-interactive hover-lift focus-visible:outline-2 focus-visible:outline-[var(--myblue)] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(117,166,187,0.2)]"
    :aria-labelledby="`project-title-${project.id}`"
    :aria-describedby="`project-desc-${project.id}`"
    tabindex="0"
  >
    <!-- Project Header -->
    <div class="mb-4">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        <h3
          :id="`project-title-${project.id}`"
          class="text-fluid-lg font-semibold text-[var(--text-primary)] leading-tight break-words flex-1"
        >
          {{ project.title }}
        </h3>
        <div class="flex gap-3 flex-shrink-0">
          <a
            v-if="project.liveUrl"
            :href="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="external-link interactive-primary text-fluid-sm font-medium hover-lift focus-visible:outline-2 focus-visible:outline-[var(--myblue)] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(117,166,187,0.2)]"
            :aria-label="`View ${project.title} live demo`"
          >
            <span class="sr-only">External link:</span>
            demo ↗
          </a>
          <a
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="external-link interactive-primary text-fluid-sm font-medium hover-lift focus-visible:outline-2 focus-visible:outline-[var(--myblue)] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_4px_rgba(117,166,187,0.2)]"
            :aria-label="`View ${project.title} source code`"
          >
            <span class="sr-only">GitHub repository:</span>
            repo ↗
          </a>
        </div>
      </div>
    </div>

    <!-- Project Description -->
    <p
      :id="`project-desc-${project.id}`"
      class="text-fluid-sm text-[var(--text-secondary)] mb-4 leading-relaxed"
    >
      {{ project.description }}
    </p>

    <!-- Technology Tags -->
    <div class="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
      <span
        v-for="tech in project.technologies"
        :key="tech"
        class="tech-tag px-3 py-1.5 text-xs rounded-full bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)] border border-[var(--interactive-primary)]/20 font-medium"
        role="listitem"
      >
        {{ tech }}
      </span>
    </div>
  </article>
</template>

<style scoped>
/* Enhanced tech tag styling */
.tech-tag {
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
}

.tech-tag:hover {
  background-color: var(--interactive-primary);
  color: var(--text-inverse);
  transform: translateY(-1px);
  border-color: var(--interactive-primary);
}

/* Override global span styles for tech tags */
.tech-tag::after {
  display: none !important;
}

.tech-tag:hover::after {
  display: none !important;
}

/* Enhanced external link styling */
.external-link {
  position: relative;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all var(--duration-normal) var(--ease-out);
  padding: var(--space-1) 0;
}

.external-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 1px;
  background-color: currentColor;
  transition: width var(--duration-normal) var(--ease-out);
}

.external-link:hover::after {
  width: 100%;
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  .tech-tag {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-xs);
    min-height: 32px;
  }

  .external-link {
    min-height: 44px;
    padding: var(--space-2) 0;
    display: flex;
    align-items: center;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tech-tag {
    transition: none;
  }

  .tech-tag:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .tech-tag {
    border-width: 2px;
  }

  .external-link {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
}
</style>
