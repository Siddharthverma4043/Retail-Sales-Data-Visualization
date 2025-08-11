"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Trade = {
  id: string;
  executedAt: string;
  stock: string;
  strategyName: string;
  profitLoss: string | number;
  quantity: number;
  entryPrice: string | number;
  exitPrice: string | number;
};

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [strategy, setStrategy] = useState("");
  const [stock, setStock] = useState("");
  const [plType, setPlType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const fetchTrades = async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (strategy) params.set("strategy", strategy);
      if (stock) params.set("stock", stock);
      if (plType) params.set("plType", plType);
      if (start) params.set("start", new Date(start).toISOString());
      if (end) params.set("end", new Date(end).toISOString());
      const res = await fetch(`/api/trades?${params.toString()}`);
      const data = await res.json();
      setTrades(data.trades);
      setTotal(data.total);
      setPage(data.page);
      setPageSize(data.pageSize);
    };
    fetchTrades();
  }, [page, pageSize, strategy, stock, plType, start, end]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trade History</h1>
        <Link href="/trades/add" className="btn-primary">Add Trade</Link>
      </div>

      <div className="glass p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <input className="bg-transparent border rounded p-2" placeholder="Strategy" value={strategy} onChange={(e)=>setStrategy(e.target.value)} />
        <input className="bg-transparent border rounded p-2" placeholder="Stock" value={stock} onChange={(e)=>setStock(e.target.value)} />
        <select className="bg-transparent border rounded p-2" value={plType} onChange={(e)=>setPlType(e.target.value)}>
          <option value="">P/L type</option>
          <option value="profit">Profit</option>
          <option value="loss">Loss</option>
        </select>
        <input type="date" className="bg-transparent border rounded p-2" value={start} onChange={(e)=>setStart(e.target.value)} />
        <input type="date" className="bg-transparent border rounded p-2" value={end} onChange={(e)=>setEnd(e.target.value)} />
        <button className="btn-outline" onClick={()=>{setStrategy("");setStock("");setPlType("");setStart("");setEnd("");}}>Reset</button>
      </div>

      <div className="overflow-x-auto glass">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[#a0b4c8]">
              <th className="p-3">Date</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Strategy</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Entry</th>
              <th className="p-3">Exit</th>
              <th className="p-3">P/L</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.id} className="border-t border-white/10">
                <td className="p-3">{new Date(t.executedAt).toLocaleString()}</td>
                <td className="p-3">{t.stock}</td>
                <td className="p-3">{t.strategyName}</td>
                <td className="p-3">{t.quantity}</td>
                <td className="p-3">{Number(t.entryPrice).toFixed(2)}</td>
                <td className="p-3">{Number(t.exitPrice).toFixed(2)}</td>
                <td className={`p-3 ${Number(t.profitLoss) >= 0 ? "text-green-400" : "text-red-400"}`}>{Number(t.profitLoss).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-[#a0b4c8]">Page {page} of {totalPages || 1}</div>
        <div className="flex gap-2">
          <button disabled={page<=1} onClick={()=>setPage((p)=>p-1)} className="btn-outline disabled:opacity-50">Prev</button>
          <button disabled={page>=totalPages} onClick={()=>setPage((p)=>p+1)} className="btn-outline disabled:opacity-50">Next</button>
        </div>
      </div>
    </main>
  );
}