import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { data: { user: { email } }, error: null, demo: true }
  const result = await supabase.auth.signInWithPassword({ email, password })
  return { ...result, demo: false }
}

export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: null, demo: true }
  const result = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  return { ...result, demo: false }
}

export async function signInAsGuest() {
  if (!supabase) return { data: { user: { is_anonymous: true } }, error: null, demo: true }
  const result = await supabase.auth.signInAnonymously()
  return { ...result, demo: false }
}

export async function requestAnalysis(exerciseId: string) {
  if (!supabase) return { demo: true, data: null, error: null }
  const { data, error } = await supabase.functions.invoke('analyze-exercise', { body: { exerciseId } })
  return { demo: false, data, error }
}
