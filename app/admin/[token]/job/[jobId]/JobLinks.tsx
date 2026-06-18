'use client'

import { useState } from 'react'

function CopyButton({ url, label }: { url: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-xs text-zinc-400 font-mono truncate mb-3">{url}</p>
      <button
        onClick={copy}
        className="w-full py-2.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-100 transition-colors"
      >
        {copied ? 'Copied ✓' : 'Copy link'}
      </button>
    </div>
  )
}

export default function JobLinks({ opUrl, clientUrl }: { opUrl: string; clientUrl: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <CopyButton url={opUrl} label="Operator link — you + assistant" />
      <CopyButton url={clientUrl} label="Client link — agency / brand" />
    </div>
  )
}
