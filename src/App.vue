<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Snowfall from './components/SnowFall.vue'
import NavBar from './components/NavBar.vue'

const showSnow = ref(true)

function toggleSnow() {
  showSnow.value = !showSnow.value
  applyShowSnow(showSnow.value)
}

function applyShowSnow(value: boolean) {
  localStorage.setItem('showSnow', value.toString())
}

onMounted(() => {
  const saved = localStorage.getItem('showSnow')
  console.log('Loaded snow state from storage:', saved)
  showSnow.value = saved ? saved === 'true' : true
  applyShowSnow(showSnow.value)
})
</script>

<template>
  <div class="bg-[var(--obgcolor)] text-[var(--textcolor)] duration-300">
    <Snowfall v-if="showSnow" />
    <div class="min-h-screen mx-10 sm:mx-24 flex justify-center">
      <div
        class="bg-[var(--bgcolor)] [background-image:var(--bggradient)] items-center pt-24 max-w-2xl w-full pl-5 pr-5 pb-12"
      >
        <div class="grid grid-cols-2">
          <div id="left" class="text-left flex items-start flex-col">
            <header class="text-[var(--textcolor)] font-semibold text-lg">jeffrey chen</header>
            <button @click="toggleSnow" class="mt-[1px]">
              toggle snow {{ showSnow ? 'off' : 'on' }}
            </button>
            <div class="flex space-x-1 mt-1">
              <a href="https://github.com/wovensoul/"
                ><i class="fa-brands fa-square-github fa-2x"></i
              ></a>
              <a href="https://www.linkedin.com/in/jffrychn"
                ><i class="fab fa-linkedin fa-2x"></i
              ></a>
            </div>
          </div>
          <div id="right" class="text-right flex flex-col justify-self-end">
            <NavBar />
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  position: relative;
  text-decoration: none;
  transition:
    color 0.3s ease,
    text-shadow 0.3s ease;
  cursor: pointer;
}

button:hover {
  color: var(--snowcolor);
}

button:active {
  color: color-mix(in srgb, var(--snowcolor) 60%, rgb(19, 24, 93) 40%);
}
button::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background-color: var(--snowcolor);
  box-shadow: 0 0 10px 1px var(--snowcolor);
  opacity: 0;
  transition: opacity 0.3s ease;
}

button:hover::after {
  opacity: 1;
}
button:active::after {
  background-color: color-mix(in srgb, var(--snowcolor) 60%, rgb(19, 24, 93) 40%);
  box-shadow: 0 0 10px 1px color-mix(in srgb, var(--snowcolor) 60%, rgb(19, 24, 93) 40%);
  transition: opacity 0.3s ease;
}
</style>
