<script setup lang="ts">
import { ref, onMounted } from 'vue'

const themes = ['light', 'dark']
const currentTheme = ref('light')

function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

function toggleTheme() {
  const index = themes.indexOf(currentTheme.value)
  const nextIndex = (index + 1) % themes.length
  currentTheme.value = themes[nextIndex]
  applyTheme(currentTheme.value)
}

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'light'
  currentTheme.value = saved
  applyTheme(currentTheme.value)
})
</script>

<template>
  <ul class="flex flex-col text-right text-[var(--textcolor)] duration-100">
    <li>
      <router-link to="/"><span>home</span></router-link>
    </li>
    <li>
      <router-link to="/about"><span>about</span></router-link>
    </li>
    <li>
      <router-link to="/contact"><span>contact</span></router-link>
    </li>
    <li class="resume font-bold">
      <a href="/resume.pdf"
        ><span>resume <i class="fa-solid fa-file-lines pl-1"></i></span
      ></a>
    </li>

    <li>
      <a href="#" @click.prevent="toggleTheme">
        <span>{{ themes[(themes.indexOf(currentTheme) + 1) % themes.length] }} mode</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.resume {
  color: color-mix(in srgb, var(--myblue) 50%, var(--textcolor) 50%);
}
</style>
