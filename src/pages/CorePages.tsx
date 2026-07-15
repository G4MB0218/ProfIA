import { useEffect, useRef, useState, type DragEvent, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle, ArrowRight, BookOpen, Camera, Check, ChevronRight, CloudUpload,
  Contrast, Crop, Eye, FileText, ImagePlus, Lightbulb, Lock,
  Mail, RotateCw, ShieldCheck, Sparkles, Star, TrendingUp, WandSparkles,
} from 'lucide-react'
import { DemoBadge, Logo, PageHeader, StatusPill } from '../components/AppShell'
import { demoOcr, schoolLevels, subjects } from '../data'
import { signInAsGuest, signInWithEmail, signInWithGoogle } from '../lib/supabase'
import { useApp } from '../context/AppContext'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('giulia@demo.it')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    const result = await signInWithEmail(email, password)
    setLoading(false)
    if (result.error) setError(result.error.message)
    else navigate('/app')
  }

  async function guest() { setLoading(true); await signInAsGuest(); navigate('/app') }
  async function google() { setLoading(true); const result = await signInWithGoogle(); if (result.demo) navigate('/app'); setLoading(false) }

  return <div className="min-h-screen bg-[#f8f8fc] p-4 dark:bg-[#111421] sm:p-6 lg:p-8">
    <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-lift dark:bg-[#171a28] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-brand-600 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 opacity-25 dot-grid" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-400 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-mint/40 blur-3xl" />
        <div className="relative z-10"><Logo /><div className="mt-24 max-w-lg"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur"><Sparkles size={16} /> Studiare può essere più semplice</span><h1 className="mt-7 font-display text-5xl font-extrabold leading-[1.08]">Non solo la risposta.<br /><span className="text-[#cfcaff]">Il modo per capirla.</span></h1><p className="mt-6 max-w-md text-lg leading-8 text-brand-100">Carica un esercizio e ricevi una spiegazione paziente, chiara e su misura per te.</p></div></div>
        <div className="relative z-10 mt-auto grid grid-cols-3 gap-3">
          {[['12k+', 'Esercizi capiti'], ['94%', 'Più sicurezza'], ['4.9/5', 'Studenti felici']].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><p className="font-display text-xl font-bold">{value}</p><p className="mt-1 text-xs text-brand-100">{label}</p></div>)}
        </div>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden"><Logo /><DemoBadge /></div>
          <p className="eyebrow">Bentornata</p><h2 className="mt-2 font-display text-3xl font-extrabold text-ink dark:text-white">Accedi al tuo spazio</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Riprendi da dove avevi lasciato.</p>
          <form onSubmit={login} className="mt-8 space-y-4">
            <div><label htmlFor="email" className="label">Email</label><div className="relative"><Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} /><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-11" required /></div></div>
            <div><div className="flex justify-between"><label htmlFor="password" className="label">Password</label><button type="button" className="mb-1.5 text-xs font-semibold text-brand-600">Password dimenticata?</button></div><div className="relative"><Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} /><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field pl-11" required /></div></div>
            {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"><AlertCircle className="mr-2 inline" size={16} />{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Accesso…' : 'Accedi'}<ArrowRight size={18} /></button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />oppure<span className="h-px flex-1 bg-slate-200 dark:bg-white/10" /></div>
          <div className="grid gap-3 sm:grid-cols-2"><button onClick={google} className="btn-secondary"><span className="font-bold text-[#4285F4]">G</span> Google</button><button onClick={guest} className="btn-secondary"><Eye size={18} /> Entra come ospite</button></div>
          <p className="mt-7 text-center text-xs leading-5 text-slate-400">Accedendo accetti i <Link className="font-semibold text-brand-600" to="/termini">Termini</Link> e confermi di aver letto la <Link className="font-semibold text-brand-600" to="/privacy">Privacy</Link>.</p>
        </div>
      </section>
    </div>
  </div>
}

