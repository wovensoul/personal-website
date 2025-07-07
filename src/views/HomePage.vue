<script setup lang="ts">
import leaves from '@/assets/leaves.png'
import leaves2 from '@/assets/leaves2.png'
import leaves3 from '@/assets/leaves3.png'
import tree1 from '@/assets/tree_1.png'
import tree2 from '@/assets/tree_2.png'
import tree3 from '@/assets/tree_3.png'
import nyuWord from '@/assets/nyu_word.png'
import nyuIcon from '@/assets/nyu_icon.png'
import pupilWord from '@/assets/pupil_word.png'
import pupilIcon from '@/assets/pupil_icon.png'
import { technologies, languages } from '@/assets/globals'
import FlashCard from '@/components/FlashCard.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import DeviconIcons from '@/components/DeviconIcons.vue'

const nyuImages = [nyuIcon, tree2, tree3, leaves, leaves3, nyuWord]
const pupilImages = [pupilIcon, tree1, tree3, leaves2, leaves, pupilWord]
</script>

<template>
  <h1 class="uppercase pt-6 pb-0 text-[var(--myblue)] font-semibold">Experience</h1>
  <p class="text-xs text-[var(--mygray)] pb-4">(CLICK CARDS)</p>
  <div class="flex justify-center">
    <FlashCard
      :hue="250"
      :isHolo="true"
      :debug="false"
      :text="'swe @ '"
      :hyper="{
        text: 'pupil',
        link: 'https://getpupil.com',
      }"
      :sub-text="'oct 2023 - june 2025'"
      :images="pupilImages"
    />
    <FlashCard
      :hue="260"
      :isHolo="false"
      :debug="false"
      :text="'it @ '"
      :hyper="{
        text: 'nyu',
        link: 'https://as.nyu.edu/administrative-resources/office/cit.html',
      }"
      :sub-text="'feb 2022 - may 2024'"
      :images="nyuImages"
    />
  </div>
  <p class="text-xs text-[var(--mygray)]">
    This project is a personal, non-commercial, and creative work created to showcase
    design/development skills. This work is not endorsed by, sponsored by, or affiliated with NYU or
    Pupil in any official capacity.
  </p>
  <h1 class="uppercase pt-12 pb-4 text-[var(--myblue)] font-semibold">Projects</h1>
  <ProjectCard
    :project-name="'matchaluv'"
    :description="'a matcha centric social media app'"
    :stack="'flutter, firebase'"
    :repo="'https://github.com/wovensoul/matchaluv'"
  />
  <ProjectCard
    :project-name="'personal blog'"
    :description="'a blog implementing headless cms with automatic builds and deploys'"
    :stack="'vue, strapi'"
  ></ProjectCard>
  <ProjectCard
    :project-name="'personal website'"
    :description="'you are here'"
    :stack="'vue, tailwindcss, html, typescript'"
    :demo="'https://jeffreychen.work'"
    :repo="'https://github.com/wovensoul/personal-website'"
  ></ProjectCard>
  <h1 class="uppercase pt-12 pb-4 text-[var(--myblue)] font-semibold">Technical Skills</h1>
  <div class="bg-[var(--obgcolor)] rounded-3xl">
    <div class="flex flex-wrap justify-center p-1">
      <DeviconIcons :sws="languages"></DeviconIcons>
      <DeviconIcons :sws="technologies"></DeviconIcons>
    </div>
  </div>
</template>
