"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handleRegister(workshop: WorkshopItem) {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setLoadingId(workshop.id);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: workshop.id })
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
        description: workshop.title,
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
              eventId: workshop.id,
              amount: data.amount
            })
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            alert(verifyData.error || "Payment verification failed");
          } else {
            alert("Workshop registration successful!");
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
                  onClick={() => handleRegister(workshop)}
                  disabled={loadingId === workshop.id || status === "loading"}
                  className="rounded-md bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-400 disabled:opacity-60"
                >
                  {loadingId === workshop.id ? "Processing..." : "Register"}
                </button>
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