export function DashboardPage() {
  const { exercises } = useApp()
  return <div className="mx-auto max-w-7xl animate-float-in">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><p className="text-sm font-medium text-slate-500 dark:text-slate-400">Martedì, 14 luglio</p><h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight dark:text-white">Ciao Giulia! <span aria-hidden>👋</span></h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pronta a capire qualcosa di nuovo?</p></div>
      <Link to="/app/nuovo" className="btn-primary"><PlusIcon /> Nuovo esercizio</Link>
    </div>
    <section className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-brand-700 via-brand-600 to-[#8b64de] p-6 text-white shadow-lift sm:p-8">
      <div className="absolute inset-0 opacity-25 dot-grid" /><div className="absolute -right-8 -top-16 h-56 w-56 rounded-full bg-white/10" /><div className="absolute right-10 top-10 hidden h-44 w-44 rotate-6 rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur sm:block"><div className="h-2 w-16 rounded bg-white/35" /><div className="mt-4 space-y-2"><div className="h-1.5 rounded bg-white/20" /><div className="h-1.5 w-4/5 rounded bg-white/20" /><div className="h-1.5 w-2/3 rounded bg-white/20" /></div><div className="mt-5 font-display text-2xl font-bold text-[#dbd7ff]">2x + 4 = 12</div><div className="mt-3 flex justify-end"><span className="grid h-9 w-9 place-items-center rounded-full bg-mint text-white"><Check size={19} /></span></div></div>
      <div className="relative max-w-xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold"><WandSparkles size={14} /> Il tuo professore virtuale</span><h2 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Hai un esercizio che<br />non ti torna?</h2><p className="mt-4 max-w-md text-sm leading-6 text-brand-100 sm:text-base">Fotografalo o caricalo: lo analizziamo insieme, passaggio dopo passaggio.</p><Link to="/app/nuovo" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-brand-700 shadow-lg transition hover:-translate-y-0.5">Inizia ora <ArrowRight size={18} /></Link></div>
    </section>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_.85fr]">
      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-lg font-bold dark:text-white">Continua a studiare</h2><Link to="/app/correzioni" className="text-sm font-bold text-brand-600 dark:text-brand-300">Vedi tutte</Link></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {exercises.slice(0, 4).map((item, index) => <Link to={`/app/correzione/${item.id}`} key={item.id} className={`card card-hover animate-float-in p-4 animate-delay-${index % 2 + 1}`}><div className="flex items-start gap-3"><SubjectAvatar subject={item.subject} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="truncate font-bold text-slate-800 dark:text-white">{item.title}</p>{item.favorite && <Star size={16} className="shrink-0 text-amber-500" fill="currentColor" />}</div><p className="mt-1 text-xs text-slate-400">{item.subject} · {item.date}</p><div className="mt-3 flex items-center justify-between"><StatusPill status={item.status} /><ChevronRight size={17} className="text-slate-400" /></div></div></div></Link>)}
        </div>
      </section>
      <aside className="space-y-4">
        <div className="card p-5"><div className="flex items-center justify-between"><div><p className="eyebrow">Questa settimana</p><h2 className="mt-1 font-display text-lg font-bold dark:text-white">Il tuo ritmo</h2></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15"><TrendingUp size={22} /></span></div><div className="mt-5 grid grid-cols-3 gap-2 text-center"><Metric value="8" label="Esercizi" /><Metric value="74%" label="Corretti" /><Metric value="4" label="Giorni" /></div><div className="mt-5 flex h-20 items-end gap-2" aria-label="Grafico attività settimanale">{[36, 58, 42, 78, 65, 28, 12].map((h, i) => <div key={i} className="flex flex-1 flex-col items-center gap-1"><span className={`w-full rounded-md ${i === 3 ? 'bg-brand-600' : 'bg-brand-100 dark:bg-brand-500/20'}`} style={{ height: h }} /><span className="text-[10px] text-slate-400">{['L','M','M','G','V','S','D'][i]}</span></div>)}</div></div>
        <div className="card border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-400/20 dark:from-amber-400/10 dark:to-[#1b1e2d]"><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-400/15"><Lightbulb size={20} /></span><div><p className="font-bold dark:text-white">Da ripassare</p><p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">I cambi di segno nelle equazioni meritano ancora un po’ di allenamento.</p><Link to="/app/ripassare" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-amber-700 dark:text-amber-300">Allenati ora <ArrowRight size={15} /></Link></div></div></div>
      </aside>
    </div>
  </div>
}

