/**
 * SEO and Structured Data Utilities
 * Manages meta tags, structured data, and SEO optimization
 */

export interface PersonSchema {
  '@context': string
  '@type': string
  name: string
  jobTitle: string
  description: string
  url: string
  sameAs: string[]
  knowsAbout: string[]
  email?: string
  image?: string
  worksFor?: OrganizationSchema[]
  alumniOf?: OrganizationSchema[]
}

export interface OrganizationSchema {
  '@type': string
  name: string
  url?: string
}

export interface ProjectSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  url?: string
  codeRepository?: string
  author: PersonSchema
  programmingLanguage: string[]
  dateCreated: string
  dateModified?: string
  keywords?: string[]
}

export interface WebsiteSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  author: PersonSchema
  inLanguage: string
  copyrightYear: number
  copyrightHolder: PersonSchema
}

/**
 * Creates and injects structured data script into document head
 */
export function injectStructuredData(data: any, id: string): void {
  // Remove existing structured data with same ID
  const existingScript = document.getElementById(id)
  if (existingScript) {
    existingScript.remove()
  }

  // Create new structured data script
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * Removes structured data script from document head
 */
export function removeStructuredData(id: string): void {
  const script = document.getElementById(id)
  if (script) {
    script.remove()
  }
}

/**
 * Updates meta tag content
 */
export function updateMetaTag(name: string, content: string, property = false): void {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let meta = document.querySelector(selector) as HTMLMetaElement

  if (!meta) {
    meta = document.createElement('meta')
    if (property) {
      meta.setAttribute('property', name)
    } else {
      meta.setAttribute('name', name)
    }
    document.head.appendChild(meta)
  }

  meta.content = content
}

/**
 * Creates person schema for Jeffrey Chen
 */
export function createPersonSchema(): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jeffrey Chen',
    jobTitle: 'Software Engineer',
    description:
      'Software Engineer & Creative Problem Solver building meaningful digital experiences with modern web technologies',
    url: 'https://jeffreychen.work',
    email: 'jeffrey@jeffreychen.work',
    image: 'https://jeffreychen.work/profile-image.jpg',
    sameAs: [
      'https://github.com/jffrychn',
      'https://www.linkedin.com/in/jffrychn/',
      'https://jeffreychen.work',
    ],
    knowsAbout: [
      'Software Engineering',
      'Frontend Development',
      'Backend Development',
      'Vue.js',
      'TypeScript',
      'JavaScript',
      'Python',
      'Java',
      'Web Development',
      'Full Stack Development',
      'React',
      'Node.js',
      'Spring Boot',
      'PostgreSQL',
      'MongoDB',
      'AWS',
      'Docker',
      'Git',
    ],
    worksFor: [
      {
        '@type': 'Organization',
        name: 'Pupil',
        url: 'https://pupil.com',
      },
    ],
  }
}

/**
 * Creates website schema
 */
export function createWebsiteSchema(): WebsiteSchema {
  const person = createPersonSchema()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jeffrey Chen - Portfolio',
    description: 'Personal portfolio website showcasing software engineering projects and skills',
    url: 'https://jeffreychen.work',
    author: person,
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: person,
  }
}

/**
 * Creates project schema for a given project
 */
export function createProjectSchema(project: {
  title: string
  description: string
  liveUrl?: string
  githubUrl?: string
  technologies: string[]
  dateCreated: string
  dateModified?: string
}): ProjectSchema {
  const person = createPersonSchema()

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: project.liveUrl,
    codeRepository: project.githubUrl,
    author: person,
    programmingLanguage: project.technologies,
    dateCreated: project.dateCreated,
    dateModified: project.dateModified || project.dateCreated,
    keywords: [...project.technologies, 'Software Development', 'Web Development'],
  }
}

/**
 * Creates ItemList schema for projects collection
 */
export function createProjectsListSchema(projects: any[]): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jeffrey Chen - Software Development Projects',
    description:
      'A curated collection of software development projects showcasing modern web technologies and creative problem-solving',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: createProjectSchema(project),
    })),
  }
}

/**
 * Updates page title dynamically
 */
export function updatePageTitle(title: string): void {
  document.title = title
  updateMetaTag('title', title)
  updateMetaTag('og:title', title, true)
  updateMetaTag('twitter:title', title, true)
}

/**
 * Updates page description dynamically
 */
export function updatePageDescription(description: string): void {
  updateMetaTag('description', description)
  updateMetaTag('og:description', description, true)
  updateMetaTag('twitter:description', description, true)
}

/**
 * Sets up comprehensive SEO for the main page
 */
export function setupMainPageSEO(): void {
  // Inject main structured data
  injectStructuredData(createPersonSchema(), 'person-schema')
  injectStructuredData(createWebsiteSchema(), 'website-schema')

  // Update dynamic meta tags
  updatePageTitle('Jeffrey Chen - Software Engineer & Creative Problem Solver')
  updatePageDescription(
    'Software Engineer building meaningful digital experiences with modern web technologies. Specializing in Vue.js, TypeScript, and full-stack development.',
  )

  // Update additional meta tags
  updateMetaTag(
    'keywords',
    'Jeffrey Chen, Software Engineer, Frontend Developer, Vue.js, TypeScript, Web Development, Portfolio, Full Stack Developer',
  )
  updateMetaTag('author', 'Jeffrey Chen')
  updateMetaTag('og:url', 'https://jeffreychen.work', true)
  updateMetaTag('twitter:url', 'https://jeffreychen.work', true)
}

/**
 * Cleans up SEO data when component unmounts
 */
export function cleanupSEO(): void {
  removeStructuredData('person-schema')
  removeStructuredData('website-schema')
  removeStructuredData('projects-schema')
}
