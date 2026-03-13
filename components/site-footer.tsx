import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-8 w-full max-w-6xl px-4 pb-6">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-black/45 px-6 py-8 md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="select-none text-[64px] font-extrabold uppercase leading-[0.9] tracking-tight text-cyan-500/10 md:text-[160px]">
            NOVASPHERE
          </span>
        </div>

        <div className="relative z-10 grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400 md:text-3xl">NOVASPHERE 2026</h2>
            <p className="text-base text-white/80 md:text-xl">Inter-College Event</p>
            <p className="text-base text-white/80 md:text-xl">
              Sathyabama Institute of Science and Technology, Chennai
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-2xl font-semibold text-purple-400">Contact Us</h3>
            <div className="space-y-4 text-white/80">
              <p className="text-base md:text-lg">neilnickson2007@gmail.com</p>
              <p className="text-base md:text-lg">
                +91 9123579371
                <br />
                +91 8610219015
              </p>
              <p className="text-base md:text-lg">Chennai, Tamil Nadu</p>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-3xl font-semibold text-purple-400">Follow Us</h3>
            <Link
              href="https://www.instagram.com/novasphere_26?igsh=MTNlNWFubDVzZG52Nw=="
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-slate-900/70 text-white/85 transition hover:bg-slate-800"
              aria-label="Follow NOVASPHERE on Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-white/55 md:flex-row">
        <p>© 2026 NOVASPHERE. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
          <Link
            href="/code-of-conduct"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-purple-300 transition hover:text-purple-200"
          >
            NovaSphere Code of Conduct
          </Link>
          <Link
            href="/legal-privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-purple-300 transition hover:text-purple-200"
          >
            NovaSphere Legal &amp; Privacy Policy
          </Link>
          <Link
            href="/admin/login"
            className="font-semibold text-purple-300 transition hover:text-purple-200"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
