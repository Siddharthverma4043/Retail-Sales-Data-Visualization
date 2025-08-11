"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Failed to create account");
    } else {
      setSuccess("Account created. You can now log in.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-sm text-[#a0b4c8] mb-6">Sign up to start journaling your trades</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full bg-transparent border rounded p-3" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full bg-transparent border rounded p-3" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="w-full bg-transparent border rounded p-3" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          <button disabled={loading} className="btn-primary w-full">{loading?"Creating...":"Sign Up"}</button>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <Link href="/login" className="hover:underline">Already have an account? Login</Link>
        </div>
      </div>
    </main>
  );
}