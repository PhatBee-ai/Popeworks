'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Job, Scene, Unit } from '@/lib/supabase'

type Props = {
  job: Job
  initialScenes: Scene[]
}

export default function OperatorBoard({ job, initialScenes }: Props) {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes)
  const [activeUnit, setActiveUnit] = useState<Unit>('a')

  useEffect(() => {
    const client = createSupabaseClient()
    const channel = client
      .channel(`op-scenes-${job.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'scenes', filter: `job_id=eq.${job.id}` },
        (payload) => {
          setScenes(prev =>
            prev.map(s => (s.id === payload.new.id ? (payload.new as Scene) : s))
          )
        }
      )
      .subscribe()

    return () => { client.removeChannel(channel) }
  }, [job.id])

  async function startScene(scene: Scene) {
    const client = createSupabaseClient()

    const toComplete = scenes.filter(
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
    const client = createSupabaseClient()
    await client.from('scenes').update({ status: 'complete' }).eq('id', scene.id)
    setScenes(prev => prev.map(s => (s.id === scene.id ? { ...s, status: 'complete' } : s)))
  }

  const isMultiUnit = job.units === 2
  const visibleScenes = isMultiUnit
    ? scenes.filter(s => s.unit === activeUnit)
    : scenes

  const nowShooting = visibleScenes.filter(s => s.status === 'inprogress')
  const upcoming = visibleScenes.filter(s => s.status === 'upcoming')
  const done = visibleScenes.filter(s => s.status === 'complete')

  const totalScenes = scenes.length
  const totalDone = scenes.filter(s => s.status === 'complete').length
  const pct = totalScenes > 0 ? Math.round((totalDone / totalScenes) * 100) : 0

  return (
    <div className="max-w-lg mx-auto p-5 pb-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">
              {new Date(job.shoot_date).toLocaleDateString('en-ZA', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </p>
            <h1 className="text-lg font-medium leading-tight">{job.title}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{job.location}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold tabular-nums">{pct}%</p>
            <p className="text-xs text-zinc-500">{totalDone}/{totalScenes} done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

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
          <p className="text-sm text-zinc-600">Tap a scene to start</p>
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

      {/* Upcoming scenes */}
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
