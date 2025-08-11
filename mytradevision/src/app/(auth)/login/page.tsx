"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    if (res?.error) setError("Invalid credentials");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-sm text-[#a0b4c8] mb-6">Already have an account? Login</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full bg-transparent border rounded p-3" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="w-full bg-transparent border rounded p-3" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading?"Logging in...":"Login"}</button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <Link href="/signup" className="hover:underline">Create account</Link>
          <Link href="/reset" className="hover:underline">Forgot password?</Link>
        </div>
      </div>
    </main>
  );
}