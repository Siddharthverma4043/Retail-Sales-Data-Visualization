"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function AddTradePage() {
  const router = useRouter();
  const [stock, setStock] = useState("");
  const [executedAt, setExecutedAt] = useState<string>("");
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [exitPrice, setExitPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [strategyName, setStrategyName] = useState("");
  const [target, setTarget] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [indicators, setIndicators] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const pl = useMemo(() => {
    const ep = parseFloat(entryPrice || "0");
    const xp = parseFloat(exitPrice || "0");
    const q = parseInt(quantity || "0", 10);
    return (xp - ep) * q;
  }, [entryPrice, exitPrice, quantity]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stock,
        executedAt: new Date(executedAt),
        entryPrice: parseFloat(entryPrice),
        exitPrice: parseFloat(exitPrice),
        quantity: parseInt(quantity, 10),
        strategyName,
        target: target ? parseFloat(target) : null,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        indicators,
        notes,
      }),
    });
    if (res.ok) {
      router.push("/trades");
    }
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Trade</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 glass p-4">
        <input className="bg-transparent border rounded p-3" placeholder="Stock" value={stock} onChange={(e)=>setStock(e.target.value)} required />
        <input className="bg-transparent border rounded p-3" placeholder="Date & Time" type="datetime-local" value={executedAt} onChange={(e)=>setExecutedAt(e.target.value)} required />
        <input className="bg-transparent border rounded p-3" placeholder="Entry Price" type="number" step="0.000001" value={entryPrice} onChange={(e)=>setEntryPrice(e.target.value)} required />
        <input className="bg-transparent border rounded p-3" placeholder="Exit Price" type="number" step="0.000001" value={exitPrice} onChange={(e)=>setExitPrice(e.target.value)} required />
        <input className="bg-transparent border rounded p-3" placeholder="Quantity" type="number" value={quantity} onChange={(e)=>setQuantity(e.target.value)} required />
        <input className="bg-transparent border rounded p-3" placeholder="Strategy Name" value={strategyName} onChange={(e)=>setStrategyName(e.target.value)} required />
        <input className="bg-transparent border rounded p-3" placeholder="Target" type="number" step="0.000001" value={target} onChange={(e)=>setTarget(e.target.value)} />
        <input className="bg-transparent border rounded p-3" placeholder="Stop Loss" type="number" step="0.000001" value={stopLoss} onChange={(e)=>setStopLoss(e.target.value)} />
        <input className="bg-transparent border rounded p-3" placeholder="Indicators (comma-separated)" value={indicators} onChange={(e)=>setIndicators(e.target.value)} />
        <textarea className="sm:col-span-2 bg-transparent border rounded p-3" placeholder="Notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
        <div className="sm:col-span-2 flex items-center justify-between">
          <p className="text-[#a0b4c8]">Auto P/L: {pl.toFixed(2)}</p>
          <button className="btn-primary" disabled={loading}>{loading?"Saving...":"Save Trade"}</button>
        </div>
      </form>
    </main>
  );
}