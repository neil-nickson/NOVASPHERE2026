"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST"
      });
    } finally {
      router.push("/admin/login");
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-purple-300/40 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-100 transition hover:bg-purple-500/25 disabled:opacity-60"
    >
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
