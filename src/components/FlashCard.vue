<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, reactive, useTemplateRef, ref } from 'vue'
import { reactify, useMediaQuery, useParallax } from '@vueuse/core'
import YAML from 'yaml'
import cardBorder from '@/assets/grayCardBorder.png'

const target = useTemplateRef<HTMLElement>('target')
const isMobile = useMediaQuery('(max-width: 700px)')
const parallax = reactive(useParallax(target))
const currAngle = ref(0)
const isHovered = ref(false)

const flipCard = () => {
  if (parallax.tilt < 0) {
    currAngle.value -= 180 // flip counterclockwise
  } else {
    currAngle.value += 180 // flip clockwise
  }
}

const stringify = reactify((input: typeof parallax) =>
  YAML.stringify(
    input,
    (k, v) => {
      if (typeof v === 'function') return undefined
      return v
    },
    {
      singleQuote: true,
      flowCollectionPadding: false,
    },
  ),
)

const layerBase: CSSProperties = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  transition: '.3s ease-out all',
}

const props = withDefaults(
  defineProps<{
    images: string[]
    text?: string
    debug?: boolean
    isHolo?: boolean
    hue?: number
    subText?: string
    hyper: {
      text: string
      link: string
    }
  }>(),
  {
    debug: false,
    isHolo: false,
    hyper: () => ({
      text: '',
      link: '',
    }),
  },
)
const layers = props.images.map((url, index) => {
  const style = computed(() => {
    if (index === 0) {
      return { ...layerBase }
    }
    if (index === props.images.length - 1) {
      return { ...layerBase }
    }
    const multiplier = (index + 1) * 10
    return {
      ...layerBase,
      transform: `translateX(${parallax.tilt * multiplier}px) translateY(${parallax.roll * multiplier}px) scale(1.33)`,
    }
  })
  return { url, style }
})
</script>

<template>
  <div ref="target" class="flex flex-grow flex-col transition-all duration-300 ease-out pt-3 pb-3">
    <!-- Display YAML stringified parallax data -->
    <pre v-if="debug" class="absolute opacity-40 top-5 left-10">{{ stringify(parallax) }}</pre>

    <!-- Card container with perspective -->
    <div
      id="card"
      class="flex justify-center"
      :style="{ perspective: '400px' }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Flip container -->
      <div
        class="relative max-w-40 w-full aspect-square flex-grow rounded-3xl transition-transform duration-500"
        :style="{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${currAngle}deg)`,
          cursor: 'pointer',
        }"
        @click="flipCard"
      >
        <!-- Front face -->
        <div
          class="select-none absolute inset-0 bg-[var(--bgcolor)] rounded-3xl border border-transparent overflow-hidden"
          :style="{
            transform: isHovered
              ? `rotateX(${parallax.roll * 20}deg) rotateY(${parallax.tilt * 20}deg) scale(1.05)`
              : 'rotateX(0deg) rotateY(0deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }"
        >
          <div
            class="overflow-hidden m-auto"
            :style="{ top: 'calc(50% - 1em)', left: 'calc(50% - 1em)' }"
          >
            <!-- Parallax image layers -->
            <img
              v-for="(layer, index) in layers"
              :key="index"
              :src="layer.url"
              :style="layer.style.value"
              alt=""
            />
            <div
              class="holo-1 absolute inset-1 rounded-3xl pointer-events-none z-50"
              :style="{
                maskImage: `url(${props.images[props.images.length - 1]}), url(${cardBorder})`,
                WebkitMaskPosition: 'center top, center top',
                WebkitMaskRepeat: 'no-repeat, no-repeat',
                background: props.isHolo ? undefined : 'var(--bordercolor)',
                '--ratio-x': parallax.tilt * 2,
                '--ratio-y': parallax.roll * 2,
                '--correction': '0%',
                ...(props.hue !== undefined ? { '--hue': props.hue } : {}),
              }"
            ></div>
          </div>
        </div>

        <!-- Back face -->
        <div
          class="select-none absolute inset-0 bg-[var(--obgcolor)] rounded-3xl flex flex-col items-center justify-center duration-800 ease-out"
          :style="{
            transform: isHovered
              ? `rotateX(${parallax.roll * 20}deg) rotateY(${parallax.tilt * 20 + 180}deg) scale(1.05)`
              : 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }"
        >
          <p class="text-[var(--textcolor)] text-xl font-bold">
            {{ props.text }}
            <a
              @click.stop
              :href="props.hyper.link"
              class="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ props.hyper.text }}
            </a>
          </p>

          <p class="text-[var(--textcolor)] text-sm">{{ props.subText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.holo-1 {
  mask-size: contain;
  mask-repeat: no-repeat;
  content: '';
  --size: 0.001rem;
  top: var(--size);
  right: var(--size);
  bottom: var(--size);
  left: var(--size);
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at calc(90% - var(--ratio-x) * 20%) calc(0% - var(--ratio-y) * 20%),
      hsl(var(--hue), 90%, var(--light-70)),
      hsl(var(--hue), 60%, var(--light-85)) 1%,
      hsla(var(--hue), 78%, var(--light-88), 0.76) 20%,
      transparent
    ),
    linear-gradient(
      110deg,
      hsl(var(--hue), 100%, 45%) calc(10% - var(--ratio-x) * 20%),
      hsl(var(--hue), 90%, var(--light-70)) calc(20% - var(--ratio-x) * 20%),
      hsla(var(--hue), 100%, var(--light-95), 1) calc(30% - var(--ratio-x) * 20%),
      hsla(var(--hue), 83%, calc(var(--light-77) - 20% * var(--ratio-x)), 1)
        calc(40% - var(--ratio-x) * 20%),
      transparent calc(60% - var(--ratio-x) * 20%),
      hsl(var(--hue), 65%, var(--light-80)) calc(70% - var(--ratio-x) * 20%),
      hsl(var(--hue), 50%, var(--light-90)) calc(80% - var(--ratio-x) * 20%)
    );
  transition: all 0.2s linear;
  pointer-events: none;
}
</style>
