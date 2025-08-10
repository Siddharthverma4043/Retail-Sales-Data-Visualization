"use client"

import { useState } from 'react'

export default function SettingsForm({ user }: { user: { id: string; name: string; email: string } }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    const data = await res.json()
    setMessage(res.ok ? 'Profile updated' : data.error || 'Failed to update')
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Profile Settings</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">New Password (optional)</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        {message && <p className="text-sm">{message}</p>}
        <button className="w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-black">Save changes</button>
      </form>
    </div>
  )
}