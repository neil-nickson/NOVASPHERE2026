import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Registration } from "@/models/Registration";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id as string | undefined;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    redirect("/login");
  }

  let user: any = null;
  let registrations: any[] = [];

  try {
    await connectDB();

    user = await User.findById(userId).lean().exec();

    registrations = await Registration.find({ userId })
      .populate("eventId")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  } catch (error) {
    console.error("Failed to load dashboard data", error);
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
        Failed to load dashboard right now. Please refresh and try again.
      </div>
    );
  }

  const paidRegistrations = registrations.filter((registration) => registration.status === "paid");

  const registeredEvents = Array.from(
    new Map(
      paidRegistrations.map((registration) => {
        const populatedEventTitle =
          typeof registration.eventId === "object" && registration.eventId
            ? (registration.eventId as any).title
            : undefined;
        const title = registration.eventTitle || populatedEventTitle || "Unknown Event";
        return [title, registration];
      })
    ).entries()
  ).map(([title, registration]) => ({
    title,
    amount: (registration.amount || 0) / 100,
    teamName: registration.teamName || "-",
    participantCount: registration.participantCount || 1
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-white/70">
          View your profile, registered events, and payment history.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-sm">
          <h2 className="text-sm font-semibold text-white">Profile</h2>
          <div className="mt-3 space-y-1 text-xs text-white/75">
            <div>
              <span className="text-white/60">Name:</span>{" "}
              <span className="font-medium">{user?.name}</span>
            </div>
            <div>
              <span className="text-white/60">Email:</span>{" "}
              <span className="font-medium">{user?.email}</span>
            </div>
            <div>
              <span className="text-white/60">Email verified:</span>{" "}
              <span className="font-medium">
                {user?.emailVerified ? "Yes" : "Pending verification"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-sm">
          <h2 className="text-sm font-semibold text-white">Registered Events</h2>
          <div className="mt-3 space-y-2 text-xs text-white/75">
            {registeredEvents.length > 0 ? (
              registeredEvents.map((ev) => (
                <div
                  key={`${ev.title}-${ev.teamName}`}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{ev.title}</span>
                    <span className="text-blue-300">₹{ev.amount.toFixed(0)}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-white/60">
                    Team: {ev.teamName} • Participants: {ev.participantCount}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60">You didn&apos;t register for any events yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/60 p-5 text-sm">
          <h2 className="text-sm font-semibold text-white">Summary</h2>
          <div className="mt-3 space-y-1 text-xs text-white/75">
            <div>
              <span className="text-white/60">Total events registered:</span>{" "}
              <span className="font-medium">{paidRegistrations.length}</span>
            </div>
            <div>
              <span className="text-white/60">Total amount paid:</span>{" "}
              <span className="font-medium">
                ₹
                {paidRegistrations.reduce((sum, registration) => sum + (registration.amount || 0), 0) /
                  100}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/60 p-5 text-sm">
        <h2 className="text-sm font-semibold text-white">Payment History</h2>
        <div className="mt-3 space-y-2 text-xs text-white/75">
          {registrations.length === 0 ? (
            <p className="text-white/60">No payments recorded yet.</p>
          ) : (
            registrations.map((reg) => (
              <div
                key={String(reg._id)}
                className="grid gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 md:grid-cols-4 md:items-center"
              >
                <div>
                  <div className="text-white">
                    {typeof reg.eventId === "object" && (reg.eventId as any).title}
                  </div>
                  <div className="text-[11px] text-white/60">
                    {new Date(reg.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-white/60">Amount</div>
                  <div className="font-medium">₹{(reg.amount || 0) / 100}</div>
                </div>
                <div>
                  <div className="text-white/60">Status</div>
                  <div className="font-medium text-emerald-300">{reg.status}</div>
                </div>
                <div className="truncate">
                  <div className="text-white/60">Transaction / UPI</div>
                  <div className="font-mono text-[11px] text-white/70">
                    {reg.paymentId || "-"} / {reg.paymentUpiId || "-"}
                  </div>
                  <div className="mt-1 text-[11px] text-white/60">
                    Team: {reg.teamName || "-"} • Participants: {reg.participantCount || 1}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

