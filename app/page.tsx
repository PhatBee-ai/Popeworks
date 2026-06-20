import Image from 'next/image'
import { LogoMark } from '@/components/Logo'

const DIRECTORS = [
  'Greg Gray',
  'Justice Mukheli',
  'Lebogang Rasethaba',
  'Monde',
  'Rajay Singh',
  'Tebza Malope',
  'Thabang Moleya',
  'Zee Ntuli',
  'Zwelethu Radebe',
]

const SERVICES = [
  {
    n: '01',
    title: 'Streaming video',
    body: 'Broadcast-grade live streaming pushed to any device, anywhere — the take, the moment it happens.',
  },
  {
    n: '02',
    title: 'Video assist (VT)',
    body: 'On-set playback and monitoring on QTake. Multi-cam, multi-unit — every angle routed and labelled.',
  },
  {
    n: '03',
    title: 'World-class gear',
    body: 'Everything needed to execute, supplied and run: QTake Standard & Pro, Sony monitors, Teradek wireless.',
  },
  {
    n: '04',
    title: 'Live scene tracking',
    body: 'A real-time board for the whole production — upcoming, shooting now, wrapped — on one shareable link.',
  },
]

const GEAR = [
  { name: 'QTake', detail: 'Standard & Pro — industry-standard video assist and playback' },
  { name: 'Sony monitors', detail: 'Calibrated, broadcast-grade reference monitoring' },
  { name: 'Teradek', detail: 'Zero-delay wireless video transmission' },
]

const TEAM = [
  {
    name: 'Thando Ntombela',
    role: 'Founder & lead VT',
    aka: 'The Bearded Pope',
    photo: null,
    bio: 'Founder of PopeWorks. Years on the biggest local and international commercials, trusted by top directors and agencies for streaming and video assist.',
  },
  {
    name: 'Zack Gumede',
    role: 'VT operator',
    aka: null,
    photo: '/brand/team/zack.jpg',
    bio: 'VT operator running playback and streaming on set — keeping every monitor and feed locked across the production.',
  },
  {
    name: 'Tshidiso Makhoba',
    role: 'VTO · VT assistant',
    aka: null,
    photo: '/brand/team/tshidiso.jpg',
    bio: 'Three-plus years across local and international productions. The assistant lead operators rely on in high-demand, complex environments — and the VTO running the desk on standard shoots. Calm under pressure, fast to solve problems.',
  },
]

// Sourced from Thando's CV — monochrome logos for the most recognisable brands.
const CLIENT_LOGOS: [string, string][] = [
  ['netflix', 'Netflix'],
  ['hbo', 'HBO'],
  ['cocacola', 'Coca-Cola'],
  ['nike', 'Nike'],
  ['adidas', 'Adidas'],
  ['samsung', 'Samsung'],
  ['redbull', 'Red Bull'],
  ['mercedes', 'Mercedes-Benz'],
  ['emirates', 'Emirates'],
  ['kfc', 'KFC'],
  ['uber', 'Uber'],
  ['volkswagen', 'Volkswagen'],
  ['renault', 'Renault'],
  ['landrover', 'Land Rover'],
  ['suzuki', 'Suzuki'],
  ['logitech', 'Logitech'],
  ['jbl', 'JBL'],
  ['handm', 'H&M'],
  ['tinder', 'Tinder'],
  ['jameson', 'Jameson'],
]

