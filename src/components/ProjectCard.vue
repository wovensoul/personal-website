<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    projectName?: string
    description?: string
    demo?: string
    repo?: string
    stack?: string
    showDemoRepo?: boolean
  }>(),
  {
    showDemoRepo: true,
    projectName: 'unnamed project',
    demo: '',
    repo: '',
    description: '',
    stack: '',
  },
)
</script>

<template>
  <div class="flex justify-between items-center">
    <p>{{ props.projectName }}</p>
    <div v-if="showDemoRepo" class="flex space-x-1">
      <a v-if="demo" :href="demo">demo</a>
      <span
        class="pointer-events-none"
        v-else
        :style="{ color: 'color-mix(in srgb, var(--textcolor) 30%, transparent 70%)' }"
        >demo</span
      >
      <a v-if="repo" :href="repo">repo</a>
      <span
        class="pointer-events-none"
        v-else
        :style="{ color: 'color-mix(in srgb, var(--textcolor) 30%, transparent 70%)' }"
        >repo</span
      >
    </div>
  </div>

  <div class="flex justify-between items-center">
    <p
      class="text-sm pb-3"
      :style="{ color: 'color-mix(in srgb, var(--textcolor) 50%, transparent 50%)' }"
    >
      {{ description }}
    </p>
    <p
      class="text-sm pb-3"
      :style="{ color: 'color-mix(in srgb, var(--textcolor) 50%, transparent 50%)' }"
    >
      {{ stack }}
    </p>
  </div>
</template>

<style scoped>
a {
  position: relative;
}
a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 2px;
  background-color: var(--textcolor);
  box-shadow: 0 0 20px 1px var(--textcolor);
  opacity: 1;
  transition: opacity 0.3s ease;
}

a:hover {
  color: color-mix(in srgb, var(--highlightcolor) 90%, var(--textcolor) 10%);
}

a:hover::after {
  background-color: color-mix(in srgb, var(--highlightcolor) 90%, var(--textcolor) 10%);
  box-shadow: 0 0 10px 1px color-mix(in srgb, var(--highlightcolor) 90%, var(--textcolor) 10%);
  transition: opacity 0.3s ease;
}
</style>
