"use client";
import { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ranges = [
  { key: "7d", label: "Last 7d", start: () => subDays(new Date(), 7) },
  { key: "30d", label: "Last 30d", start: () => subDays(new Date(), 30) },
  { key: "90d", label: "Last 90d", start: () => subDays(new Date(), 90) },
  { key: "all", label: "All", start: () => new Date(0) },
];

export default function DashboardClient() {
  const [range, setRange] = useState("30d");
  const [start, setStart] = useState<Date>(ranges[1].start());
  const [end, setEnd] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [equity, setEquity] = useState<any[]>([]);
  const [strategyPerf, setStrategyPerf] = useState<any[]>([]);
  const [wl, setWl] = useState<{ wins: number; losses: number }>({ wins: 0, losses: 0 });

  useEffect(() => {
    const selected = ranges.find((r) => r.key === range);
    if (selected) setStart(selected.start());
  }, [range]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
      });
      const res = await fetch(`/api/analytics?${params.toString()}`);
      const data = await res.json();
      setSummary(data.summary);
      setEquity(data.equityCurve);
      setStrategyPerf(data.strategyProfitability);
      setWl(data.winLoss);
      setLoading(false);
    };
    fetchData();
  }, [start, end]);

  const equityData = useMemo(() => ({
    labels: equity.map((p) => format(new Date(p.date), "MMM d")),
    datasets: [
      {
        label: "Equity",
        data: equity.map((p) => p.value),
        borderColor: "#00f0ff",
        backgroundColor: "rgba(0,240,255,0.2)",
      },
    ],
  }), [equity]);

  const barData = useMemo(() => ({
    labels: strategyPerf.map((s) => s.strategy),
    datasets: [
      {
        label: "P/L",
        data: strategyPerf.map((s) => s.profit),
        backgroundColor: "rgba(0,255,136,0.4)",
        borderColor: "#00ff88",
      },
    ],
  }), [strategyPerf]);

  const pieData = useMemo(() => ({
    labels: ["Wins", "Losses"],
    datasets: [
      {
        label: "Count",
        data: [wl.wins, wl.losses],
        backgroundColor: ["#00ff88", "#ff4d4d"],
      },
    ],
  }), [wl]);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2 items-center">
          {ranges.map((r) => (
            <button key={r.key} className={`px-3 py-2 rounded border ${range===r.key?"bg-[#0ef] text-black":""}`} onClick={()=>setRange(r.key)}>
              {r.label}
            </button>
          ))}
          <input type="date" value={format(start, "yyyy-MM-dd")} onChange={(e)=>setStart(new Date(e.target.value))} className="bg-transparent border rounded px-2 py-2" />
          <input type="date" value={format(end, "yyyy-MM-dd")} onChange={(e)=>setEnd(new Date(e.target.value))} className="bg-transparent border rounded px-2 py-2" />
        </div>
      </div>

      {loading ? (
        <p className="text-[#a0b4c8]">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass p-4">
              <p className="text-sm text-[#a0b4c8]">Total Trades</p>
              <p className="text-2xl font-bold">{summary?.totalTrades ?? 0}</p>
            </div>
            <div className="glass p-4">
              <p className="text-sm text-[#a0b4c8]">Total P/L</p>
              <p className="text-2xl font-bold">{summary?.totalPL?.toFixed(2) ?? "0.00"}</p>
            </div>
            <div className="glass p-4">
              <p className="text-sm text-[#a0b4c8]">Win Rate</p>
              <p className="text-2xl font-bold">{summary?.winRate?.toFixed(1) ?? 0}%</p>
            </div>
            <div className="glass p-4">
              <p className="text-sm text-[#a0b4c8]">Top Strategy</p>
              <p className="text-2xl font-bold">{summary?.topStrategy ?? "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass p-4 lg:col-span-2">
              <h2 className="font-semibold mb-2">Equity Curve</h2>
              <Line data={equityData} options={{ responsive: true, maintainAspectRatio: false }} height={260} />
            </div>
            <div className="glass p-4">
              <h2 className="font-semibold mb-2">Win vs Loss</h2>
              <Pie data={pieData} />
            </div>
            <div className="glass p-4 lg:col-span-3">
              <h2 className="font-semibold mb-2">Strategy Profitability</h2>
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} height={280} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}