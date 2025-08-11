"use client";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
      }
    };
    fetchMe();
  }, []);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    setMessage(res.ok ? "Profile updated" : "Failed to update");
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setMessage(res.ok ? "Password updated" : "Failed to update password");
  };

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <form onSubmit={updateProfile} className="glass p-4 space-y-3">
        <input className="w-full bg-transparent border rounded p-3" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full bg-transparent border rounded p-3" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <button className="btn-primary">Save</button>
      </form>

      <form onSubmit={updatePassword} className="glass p-4 space-y-3">
        <input className="w-full bg-transparent border rounded p-3" placeholder="New Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn-outline">Update Password</button>
      </form>

      {message && <p className="text-sm text-[#a0b4c8]">{message}</p>}

      <button onClick={()=>signOut({ callbackUrl: "/" })} className="btn-outline">Logout</button>
    </main>
  );
}