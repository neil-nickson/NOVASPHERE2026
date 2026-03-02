"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { TeamRegistrationForm } from "@/components/team-registration-form";

interface WorkshopItem {
  id: string;
  title: string;
  time: string;
  fee: string;
  price: number;
  brochureImage: string;
}

interface Props {
  workshops: WorkshopItem[];
}

export function WorkshopsClient({ workshops }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [registrationOpenId, setRegistrationOpenId] = useState<string | null>(null);

  function handleRegisterClick(workshop: WorkshopItem) {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setRegistrationOpenId((current) => (current === workshop.id ? null : workshop.id));
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {workshops.map((workshop, index) => {
        const isOpen = expandedIndex === index;

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
                <button
                  onClick={() => handleRegisterClick(workshop)}
                  disabled={status === "loading"}
                  className="rounded-md bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-400 disabled:opacity-60"
                >
                  {registrationOpenId === workshop.id ? "Close Registration" : "Register"}
                </button>
              </div>
            </div>

            <p className="mt-2 text-sm text-purple-200">{workshop.time}</p>
            <p className="mt-2 text-sm text-slate-300">{workshop.fee}</p>

            {registrationOpenId === workshop.id && (
              <TeamRegistrationForm
                eventId={workshop.id}
                eventTitle={workshop.title}
                teamSizeText="1"
                onSuccess={() => router.push("/dashboard")}
              />
            )}

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
