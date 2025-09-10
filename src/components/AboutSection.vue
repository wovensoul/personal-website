<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SectionHeader from './SectionHeader.vue'
import TechIconGrid from './TechIconGrid.vue'

// Animation state
const isVisible = ref(false)
const aboutRef = ref<HTMLElement>()

// Technology data organized by categories
const languages = [
  { name: 'JavaScript', icon: 'devicon-javascript-plain' },
  { name: 'TypeScript', icon: 'devicon-typescript-plain' },
  { name: 'Python', icon: 'devicon-python-plain' },
  { name: 'Java', icon: 'devicon-java-plain' },
  { name: 'Swift', icon: 'devicon-swift-plain' },
  { name: 'Kotlin', icon: 'devicon-kotlin-plain' },
]

const frameworks = [
  { name: 'Vue.js', icon: 'devicon-vuejs-plain' },
  { name: 'React', icon: 'devicon-react-original' },
  { name: 'Node.js', icon: 'devicon-nodejs-plain' },
  { name: 'Express', icon: 'devicon-express-original' },
  { name: 'Django', icon: 'devicon-django-plain' },
  { name: 'Spring Boot', icon: 'devicon-spring-plain' },
]

const tools = [
  { name: 'Git', icon: 'devicon-git-plain' },
  { name: 'Docker', icon: 'devicon-docker-plain' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
  { name: 'MongoDB', icon: 'devicon-mongodb-plain' },
  { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark' },
  { name: 'Figma', icon: 'devicon-figma-plain' },
]

// Intersection Observer for animations
onMounted(() => {
  if (!aboutRef.value) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px',
    },
  )

  observer.observe(aboutRef.value)
})
</script>

<template>
  <section
    id="about"
    ref="aboutRef"
    class="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
    :class="{ 'animate-fade-in': isVisible }"
    aria-labelledby="about-heading"
  >
    <div class="max-w-6xl mx-auto">
      <!-- Standardized Section Header -->
      <SectionHeader
        title="About Me"
        subtitle="Get to know me, my background, and the technologies I work with"
        :centered="true"
        :level="2"
        id="about-heading"
      />

      <!-- Main Content Layout -->
      <div class="space-y-12 sm:space-y-16">
        <!-- About Content -->
        <article class="max-w-4xl mx-auto">
          <div class="prose prose-base sm:prose-lg max-w-none text-center">
            <p class="text-base sm:text-lg leading-relaxed text-[var(--textcolor)]">
              Hello! My name is Jeffrey but you can call me Jeff! I'm a New Grad who recently
              graduated from NYU with a degree in Computer Science. For the last two years I was a
              software engineer at a startup called Pupil, where we connect underrepresented
              students with mentors to help them thrive.
            </p>

            <p class="text-base sm:text-lg leading-relaxed text-[var(--textcolor)]">
              Currently, I'm participating in hackathons and diving deep into agentic workflow
              frameworks, exploring the fascinating layers of abstractions that power modern
              AI-driven development tools and autonomous systems.
            </p>

            <p class="text-base sm:text-lg leading-relaxed text-[var(--textcolor)]">
              On the side, I'm building projects like MatchaLuv, a matcha-themed social app, with
              plans to add AI-powered features like personalized matcha recipes!
            </p>

            <p class="text-base sm:text-lg leading-relaxed text-[var(--textcolor)]">
              I still have plenty to learn, and I'm always open to connect and chat about tech,
              projects, or whatever's trending! Heels, nails, blade, mascara (bonus points if you
              get the reference)!
            </p>

            <p class="text-base sm:text-lg leading-relaxed text-[var(--textcolor)]">
              When I'm not coding, I love listening to K-pop, ice skating and enjoy trying new foods
              around the city!
            </p>
          </div>
        </article>

        <!-- Skills & Technologies Section -->
        <section aria-labelledby="skills-heading" class="skills-section">
          <div class="mb-8">
            <h3 id="skills-heading" class="text-2xl font-semibold text-[var(--myblue)] mb-2">
              Skills & Technologies
            </h3>
            <!-- <p class="text-[var(--mygray)]">Technologies and tools I use to bring ideas to life</p> -->
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <!-- Languages -->
            <div class="skill-category">
              <h4 class="text-lg font-medium mb-4 text-[var(--textcolor)] flex items-center">
                <span class="w-2 h-2 bg-[var(--myblue)] rounded-full mr-3"></span>
                Languages
              </h4>
              <TechIconGrid :technologies="languages" />
            </div>

            <!-- Frameworks & Libraries -->
            <div class="skill-category">
              <h4 class="text-lg font-medium mb-4 text-[var(--textcolor)] flex items-center">
                <span class="w-2 h-2 bg-[var(--myblue)] rounded-full mr-3"></span>
                Frameworks & Libraries
              </h4>
              <TechIconGrid :technologies="frameworks" />
            </div>

            <!-- Tools & Technologies -->
            <div class="skill-category">
              <h4 class="text-lg font-medium mb-4 text-[var(--textcolor)] flex items-center">
                <span class="w-2 h-2 bg-[var(--myblue)] rounded-full mr-3"></span>
                Tools & Technologies
              </h4>
              <TechIconGrid :technologies="tools" />
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeInUp 0.8s ease-out forwards;
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

.skill-category {
  transition: transform 0.3s ease;
}

.skill-category:hover {
  transform: translateY(-2px);
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
  }

  .skill-category:hover {
    transform: none;
  }

  @keyframes fadeInUp {
    from,
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* Enhanced prose styling */
.prose p {
  margin-bottom: 1.5rem;
  color: var(--textcolor);
}

.prose p:last-child {
  margin-bottom: 0;
}
</style>
