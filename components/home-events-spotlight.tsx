"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HomeEventCard = {
  id: string;
  code: string;
  title: string;
  category: string;
  time: string;
  fee: string;
};

const HOME_EVENTS: HomeEventCard[] = [
  {
    id: "ideathon",
    code: "001",
    title: "NeuralForge Ideathon",
    category: "TECH",
    time: "9:45 AM – 12:15 PM",
    fee: "₹150 per person"
  },
  {
    id: "logic-arena",
    code: "002",
    title: "Logic Arena: MUN X Tech",
    category: "DEBATE",
    time: "10:00 AM – 12:00 PM",
    fee: "₹150 per person"
  },
  {
    id: "quantum-canvas",
    code: "003",
    title: "Quantum Canvas",
    category: "DESIGN",
    time: "9:45 AM – 12:15 PM",
    fee: "₹150 per person"
  },
  {
    id: "tech-escape",
    code: "004",
    title: "Tech Escape Challenge",
    category: "CHALLENGE",
    time: "10:30 AM – 12:00 PM",
    fee: "₹150 per person"
  },
  {
    id: "debug-dominion",
    code: "005",
    title: "Debug Dominion",
    category: "DEBUG",
    time: "10:30 AM – 12:00 PM",
    fee: "₹150 per person"
  },
  {
    id: "webdev-workshop-morning",
    code: "006",
    title: "Web Development Workshop",
    category: "WORKSHOP",
    time: "9:30 AM – 12:30 PM",
    fee: "₹150 per person"
  },
  {
    id: "ai-tools-workshop",
    code: "007",
    title: "AI Tools Workshop",
    category: "WORKSHOP",
    time: "1:00 PM – 3:00 PM",
    fee: "₹150 per person"
  }
];

const ROTATE_MS = 5000;

function mod(value: number, total: number) {
  return (value + total) % total;
}

export function HomeEventsSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => mod(current + 1, HOME_EVENTS.length));
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, []);

  const activeEvent = HOME_EVENTS[activeIndex];
  const prevEvent = useMemo(
    () => HOME_EVENTS[mod(activeIndex - 1, HOME_EVENTS.length)],
    [activeIndex]
  );
  const nextEvent = useMemo(
    () => HOME_EVENTS[mod(activeIndex + 1, HOME_EVENTS.length)],
    [activeIndex]
  );

  return (
    <section className="rounded-3xl border border-purple-400/25 bg-black/50 p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.18),0_20px_50px_-24px_rgba(168,85,247,0.6)] md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-300/90">
            Event Spotlight
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr,1.35fr,1fr]">
        <article className="hidden rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 opacity-35 blur-[0.2px] transition-all md:block">
          <p className="text-[11px] tracking-[0.14em] text-purple-300">[{prevEvent.code}]</p>
          <h3 className="mt-2 text-lg font-semibold text-white/90">{prevEvent.title}</h3>
          <p className="mt-2 text-xs text-white/60">{prevEvent.category}</p>
        </article>

        <article className="relative overflow-hidden rounded-2xl border border-purple-300/60 bg-gradient-to-b from-purple-900/35 via-purple-950/25 to-black p-6 shadow-[0_0_24px_rgba(168,85,247,0.25)] transition-all duration-500">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-purple-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-fuchsia-400/15 blur-2xl" />

          <p className="relative z-10 text-xs font-semibold tracking-[0.18em] text-purple-200/90">
            [{activeEvent.code}]
          </p>
          <h3 className="relative z-10 mt-3 text-2xl font-extrabold uppercase tracking-tight text-white md:text-3xl">
            {activeEvent.title}
          </h3>

          <div className="relative z-10 mt-5 grid gap-3 rounded-xl border border-purple-300/20 bg-black/25 p-4 text-sm text-white/80 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-purple-200/70">Category</p>
              <p className="mt-1 font-medium text-purple-100">{activeEvent.category}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-purple-200/70">Time</p>
              <p className="mt-1 font-medium text-white">{activeEvent.time}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.12em] text-purple-200/70">Fee</p>
              <p className="mt-1 font-medium text-white">{activeEvent.fee}</p>
            </div>
          </div>

          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/events"
              className="rounded-md border border-purple-300/60 bg-purple-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-purple-500/35"
            >
              Learn More
            </Link>
            <Link
              href="/events"
              className="rounded-md bg-purple-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-purple-400"
            >
              Register
            </Link>
          </div>
        </article>

        <article className="hidden rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 opacity-35 blur-[0.2px] transition-all md:block">
          <p className="text-[11px] tracking-[0.14em] text-purple-300">[{nextEvent.code}]</p>
          <h3 className="mt-2 text-lg font-semibold text-white/90">{nextEvent.title}</h3>
          <p className="mt-2 text-xs text-white/60">{nextEvent.category}</p>
        </article>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {HOME_EVENTS.map((event, index) => (
          <button
            key={event.id}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-purple-300" : "w-3 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Show ${event.title}`}
          />
        ))}
      </div>
    </section>
  );
}
