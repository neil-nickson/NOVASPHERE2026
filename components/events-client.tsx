"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handleRegister(event: EventDto) {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setLoadingId(event.id);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Inter-College Events",
        description: event.title,
        order_id: data.orderId,
        prefill: {
          email: session?.user?.email ?? undefined,
          name: session?.user?.name ?? undefined
        },
        theme: {
          color: "#a855f7"
        },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event.id,
              amount: data.amount
            })
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            alert(verifyData.error || "Payment verification failed");
          } else {
            alert("Registration successful!");
            router.push("/dashboard");
          }
        }
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Unable to initiate payment");
    } finally {
      setLoadingId(null);
    }
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
                onClick={() => handleRegister(event)}
                disabled={loadingId === event.id || status === "loading"}
                className="rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-purple-400 disabled:opacity-60"
              >
                {loadingId === event.id ? "Processing..." : "Register Now"}
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
          </article>
        );
      })}
    </div>
  );
}

