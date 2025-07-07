<script setup lang="ts">
import { computed } from 'vue'
const snowflakeCount = 40

type Snowflake = {
  left: string
  delay: string
  size: number
}

function randomSnowflake(): Snowflake {
  const left = `${Math.floor(Math.random() * 100)}%`
  const delay = `${(Math.random() * 5 + 1).toFixed(2)}s` // 1s - 6s
  const size = Math.floor(Math.random() * (8 - 3 + 1)) + 3
  return { left, delay, size }
}

const snowflakes = computed(() => Array.from({ length: snowflakeCount }, () => randomSnowflake()))
</script>
<template>
  <div class="snowfall">
    <div
      v-for="(flake, i) in snowflakes"
      :key="i"
      class="snowflake"
      :style="{
        left: flake.left,
        animationDelay: flake.delay,
        width: flake.size + 'px',
        height: flake.size + 'px',
      }"
    ></div>
  </div>
</template>
<style>
.snowfall {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.snowflake {
  --small: 3px;
  --medium: 7px;
  width: var(--small);
  height: var(--small);
  position: absolute;
  background-color: var(--snowcolor);
  border-radius: 50%;
  animation:
    snow 6s linear infinite,
    wind 10s ease-in-out infinite,
    glow 3s ease-in-out infinite alternate;
  top: -10%;
  box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.6);
}

@keyframes snow {
  100% {
    top: 100%;
  }
}

@keyframes wind {
  50% {
    transform: translateX(120px);
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 2px 1px (rgba(255, 255, 255, 0.15));
    opacity: 0.8;
  }
  25% {
    box-shadow: 0 0 6px 2px (rgba(255, 255, 255, 0.3));
    opacity: 0.9;
  }
  50% {
    box-shadow: 0 0 2px 1px (rgba(255, 255, 255, 0.15));
    opacity: 0.8;
  }
  75% {
    box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.3);
    opacity: 0.9;
  }
  100% {
    box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.15);
    opacity: 0.8;
  }
}
</style>
