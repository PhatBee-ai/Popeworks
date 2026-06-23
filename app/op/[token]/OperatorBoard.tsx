'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Job, Scene, ShootDay, Unit } from '@/lib/supabase'

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

function dayDateLabel(d: ShootDay | null) {
  if (!d?.shoot_date) return d?.label || ''
  return new Date(d.shoot_date).toLocaleDateString('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function OperatorBoard({ job, shootDays, initialScenes }: Props) {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes)
  const [activeDayId, setActiveDayId] = useState<string | null>(() =>
    defaultDayId(shootDays, initialScenes)
  )
  const [activeUnit, setActiveUnit] = useState<Unit>('a')
  const [online, setOnline] = useState(true)
  const [undoScene, setUndoScene] = useState<Scene | null>(null)

  useEffect(() => {
    let client: ReturnType<typeof createSupabaseClient>
    try {
      client = createSupabaseClient()
    } catch {
      return // no Supabase configured — show initial data without live updates
    }
    const channel = client
      .channel(`op-scenes-${job.id}`)
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

  useEffect(() => {
    setOnline(navigator.onLine)
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  useEffect(() => {
    if (!undoScene) return
    const t = setTimeout(() => setUndoScene(null), 6000)
    return () => clearTimeout(t)
  }, [undoScene])

  const dayScenes = scenes.filter(s => s.shoot_day_id === activeDayId)

  async function startScene(scene: Scene) {
    const client = createSupabaseClient()
    const toComplete = dayScenes.filter(
      s => s.status === 'inprogress' && (job.units === 1 || s.unit === scene.unit)
    )
    for (const s of toComplete) {
      await client.from('scenes').update({ status: 'complete' }).eq('id', s.id)
    }
    await client.from('scenes').update({ status: 'inprogress' }).eq('id', scene.id)
    setScenes(prev =>
      prev.map(s => {
        if (s.id === scene.id) return { ...s, status: 'inprogress' }
        if (toComplete.some(c => c.id === s.id)) return { ...s, status: 'complete' }
        return s
      })
    )
  }

  async function movingOn(scene: Scene) {
    const remaining = dayScenes.filter(
      s => s.id !== scene.id && (s.status === 'upcoming' || s.status === 'inprogress')
    )
    if (remaining.length === 0) {
      const ok = window.confirm('Last scene of the day. Wrap the day?')
      if (!ok) return
    }
    const client = createSupabaseClient()
    await client.from('scenes').update({ status: 'complete' }).eq('id', scene.id)
    setScenes(prev => prev.map(s => (s.id === scene.id ? { ...s, status: 'complete' } : s)))
    setUndoScene(scene)
  }

  async function undoMovingOn(scene: Scene) {
    const client = createSupabaseClient()
    await client.from('scenes').update({ status: 'inprogress' }).eq('id', scene.id)
    setScenes(prev => prev.map(s => (s.id === scene.id ? { ...s, status: 'inprogress' } : s)))
    setUndoScene(null)
  }

  const activeDay = shootDays.find(d => d.id === activeDayId) ?? null
  const isMultiUnit = job.units === 2
  const isLongForm = job.type !== 'commercial'

  const visibleScenes = isMultiUnit ? dayScenes.filter(s => s.unit === activeUnit) : dayScenes
  const nowShooting = visibleScenes.filter(s => s.status === 'inprogress')
  const upcoming = visibleScenes.filter(s => s.status === 'upcoming')
  const done = visibleScenes.filter(s => s.status === 'complete')

  // Day-level progress
  const dayTotal = dayScenes.length
  const dayDone = dayScenes.filter(s => s.status === 'complete').length
  const dayPct = dayTotal > 0 ? Math.round((dayDone / dayTotal) * 100) : 0

  // Production-level progress
  const prodTotal = scenes.length
  const prodDone = scenes.filter(s => s.status === 'complete').length
  const prodPct = prodTotal > 0 ? Math.round((prodDone / prodTotal) * 100) : 0
  const dayIndex = shootDays.findIndex(d => d.id === activeDayId) + 1

  return (
    <div className="max-w-lg mx-auto p-5 pb-10">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">{job.title}</p>
            <h1 className="text-lg font-medium leading-tight truncate">
              {activeDay?.label || 'Day'}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {dayDateLabel(activeDay)}
              {activeDay?.location ? ` · ${activeDay.location}` : ''}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold tabular-nums">{dayPct}%</p>
            <p className="text-xs text-zinc-500">{dayDone}/{dayTotal} today</p>
          </div>
        </div>

        {!online && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/50 border border-red-900/60">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <p className="text-xs text-red-300">Offline — changes will sync when signal returns</p>
          </div>
        )}

        {/* Day progress bar */}
        <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${dayPct}%` }}
          />
        </div>

        {/* Production rollup (long-form) */}
        {isLongForm && shootDays.length > 0 && (
          <p className="mt-2 text-xs text-zinc-500">
            Day {dayIndex} of {shootDays.length} · {prodDone}/{prodTotal} scenes wrapped ({prodPct}%)
          </p>
        )}

        {/* Day selector */}
        {shootDays.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {shootDays.map((d, i) => {
              const dScenes = scenes.filter(s => s.shoot_day_id === d.id)
              const dDone = dScenes.filter(s => s.status === 'complete').length
              const allDone = dScenes.length > 0 && dDone === dScenes.length
              const active = d.id === activeDayId
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDayId(d.id)}
                  className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                    active
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className="block">{d.label || `Day ${i + 1}`}</span>
                  <span className={`block text-[10px] ${active ? 'text-zinc-600' : 'text-zinc-600'}`}>
                    {allDone ? '✓ wrapped' : `${dDone}/${dScenes.length}`}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Unit toggle */}
        {isMultiUnit && (
          <div className="mt-4 flex gap-2">
            {(['a', 'b'] as Unit[]).map(u => (
              <button
                key={u}
                onClick={() => setActiveUnit(u)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeUnit === u
                    ? 'bg-white text-black'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                Unit {u.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Now shooting */}
      {nowShooting.length > 0 ? (
        <div className="space-y-3 mb-6">
          {nowShooting.map(scene => (
            <NowCard key={scene.id} scene={scene} onMovingOn={() => movingOn(scene)} />
          ))}
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-center h-24 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-sm text-zinc-600">
            {dayTotal === 0 ? 'No scenes for this day yet' : 'Tap a scene to start'}
          </p>
        </div>
      )}

      {/* QTake link */}
      {job.qtake_url && (
        <a
          href={job.qtake_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full mb-6 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm font-medium hover:border-zinc-500 transition-colors"
        >
          <span>QTake stream</span>
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Up next</p>
          <div className="space-y-1.5">
            {upcoming.map((scene, i) => (
              <button
                key={scene.id}
                onClick={() => startScene(scene)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors border ${
                  i === 0
                    ? 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span className="text-sm font-bold w-8 text-zinc-300 shrink-0">{scene.scene_number}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{scene.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{scene.location}</p>
                </div>
                {isMultiUnit && (
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full shrink-0">
                    {scene.unit.toUpperCase()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div>
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Complete</p>
          <div className="space-y-1">
            {done.map(scene => (
              <div
                key={scene.id}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-900"
              >
                <span className="text-sm font-bold w-8 text-zinc-700 shrink-0 line-through">{scene.scene_number}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-600 line-through truncate">{scene.title}</p>
                </div>
                <svg className="w-4 h-4 text-zinc-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Undo toast */}
      {undoScene && (
        <div className="fixed inset-x-0 bottom-5 px-5 z-50">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 py-3 bg-zinc-100 text-black rounded-2xl shadow-2xl">
            <p className="text-sm font-medium truncate">Scene {undoScene.scene_number} wrapped</p>
            <button
              onClick={() => undoMovingOn(undoScene)}
              className="text-sm font-semibold px-4 py-1.5 rounded-full bg-black text-white shrink-0 active:scale-95 transition-transform"
            >
              Undo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function NowCard({ scene, onMovingOn }: { scene: Scene; onMovingOn: () => void }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Now shooting</p>
          <p className="text-sm text-zinc-300 truncate">{scene.title}</p>
          <p className="text-xs text-zinc-600 truncate">{scene.location}</p>
        </div>
        <span className="text-5xl font-black text-white tabular-nums leading-none shrink-0">
          {scene.scene_number}
        </span>
      </div>
      <button
        onClick={onMovingOn}
        className="w-full py-4 bg-white text-black text-base font-semibold rounded-xl active:scale-95 transition-transform"
      >
        Moving on →
      </button>
    </div>
  )
}
