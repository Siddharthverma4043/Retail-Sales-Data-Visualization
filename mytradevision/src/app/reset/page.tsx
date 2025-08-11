"use client";
import { useState } from "react";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setMessage(res.ok ? "Password reset successful" : "Failed to reset password");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full bg-transparent border rounded p-3" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="w-full bg-transparent border rounded p-3" placeholder="New Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button className="btn-primary w-full">Reset Password</button>
        </form>
        {message && <p className="mt-4 text-sm text-[#a0b4c8]">{message}</p>}
      </div>
    </main>
  );
}