import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns'
import Charts from '@/components/charts'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return null

  const [totalTrades, totals, winLoss, recent] = await Promise.all([
    prisma.trade.count({ where: { userId: user.id } }),
    prisma.trade.aggregate({ where: { userId: user.id }, _sum: { profitLoss: true }, _avg: { profitLoss: true } }),
    prisma.trade.groupBy({ by: ['outcome'], where: { userId: user.id }, _count: { _all: true } }),
    prisma.trade.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 })
  ])

  const winCount = winLoss.find(w => w.outcome === 'PROFIT')?._count._all ?? 0
  const lossCount = winLoss.find(w => w.outcome === 'LOSS')?._count._all ?? 0
  const winRate = totalTrades ? Math.round((winCount / totalTrades) * 100) : 0

  const from = subDays(new Date(), 30)
  const series = await prisma.trade.groupBy({
    by: ['userId', 'createdAt'],
    where: { userId: user.id, createdAt: { gte: from } },
    _sum: { profitLoss: true }
  })

  const chartData = series.map(s => ({ x: s.createdAt, y: Number(s._sum.profitLoss || 0) }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Total Trades" value={totalTrades} />
        <Stat title="Total P/L" value={(Number(totals._sum.profitLoss || 0)).toFixed(2)} />
        <Stat title="Avg P/L" value={(Number(totals._avg.profitLoss || 0)).toFixed(2)} />
        <Stat title="Win Rate" value={`${winRate}%`} />
      </div>

      <Charts data={chartData} />

      <div>
        <h2 className="text-lg font-semibold mt-2">Recent Trades</h2>
        <div className="mt-3 overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/40">
              <tr>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Strategy</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">P/L</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(t => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.stock}</td>
                  <td className="p-2">{t.strategyName}</td>
                  <td className="p-2">{t.quantity}</td>
                  <td className="p-2">{Number(t.profitLoss).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-xs uppercase text-slate-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  )
}