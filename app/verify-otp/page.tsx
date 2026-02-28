"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Verification failed");
    } else {
      setMessage("Email verified successfully. Redirecting to login...");
      setTimeout(() => {
        router.push("/login?verified=1");
      }, 1500);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8 shadow-glow">
      <h1 className="mb-2 text-2xl font-semibold">Verify your email</h1>
      <p className="mb-6 text-sm text-white/60">
        We have sent a 6-digit code to your email. Enter it below to activate your
        account.
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="mb-1 block text-sm text-white/80">Verification code</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full tracking-[0.4em] rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-center font-semibold outline-none ring-0 focus:border-blue-500 focus:bg-black/60"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}

