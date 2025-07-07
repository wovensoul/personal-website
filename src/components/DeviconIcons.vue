<template>
  <i
    v-for="sw in props.sws"
    :key="sw.name"
    :class="sw.icon"
    class="text-3xl p-3"
    :title="sw.name"
  ></i>
</template>

<script setup lang="ts">
const props = defineProps<{
  sws: { name: string; icon: string | null }[]
}>()
</script>