const MORE_BRANDS = [
  'Showmax', 'SuperSport', 'DStv', 'Vodacom', 'MTN', 'Telkom', 'Cell C',
  'Nedbank', 'FNB', 'Standard Bank', 'Absa', 'Sanlam', 'Old Mutual', 'Hollard',
  'Woolworths', 'Shoprite', 'Spar', 'Makro', 'Castle', 'Savanna', 'Heineken',
  'Amstel', 'Smirnoff', 'Sprite', 'Gatorade', 'Nivea', 'Philips', 'Sasol',
  'Chicken Licken', 'Spur', 'Maybelline',
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
          <div className="hidden md:flex items-center gap-7 text-sm font-medium uppercase tracking-wide">
            <a href="#work" className="hover:underline decoration-4 underline-offset-4">Directors</a>
            <a href="#brands" className="hover:underline decoration-4 underline-offset-4">Brands</a>
            <a href="#services" className="hover:underline decoration-4 underline-offset-4">Services</a>
            <a href="#gear" className="hover:underline decoration-4 underline-offset-4">Gear</a>
            <a href="#team" className="hover:underline decoration-4 underline-offset-4">Team</a>
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
              Streaming video and video assist for film and commercial shoots —
              with all the world-class gear required to execute. So the director,
              the agency and the brand are all in the room, wherever they are.
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

      {/* ---------- Directors ---------- */}
      <section id="work" aria-labelledby="directors-heading" className="border-b-4 border-black px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Directors we've worked with</p>
          <h2 id="directors-heading" className="font-display uppercase text-4xl sm:text-6xl leading-[0.9] tracking-tight max-w-3xl">
            On set with South Africa's best.
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-black">
            {DIRECTORS.map(d => (
              <div
                key={d}
                className="border-b-2 border-r-2 border-black px-5 py-6 font-display text-xl sm:text-2xl uppercase tracking-tight hover:bg-black hover:text-white transition-colors"
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Brands & broadcasters ---------- */}
      <section id="brands" aria-labelledby="brands-heading" className="border-b-4 border-black px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Brands &amp; broadcasters</p>
          <h2 id="brands-heading" className="font-display uppercase text-4xl sm:text-6xl leading-[0.9] tracking-tight max-w-3xl">
            A decade on the biggest commercials.
          </h2>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 border-t-2 border-l-2 border-black">
            {CLIENT_LOGOS.map(([slug, name]) => (
              <div
                key={slug}
                className="border-b-2 border-r-2 border-black flex items-center justify-center p-6 sm:p-8 aspect-[3/2] hover:bg-black transition-colors group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/clients/${slug}.svg`}
                  alt={name}
                  className="max-h-8 sm:max-h-10 w-auto object-contain transition group-hover:invert"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <p className="mt-12 text-xs font-bold uppercase tracking-[0.3em] mb-4 text-zinc-500">Also on set with</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {MORE_BRANDS.map(b => (
              <span key={b} className="font-display text-base sm:text-lg uppercase tracking-tight text-zinc-700">{b}</span>
            ))}
          </div>
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

      {/* ---------- Gear ---------- */}
      <section id="gear" aria-labelledby="gear-heading" className="border-b-4 border-black px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">The kit</p>
          <h2 id="gear-heading" className="font-display uppercase text-4xl sm:text-6xl leading-[0.9] tracking-tight max-w-3xl">
            World-class gear, run by people who know it.
          </h2>
          <div className="mt-14 grid sm:grid-cols-3 gap-6">
            {GEAR.map(g => (
              <div key={g.name} className="border-4 border-black p-8 shadow-[8px_8px_0_#000]">
                <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tight">{g.name}</h3>
                <p className="mt-3 text-sm leading-relaxed">{g.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Team ---------- */}
      <section id="team" aria-labelledby="team-heading" className="border-b-4 border-black px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">The team</p>
          <h2 id="team-heading" className="font-display uppercase text-4xl sm:text-6xl leading-[0.9] tracking-tight max-w-3xl">
            VT operators under PopeWorks.
          </h2>
          <p className="mt-6 leading-relaxed max-w-2xl">
            Founded by Thando Ntombela — the Bearded Pope — PopeWorks has spent
            years on commercial and film sets keeping directors, agencies and
            clients watching the same picture. Same craft, now streamed, with a
            crew of operators behind it.
          </p>

          <div className="mt-14 grid sm:grid-cols-3 gap-6">
            {TEAM.map(m => (
              <div
                key={m.name}
                className="border-4 border-black bg-white shadow-[8px_8px_0_#000] overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/5] border-b-4 border-black flex items-center justify-center bg-zinc-100">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 360px"
                      className="object-cover grayscale"
                    />
                  ) : (
                    <LogoMark className="w-28 h-28" />
                  )}
                </div>
                <div className="p-6 flex-1">
                  <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-zinc-500">{m.role}</p>
                  {m.aka && <p className="mt-0.5 text-xs italic">“{m.aka}”</p>}
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">{m.bio}</p>
                </div>
              </div>
            ))}
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
              href="https://wa.me/27763170744?text=Hi%20PopeWorks%2C%20I%27d%20like%20to%20book%20a%20shoot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center px-8 py-4 font-bold uppercase bg-white text-black border-2 border-white shadow-[6px_6px_0_#fff] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#fff] transition-all"
            >
              WhatsApp · 076 317 0744
            </a>
            <a
              href="mailto:realphonetic@gmail.com?subject=Shoot%20booking"
              className="inline-flex justify-center px-8 py-4 font-bold uppercase bg-black text-white border-2 border-white shadow-[6px_6px_0_#fff] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_#fff] transition-all"
            >
              Email us
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
