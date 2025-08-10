"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    const data = await res.json()
    if (!res.ok) return setMessage(data.error || 'Registration failed')
    setMessage('Account created. You can sign in now.')
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        {message && <p className="text-sm">{message}</p>}
        <button className="w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-black">Create account</button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link className="underline" href="/signin">Sign in</Link></p>
    </div>
  )
}