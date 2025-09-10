<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  centered?: boolean
  level?: 1 | 2 | 3 | 4 | 5 | 6
  id?: string
}

withDefaults(defineProps<Props>(), {
  centered: false,
  level: 2,
})
</script>

<template>
  <header :class="{ 'text-center': centered, 'text-left': !centered }" class="mb-16">
    <component
      :is="`h${level}`"
      :id="id"
      class="text-3xl md:text-4xl font-bold mb-4 text-[var(--myblue)] uppercase tracking-wide"
    >
      {{ title }}
    </component>
    <div
      class="w-20 h-1 bg-[var(--myblue)] rounded mb-6"
      :class="{ 'mx-auto': centered, 'mx-0': !centered }"
      aria-hidden="true"
    ></div>
    <p
      v-if="subtitle"
      class="text-lg text-[var(--mygray)] leading-relaxed"
      :class="{ 'max-w-2xl mx-auto': centered, 'max-w-3xl': !centered }"
    >
      {{ subtitle }}
    </p>
  </header>
</template>

<style scoped>
/* Consistent header styling across all sections */
h1,
h2,
h3,
h4,
h5,
h6 {
  letter-spacing: 0.05em;
  line-height: 1.2;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 2rem;
  }
}
</style>
