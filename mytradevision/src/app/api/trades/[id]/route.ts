import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(_req: Request, context: any) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = context.params as { id: string };
  const trade = await prisma.trade.findFirst({ where: { id, userId: (session.user as any).id } });
  if (!trade) return Response.json({ message: "Not found" }, { status: 404 });
  return Response.json({ trade });
}

const updateSchema = z.object({
  stock: z.string().optional(),
  executedAt: z.coerce.date().optional(),
  entryPrice: z.number().optional(),
  exitPrice: z.number().optional(),
  quantity: z.number().int().optional(),
  strategyName: z.string().optional(),
  target: z.number().nullable().optional(),
  stopLoss: z.number().nullable().optional(),
  indicators: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PUT(req: Request, context: any) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = context.params as { id: string };
  const json = await req.json();
  const body = updateSchema.parse(json);

  let profitLoss: number | undefined = undefined;
  if (body.entryPrice !== undefined || body.exitPrice !== undefined || body.quantity !== undefined) {
    const existing = await prisma.trade.findFirst({ where: { id, userId: (session.user as any).id } });
    if (!existing) return Response.json({ message: "Not found" }, { status: 404 });
    const entry = body.entryPrice ?? Number(existing.entryPrice);
    const exit = body.exitPrice ?? Number(existing.exitPrice);
    const qty = body.quantity ?? existing.quantity;
    profitLoss = (exit - entry) * qty;
  }

  const trade = await prisma.trade.update({
    where: { id },
    data: {
      stock: body.stock ?? undefined,
      executedAt: body.executedAt ?? undefined,
      entryPrice: body.entryPrice ?? undefined,
      exitPrice: body.exitPrice ?? undefined,
      quantity: body.quantity ?? undefined,
      strategyName: body.strategyName ?? undefined,
      target: body.target ?? undefined,
      stopLoss: body.stopLoss ?? undefined,
      indicators: body.indicators ?? undefined,
      notes: body.notes ?? undefined,
      profitLoss: profitLoss ?? undefined,
    },
  });

  return Response.json({ trade });
}

export async function DELETE(_req: Request, context: any) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = context.params as { id: string };
  await prisma.trade.delete({ where: { id } });
  return Response.json({ ok: true });
}