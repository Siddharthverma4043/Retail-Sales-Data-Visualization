"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTradePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    stock: '',
    entryAt: '',
    exitAt: '',
    buyPrice: '',
    sellPrice: '',
    quantity: 1,
    strategyName: '',
    targetPrice: '',
    stopLossPrice: '',
    indicators: '' as string,
    notes: ''
  })
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const payload = { ...form, indicators: form.indicators.split(',').map(s => s.trim()).filter(Boolean) }
    const res = await fetch('/api/trades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to save')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Log a trade</h1>
      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Stock" value={form.stock} onChange={v => setForm(f => ({ ...f, stock: v }))} required />
        <Field label="Strategy" value={form.strategyName} onChange={v => setForm(f => ({ ...f, strategyName: v }))} required />
        <Field label="Entry Date & Time" type="datetime-local" value={form.entryAt} onChange={v => setForm(f => ({ ...f, entryAt: v }))} required />
        <Field label="Exit Date & Time" type="datetime-local" value={form.exitAt} onChange={v => setForm(f => ({ ...f, exitAt: v }))} />
        <Field label="Buy Price" type="number" step="0.0001" value={form.buyPrice} onChange={v => setForm(f => ({ ...f, buyPrice: v }))} required />
        <Field label="Sell Price" type="number" step="0.0001" value={form.sellPrice} onChange={v => setForm(f => ({ ...f, sellPrice: v }))} />
        <Field label="Quantity" type="number" value={String(form.quantity)} onChange={v => setForm(f => ({ ...f, quantity: Number(v) }))} required />
        <Field label="Target Price" type="number" step="0.0001" value={form.targetPrice} onChange={v => setForm(f => ({ ...f, targetPrice: v }))} />
        <Field label="Stop Loss Price" type="number" step="0.0001" value={form.stopLossPrice} onChange={v => setForm(f => ({ ...f, stopLossPrice: v }))} />
        <div className="sm:col-span-2">
          <label className="text-sm">Indicators Used (comma separated)</label>
          <input value={form.indicators} onChange={e => setForm(f => ({ ...f, indicators: e.target.value }))} className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm">Additional Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
        </div>
        {error && <p className="sm:col-span-2 text-sm text-red-500">{error}</p>}
        <div className="sm:col-span-2">
          <button className="w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-black">Save trade</button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required = false, step }:
  { label: string, value: string, onChange: (v: string) => void, type?: string, required?: boolean, step?: string }) {
  return (
    <div>
      <label className="text-sm">{label}{required ? ' *' : ''}</label>
      <input value={value} onChange={e => onChange(e.target.value)} type={type} step={step}
        required={required} className="mt-1 w-full rounded-md border bg-transparent px-3 py-2" />
    </div>
  )
}