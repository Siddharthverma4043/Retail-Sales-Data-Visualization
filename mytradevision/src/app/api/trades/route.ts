import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const TradeSchema = z.object({
  stock: z.string().min(1),
  entryAt: z.string(),
  exitAt: z.string().optional(),
  buyPrice: z.coerce.number(),
  sellPrice: z.coerce.number().optional(),
  quantity: z.coerce.number().int().positive(),
  strategyName: z.string().min(1),
  targetPrice: z.coerce.number().optional(),
  stopLossPrice: z.coerce.number().optional(),
  indicators: z.array(z.string()).default([]),
  notes: z.string().optional()
})

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const strategy = searchParams.get('strategy') || undefined
  const stock = searchParams.get('stock') || undefined
  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined
  const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined

  const trades = await prisma.trade.findMany({
    where: {
      userId: user.id,
      strategyName: strategy,
      stock,
      ...(from || to ? { entryAt: { gte: from, lte: to } } : {})
    },
    orderBy: { entryAt: 'desc' },
    include: { indicators: { include: { indicator: true } } }
  })

  return NextResponse.json(trades)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await req.json()
  const parsed = TradeSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const t = parsed.data

  const sell = t.sellPrice ?? 0
  const qty = t.quantity
  const pl = t.sellPrice ? (sell - t.buyPrice) * qty : 0
  const outcome = t.sellPrice ? (pl >= 0 ? 'PROFIT' : 'LOSS') : 'OPEN'

  const indicatorRecords = await Promise.all(
    (t.indicators || []).map(async name => {
      const ind = await prisma.indicator.upsert({ where: { name }, update: {}, create: { name } })
      return { indicatorId: ind.id }
    })
  )

  const trade = await prisma.trade.create({
    data: {
      userId: user.id,
      stock: t.stock,
      entryAt: new Date(t.entryAt),
      exitAt: t.exitAt ? new Date(t.exitAt) : null,
      buyPrice: t.buyPrice,
      sellPrice: t.sellPrice ?? null,
      quantity: t.quantity,
      strategyName: t.strategyName,
      targetPrice: t.targetPrice ?? null,
      stopLossPrice: t.stopLossPrice ?? null,
      notes: t.notes,
      profitLoss: pl,
      outcome,
      indicators: { create: indicatorRecords }
    }
  })

  return NextResponse.json(trade)
}