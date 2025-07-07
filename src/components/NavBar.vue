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
    <li><router-link to="/">home</router-link></li>
    <li><router-link to="/about">about</router-link></li>
    <li><a href="mailto:jc9964@nyu.edu">contact</a></li>
    <li class="resume font-bold">
      <a href="/resume.pdf">resume <i class="fa-solid fa-file-lines pl-1"></i></a>
    </li>

    <li>
      <a href="#" @click.prevent="toggleTheme">
        {{ themes[(themes.indexOf(currentTheme) + 1) % themes.length] }} mode
      </a>
    </li>
  </ul>
</template>

<style scoped>
a {
  position: relative;
  text-decoration: none;
  transition:
    color 0.3s ease,
    text-shadow 0.3s ease;
}

a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 2px;
  background-color: var(--textcolor);
  box-shadow: 0 0 10px 1px var(--textcolor);
  opacity: 0;
  transition: opacity 0.3s ease;
}

a:hover::after {
  opacity: 1;
}

a:active::after {
  background-color: color-mix(in srgb, var(--highlightcolor) 90%, var(--textcolor) 10%);
  box-shadow: 0 0 10px 1px color-mix(in srgb, var(--highlightcolor) 90%, var(--textcolor) 10%);
  transition: opacity 0.3s ease;
}

.resume {
  color: color-mix(in srgb, var(--myblue) 50%, var(--textcolor) 50%);
}
</style>
