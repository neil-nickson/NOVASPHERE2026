import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Registration } from "@/models/Registration";
import { Event } from "@/models/Event";
import { User } from "@/models/User";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendRegistrationConfirmationEmail } from "@/lib/email";

const COMPETITIVE_EVENT_PRICE = 99;
const WORKSHOP_PRICE = 149;
const WORKSHOP_CAPACITY = 180;
let paymentIdIndexEnsured = false;

async function ensurePaymentIdDuplicatesAllowed() {
  if (paymentIdIndexEnsured) return;

  try {
    await Registration.collection.dropIndex("paymentId_1");
  } catch (error: any) {
    const message = String(error?.message || "");
    const indexNotFound =
      error?.codeName === "IndexNotFound" ||
      error?.code === 27 ||
      message.includes("index not found");

    if (!indexNotFound) {
      console.warn("Could not drop legacy paymentId unique index", error);
    }
  } finally {
    paymentIdIndexEnsured = true;
  }
}

const memberSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email("Member email must be valid"),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Member mobile number must be 10 to 15 digits"),
  college: z.string().trim().min(2),
  course: z.string().trim().min(2),
  year: z.enum(["1st", "2nd", "3rd", "4th"])
});

const schema = z.object({
  eventId: z.string().trim(),
  eventTitle: z.string().trim().min(2),
  eventTime: z.string().trim().min(1).optional(),
  teamName: z.string().trim().min(2).optional(),
  members: z.array(memberSchema),
  transactionId: z.string().trim().min(4, "Transaction ID must be at least 4 characters"),
  paymentUpiId: z.string().trim().min(3, "UPI ID must be at least 3 characters")
});

function getTeamConstraintsFromTitle(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("ideathon")) {
    return { min: 3, max: 4 };
  }

  if (
    normalized.includes("logic arena") ||
    normalized.includes("debate") ||
    normalized.includes("mun x tech")
  ) {
    return { min: 3, max: 3 };
  }

  if (normalized.includes("tech escape")) {
    return { min: 3, max: 3 };
  }

  if (normalized.includes("workshop") || normalized.includes("web development") || normalized.includes("ai tools")) {
    return { min: 1, max: 1 };
  }

  return { min: 1, max: 1 };
}

function getPricePerParticipant(title: string) {
  const normalized = title.toLowerCase();
  if (
    normalized.includes("workshop") ||
    normalized.includes("web development") ||
    normalized.includes("ai tools")
  ) {
    return WORKSHOP_PRICE;
  }
  return COMPETITIVE_EVENT_PRICE;
}

function isWorkshopTitle(title: string) {
  const normalized = title.toLowerCase();
  return (
    normalized.includes("workshop") ||
    normalized.includes("web development") ||
    normalized.includes("ai tools")
  );
}

