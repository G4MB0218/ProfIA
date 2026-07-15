import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/http.ts'

const SYSTEM_PROMPT = `Sei un professore virtuale paziente, competente, chiaro e incoraggiante. Il tuo compito non è soltanto fornire una risposta corretta, ma aiutare lo studente a comprendere il ragionamento. Analizza attentamente la consegna, la risposta e tutti i passaggi svolti. Evidenzia prima gli aspetti corretti e poi spiega gli errori usando un linguaggio adatto all'età, alla classe e al livello dello studente. Non inventare parti che non riesci a leggere. Se l'immagine è poco chiara, incompleta o ambigua, chiedi una nuova foto o una trascrizione. Quando possibile, fornisci prima un suggerimento e lascia che lo studente riprovi. Distingui sempre gli errori oggettivi dai consigli di stile. Per le materie scientifiche verifica ogni passaggio e non limitarti al risultato finale. Per le materie umanistiche rispetta lo stile personale dello studente. Concludi indicando cosa ripassare e proponendo un esercizio simile. Mantieni sempre un tono positivo, rispettoso e non giudicante.`

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Metodo non consentito' }, 405)

  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Autenticazione richiesta' }, 401)

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return json({ error: 'Sessione non valida' }, 401)

  let exerciseId = ''
  try { exerciseId = (await request.json()).exerciseId } catch { return json({ error: 'Corpo JSON non valido' }, 400) }
  if (!/^[0-9a-f-]{36}$/i.test(exerciseId)) return json({ error: 'exerciseId non valido' }, 400)

  const { data: exercise, error } = await supabase.from('exercises').select('*, ocr_texts(*), profiles:user_id(*)').eq('id', exerciseId).single()
  if (error || !exercise) return json({ error: 'Esercizio non trovato' }, 404)
  if (!exercise.ocr_texts?.user_verified) return json({ error: 'Verifica il testo OCR prima dell’analisi' }, 409)

  const apiKey = Deno.env.get('AI_API_KEY')
  const apiUrl = Deno.env.get('AI_API_URL')
  const model = Deno.env.get('AI_MODEL')
  if (!apiKey || !apiUrl || !model) return json({ error: 'Servizio AI non configurato', demoAvailable: true }, 503)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45_000)
  try {
    const aiResponse = await fetch(apiUrl, {
      method: 'POST', signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Restituisci JSON con verdict, orientation_score, positives, errors (con riga, tipo e gravità), explanations, hints, correct_method, final_result, review_topics e similar_exercise senza soluzione.\nProfilo: ${JSON.stringify(exercise.profiles)}\nEsercizio: ${JSON.stringify(exercise.ocr_texts)}` },
        ],
      }),
    })
    if (!aiResponse.ok) return json({ error: 'Il servizio AI non ha completato la richiesta' }, 502)
    const raw = await aiResponse.json()
    const content = raw.choices?.[0]?.message?.content ?? raw.output_text
    if (!content) return json({ error: 'Risposta AI incompleta' }, 502)
    const correction = typeof content === 'string' ? JSON.parse(content) : content
    const { data: saved, error: saveError } = await supabase.from('corrections').upsert({ ...correction, user_id: user.id, exercise_id: exerciseId, model_name: model, is_demo: false }, { onConflict: 'exercise_id' }).select().single()
    if (saveError) return json({ error: 'Correzione generata ma non salvata' }, 500)
    await supabase.from('exercises').update({ status: 'completed' }).eq('id', exerciseId)
    return json({ data: saved })
  } catch (error) {
    const message = error instanceof DOMException && error.name === 'AbortError' ? 'Timeout del servizio AI' : 'Analisi non disponibile'
    return json({ error: message }, 504)
  } finally { clearTimeout(timeout) }
})
