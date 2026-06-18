import { LogoMark, Wordmark } from '@/components/Logo'

const CLIENTS = [
  'Wunderman Thompson',
  'Ogilvy',
  'VML',
  'Netflix',
  'Showmax',
  'M-Net',
  'Bioscope',
]

const SERVICES = [
  {
    n: '01',
    title: 'Live HD streaming',
    body: 'Broadcast-grade video village pushed to any device, anywhere. The take, the moment it happens.',
  },
  {
    n: '02',
    title: 'Multi-cam VTV',
    body: 'Two units, multiple cameras, multiple locations. Every angle routed and labelled.',
  },
  {
    n: '03',
    title: 'Scene tracking',
    body: 'A live board for the whole production. Upcoming, shooting now, wrapped.',
  },
  {
    n: '04',
    title: 'QTake integration',
    body: 'Built on the playback tools your crew already trusts. We add the client layer.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'We rig the village',
    body: 'PopeWorks arrives, sets up cameras, cables and the streaming feed alongside your crew. Zero load on your team.',
  },
  {
    n: '02',
    title: 'You get one link',
    body: 'A single shareable link per shoot day. No apps, no logins — agency and brand open it on any device.',
  },
  {
    n: '03',
    title: 'Watch & track live',
    body: 'The live feed plus a real-time scene board. The room sees the take and knows where the day stands.',
  },
]

