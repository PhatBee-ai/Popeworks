'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Job, Scene, ShootDay } from '@/lib/supabase'

type Props = {
  job: Job
  shootDays: ShootDay[]
  initialScenes: Scene[]
}

function todayISO() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function defaultDayId(days: ShootDay[], scenes: Scene[]): string | null {
  if (days.length === 0) return null
  const today = todayISO()
  const byDate = days.find(d => d.shoot_date === today)
  if (byDate) return byDate.id
  const inprog = scenes.find(s => s.status === 'inprogress')
  if (inprog?.shoot_day_id) return inprog.shoot_day_id
  return days[days.length - 1].id
}

export default function ClientBoard({ job, shootDays, initialScenes }: Props) {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes)
  const [activeDayId, setActiveDayId] = useState<string | null>(() =>
    defaultDayId(shootDays, initialScenes)
  )

  useEffect(() => {
    let client: ReturnType<typeof createSupabaseClient>
    try {
      client = createSupabaseClient()
    } catch {
      return
    }
    const channel = client
      .channel(`client-scenes-${job.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'scenes', filter: `job_id=eq.${job.id}` },
        payload => {
          setScenes(prev => prev.map(s => (s.id === payload.new.id ? (payload.new as Scene) : s)))
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scenes', filter: `job_id=eq.${job.id}` },
        payload => {
          const row = payload.new as Scene
          setScenes(prev => (prev.some(s => s.id === row.id) ? prev : [...prev, row]))
        }
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [job.id])

  const isMultiUnit = job.units === 2
  const isLongForm = job.type !== 'commercial'

  const activeDay = shootDays.find(d => d.id === activeDayId) ?? null
  const dayScenes = scenes.filter(s => s.shoot_day_id === activeDayId)
  const dayDone = dayScenes.filter(s => s.status === 'complete').length

  // Production rollup
  const prodTotal = scenes.length
  const prodDone = scenes.filter(s => s.status === 'complete').length
  const prodPct = prodTotal > 0 ? Math.round((prodDone / prodTotal) * 100) : 0
  const dayIndex = shootDays.findIndex(d => d.id === activeDayId) + 1

  return (
    <div className="max-w-xl mx-auto px-5 py-8 sm:py-10">
      {/* Masthead */}
      <header className="border-b-2 border-black pb-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display uppercase text-xs tracking-[0.3em]">Shot list</p>
          <p className="text-xs tabular-nums text-black/50">{dayDone}/{dayScenes.length} shot</p>
        </div>
        <h1 className="font-display uppercase text-2xl sm:text-3xl tracking-tight mt-1.5 leading-none">
          {job.title}
        </h1>
        <p className="text-xs text-black/50 mt-2">
          {activeDay?.label ? `${activeDay.label} · ` : ''}
          {activeDay?.shoot_date
            ? new Date(activeDay.shoot_date).toLocaleDateString('en-ZA', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
            : ''}
          {activeDay?.location ? ` · ${activeDay.location}` : job.location ? ` · ${job.location}` : ''}
        </p>
      </header>

      {/* Watch live */}
      {job.qtake_url && (
        <a
          href={job.qtake_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full mt-5 px-5 py-3.5 bg-black text-white font-bold uppercase text-sm border-2 border-black shadow-[5px_5px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          Watch live
        </a>
      )}

      {/* Day selector (long-form) */}
      {shootDays.length > 1 && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {shootDays.map((d, i) => {
            const dScenes = scenes.filter(s => s.shoot_day_id === d.id)
            const allDone = dScenes.length > 0 && dScenes.every(s => s.status === 'complete')
            const active = d.id === activeDayId
            return (
              <button
                key={d.id}
                onClick={() => setActiveDayId(d.id)}
                className={`shrink-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wide border-2 border-black transition-colors ${
                  active ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                {d.label || `Day ${i + 1}`} {allDone ? '✓' : ''}
              </button>
            )
          })}
        </div>
      )}

      {/* Shot list */}
      <ol className="mt-6 border-t border-black/10">
        {dayScenes.map(scene => (
          <ShotRow key={scene.id} scene={scene} isMultiUnit={isMultiUnit} />
        ))}
        {dayScenes.length === 0 && (
          <li className="py-6 text-sm text-black/40">No scenes listed for this day yet.</li>
        )}
      </ol>

      {/* Production rollup (long-form) */}
      {isLongForm && shootDays.length > 0 && (
        <div className="mt-8 border-t-2 border-black pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display uppercase text-xs tracking-[0.3em]">Production progress</p>
            <p className="text-xs tabular-nums text-black/50">{prodDone}/{prodTotal} scenes</p>
          </div>
          <p className="mt-2 text-sm">
            Day {dayIndex} of {shootDays.length} · {prodPct}% of scenes wrapped
          </p>
          <div className="mt-3 h-1.5 bg-black/10 overflow-hidden">
            <div className="h-full bg-black transition-all duration-700" style={{ width: `${prodPct}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

function ShotRow({ scene, isMultiUnit }: { scene: Scene; isMultiUnit: boolean }) {
  const complete = scene.status === 'complete'
  const now = scene.status === 'inprogress'
  const meta = scene.location + (isMultiUnit ? ` · Unit ${scene.unit.toUpperCase()}` : '')

  if (now) {
    return (
      <li className="flex items-center gap-4 px-4 py-4 bg-black text-white">
        <span className="font-display text-lg w-10 shrink-0 tabular-nums">{scene.scene_number}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium truncate">{scene.title}</p>
          <p className="text-xs text-white/60 truncate">{meta}</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] shrink-0">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          Now
        </span>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-4 px-4 py-3.5 border-b border-black/10">
      <span
        className={`font-display text-lg w-10 shrink-0 tabular-nums ${
          complete ? 'line-through text-black/30' : ''
        }`}
      >
        {scene.scene_number}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] truncate ${complete ? 'line-through text-black/30' : 'font-medium'}`}>
          {scene.title}
        </p>
        <p className={`text-xs truncate ${complete ? 'text-black/25' : 'text-black/45'}`}>{meta}</p>
      </div>
      {complete && (
        <svg className="w-4 h-4 text-black/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </li>
  )
}