function PlusIcon() { return <span className="text-xl leading-none">+</span> }
function Metric({ value, label }: { value: string; label: string }) { return <div className="rounded-xl bg-slate-50 px-2 py-3 dark:bg-white/5"><p className="font-display text-lg font-extrabold text-slate-800 dark:text-white">{value}</p><p className="text-[10px] text-slate-400">{label}</p></div> }
function SubjectAvatar({ subject }: { subject: string }) { const colors: Record<string, string> = { Matematica: 'bg-brand-100 text-brand-600', Italiano: 'bg-rose-100 text-rose-600', Fisica: 'bg-sky-100 text-sky-600', Inglese: 'bg-amber-100 text-amber-600', Chimica: 'bg-emerald-100 text-emerald-600' }; return <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${colors[subject] || 'bg-slate-100 text-slate-600'}`}><BookOpen size={20} /></span> }

type UploadPhase = 'upload' | 'preview' | 'ocr'

export function NewExercisePage() {
  const navigate = useNavigate()
  const fileInput = useRef<HTMLInputElement>(null)
  const cameraInput = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<UploadPhase>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [subject, setSubject] = useState('Matematica')
  const [level, setLevel] = useState('Scuola secondaria di secondo grado')
  const [topic, setTopic] = useState('Equazioni di primo grado')
  const [consent, setConsent] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [processing, setProcessing] = useState(false)
  const [ocr, setOcr] = useState(demoOcr)

  useEffect(() => { if (!file || file.type === 'application/pdf') { setPreview(''); return }; const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url) }, [file])

  function chooseFile(next: File | undefined) {
    if (!next) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
    if (!allowed.includes(next.type)) { setError('Formato non supportato. Usa JPG, PNG, WEBP, HEIC o PDF.'); return }
    if (next.size > 12 * 1024 * 1024) { setError('Il file supera il limite di 12 MB. Prova a comprimerlo.'); return }
    setError(''); setFile(next); setPhase('preview')
  }
  function drop(event: DragEvent) { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }
  function runOcr() { if (!consent) { setError('Conferma il consenso al trattamento prima di continuare.'); return }; setError(''); setProcessing(true); window.setTimeout(() => { setProcessing(false); setPhase('ocr') }, 750) }

  const steps = [['Carica', 'upload'], ['Controlla', 'preview'], ['Verifica testo', 'ocr']]
  const phaseIndex = { upload: 0, preview: 1, ocr: 2 }[phase]

  return <div className="mx-auto max-w-5xl animate-float-in">
    <PageHeader eyebrow="Nuovo esercizio" title="Cosa vuoi capire oggi?" description="Carica una foto o un PDF. Prima della correzione potrai controllare tutto il testo riconosciuto." />
    <div className="mb-6 flex items-center justify-center">{steps.map(([label], index) => <div key={label} className="flex items-center"><div className={`flex items-center gap-2 text-xs font-bold ${index <= phaseIndex ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400'}`}><span className={`grid h-7 w-7 place-items-center rounded-full ${index < phaseIndex ? 'bg-brand-600 text-white' : index === phaseIndex ? 'border-2 border-brand-600 bg-brand-50' : 'bg-slate-100 dark:bg-white/5'}`}>{index < phaseIndex ? <Check size={14} /> : index + 1}</span><span className="hidden sm:block">{label}</span></div>{index < steps.length - 1 && <span className={`mx-2 h-px w-8 sm:w-16 ${index < phaseIndex ? 'bg-brand-500' : 'bg-slate-200 dark:bg-white/10'}`} />}</div>)}</div>

    {phase === 'upload' && <div className="card p-5 sm:p-7">
      <div onDragOver={(e) => e.preventDefault()} onDrop={drop} className="dot-grid rounded-[1.5rem] border-2 border-dashed border-brand-200 bg-brand-50/40 px-5 py-12 text-center transition hover:border-brand-400 dark:border-brand-500/30 dark:bg-brand-500/5">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft dark:bg-white/10 dark:text-brand-300"><CloudUpload size={30} /></span><h2 className="mt-5 font-display text-xl font-bold dark:text-white">Trascina qui il tuo esercizio</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">JPG, PNG, WEBP, HEIC o PDF · massimo 12 MB</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button className="btn-primary" onClick={() => cameraInput.current?.click()}><Camera size={18} /> Scatta una foto</button><button className="btn-secondary" onClick={() => fileInput.current?.click()}><ImagePlus size={18} /> Scegli un file</button></div>
        <input ref={fileInput} hidden type="file" accept="image/jpeg,image/png,image/webp,image/heic,application/pdf" onChange={(e) => chooseFile(e.target.files?.[0])} /><input ref={cameraInput} hidden type="file" accept="image/*" capture="environment" onChange={(e) => chooseFile(e.target.files?.[0])} />
      </div>
      {error && <ErrorMessage text={error} />}
      <div className="mt-6 grid gap-4 sm:grid-cols-3"><InfoTile icon={<WandSparkles />} title="Miglioramento automatico" text="Raddrizza e rende il testo più leggibile." /><InfoTile icon={<ShieldCheck />} title="Privacy protetta" text="Puoi oscurare dati personali e volti." /><InfoTile icon={<Eye />} title="Controllo prima dell’analisi" text="Modifica sempre il testo riconosciuto." /></div>
    </div>}

    {phase === 'preview' && <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <div className="card overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/10"><div><p className="font-bold dark:text-white">Anteprima</p><p className="mt-0.5 max-w-[230px] truncate text-xs text-slate-400">{file?.name}</p></div><button className="text-sm font-bold text-brand-600" onClick={() => { setFile(null); setPhase('upload') }}>Cambia file</button></div><div className="grid min-h-[430px] place-items-center overflow-hidden bg-slate-100 p-6 dark:bg-black/20">{file?.type === 'application/pdf' ? <div className="text-center"><FileText size={70} className="mx-auto text-rose-500" /><p className="mt-3 font-bold">Documento PDF</p><p className="text-sm text-slate-400">{file.name}</p></div> : preview ? <img src={preview} alt="Anteprima dell’esercizio caricato" className="max-h-[380px] max-w-full rounded-lg shadow-lg transition" style={{ transform: `rotate(${rotation}deg)`, filter: `brightness(${brightness}%) contrast(${contrast}%)` }} /> : <div className="w-[78%] rounded-xl bg-white p-7 shadow-lg"><div className="h-3 w-1/2 rounded bg-slate-200" /><div className="mt-8 space-y-4 font-display text-xl text-slate-600"><p>3x + 5 = x + 9</p><p>3x − x = 9 + 5</p><p>2x = 14</p><p>x = 7</p></div></div>}</div><div className="flex flex-wrap gap-2 border-t border-slate-100 p-4 dark:border-white/10"><button className="btn-secondary px-3" onClick={() => setRotation((v) => v + 90)}><RotateCw size={17} /> Ruota</button><button className="btn-secondary px-3" onClick={() => setContrast((v) => v === 100 ? 125 : 100)}><Contrast size={17} /> Contrasto</button><button className="btn-secondary px-3"><Crop size={17} /> Ritaglia</button></div></div>
      <div className="card p-5"><h2 className="font-display text-lg font-bold dark:text-white">Dettagli dell’esercizio</h2><div className="mt-5 space-y-4"><div><label className="label" htmlFor="subject">Materia</label><select id="subject" className="field" value={subject} onChange={(e) => setSubject(e.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></div><div><label className="label" htmlFor="level">Livello scolastico</label><select id="level" className="field" value={level} onChange={(e) => setLevel(e.target.value)}>{schoolLevels.map((item) => <option key={item}>{item}</option>)}</select></div><div><label className="label" htmlFor="topic">Argomento <span className="font-normal text-slate-400">(facoltativo)</span></label><input id="topic" className="field" value={topic} onChange={(e) => setTopic(e.target.value)} /></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><label className="label" htmlFor="brightness">Luminosità · {brightness}%</label><input id="brightness" className="w-full accent-brand-600" type="range" min="70" max="140" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /></div><label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10"><input className="mt-1 h-4 w-4 accent-brand-600" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span className="text-xs leading-5 text-slate-500 dark:text-slate-400">Acconsento al trattamento di questo contenuto per effettuare la correzione. I dati non saranno usati per addestrare modelli senza consenso esplicito.</span></label>{error && <ErrorMessage text={error} />}<button className="btn-primary w-full" onClick={runOcr} disabled={processing}>{processing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Riconoscimento in corso…</> : <>Riconosci il testo <ArrowRight size={18} /></>}</button></div></div>
    </div>}

    {phase === 'ocr' && <div className="card overflow-hidden"><div className="border-b border-slate-100 bg-emerald-50/70 px-5 py-4 dark:border-white/10 dark:bg-emerald-400/5"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15"><Check size={18} /></span><div><p className="font-bold text-emerald-800 dark:text-emerald-300">Testo riconosciuto in modalità demo</p><p className="mt-0.5 text-xs text-emerald-700/70 dark:text-emerald-300/70">Controllalo e correggilo prima di avviare l’analisi.</p></div></div></div><div className="space-y-5 p-5 sm:p-7"><OcrField label="Consegna" value={ocr.assignment} onChange={(value) => setOcr({ ...ocr, assignment: value })} /><OcrField label="Svolgimento dello studente" value={ocr.answer} onChange={(value) => setOcr({ ...ocr, answer: value })} rows={6} /><OcrField label="Annotazioni e verifica" value={ocr.notes} onChange={(value) => setOcr({ ...ocr, notes: value })} rows={3} /><div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200"><Eye size={16} className="mr-2 inline" /><strong>Regola anti-invenzione:</strong> se una parte non fosse leggibile, sarebbe segnalata qui e ti chiederemmo una nuova foto o una trascrizione.</div><div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row"><button className="btn-secondary" onClick={() => setPhase('preview')}>Torna all’anteprima</button><button className="btn-primary" onClick={() => navigate('/app/correzione/equazione-primo-grado')}>Analizza e correggi <Sparkles size={18} /></button></div></div></div>}
  </div>
}

function OcrField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) { return <div><div className="mb-2 flex items-center justify-between"><label className="label mb-0">{label}</label><span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">OCR · modificabile</span></div><textarea className="field resize-y leading-7" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} /></div> }
function ErrorMessage({ text }: { text: string }) { return <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"><AlertCircle className="mr-2 inline" size={16} />{text}</p> }
function InfoTile({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <div className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/5"><span className="mt-0.5 text-brand-600 dark:text-brand-300">{icon}</span><div><p className="text-sm font-bold dark:text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{text}</p></div></div> }
