import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const start = new Date(searchParams.get("start") || "1970-01-01");
  const end = new Date(searchParams.get("end") || new Date().toISOString());

  const trades = await prisma.trade.findMany({
    where: {
      userId: session.user.id,
      executedAt: { gte: start, lte: end },
    },
    orderBy: { executedAt: "asc" },
  });

  const totalTrades = trades.length;
  const totalPL = trades.reduce((acc, t) => acc + Number(t.profitLoss), 0);
  const wins = trades.filter((t) => Number(t.profitLoss) > 0).length;
  const losses = totalTrades - wins;
  const winRate = totalTrades ? (wins / totalTrades) * 100 : 0;

  const byStrategy = new Map<string, number>();
  trades.forEach((t) => {
    const val = byStrategy.get(t.strategyName) || 0;
    byStrategy.set(t.strategyName, val + Number(t.profitLoss));
  });
  let topStrategy: string | null = null;
  let maxProfit = -Infinity;
  for (const [strategy, profit] of byStrategy) {
    if (profit > maxProfit) {
      maxProfit = profit;
      topStrategy = strategy;
    }
  }

  let eq = 0;
  const equityCurve = trades.map((t) => {
    eq += Number(t.profitLoss);
    return { date: t.executedAt, value: eq };
  });

  const strategyProfitability = Array.from(byStrategy.entries()).map(([strategy, profit]) => ({
    strategy,
    profit,
  }));

  return Response.json({
    summary: { totalTrades, totalPL, winRate, topStrategy },
    equityCurve,
    strategyProfitability,
    winLoss: { wins, losses },
  });
}