export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  image?: string
  featured?: boolean
  dateCreated?: string
}
