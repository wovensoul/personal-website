<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Technology {
  name: string
  icon: string
}

defineProps<{
  technologies: Technology[]
}>()

// Animation state
const isVisible = ref(false)
const gridRef = ref<HTMLElement>()

// Remove keyboard navigation since items are no longer interactive

// Intersection Observer for staggered animations
onMounted(() => {
  if (!gridRef.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px',
    },
  )

  observer.observe(gridRef.value)
})
</script>

<template>
  <div ref="gridRef" class="tech-grid" :class="{ 'animate-stagger': isVisible }">
    <div
      v-for="(tech, index) in technologies"
      :key="tech.name"
      class="tech-item"
      :style="{ 'animation-delay': `${index * 0.1}s` }"
      :title="tech.name"
      :aria-label="`${tech.name} technology`"
    >
      <i :class="tech.icon" class="tech-icon" :aria-hidden="true"></i>
      <span class="tech-name">{{ tech.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
  padding: 0;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: color-mix(in srgb, var(--myblue) 5%, transparent 95%);
  border: 1px solid color-mix(in srgb, var(--myblue) 10%, transparent 90%);
  transition: all 0.3s ease;
  cursor: default;
  opacity: 0;
  transform: translateY(1rem);
  min-height: 80px;
  /* Ensure adequate touch targets */
  min-width: 80px;
  touch-action: manipulation;
}

.tech-item:hover {
  background: color-mix(in srgb, var(--myblue) 10%, transparent 90%);
  border-color: color-mix(in srgb, var(--myblue) 20%, transparent 80%);
  transform: translateY(-0.25rem);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--myblue) 15%, transparent 85%);
}

.tech-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
  color: var(--myblue);
  transition: all 0.3s ease;
}

.tech-item:hover .tech-icon {
  transform: scale(1.1);
  color: color-mix(in srgb, var(--myblue) 80%, var(--textcolor) 20%);
}

.tech-name {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  color: var(--textcolor);
  opacity: 0.8;
  transition: opacity 0.3s ease;
  line-height: 1.2;
}

.tech-item:hover .tech-name {
  opacity: 1;
}

/* Animation classes */
.animate-stagger .tech-item {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 0.75rem;
  }

  .tech-item {
    padding: 0.75rem 0.5rem;
    min-height: 80px;
    min-width: 80px;
    border-radius: 0.75rem;
  }

  .tech-item:active {
    transform: scale(0.95);
    background: color-mix(in srgb, var(--myblue) 15%, transparent 85%);
  }

  .tech-icon {
    font-size: 1.875rem;
    margin-bottom: 0.375rem;
  }

  .tech-name {
    font-size: 0.75rem;
    font-weight: 600;
  }
}

/* Tablet adjustments */
@media (min-width: 641px) and (max-width: 1023px) {
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .tech-item {
    min-height: 85px;
    min-width: 85px;
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .tech-item {
    transition: none;
    opacity: 1;
    transform: translateY(0);
  }

  .tech-item:hover {
    transform: none;
  }

  .tech-icon,
  .tech-name {
    transition: none;
  }

  .tech-item:hover .tech-icon {
    transform: none;
  }

  .animate-stagger .tech-item {
    animation: none;
  }

  @keyframes fadeInUp {
    from,
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* Remove focus styles since items are no longer interactive */
</style>
