import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const strategy = searchParams.get("strategy") || undefined;
  const stock = searchParams.get("stock") || undefined;
  const plType = searchParams.get("plType") || undefined; // profit | loss
  const start = searchParams.get("start") ? new Date(searchParams.get("start")!) : undefined;
  const end = searchParams.get("end") ? new Date(searchParams.get("end")!) : undefined;

  const where: any = { userId: session.user.id };
  if (strategy) where.strategyName = strategy;
  if (stock) where.stock = stock;
  if (plType === "profit") where.profitLoss = { gt: 0 };
  if (plType === "loss") where.profitLoss = { lt: 0 };
  if (start || end) where.executedAt = { gte: start, lte: end };

  const total = await prisma.trade.count({ where });
  const trades = await prisma.trade.findMany({
    where,
    orderBy: { executedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return Response.json({ trades, total, page, pageSize });
}

const tradeSchema = z.object({
  stock: z.string().min(1),
  executedAt: z.coerce.date(),
  entryPrice: z.number(),
  exitPrice: z.number(),
  quantity: z.number().int(),
  strategyName: z.string().min(1),
  target: z.number().nullable().optional(),
  stopLoss: z.number().nullable().optional(),
  indicators: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const body = tradeSchema.parse(json);

  const profitLoss = (body.exitPrice - body.entryPrice) * body.quantity;

  const trade = await prisma.trade.create({
    data: {
      userId: session.user.id,
      stock: body.stock,
      executedAt: body.executedAt,
      entryPrice: body.entryPrice,
      exitPrice: body.exitPrice,
      quantity: body.quantity,
      strategyName: body.strategyName,
      target: body.target ?? undefined,
      stopLoss: body.stopLoss ?? undefined,
      indicators: body.indicators ?? undefined,
      notes: body.notes ?? undefined,
      profitLoss,
    },
  });

  return Response.json({ trade });
}