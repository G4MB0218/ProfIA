import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { exercises as demoExercises } from '../data'
import type { Exercise, Profile } from '../types'

type AppContextValue = {
  dark: boolean
  setDark: (value: boolean) => void
  exercises: Exercise[]
  toggleFavorite: (id: string) => void
  toggleReview: (id: string) => void
  profile: Profile
  setProfile: (profile: Profile) => void
}

const defaultProfile: Profile = {
  nickname: 'Giulia', age: '15', schoolClass: '2ª superiore', favoriteSubjects: 'Italiano, Storia', difficultSubjects: 'Matematica, Fisica', explanationLevel: 'Normale', goals: 'Migliorare nelle equazioni e studiare con più regolarità', language: 'Italiano',
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => localStorage.getItem('profia-theme') === 'dark')
  const [exercises, setExercises] = useState(demoExercises)
  const [profile, setProfile] = useState(defaultProfile)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('profia-theme', dark ? 'dark' : 'light')
  }, [dark])

  const value = useMemo(() => ({
    dark, setDark, exercises, profile, setProfile,
    toggleFavorite: (id: string) => setExercises((items) => items.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item)),
    toggleReview: (id: string) => setExercises((items) => items.map((item) => item.id === id ? { ...item, review: !item.review } : item)),
  }), [dark, exercises, profile])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp deve essere usato dentro AppProvider')
  return context
}
