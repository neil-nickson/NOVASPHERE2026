"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState<"1st" | "2nd" | "3rd" | "4th">("1st");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        mobileNumber,
        college,
        course,
        year
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
    } else {
      const devOtpNote = data.devOtp ? ` Dev OTP: ${data.devOtp}` : "";
      setMessage(`${data.message || "Registration successful"}${devOtpNote}`);
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 shadow-glow">
      <h1 className="mb-2 text-2xl font-semibold">Create your account</h1>
      <p className="mb-6 text-sm text-white/60">
        Register once to participate in inter-college events.
      </p>

      {message && (
        <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-white/80">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-black/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-black/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-black/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Mobile Number</label>
          <input
            type="tel"
            required
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-black/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">College</label>
          <input
            type="text"
            required
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-black/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Course</label>
          <input
            type="text"
            required
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-black/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Year</label>
          <select
            required
            value={year}
            onChange={(e) => setYear(e.target.value as "1st" | "2nd" | "3rd" | "4th")}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:bg-black/60"
          >
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-60 md:col-span-2"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}

