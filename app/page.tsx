import Link from 'next/link'

const CLIENTS = [
  'Wunderman Thompson',
  'Ogilvy',
  'VML',
  'Netflix',
  'Showmax',
  'M-Net',
  'Tshimologong',
  'Bioscope',
]

const SERVICES = [
  {
    title: 'Live HD streaming',
    body: 'Broadcast-grade video village pushed to any device, anywhere. Directors, agency and brand watch the take the moment it happens.',
  },
  {
    title: 'Multi-cam VTV',
    body: 'Run two units, multiple cameras, multiple locations. Every angle routed and labelled, nothing lost between setups.',
  },
  {
    title: 'Scene tracking',
    body: 'A live board for the whole production. Upcoming, shooting now, wrapped — so remote stakeholders always know where the day is.',
  },
  {
    title: 'QTake integration',
    body: 'Built on top of the playback and streaming tools your crew already trusts. We add the layer that keeps clients in the loop.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'We rig the village',
    body: 'PopeWorks arrives, sets up the cameras, cables and streaming feed alongside your crew. Zero load on your team.',
  },
  {
    n: '02',
    title: 'You get one link',
    body: 'A single shareable link per shoot day. No apps, no logins — agency and brand open it on any phone, tablet or laptop.',
  },
  {
    n: '03',
    title: 'Watch & track live',
    body: 'The live feed plus a real-time scene board. The room sees the take and knows exactly where the day stands.',
  },
]

export default function Home() {
  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans">
      {/* ---------- Nav ---------- */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-zinc-950/70 border-b border-white/5">
        <nav
          aria-label="Main navigation"
          className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16"
        >
          <span className="font-display text-lg tracking-tight">
            Pope<span className="text-amber-500">Works</span>
          </span>
          <div className="hidden sm:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
          </div>
          <a
            href="#contact"
            className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-amber-400 transition-colors"
          >
            Book a shoot
          </a>
        </nav>
      </header>

      {/* ---------- Hero ---------- */}
      <section
        aria-labelledby="hero-heading"
        className="relative min-h-screen flex flex-col justify-center px-5 sm:px-8 pt-24 pb-16 overflow-hidden"
      >
        {/* atmosphere */}
        <div className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.10),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_4px)]" />

        <div className="relative max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2.5 mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Video Village · Live transmission
            </span>
          </div>

          <h1
            id="hero-heading"
            className="font-display font-light leading-[0.95] tracking-tight text-[clamp(2.75rem,9vw,7.5rem)]"
          >
            Live eyes on
            <br />
            <span className="italic text-amber-500">every frame.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            PopeWorks streams your shoot in broadcast HD and tracks every scene
            in real time — so the director, the agency and the brand are all in
            the room, wherever they are.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="inline-flex justify-center px-7 py-3.5 rounded-full bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
            >
              Book a shoot
            </a>
            <a
              href="#how"
              className="inline-flex justify-center items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-zinc-200 hover:border-white/40 transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto w-full mt-20 grid grid-cols-3 gap-px text-center">
          {[
            ['12+ yrs', 'On commercial sets'],
            ['2 units', 'Streamed simultaneously'],
            ['0 apps', 'For clients to install'],
          ].map(([stat, label]) => (
            <div key={label} className="py-6">
              <p className="font-display text-2xl sm:text-4xl text-white">{stat}</p>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Clients marquee ---------- */}
      <section id="work" aria-label="Selected clients" className="border-y border-white/5 py-10 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-zinc-600 mb-8">
          Trusted on set by
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 px-5 max-w-5xl mx-auto">
          {CLIENTS.map(c => (
            <span
              key={c}
              className="font-display text-lg sm:text-2xl text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" aria-labelledby="how-heading" className="px-5 sm:px-8 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-500 mb-4">How it works</p>
          <h2 id="how-heading" className="font-display font-light text-4xl sm:text-6xl tracking-tight max-w-2xl">
            One link. The whole production in sync.
          </h2>

          <div className="mt-16 grid sm:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {STEPS.map(step => (
              <div key={step.n} className="bg-zinc-950 p-8 sm:p-10 group">
                <span className="font-display text-5xl text-zinc-700 group-hover:text-amber-500 transition-colors">
                  {step.n}
                </span>
                <h3 className="mt-6 text-xl font-medium">{step.title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services (bento) ---------- */}
      <section id="services" aria-labelledby="services-heading" className="px-5 sm:px-8 pb-24 sm:pb-32">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-500 mb-4">What we do</p>
          <h2 id="services-heading" className="font-display font-light text-4xl sm:text-6xl tracking-tight max-w-2xl">
            The village, the feed, the board.
          </h2>

          <div className="mt-16 grid sm:grid-cols-2 gap-4">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className={`rounded-2xl border border-white/10 p-8 sm:p-10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-amber-500/40 transition-colors ${
                  i === 0 ? 'sm:row-span-1' : ''
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-amber-500">0{i + 1}</span>
                  <h3 className="text-xl sm:text-2xl font-medium">{s.title}</h3>
                </div>
                <p className="mt-4 text-zinc-400 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Founder ---------- */}
      <section aria-labelledby="founder-heading" className="px-5 sm:px-8 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-[1fr_1.4fr] gap-12 items-center">
          <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-amber-500/20 via-zinc-900 to-zinc-950 border border-white/10 flex items-end p-8">
            <div>
              <p className="font-display text-2xl">Thando Ntombela</p>
              <p className="text-sm text-amber-500">“The Bearded Pope” · Founder & lead VT</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-500 mb-4">The operator</p>
            <h2 id="founder-heading" className="font-display font-light text-3xl sm:text-5xl leading-tight tracking-tight">
              A decade in the video village, now <span className="italic text-amber-500">streamed.</span>
            </h2>
            <p className="mt-6 text-zinc-400 leading-relaxed max-w-xl">
              PopeWorks is run by Thando Ntombela — a VT operator who has spent
              years on commercial and film sets keeping directors, agencies and
              clients watching the same picture. The physical board on the
              monitor wall became a live link. The clipboard became a real-time
              scene tracker. Same craft, no walls.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Contact CTA ---------- */}
      <section id="contact" aria-labelledby="contact-heading" className="px-5 sm:px-8 py-28 sm:py-40 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.12),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 id="contact-heading" className="font-display font-light text-4xl sm:text-7xl tracking-tight leading-[0.95]">
            Got a shoot
            <br />
            <span className="italic text-amber-500">coming up?</span>
          </h2>
          <p className="mt-6 text-zinc-400 max-w-md mx-auto">
            Tell us the dates and the brief. We'll bring the village, the feed
            and the board.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="mailto:hello@popeworks.co.za?subject=Shoot%20booking"
              className="inline-flex justify-center px-8 py-4 rounded-full bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
            >
              hello@popeworks.co.za
            </a>
            <a
              href="https://wa.me/27000000000"
              className="inline-flex justify-center px-8 py-4 rounded-full border border-white/15 text-zinc-200 hover:border-white/40 transition-colors"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/5 px-5 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <span className="font-display text-base text-zinc-400">
            Pope<span className="text-amber-500">Works</span>
          </span>
          <p>© {new Date().getFullYear()} PopeWorks · Video Village & Live Transmission · Johannesburg</p>
        </div>
      </footer>
    </div>
  )
}
