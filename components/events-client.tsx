"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TeamRegistrationForm } from "@/components/team-registration-form";

interface EventDto {
  id: string;
  title: string;
  description: string;
  price: number;
  time?: string;
  teamSize?: string;
  finals?: string;
  brief?: string;
  rounds?: Array<{
    name: string;
    time: string;
    points: string[];
  }>;
  judging?: string[];
}

interface Props {
  events: EventDto[];
}

const CATEGORY_BY_INDEX = ["TECH", "DEBATE", "DESIGN", "CHALLENGE", "DEBUG"];

function getCleanTitle(title: string) {
  const parts = title.trim().split(" ");
  if (parts.length > 1 && /\d/.test(parts[0])) {
    return parts.slice(1).join(" ");
  }
  return title;
}

export function EventsClient({ events }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [registrationOpenId, setRegistrationOpenId] = useState<string | null>(null);

  async function handleRegisterClick(event: EventDto) {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setRegistrationOpenId((current) => (current === event.id ? null : event.id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {events.map((event, index) => {
        const title = getCleanTitle(event.title);
        const category = CATEGORY_BY_INDEX[index] ?? "EVENT";

        return (
          <article
            key={event.id}
            className="group relative overflow-hidden rounded-3xl border border-purple-400/25 bg-gradient-to-b from-purple-950/35 via-slate-950 to-slate-950 p-6 shadow-[0_10px_30px_-12px_rgba(168,85,247,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/60 hover:shadow-[0_18px_45px_-10px_rgba(168,85,247,0.55)]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-2xl" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <span className="rounded-full border border-purple-300/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-purple-200">
                NOVASPHERE 2026
              </span>
              <span className="rounded-full border border-purple-300/35 bg-purple-500/15 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-purple-100">
                {category}
              </span>
            </div>

            <div className="relative z-10 mt-5 space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-purple-200">
                {title}
              </h2>
              <p className="text-sm leading-6 text-slate-300">{event.brief ?? event.description}</p>
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-1 gap-3 border-y border-purple-300/15 py-4 text-sm text-slate-200 sm:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Time</p>
                <p className="mt-1 font-medium text-slate-100">{event.time ?? "TBA"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Team Size</p>
                <p className="mt-1 font-medium text-slate-100">{event.teamSize ?? "TBA"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Registration Fee</p>
                <p className="mt-1 font-semibold text-purple-200">₹{event.price.toFixed(0)} per person</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Finals</p>
                <p className="mt-1 font-medium text-slate-100">{event.finals ?? "No separate finals round"}</p>
              </div>
            </div>

            <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => handleRegisterClick(event)}
                disabled={status === "loading"}
                className="rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-purple-400 disabled:opacity-60"
              >
                {registrationOpenId === event.id ? "Close Registration" : "Register Now"}
              </button>
              <button
                onClick={() =>
                  setExpandedId((current) => (current === event.id ? null : event.id))
                }
                className="rounded-xl border border-purple-300/40 bg-transparent px-4 py-3 text-sm font-semibold uppercase tracking-wider text-purple-100 transition-all hover:bg-purple-500/10"
              >
                {expandedId === event.id ? "Hide Details" : "Details"}
              </button>
            </div>

            {expandedId === event.id && (
              <div className="relative z-10 mt-5 space-y-4 border-t border-purple-300/20 pt-4 text-sm text-slate-300">
                {event.rounds && event.rounds.length > 0 && (
                  <div>
                    <h4 className="font-semibold uppercase tracking-wider text-purple-200">Round-Wise Flow</h4>
                    <div className="mt-3 space-y-3">
                      {event.rounds.map((round) => (
                        <div key={round.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                          <p className="font-semibold text-slate-100">{round.name}</p>
                          <p className="text-xs text-purple-200">{round.time}</p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                            {round.points.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {event.judging && event.judging.length > 0 && (
                  <div>
                    <h4 className="font-semibold uppercase tracking-wider text-purple-200">Judging Criteria</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {event.judging.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {registrationOpenId === event.id && (
              <TeamRegistrationForm
                eventId={event.id}
                eventTitle={event.title}
                eventTime={event.time}
                teamSizeText={event.teamSize}
                onSuccess={() => router.push("/dashboard")}
              />
            )}
          </article>
        );
      })}
    </div>
  );
}

