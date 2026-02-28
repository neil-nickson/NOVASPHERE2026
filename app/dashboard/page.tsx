import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Registration } from "@/models/Registration";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById((session.user as any).id)
    .populate("registeredEvents")
    .lean()
    .exec();

  const registeredEvents = user?.registeredEvents ? (user.registeredEvents as any[]) : [];
  const registrations = await Registration.find({ userId: (session.user as any).id })
    .populate("eventId")
    .sort({ createdAt: -1 })
    .lean()
    .exec();

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
                  key={String(ev._id)}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2"
                >
                  <span>{ev.title}</span>
                  <span className="text-blue-300">₹{ev.price}</span>
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
              <span className="font-medium">{registeredEvents.length}</span>
            </div>
            <div>
              <span className="text-white/60">Total amount paid:</span>{" "}
              <span className="font-medium">
                ₹
                {registrations
                  .filter((r) => r.status === "paid")
                  .reduce((sum, r) => sum + (r.amount || 0), 0) / 100}
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
                  <div className="text-white/60">Payment ID</div>
                  <div className="font-mono text-[11px] text-white/70">{reg.paymentId}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

