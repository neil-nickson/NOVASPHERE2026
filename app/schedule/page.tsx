export default function SchedulePage() {
  return (
    <section className="rounded-3xl border border-purple-500/30 bg-black/45 px-8 py-12 md:px-12 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300 md:text-sm">
            // 7 April 2026
          </p>

          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
            <span className="text-slate-100">Event </span>
            <span className="text-purple-300">Timeline</span>
          </h1>

          <p className="max-w-3xl text-base text-white/65 md:text-xl">
            Full day schedule from 9:00 AM to 3:00 PM
          </p>

          <div className="mt-8 space-y-6 border-l border-purple-500/35 pl-5 md:pl-7">
          <article className="relative rounded-2xl border border-white/10 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-purple-300">8:45 AM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              📋 Participant Check-In &amp; QR Verification
            </h3>
          </article>

          <article className="relative rounded-2xl border border-white/10 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-purple-300">9:00 AM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              🎤 Inauguration &amp; Opening Keynote
            </h3>
          </article>

          <article className="relative rounded-2xl border border-purple-500/30 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-purple-300">9:30 AM – 12:30 PM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              <span className="text-purple-300">1️⃣</span> WEB DEVELOPMENT (WORKSHOP)
            </h3>
            <p className="mt-3 text-sm text-white/75">Entry Fee: ₹149 per person</p>
          </article>

          <article className="relative rounded-2xl border border-white/10 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-purple-300">10:00 AM – 12:00 PM & 1:00 PM – 2:00 PM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">2️⃣ NeuralForge Ideathon</h3>
            <p className="mt-3 text-sm text-white/75">Entry Fee: ₹145 per team</p>
          </article>

          <article className="relative rounded-2xl border border-white/10 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-purple-300">10:00 AM – 11:00 AM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">3️⃣ Quantum Canvas (Tech Poster)</h3>
            <p className="mt-3 text-sm text-white/75">Entry Fee: ₹145 per team</p>
          </article>

          <article className="relative rounded-2xl border border-white/10 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-purple-300">10:00 AM – 12:00 PM & 1:00 PM – 2:00 PM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">4️⃣ Logic Arena: Tech X Debate</h3>
            <p className="mt-3 text-sm text-white/75">Entry Fee: ₹145 per team</p>
          </article>

          <article className="relative rounded-2xl border border-white/10 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-amber-300">12:00 PM – 1:00 PM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">🍽️ Lunch Break</h3>
          </article>

          <article className="relative rounded-2xl border border-purple-500/30 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-purple-300">1:00 PM – 3:00 PM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              <span className="text-purple-300">5️⃣</span> AI TOOLS (WORKSHOP)
            </h3>
            <p className="mt-3 text-sm text-white/75">Entry Fee: ₹149 per person</p>
          </article>

          <article className="relative rounded-2xl border border-white/10 bg-black/35 p-5">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-purple-400 md:-left-[39px]" />
            <p className="text-sm font-semibold text-purple-300">3:00 PM</p>
            <h3 className="mt-2 text-lg font-semibold text-white">✅ Event Concludes</h3>
          </article>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-white/10 bg-black/35 p-6 lg:sticky lg:top-24">
          <h3 className="text-2xl font-semibold text-amber-400">📍 Venue Info</h3>
          <div className="mt-6 space-y-2 text-white/75">
            <p>SCAS Block , SIST,</p>
            <p>Sathyabama Institute of Science and Technology</p>
            <p>Chennai, Tamil Nadu</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
