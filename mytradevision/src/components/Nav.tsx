"use client";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Nav() {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-wide neon-text">MyTradeVision</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/trades" className="hover:underline">Trades</Link>
          <Link href="/profile" className="hover:underline">Profile</Link>
          <button onClick={()=>setTheme(theme==="dark"?"light":"dark")} className="btn-outline px-3 py-1">{theme==="dark"?"Light":"Dark"}</button>
        </div>
      </div>
    </nav>
  );
}