// Recreated Bearded Pope emblem — hat + beard inside a ring.
// Hand-traced approximation of the supplied logo image; swap in the real
// vector when available. Uses currentColor so it inverts on dark/light blocks.

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Bearded Pope"
      className={className}
      fill="currentColor"
    >
      {/* ring */}
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="5" />

      {/* hat brim */}
      <ellipse cx="100" cy="88" rx="82" ry="17" />

      {/* hat crown — sits above the brim, the gap reads as the hatband */}
      <path d="M72 46 Q100 37 128 46 L134 80 Q100 88 66 80 Z" />

      {/* beard with carved mouth (evenodd punches the hole) */}
      <path
        fillRule="evenodd"
        d="M60 100
           C 58 142 80 174 100 198
           C 120 174 142 142 140 100
           C 122 112 78 112 60 100 Z
           M86 120
           q14 -7 28 0
           q-3 14 -14 14
           q-11 0 -14 -14 Z"
      />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display leading-[0.82] tracking-tight uppercase ${className}`}>
      Bearded
      <br />
      Pope
    </span>
  )
}

export function LogoLockup({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <LogoMark className="w-28 h-28" />
      <Wordmark className="text-3xl text-center" />
    </div>
  )
}
