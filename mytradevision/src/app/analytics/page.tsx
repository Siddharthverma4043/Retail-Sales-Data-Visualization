import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Charts from '@/components/charts'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return null

  const trades = await prisma.trade.findMany({ where: { userId: user.id } })

  const daily = trades.reduce<Record<string, number>>((acc, t) => {
    const d = new Date(t.createdAt).toISOString().slice(0, 10)
    acc[d] = (acc[d] || 0) + Number(t.profitLoss)
    return acc
  }, {})

  const series = Object.entries(daily).map(([date, y]) => ({ x: new Date(date), y }))

  const totals = trades.reduce((acc, t) => {
    const key = t.strategyName
    const isWin = t.outcome === 'PROFIT'
    if (!acc[key]) acc[key] = { count: 0, wins: 0, profit: 0 }
    acc[key].count++
    acc[key].wins += isWin ? 1 : 0
    acc[key].profit += Number(t.profitLoss)
    return acc
  }, {} as Record<string, { count: number; wins: number; profit: number }>)

  const strategies = Object.entries(totals)
    .map(([name, v]) => ({ name, successRate: Math.round((v.wins / v.count) * 100), profit: v.profit }))
    .sort((a, b) => b.profit - a.profit)

  const wins = trades.filter(t => t.outcome === 'PROFIT').length
  const losses = trades.filter(t => t.outcome === 'LOSS').length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <Charts data={series} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-md border p-4">
          <h2 className="font-semibold mb-3">Profitable vs Losing</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${(wins / Math.max(1, wins + losses)) * 100}%` }} />
              </div>
              <div className="mt-2 text-sm">Wins: {wins} | Losses: {losses}</div>
            </div>
          </div>
        </div>
        <div className="rounded-md border p-4 overflow-x-auto">
          <h2 className="font-semibold mb-3">Strategies</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Strategy</th>
                <th className="p-2 text-left">Success</th>
                <th className="p-2 text-left">Profit</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map(s => (
                <tr key={s.name} className="border-t">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.successRate}%</td>
                  <td className="p-2">{s.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}