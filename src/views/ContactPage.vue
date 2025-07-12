<template>
  <p class="mt-10">
    you can reach me by email:
    <span @click="copyEmail" style="cursor: pointer" class="text-blue-300">{{ email }}</span>
    or through
    <span><a href="https://www.linkedin.com/in/jffrychn/">LinkedIn!</a></span>
  </p>

  <p v-if="copied" class="text-[var(--myblue)]">email copied to clipboard!</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = 'jeffrey@jeffrey.work'
const copied = ref(false)

function copyEmail() {
  navigator.clipboard
    .writeText(email)
    .then(() => {
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
    })
    .catch((err) => {
      console.error('Failed to copy: ', err)
    })
}
</script>

<style scoped></style>
