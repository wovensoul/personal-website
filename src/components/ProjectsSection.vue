<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SectionHeader from './SectionHeader.vue'
import ProjectCard from './ProjectCard.vue'
import type { Project } from '@/types/project'
import { createProjectsListSchema, injectStructuredData, removeStructuredData } from '@/utils/seo'

// Project data migrated from existing HomePage.vue with enhanced structure
const projects = ref<Project[]>([
  {
    id: 'restaurant-demo',
    title: 'Restaurant Website',
    description: 'Modern redesign of local restaurant websites that are PC and mobile friendly',
    longDescription:
      'A complete redesign focused on creating user-friendly restaurant websites that work seamlessly across all devices. Features responsive design, smooth animations, and optimized performance for better customer experience.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'App Router'],
    liveUrl: 'https://bluember.jeffreychen.work',
    image: 'https://via.placeholder.com/400x200/dc2626/ffffff?text=Blu+Ember+Restaurant',
    featured: true,
    dateCreated: '2025-08-02',
  },
  {
    id: 'sales-analytics',
    title: 'Sales Analytics',
    description: 'REST API to manage and analyze sales data with comprehensive reporting features',
    longDescription:
      'A robust backend system built with Spring Boot that provides comprehensive sales data management and analytics capabilities. Features include data visualization, reporting, and real-time analytics.',
    technologies: ['Java', 'Spring Boot', 'Spring JPA', 'Hibernate', 'Maven', 'PostgreSQL'],
    githubUrl: 'https://github.com/wovensoul/sales-analytics',
    image: 'https://via.placeholder.com/400x200/75a6bb/ffffff?text=Sales+Analytics',
    featured: true,
    dateCreated: '2025-07-26',
  },
  {
    id: 'matcha-generator',
    title: 'Matcha Generator',
    description: 'An AI-powered web app that generates personalized matcha recipes',
    longDescription:
      'Interactive web application that uses AI to create custom matcha recipes based on user preferences. Features include ingredient customization, brewing instructions, and recipe sharing.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Docker', `Llama 3.1`, 'Hugging Face'],
    liveUrl: 'https://matcha-generator.vercel.app',
    githubUrl: 'https://github.com/wovensoul/matcha-generator',
    image: 'https://via.placeholder.com/400x200/4ade80/ffffff?text=Matcha+Generator',
    featured: true,
    dateCreated: '2025-07-14',
  },
  {
    id: 'matchaluv',
    title: 'MatchaLuv',
    description: 'A matcha-centric social media app for tea enthusiasts',
    longDescription:
      'Mobile social platform designed for matcha lovers to share experiences, recipes, and connect with fellow enthusiasts. Built with Flutter for cross-platform compatibility.',
    technologies: ['Flutter', 'Dart', 'Firebase', 'Cloud Firestore', 'Firebase Auth'],
    githubUrl: 'https://github.com/wovensoul/matchaluv',
    image: 'https://via.placeholder.com/400x200/22c55e/ffffff?text=MatchaLuv',
    featured: false,
    dateCreated: '2025-02-13',
  },
  {
    id: 'personal-blog',
    title: 'Personal Blog',
    description: 'A blog implementing headless CMS with automatic builds and deploys',
    longDescription:
      'Modern blog platform using headless CMS architecture with automated deployment pipeline. Features include content management, SEO optimization, and responsive design.',
    technologies: ['Vue.js', 'Strapi', 'Render', 'Markdown', 'REST API'],
    image: 'https://via.placeholder.com/400x200/888888/ffffff?text=Personal+Blog',
    featured: false,
    dateCreated: '2025-06-10',
  },
  {
    id: 'personal-website',
    title: 'Personal Website',
    description: 'You are here - this portfolio website showcasing modern web development',
    longDescription:
      'A responsive portfolio website built with modern web technologies, featuring dark/light themes, interactive animations, and optimized performance.',
    technologies: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML5'],
    liveUrl: 'https://jeffreychen.work',
    githubUrl: 'https://github.com/wovensoul/personal-website',
    image: 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=Portfolio+Website',
    featured: true,
    dateCreated: '2025-07-07',
  },
])

// Animation state
const sectionVisible = ref(false)
const sectionRef = ref<HTMLElement>()

onMounted(() => {
  // Set up intersection observer for section animation
  if (sectionRef.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionVisible.value = true
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(sectionRef.value)
  }

  // Add structured data for projects using centralized utility
  const projectsData = projects.value.map((project) => ({
    title: project.title,
    description: project.description,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    technologies: project.technologies,
    dateCreated: project.dateCreated,
  }))

  const structuredData = createProjectsListSchema(projectsData)
  injectStructuredData(structuredData, 'projects-schema')
})

onUnmounted(() => {
  // Clean up structured data using centralized utility
  removeStructuredData('projects-schema')
})
</script>

<template>
  <section
    id="projects"
    ref="sectionRef"
    class="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
    :class="{ 'section-visible': sectionVisible }"
    aria-labelledby="projects-heading"
  >
    <div class="max-w-6xl mx-auto">
      <!-- Standardized Section Header -->
      <SectionHeader
        title="Projects"
        subtitle="A collection of projects showcasing modern web development, from full-stack applications to creative experiments"
        :centered="true"
        :level="2"
        id="projects-heading"
      />

      <!-- All Projects in Single Grid -->
      <div class="projects-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-visible {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .section-visible {
    animation: none;
  }

  @keyframes fadeInUp {
    from,
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
