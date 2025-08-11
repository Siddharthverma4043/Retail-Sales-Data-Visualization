import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight neon-text">
          MyTradeVision — Trade Smart, Trade Insightfully
        </h1>
        <p className="text-lg text-[#a0b4c8]">
          Log trades + visualize your strategy + master your performance.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link href="/signup" className="btn-primary">Sign Up</Link>
          <Link href="/login" className="btn-outline">Login</Link>
        </div>
      </div>
    </main>
  );
}
