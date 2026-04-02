"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadRegistrations() {
    setDownloading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/export-workshops", {
        method: "GET"
      });

      if (!res.ok) {
        let message = "Unable to download registrations. Please sign in as admin first.";
        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch {
          // Ignore JSON parsing errors and keep fallback text.
        }
        setError(message);
        return;
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `all-registrations-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError("Unable to download registrations right now. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-purple-500/30 bg-black/50 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white md:text-3xl">Admin Login</h1>
      <p className="mt-2 text-sm text-white/70">Sign in to view event-wise student registrations.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm text-purple-200">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-purple-400/30 bg-black/40 px-3 py-2 text-white outline-none ring-0 transition focus:border-purple-300"
            required
          />
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-purple-500 px-4 py-2.5 font-semibold text-white transition hover:bg-purple-400 disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {password.trim().length > 0 ? (
          <button
            type="button"
            onClick={handleDownloadRegistrations}
            disabled={downloading}
            className="w-full rounded-xl border border-purple-300/40 bg-transparent px-4 py-2.5 font-semibold text-purple-100 transition hover:bg-purple-500/15 disabled:opacity-70"
          >
            {downloading ? "Preparing Excel..." : "Download All Registrations (Excel)"}
          </button>
        ) : null}
      </form>
    </section>
  );
}
