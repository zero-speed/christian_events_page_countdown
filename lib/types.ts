export type TargetAudience = "niños" | "jóvenes" | "todos" | "mujeres" | "varones"

export interface Comment {
  id: number
  author: string
  text: string
  date: string
  likes?: number
}

export interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  gallery: string[]
  category: string
  targetAudience: TargetAudience
  organizer?: string
  capacity?: string
  confirmations?: number
  comments?: Comment[]
}

export interface AboutData {
  title: string
  subtitle: string
}

export interface GalleryItem {
  id: number
  image: string
  title: string
  description: string
}

export type AdminTab = "dashboard" | "events" | "comments" | "about" | "gallery"
