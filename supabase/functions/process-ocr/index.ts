import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/http.ts'

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Autenticazione richiesta' }, 401)
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Sessione non valida' }, 401)
  const { exerciseId } = await request.json()
  if (!/^[0-9a-f-]{36}$/i.test(exerciseId ?? '')) return json({ error: 'exerciseId non valido' }, 400)
  const { data: file } = await supabase.from('exercise_files').select('*').eq('exercise_id', exerciseId).single()
  if (!file) return json({ error: 'File non trovato' }, 404)
  const endpoint = Deno.env.get('OCR_ENDPOINT'); const key = Deno.env.get('OCR_API_KEY')
  if (!endpoint || !key) return json({ error: 'OCR non configurato', demoAvailable: true }, 503)
  const { data: signed } = await supabase.storage.from('exercise-files').createSignedUrl(file.storage_path, 60)
  if (!signed?.signedUrl) return json({ error: 'Impossibile leggere il file' }, 500)
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 30_000)
  try {
    const result = await fetch(endpoint, { method: 'POST', signal: controller.signal, headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: signed.signedUrl, mimeType: file.mime_type, extract: ['printed_text','handwriting','formulas','tables','units'], doNotGuess: true }) })
    if (!result.ok) return json({ error: 'Riconoscimento OCR non riuscito' }, 502)
    const ocr = await result.json()
    const payload = { user_id: user.id, exercise_id: exerciseId, assignment_text: ocr.assignment ?? '', student_answer: ocr.studentAnswer ?? '', intermediate_steps: ocr.steps ?? [], annotations: ocr.annotations ?? '', unreadable_regions: ocr.unreadableRegions ?? [], confidence: ocr.confidence ?? null, user_verified: false }
    const { data, error } = await supabase.from('ocr_texts').upsert(payload, { onConflict: 'exercise_id' }).select().single()
    if (error) return json({ error: 'Testo riconosciuto ma non salvato' }, 500)
    await supabase.from('exercises').update({ status: 'ocr_ready' }).eq('id', exerciseId)
    return json({ data })
  } catch { return json({ error: 'Timeout o errore di rete OCR' }, 504) } finally { clearTimeout(timeout) }
})
