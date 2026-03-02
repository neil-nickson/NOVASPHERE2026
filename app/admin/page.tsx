import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Registration } from "@/models/Registration";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import { AdminLogoutButton } from "@/components/admin-logout-button";

export const dynamic = "force-dynamic";

type RegistrationView = {
  _id: string;
  teamName?: string;
  teamLeaderName?: string;
  participantCount?: number;
  studentName?: string;
  studentEmail?: string;
  mobileNumber?: string;
  college?: string;
  course?: string;
  year?: string;
  amount?: number;
  paymentId?: string;
  paymentUpiId?: string;
  status?: string;
  createdAt?: Date;
  eventTitle?: string;
  eventId?: {
    title?: string;
  } | string;
  userId?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
    college?: string;
    course?: string;
    year?: string;
  } | string;
};

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const verified = verifyAdminSessionToken(token);

  if (!verified) {
    redirect("/admin/login");
  }

  await connectDB();

  const registrationsRaw = (await Registration.find({ status: "paid" })
    .populate("eventId", "title")
    .populate("userId", "name email mobileNumber college course year")
    .sort({ createdAt: -1 })
    .lean()
    .exec()) as unknown as RegistrationView[];

  const grouped = new Map<string, RegistrationView[]>();

  for (const registration of registrationsRaw) {
    const populatedEventTitle =
      typeof registration.eventId === "object" ? registration.eventId?.title : undefined;
    const title = registration.eventTitle || populatedEventTitle || "Unknown Event";
    const current = grouped.get(title) ?? [];
    current.push(registration);
    grouped.set(title, current);
  }

  const groups = Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-500/30 bg-black/45 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">Admin Panel</p>
          <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">Event Registrations</h1>
        </div>
        <AdminLogoutButton />
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-white/70">
          No paid registrations found yet.
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([eventTitle, rows]) => (
            <article
              key={eventTitle}
              className="rounded-2xl border border-purple-500/30 bg-black/45 p-4 md:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-purple-200 md:text-xl">{eventTitle}</h2>
                <span className="rounded-full border border-purple-300/35 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-100">
                  {rows.length} teams
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs text-white/80 md:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-purple-200">
                      <th className="px-2 py-2">Team</th>
                      <th className="px-2 py-2">Team Size</th>
                      <th className="px-2 py-2">Name</th>
                      <th className="px-2 py-2">Email</th>
                      <th className="px-2 py-2">Mobile</th>
                      <th className="px-2 py-2">College</th>
                      <th className="px-2 py-2">Course</th>
                      <th className="px-2 py-2">Year</th>
                      <th className="px-2 py-2">Amount</th>
                      <th className="px-2 py-2">Transaction ID</th>
                      <th className="px-2 py-2">UPI ID</th>
                      <th className="px-2 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const fallbackUser =
                        typeof row.userId === "object" ? row.userId : undefined;

                      const name = row.studentName || fallbackUser?.name || "-";
                      const email = row.studentEmail || fallbackUser?.email || "-";
                      const mobile = row.mobileNumber || fallbackUser?.mobileNumber || "-";
                      const college = row.college || fallbackUser?.college || "-";
                      const course = row.course || fallbackUser?.course || "-";
                      const year = row.year || fallbackUser?.year || "-";
                      const teamName = row.teamName || "-";
                      const teamSize = row.participantCount || 1;
                      const leaderName = row.teamLeaderName || name;

                      return (
                        <tr key={row._id} className="border-b border-white/5 align-top">
                          <td className="px-2 py-2">{teamName}</td>
                          <td className="px-2 py-2">{teamSize}</td>
                          <td className="px-2 py-2">{leaderName}</td>
                          <td className="px-2 py-2">{email}</td>
                          <td className="px-2 py-2">{mobile}</td>
                          <td className="px-2 py-2">{college}</td>
                          <td className="px-2 py-2">{course}</td>
                          <td className="px-2 py-2">{year}</td>
                          <td className="px-2 py-2">₹{((row.amount || 0) / 100).toFixed(0)}</td>
                          <td className="max-w-[180px] truncate px-2 py-2 font-mono text-[11px]">{row.paymentId || "-"}</td>
                          <td className="max-w-[180px] truncate px-2 py-2 font-mono text-[11px]">{row.paymentUpiId || "-"}</td>
                          <td className="px-2 py-2">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
