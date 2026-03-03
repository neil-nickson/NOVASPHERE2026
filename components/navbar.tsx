"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

function NavLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "rounded-md px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-white/10 text-white"
          : "text-white/80 hover:bg-white/5 hover:text-white"
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-4 py-3 md:flex-nowrap md:justify-between">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a
            href="https://www.sathyabama.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-white/5"
          >
            <Image
              src="/sathyabama-logo.png"
              alt="SIST"
              width={38}
              height={38}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-[11px] font-medium text-white/90">SIST</p>
            </div>
          </a>

          <div className="h-8 w-px bg-white/20" />

          <Link href="/" className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-white/5">
            <Image
              src="/nova%20sphere%20logo.jpeg"
              alt="NOVASPHERE"
              width={42}
              height={42}
              className="h-9 w-9 object-contain"
            />
            <div className="leading-tight">
              <p className="text-base font-semibold tracking-tight text-purple-400">NOVASPHERE</p>
              <p className="text-[11px] font-medium text-white/70">2026</p>
            </div>
          </Link>
        </div>
        <nav className="order-3 w-full overflow-x-auto pt-1 md:order-none md:w-auto md:pt-0">
          <div className="flex min-w-max items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/events">Events</NavLink>
            <NavLink href="/schedule">Schedule</NavLink>
            <NavLink href="/leaderboard">Leaderboard</NavLink>
            <NavLink href="/faq">FAQ</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-white/10" />
          ) : session?.user ? (
            <>
              <span className="hidden text-sm text-white/70 md:inline">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-400"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

