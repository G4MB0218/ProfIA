import { useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell, BookMarked, BookOpenCheck, ChevronDown, GraduationCap, History, Home, Menu,
  MessageCircle, Moon, Plus, Settings, Sparkles, Sun, TrendingUp, UserRound, X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const nav = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/nuovo', label: 'Nuovo esercizio', icon: Plus },
  { to: '/app/correzioni', label: 'Le mie correzioni', icon: History },
  { to: '/app/progressi', label: 'I miei progressi', icon: TrendingUp },
  { to: '/app/ripassare', label: 'Da ripassare', icon: BookMarked },
  { to: '/app/chat', label: 'Chat con ProfIA', icon: MessageCircle },
]

export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5">
    <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-brand-600 text-white shadow-lg shadow-brand-600/25">
      <GraduationCap size={22} strokeWidth={2.2} />
      <Sparkles size={11} className="absolute -right-1 -top-1 text-peach" fill="currentColor" />
    </span>
    {!compact && <span className="font-display text-xl font-extrabold tracking-tight text-ink dark:text-white">Prof<span className="text-brand-600 dark:text-brand-300">IA</span></span>}
  </div>
}

export function DemoBadge() {
  return <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Modalità demo</span>
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, setDark } = useApp()
  const location = useLocation()

  return <div className="min-h-screen bg-[#f8f8fc] text-ink dark:bg-[#111421] dark:text-slate-100">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200/80 bg-white px-4 py-5 dark:border-white/10 dark:bg-[#171a28] lg:flex">
      <div className="px-2"><Logo /></div>
      <nav aria-label="Navigazione principale" className="mt-8 flex-1 space-y-1">
        {nav.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'}`}>
          <item.icon size={19} /> {item.label}
        </NavLink>)}
      </nav>
      <div className="space-y-1 border-t border-slate-100 pt-4 dark:border-white/10">
        <NavLink to="/app/profilo" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"><UserRound size={19} /> Profilo</NavLink>
        <NavLink to="/app/impostazioni" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"><Settings size={19} /> Impostazioni</NavLink>
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-300 to-brand-600 text-sm font-bold text-white">G</div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">Giulia R.</p><p className="text-xs text-slate-500 dark:text-slate-400">2ª superiore</p></div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </aside>

    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Chiudi menu" className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} /><div className="absolute inset-y-0 left-0 w-[82%] max-w-xs bg-white p-5 shadow-2xl dark:bg-[#171a28]">
      <div className="flex items-center justify-between"><Logo /><button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Chiudi"><X size={20} /></button></div>
      <nav className="mt-7 space-y-1">{nav.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200' : 'text-slate-600 dark:text-slate-300'}`}><item.icon size={19} />{item.label}</NavLink>)}</nav>
      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/10"><NavLink to="/app/profilo" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-semibold"><UserRound size={19} /> Profilo</NavLink><NavLink to="/app/impostazioni" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-semibold"><Settings size={19} /> Impostazioni</NavLink></div>
    </div></div>}

    <div className="lg:pl-64">
      <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#111421]/85 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden"><button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Apri menu"><Menu size={20} /></button><Logo compact /></div>
        <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex dark:text-slate-400"><BookOpenCheck size={17} /><span>{location.pathname.includes('correzione/') ? 'Correzione in corso' : 'Il tuo spazio di studio'}</span></div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block"><DemoBadge /></div>
          <button className="icon-button" onClick={() => setDark(!dark)} aria-label={dark ? 'Attiva modalità chiara' : 'Attiva modalità scura'}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
          <button className="icon-button relative" aria-label="Notifiche"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500 dark:border-[#171a28]" /></button>
        </div>
      </header>
      <main className="app-grid-bg min-h-[calc(100vh-68px)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><Outlet /></main>
    </div>
  </div>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>{eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}<h1 className="page-title">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>}</div>
    {action}
  </div>
}

export function StatusPill({ status }: { status: string }) {
  const cls = status === 'Corretto' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300' : status === 'Da rivedere' ? 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200'
  return <span className={`chip ${cls}`}><span aria-hidden>{status === 'Corretto' ? '✓' : status === 'Da rivedere' ? '!' : '◐'}</span>{status}</span>
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-6' : 'left-1'}`} /></button>
}