function getCompetitiveCapacityLimits(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("ideathon")) {
    return { maxTeams: 15, maxParticipants: 55 };
  }

  if (
    normalized.includes("logic arena") ||
    normalized.includes("debate") ||
    normalized.includes("mun x tech")
  ) {
    return { maxTeams: 12, maxParticipants: 36 };
  }

  if (normalized.includes("tech escape")) {
    return { maxTeams: 15, maxParticipants: 45 };
  }

  return null;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit({
    key: `manual-registration:${userId}:${clientIp}`,
    limit: 10,
    windowMs: 10 * 60 * 1000
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please retry shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds)
        }
      }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const fieldPath = firstIssue?.path?.join(".") || "input";
      const message = firstIssue?.message || "Invalid registration input";
      return NextResponse.json(
        { error: `Invalid ${fieldPath}: ${message}` },
        { status: 400 }
      );
    }

    const {
      eventId,
      eventTitle,
      eventTime,
      teamName,
      members,
      transactionId,
      paymentUpiId
    } = parsed.data;

    const trimmedTransactionId = transactionId.trim();
    const trimmedPaymentUpiId = paymentUpiId.trim();

    await connectDB();
    await ensurePaymentIdDuplicatesAllowed();

    const isObjectId = mongoose.Types.ObjectId.isValid(eventId);
    let eventDoc = isObjectId ? await Event.findById(eventId).exec() : null;

    if (!eventDoc) {
      eventDoc = await Event.findOne({ title: eventTitle.trim() }).exec();
    }

    const fallbackTitleForPrice = eventTitle.trim();
    const expectedPrice = getPricePerParticipant(fallbackTitleForPrice);

    if (!eventDoc) {
      eventDoc = await Event.create({
        title: fallbackTitleForPrice,
        description: `${fallbackTitleForPrice} registration`,
        price: expectedPrice
      });
    }

    const resolvedEventPrice = getPricePerParticipant(eventDoc.title || fallbackTitleForPrice);
    if (eventDoc.price !== resolvedEventPrice) {
      eventDoc.price = resolvedEventPrice;
      await eventDoc.save();
    }

    const event = eventDoc.toObject();

    const user = await User.findById(userId).lean().exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.email || !user.mobileNumber || !user.college || !user.course || !user.year) {
      return NextResponse.json(
        { error: "Your account profile is incomplete. Please update profile details first." },
        { status: 400 }
      );
    }

    const alreadyRegistered = await Registration.findOne({
      userId,
      eventId: eventDoc._id,
      status: "paid"
    })
      .lean()
      .exec();

    if (alreadyRegistered) {
      return NextResponse.json({ error: "You are already registered for this event" }, { status: 409 });
    }

    const normalizedEventTime = eventTime?.trim();
    if (normalizedEventTime) {
      const existingSameTimeRegistration = await Registration.findOne({
        userId,
        status: "paid",
        eventId: { $ne: eventDoc._id },
        eventTime: normalizedEventTime
      })
        .lean()
        .exec();

      if (existingSameTimeRegistration) {
        return NextResponse.json(
          {
            error:
              "You already registered for another event at the same time slot. Please choose a non-overlapping event."
          },
          { status: 409 }
        );
      }
    }

    const constraints = getTeamConstraintsFromTitle(eventTitle || event.title);
    const participantCount = members.length + 1;
    const resolvedTeamName =
      teamName && teamName.trim().length > 0 ? teamName.trim() : `${user.name} Registration`;

    if (constraints.max > 1 && !teamName) {
      return NextResponse.json({ error: "Team name is required for team events" }, { status: 400 });
    }

    if (participantCount < constraints.min || participantCount > constraints.max) {
      return NextResponse.json(
        {
          error: `Team size must be between ${constraints.min} and ${constraints.max} (including leader).`
        },
        { status: 400 }
      );
    }

    if (!isWorkshopTitle(event.title)) {
      const limits = getCompetitiveCapacityLimits(event.title);

      if (limits) {
        const competitiveStats = await Registration.aggregate<{ teams: number; participants: number }>([
          {
            $match: {
              eventId: eventDoc._id,
              status: "paid"
            }
          },
          {
            $group: {
              _id: null,
              teams: { $sum: 1 },
              participants: { $sum: { $ifNull: ["$participantCount", 1] } }
            }
          }
        ]);

        const registeredTeams = competitiveStats[0]?.teams ?? 0;
        const registeredParticipants = competitiveStats[0]?.participants ?? 0;

        if (registeredTeams >= limits.maxTeams) {
          return NextResponse.json(
            {
              error: "Registration closed for this event: maximum number of teams has been reached."
            },
            { status: 409 }
          );
        }

        if (registeredParticipants + participantCount > limits.maxParticipants) {
          const seatsLeft = Math.max(0, limits.maxParticipants - registeredParticipants);
          return NextResponse.json(
            {
              error:
                seatsLeft > 0
                  ? `Only ${seatsLeft} participant seat${seatsLeft > 1 ? "s" : ""} left for this event.`
                  : "Registration closed for this event: participant capacity reached."
            },
            { status: 409 }
          );
        }
      }
    }

    if (isWorkshopTitle(event.title)) {
      const workshopStats = await Registration.aggregate<{ total: number }>([
        {
          $match: {
            eventId: eventDoc._id,
            status: "paid"
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$participantCount", 1] } }
          }
        }
      ]);

      const registeredCount = workshopStats[0]?.total ?? 0;
      if (registeredCount + participantCount > WORKSHOP_CAPACITY) {
        const seatsLeft = Math.max(0, WORKSHOP_CAPACITY - registeredCount);
        return NextResponse.json(
          {
            error:
              seatsLeft > 0
                ? `Only ${seatsLeft} seat${seatsLeft > 1 ? "s" : ""} left for this workshop.`
                : "Seats are full for this workshop. Registration is no longer available."
          },
          { status: 409 }
        );
      }
    }

    const amount = participantCount * resolvedEventPrice * 100;
    const manualOrderId = `manual_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const registration = await Registration.create({
      userId,
      eventId: eventDoc._id,
      studentName: user.name,
      studentEmail: user.email,
      mobileNumber: user.mobileNumber,
      college: user.college,
      course: user.course,
      year: user.year,
      eventTitle: event.title,
      eventTime: normalizedEventTime,
      eventPrice: resolvedEventPrice,
      paymentId: trimmedTransactionId,
      orderId: manualOrderId,
      transactionId: trimmedTransactionId,
      paymentUpiId: trimmedPaymentUpiId,
      teamName: resolvedTeamName,
      teamLeaderName: user.name,
      teamLeaderDetails: {
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        college: user.college,
        course: user.course,
        year: user.year
      },
      participantCount,
      teamMembers: members,
      amount,
      status: "paid"
    });

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { registeredEvents: eventDoc._id }
      },
      { new: true }
    ).exec();

    try {
      const confirmationRecipients = [
        user.email,
        ...members.map((member) => member.email)
      ];

      await sendRegistrationConfirmationEmail({
        emails: confirmationRecipients,
        studentName: user.name,
        eventTitle: event.title,
        eventPrice: resolvedEventPrice,
        amountPaise: amount,
        paymentId: trimmedTransactionId,
        orderId: manualOrderId,
        registrationId: String(registration._id)
      });
    } catch (emailError) {
      console.error("Failed to send registration confirmation email", emailError);
    }

    return NextResponse.json(
      {
        message: "Registration submitted successfully",
        registrationId: String(registration._id)
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit registration" }, { status: 500 });
  }
}
