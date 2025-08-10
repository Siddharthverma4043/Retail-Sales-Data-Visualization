"use client"

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = await signIn('credentials', { email, password, redirect: true, callbackUrl: '/dashboard' })
    if (res?.error) setError(res.error)
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in to continue</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-black">Sign in</button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link href="/signup" className="underline">Create account</Link>
        <Link href="/reset-password" className="underline">Forgot password?</Link>
      </div>
    </div>
  )
}