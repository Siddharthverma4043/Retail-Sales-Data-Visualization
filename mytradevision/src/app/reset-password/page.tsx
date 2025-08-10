"use client"

import { useState } from 'react'

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState('')
  const [link, setLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLink(null)
    const res = await fetch('/api/password/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Failed to create reset link')
    setLink(data.resetUrl)
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-black">Send reset link</button>
      </form>
      {link && (
        <div className="mt-4 rounded-md border p-4 text-sm">
          Reset link (demo): <a className="underline" href={link}>{link}</a>
        </div>
      )}
    </div>
  )
}