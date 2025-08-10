"use client"

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut, LogIn } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40">
      <div className="container-fluid flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-xl">
          <span className="text-primary-500">My</span>TradeVision
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/trades/new">Log Trade</Link>
          <Link href="/analytics">Analytics</Link>
          <Link href="/settings">Settings</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {session ? (
            <button
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link href="/signin" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
              <LogIn size={16} /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}