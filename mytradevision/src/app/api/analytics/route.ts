import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') || '30d'
  const now = new Date()
  let from: Date | undefined
  if (range.endsWith('d')) {
    const d = parseInt(range)
    from = new Date(now.getTime() - d * 86400_000)
  }

  const where: any = { userId: user.id }
  if (from) where.createdAt = { gte: from }

  const [totalTrades, totals, grouped] = await Promise.all([
    prisma.trade.count({ where }),
    prisma.trade.aggregate({ where, _sum: { profitLoss: true } }),
    prisma.trade.groupBy({ by: ['outcome'], where, _count: { _all: true } })
  ])

  return NextResponse.json({
    totalTrades,
    totalProfit: Number(totals._sum.profitLoss || 0),
    wins: grouped.find(g => g.outcome === 'PROFIT')?._count._all ?? 0,
    losses: grouped.find(g => g.outcome === 'LOSS')?._count._all ?? 0,
  })
}