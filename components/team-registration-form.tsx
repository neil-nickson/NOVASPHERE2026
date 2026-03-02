"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type StudyYear = "1st" | "2nd" | "3rd" | "4th";

type MemberDetails = {
  name: string;
  email: string;
  mobileNumber: string;
  college: string;
  course: string;
  year: StudyYear;
};

type TeamRegistrationFormProps = {
  eventId: string;
  eventTitle: string;
  teamSizeText?: string;
  onSuccess?: () => void;
};

const PRICE_PER_PARTICIPANT = 150;
const YEARS: StudyYear[] = ["1st", "2nd", "3rd", "4th"];

function parseTeamSize(teamSizeText?: string) {
  if (!teamSizeText) {
    return { min: 1, max: 1 };
  }

  const rangeMatch = teamSizeText.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (rangeMatch) {
    const min = Number(rangeMatch[1]);
    const max = Number(rangeMatch[2]);
    if (Number.isFinite(min) && Number.isFinite(max) && min > 0 && max >= min) {
      return { min, max };
    }
  }

  const singleMatch = teamSizeText.match(/(\d+)/);
  if (singleMatch) {
    const size = Number(singleMatch[1]);
    if (Number.isFinite(size) && size > 0) {
      return { min: size, max: size };
    }
  }

  return { min: 1, max: 1 };
}

function createEmptyMember(): MemberDetails {
  return {
    name: "",
    email: "",
    mobileNumber: "",
    college: "",
    course: "",
    year: "1st"
  };
}

export function TeamRegistrationForm({
  eventId,
  eventTitle,
  teamSizeText,
  onSuccess
}: TeamRegistrationFormProps) {
  const { min, max } = useMemo(() => parseTeamSize(teamSizeText), [teamSizeText]);
  const requiredTeammates = Math.max(0, min - 1);
  const maxTeammates = Math.max(0, max - 1);

  const [teamName, setTeamName] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderMobile, setLeaderMobile] = useState("");
  const [leaderCollege, setLeaderCollege] = useState("");
  const [leaderCourse, setLeaderCourse] = useState("");
  const [leaderYear, setLeaderYear] = useState<StudyYear>("1st");
  const [members, setMembers] = useState<MemberDetails[]>(
    Array.from({ length: requiredTeammates }, () => createEmptyMember())
  );
  const [transactionId, setTransactionId] = useState("");
  const [paymentUpiId, setPaymentUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const participantCount = 1 + members.length;
  const totalAmount = participantCount * PRICE_PER_PARTICIPANT;

  function updateMember(index: number, field: keyof MemberDetails, value: string) {
    setMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index
          ? {
              ...member,
              [field]: field === "year" ? (value as StudyYear) : value
            }
          : member
      )
    );
  }

  function addMember() {
    if (members.length >= maxTeammates) {
      return;
    }
    setMembers((current) => [...current, createEmptyMember()]);
  }

  function removeMember(index: number) {
    if (members.length <= requiredTeammates) {
      return;
    }
    setMembers((current) => current.filter((_, memberIndex) => memberIndex !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (members.length < requiredTeammates || members.length > maxTeammates) {
      setError(`Team must include between ${min} and ${max} participants.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          eventTitle,
          teamName,
          teamLeaderName,
          leader: {
            email: leaderEmail,
            mobileNumber: leaderMobile,
            college: leaderCollege,
            course: leaderCourse,
            year: leaderYear
          },
          members,
          transactionId,
          paymentUpiId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      setSuccess("Registration submitted successfully. Payment details recorded.");
      onSuccess?.();
    } catch (submitError: any) {
      setError(submitError.message || "Unable to submit registration");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-purple-300/25 bg-black/30 p-4">
      <div className="rounded-xl border border-purple-300/30 bg-black/30 p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-purple-200">Payment QR</p>
        <p className="mt-1 text-xs text-white/70">Scan and pay before submitting details.</p>
        <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-black/35 p-2">
          <Image
            src="/payment qr.jpeg"
            alt="Payment QR"
            width={700}
            height={700}
            className="h-auto w-full rounded-md object-contain"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/80">Team Name</label>
          <input
            required
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/80">Team Leader Name</label>
          <input
            required
            value={teamLeaderName}
            onChange={(e) => setTeamLeaderName(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-200">Leader Details</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            required
            type="email"
            placeholder="Leader email"
            value={leaderEmail}
            onChange={(e) => setLeaderEmail(e.target.value)}
            className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
          <input
            required
            placeholder="Leader mobile number"
            value={leaderMobile}
            onChange={(e) => setLeaderMobile(e.target.value)}
            className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
          <input
            required
            placeholder="College"
            value={leaderCollege}
            onChange={(e) => setLeaderCollege(e.target.value)}
            className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
          <input
            required
            placeholder="Branch / Course"
            value={leaderCourse}
            onChange={(e) => setLeaderCourse(e.target.value)}
            className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
          <select
            value={leaderYear}
            onChange={(e) => setLeaderYear(e.target.value as StudyYear)}
            className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year} Year
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/25 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-200">
            Teammates ({members.length})
          </p>
          <button
            type="button"
            onClick={addMember}
            disabled={members.length >= maxTeammates}
            className="rounded-md border border-purple-300/40 px-2 py-1 text-[11px] font-semibold text-purple-100 disabled:opacity-40"
          >
            Add Member
          </button>
        </div>
        <p className="mt-1 text-[11px] text-white/65">
          Team size required: {min === max ? `${min}` : `${min}-${max}`} (including leader)
        </p>

        <div className="mt-3 space-y-3">
          {members.map((member, index) => (
            <div key={`${eventId}-member-${index}`} className="rounded-lg border border-white/10 bg-black/35 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-white/80">Member {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  disabled={members.length <= requiredTeammates}
                  className="text-[11px] text-red-300 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  required
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={member.email}
                  onChange={(e) => updateMember(index, "email", e.target.value)}
                  className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
                <input
                  required
                  placeholder="Mobile Number"
                  value={member.mobileNumber}
                  onChange={(e) => updateMember(index, "mobileNumber", e.target.value)}
                  className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
                <input
                  required
                  placeholder="College"
                  value={member.college}
                  onChange={(e) => updateMember(index, "college", e.target.value)}
                  className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
                <input
                  required
                  placeholder="Branch / Course"
                  value={member.course}
                  onChange={(e) => updateMember(index, "course", e.target.value)}
                  className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
                />
                <select
                  value={member.year}
                  onChange={(e) => updateMember(index, "year", e.target.value)}
                  className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
                >
                  {YEARS.map((year) => (
                    <option key={`${index}-${year}`} value={year}>
                      {year} Year
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/80">Transaction ID</label>
          <input
            required
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/80">UPI ID used for payment</label>
          <input
            required
            value={paymentUpiId}
            onChange={(e) => setPaymentUpiId(e.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-purple-400"
          />
        </div>
      </div>

      <div className="rounded-md border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
        Amount to pay: ₹{totalAmount} ({participantCount} participant{participantCount > 1 ? "s" : ""} × ₹{PRICE_PER_PARTICIPANT})
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400 disabled:opacity-60"
      >
        {submitting ? "Submitting..." : `Submit Registration for ${eventTitle}`}
      </button>
    </form>
  );
}
