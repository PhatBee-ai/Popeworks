'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import type { Job, Scene } from '@/lib/supabase'

type Props = {
  job: Job
  initialScenes: Scene[]
}

export default function ClientBoard({ job, initialScenes }: Props) {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes)

  useEffect(() => {
    const client = createSupabaseClient()
    const channel = client
      .channel(`client-scenes-${job.id}`)
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

  const nowShooting = scenes.filter(s => s.status === 'inprogress')
  const totalScenes = scenes.length
  const totalDone = scenes.filter(s => s.status === 'complete').length
  const pct = totalScenes > 0 ? Math.round((totalDone / totalScenes) * 100) : 0
  const isMultiUnit = job.units === 2

  return (
    <div className="max-w-lg mx-auto p-5 pb-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">PopeWorks</p>
        <h1 className="text-lg font-medium leading-tight">{job.title}</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          {new Date(job.shoot_date).toLocaleDateString('en-ZA', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
          {' · '}
          {job.location}
        </p>
      </div>

      {/* Watch live */}
      {job.qtake_url && (
        <a
          href={job.qtake_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full mb-5 px-5 py-4 bg-zinc-900 border border-zinc-700 rounded-2xl hover:border-zinc-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-sm font-medium">Watch live</span>
          </div>
          <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}

      {/* Now shooting banner */}
      {nowShooting.length > 0 && (
        <div className="mb-5 space-y-2">
          {nowShooting.map(scene => (
            <div
              key={scene.id}
              className="flex items-center gap-4 px-5 py-4 bg-amber-950/40 border border-amber-800/50 rounded-2xl"
            >
              <span className="text-4xl font-black text-amber-400 tabular-nums leading-none shrink-0">
                {scene.scene_number}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-amber-500/80 uppercase tracking-widest mb-0.5">
                  {isMultiUnit ? `Unit ${scene.unit.toUpperCase()} · Now shooting` : 'Now shooting'}
                </p>
                <p className="text-sm text-amber-100 font-medium truncate">{scene.title}</p>
                <p className="text-xs text-amber-700 truncate">{scene.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 tabular-nums shrink-0">{totalDone}/{totalScenes}</p>
      </div>

      {/* All scenes */}
      <div className="space-y-1.5">
        {scenes.map(scene => (
          <SceneRow key={scene.id} scene={scene} isMultiUnit={isMultiUnit} />
        ))}
      </div>
    </div>
  )
}

function SceneRow({ scene, isMultiUnit }: { scene: Scene; isMultiUnit: boolean }) {
  const isComplete = scene.status === 'complete'
  const isNow = scene.status === 'inprogress'

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
        isNow
          ? 'bg-amber-950/20 border-amber-800/40'
          : isComplete
          ? 'bg-zinc-950 border-zinc-900 opacity-50'
          : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      <span
        className={`text-sm font-bold w-8 shrink-0 tabular-nums ${
          isComplete ? 'text-zinc-700 line-through' : isNow ? 'text-amber-400' : 'text-zinc-300'
        }`}
      >
        {scene.scene_number}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm truncate ${
            isComplete ? 'text-zinc-700 line-through' : isNow ? 'text-amber-100' : 'text-white'
          }`}
        >
          {scene.title}
        </p>
        <p className="text-xs text-zinc-600 truncate">{scene.location}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isMultiUnit && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isNow ? 'bg-amber-900/50 text-amber-400' : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            {scene.unit.toUpperCase()}
          </span>
        )}
        {isComplete && (
          <svg className="w-4 h-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isNow && (
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
        )}
      </div>
    </div>
  )
}
