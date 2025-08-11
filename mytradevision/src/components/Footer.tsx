import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap justify-between text-sm text-[#a0b4c8]">
        <div>© {new Date().getFullYear()} MyTradeVision</div>
        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
        </nav>
      </div>
    </footer>
  );
}