export default function Home() {
  return (
    <div className="bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* ---------- Nav ---------- */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black">
        <nav
          aria-label="Main navigation"
          className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16"
        >
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark className="w-9 h-9" />
            <span className="leading-none">
              <span className="block font-display text-lg uppercase tracking-tight">PopeWorks</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-0.5">
                by the Bearded Pope
              </span>
            </span>
          </a>
          <div className="hidden sm:flex items-center gap-8 text-sm font-medium uppercase tracking-wide">
            <a href="#work" className="hover:underline decoration-4 underline-offset-4">Work</a>
            <a href="#how" className="hover:underline decoration-4 underline-offset-4">How it works</a>
            <a href="#services" className="hover:underline decoration-4 underline-offset-4">Services</a>
          </div>
          <a
            href="#contact"
            className="text-sm font-bold uppercase px-4 py-2 bg-black text-white border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
          >
            Book a shoot
          </a>
        </nav>
      </header>

      {/* ---------- Hero ---------- */}
      <section
        id="top"
        aria-labelledby="hero-heading"
        className="border-b-4 border-black px-5 sm:px-8 py-16 sm:py-24"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 border-2 border-black px-3 py-1 mb-8">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Video Village · Live</span>
            </div>

            <h1
              id="hero-heading"
              className="font-display uppercase leading-[0.85] tracking-tight text-[clamp(2.75rem,9vw,7rem)]"
            >
              Live eyes
              <br />
              on every
              <br />
              frame.
            </h1>

            <p className="mt-8 max-w-lg text-base sm:text-lg leading-relaxed">
              PopeWorks streams your shoot in broadcast HD and tracks every scene
              in real time — so the director, the agency and the brand are all in
              the room, wherever they are.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="inline-flex justify-center px-7 py-4 font-bold uppercase bg-black text-white border-2 border-black shadow-[6px_6px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#000] transition-all"
              >
                Book a shoot
              </a>
              <a
                href="#how"
                className="inline-flex justify-center px-7 py-4 font-bold uppercase bg-white text-black border-2 border-black shadow-[6px_6px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#000] transition-all"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="border-4 border-black p-10 shadow-[10px_10px_0_#000]">
              <LogoMark className="w-44 h-44 sm:w-56 sm:h-56" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats bar (inverted) ---------- */}
      <section aria-label="At a glance" className="bg-black text-white border-b-4 border-black">
        <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x-4 divide-white">
          {[
            ['12+ YRS', 'On commercial sets'],
            ['2 UNITS', 'Streamed at once'],
            ['0 APPS', 'For clients to install'],
          ].map(([stat, label]) => (
            <div key={label} className="py-8 px-4 text-center">
              <p className="font-display text-2xl sm:text-5xl">{stat}</p>
              <p className="text-xs sm:text-sm uppercase tracking-wide text-zinc-400 mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Clients ---------- */}
      <section id="work" aria-label="Selected clients" className="border-b-4 border-black px-5 sm:px-8 py-14">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] mb-8">Trusted on set by</p>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-3">
          {CLIENTS.map(c => (
            <span key={c} className="font-display text-lg sm:text-2xl uppercase tracking-tight">{c}</span>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" aria-labelledby="how-heading" className="border-b-4 border-black px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">How it works</p>
          <h2 id="how-heading" className="font-display uppercase text-4xl sm:text-6xl leading-[0.9] tracking-tight max-w-3xl">
            One link. The whole production in sync.
          </h2>

          <div className="mt-14 grid sm:grid-cols-3 gap-6">
            {STEPS.map(step => (
              <div
                key={step.n}
                className="border-4 border-black p-8 bg-white shadow-[8px_8px_0_#000]"
              >
                <span className="font-display text-6xl">{step.n}</span>
                <h3 className="mt-5 text-xl font-bold uppercase tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services (inverted bento) ---------- */}
      <section id="services" aria-labelledby="services-heading" className="bg-black text-white border-b-4 border-black px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-zinc-400">What we do</p>
          <h2 id="services-heading" className="font-display uppercase text-4xl sm:text-6xl leading-[0.9] tracking-tight max-w-3xl">
            The village, the feed, the board.
          </h2>

          <div className="mt-14 grid sm:grid-cols-2 gap-6">
            {SERVICES.map(s => (
              <div
                key={s.n}
                className="border-4 border-white p-8 sm:p-10 bg-black shadow-[8px_8px_0_#fff]"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm">{s.n}</span>
                  <h3 className="font-display text-2xl uppercase tracking-tight">{s.title}</h3>
                </div>
                <p className="mt-4 text-zinc-300 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Founder ---------- */}
      <section aria-labelledby="founder-heading" className="border-b-4 border-black px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-[1fr_1.4fr] gap-12 items-center">
          <div className="border-4 border-black p-10 shadow-[10px_10px_0_#000] flex flex-col items-center gap-5">
            <LogoMark className="w-32 h-32" />
            <Wordmark className="text-3xl text-center" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">The operator</p>
            <h2 id="founder-heading" className="font-display uppercase text-3xl sm:text-5xl leading-[0.9] tracking-tight">
              A decade in the video village, now streamed.
            </h2>
            <p className="mt-6 leading-relaxed max-w-xl">
              PopeWorks is run by Thando Ntombela — the Bearded Pope — a VT
              operator who has spent years on commercial and film sets keeping
              directors, agencies and clients watching the same picture. The
              physical board on the monitor wall became a live link. The
              clipboard became a real-time scene tracker. Same craft, no walls.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section id="contact" aria-labelledby="contact-heading" className="bg-black text-white px-5 sm:px-8 py-24 sm:py-36">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="contact-heading" className="font-display uppercase text-4xl sm:text-7xl leading-[0.85] tracking-tight">
            Got a shoot
            <br />
            coming up?
          </h2>
          <p className="mt-6 text-zinc-300 max-w-md mx-auto">
            Tell us the dates and the brief. We'll bring the village, the feed
            and the board.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:hello@popeworks.co.za?subject=Shoot%20booking"
              className="inline-flex justify-center px-8 py-4 font-bold uppercase bg-white text-black border-2 border-white shadow-[6px_6px_0_#fff] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#fff] transition-all"
            >
              hello@popeworks.co.za
            </a>
            <a
              href="https://wa.me/27000000000"
              className="inline-flex justify-center px-8 py-4 font-bold uppercase bg-black text-white border-2 border-white shadow-[6px_6px_0_#fff] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#fff] transition-all"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-white border-t-4 border-black px-5 sm:px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="w-8 h-8" />
            <span className="leading-none">
              <span className="block font-display text-base uppercase">PopeWorks</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mt-0.5">
                by the Bearded Pope
              </span>
            </span>
          </div>
          <p className="text-sm text-zinc-600 text-center">
            © {new Date().getFullYear()} PopeWorks · Video Village & Live Transmission · Johannesburg
          </p>
        </div>
      </footer>
    </div>
  )
}
