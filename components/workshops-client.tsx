"use client";

import { useState } from "react";
import Image from "next/image";

interface WorkshopItem {
  id: string;
  title: string;
  time: string;
  fee: string;
  price: number;
  brochureImage: string;
  seatsLeft?: number;
}

interface Props {
  workshops: WorkshopItem[];
}

export function WorkshopsClient({ workshops }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const workshopRegistrationLink = "https://forms.gle/9qBmjfR3cMUU7WRo6";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {workshops.map((workshop, index) => {
        const isOpen = expandedIndex === index;
        const seatsLeft = workshop.seatsLeft ?? 0;
        const isSoldOut = seatsLeft <= 0;

        return (
          <article
            key={workshop.id}
            className="group relative overflow-hidden rounded-3xl border border-purple-400/25 bg-gradient-to-b from-purple-950/30 via-slate-950 to-slate-950 p-6 shadow-[0_10px_30px_-12px_rgba(168,85,247,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/60"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-500/15 blur-2xl" />

            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{workshop.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedIndex(isOpen ? null : index)}
                  className="rounded-md border border-purple-300/40 px-3 py-1.5 text-xs font-semibold text-purple-100 hover:bg-purple-500/10"
                >
                  {isOpen ? "Hide details" : "More details"}
                </button>
                <a
                  href={workshopRegistrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`rounded-md bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-400 ${
                    isSoldOut ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  {isSoldOut ? "Seats Full" : "Register"}
                </a>
              </div>
            </div>

            <p className="mt-2 text-sm text-purple-200">{workshop.time}</p>
            <p className="mt-2 text-sm text-slate-300">{workshop.fee}</p>

            {isOpen && (
              <div className="mt-4 overflow-hidden rounded-xl border border-purple-300/20 bg-black/20 p-2">
                <Image
                  src={workshop.brochureImage}
                  alt={`${workshop.title} brochure`}
                  width={1200}
                  height={1600}
                  className="h-auto w-full rounded-lg object-cover"
                />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
