"use client"

import { useState } from 'react'

export default function ResetPassword({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/password/reset', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: params.token, password }) })
    const data = await res.json()
    setMessage(res.ok ? 'Password updated. You can sign in.' : data.error || 'Failed to reset password')
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">New password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        <button className="w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-black">Update password</button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  )
}