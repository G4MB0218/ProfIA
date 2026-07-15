export type CorrectionStatus = 'Corretto' | 'Parzialmente corretto' | 'Da rivedere'
export type CorrectionMode = 'hint' | 'guided' | 'complete'

export interface Exercise {
  id: string
  title: string
  subject: string
  topic: string
  date: string
  status: CorrectionStatus
  score: number
  favorite?: boolean
  review?: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  time: string
}

export interface Profile {
  nickname: string
  age: string
  schoolClass: string
  favoriteSubjects: string
  difficultSubjects: string
  explanationLevel: 'Semplice' | 'Normale' | 'Approfondito'
  goals: string
  language: string
}
