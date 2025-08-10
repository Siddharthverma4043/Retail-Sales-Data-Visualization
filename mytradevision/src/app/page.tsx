import Link from 'next/link'
import { ArrowRight, LineChart, Shield, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-300/30 via-transparent to-transparent" />
      <section className="py-24 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl sm:text-6xl font-bold tracking-tight">
          Trade smarter with <span className="text-primary-500">My</span>TradeVision
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-slate-600 dark:text-slate-300">
          Log your stock trades and visualize detailed performance analytics across timeframes.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-5 py-3 text-black font-medium hover:opacity-90">
            Get started <ArrowRight size={18} />
          </Link>
          <Link href="/signin" className="inline-flex items-center gap-2 rounded-md border px-5 py-3 font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
            Login
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3 mt-8">
        <Feature icon={<LineChart />} title="Deep Analytics" desc="Daily, weekly, monthly views with filters by stock and strategy." />
        <Feature icon={<Shield />} title="Secure" desc="Encrypted passwords, secure sessions, privacy-first." />
        <Feature icon={<Zap />} title="Fast & Smooth" desc="Responsive UI with immersive, subtle animations." />
      </section>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border p-6 backdrop-blur bg-white/50 dark:bg-black/30">
      <div className="text-primary-500">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
    </div>
  )
}