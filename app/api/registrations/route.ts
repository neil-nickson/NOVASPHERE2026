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

const PRICE_PER_PARTICIPANT = 150;

const memberSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  mobileNumber: z.string().trim().regex(/^[0-9]{10,15}$/),
  college: z.string().trim().min(2),
  course: z.string().trim().min(2),
  year: z.enum(["1st", "2nd", "3rd", "4th"])
});

const schema = z.object({
  eventId: z.string().trim(),
  eventTitle: z.string().trim().min(2),
  teamName: z.string().trim().min(2).optional(),
  members: z.array(memberSchema),
  transactionId: z.string().trim().min(4),
  paymentUpiId: z.string().trim().min(3)
});

function getTeamConstraintsFromTitle(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("ideathon")) {
    return { min: 3, max: 4 };
  }

  if (normalized.includes("logic arena") || normalized.includes("debate")) {
    return { min: 3, max: 3 };
  }

  if (normalized.includes("quantum canvas") || normalized.includes("poster")) {
    return { min: 2, max: 3 };
  }

  if (normalized.includes("tech escape")) {
    return { min: 3, max: 3 };
  }

  if (normalized.includes("debug dominion")) {
    return { min: 2, max: 2 };
  }

  if (normalized.includes("workshop") || normalized.includes("antigravity") || normalized.includes("web development")) {
    return { min: 1, max: 1 };
  }

  return { min: 1, max: 1 };
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
      return NextResponse.json({ error: "Invalid registration input" }, { status: 400 });
    }

    const {
      eventId,
      eventTitle,
      teamName,
      members,
      transactionId,
      paymentUpiId
    } = parsed.data;

    await connectDB();

    const isObjectId = mongoose.Types.ObjectId.isValid(eventId);
    let eventDoc = isObjectId ? await Event.findById(eventId).exec() : null;

    if (!eventDoc) {
      eventDoc = await Event.findOne({ title: eventTitle.trim() }).exec();
    }

    if (!eventDoc) {
      eventDoc = await Event.create({
        title: eventTitle.trim(),
        description: `${eventTitle.trim()} registration`,
        price: PRICE_PER_PARTICIPANT
      });
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

    const transactionTaken = await Registration.findOne({ paymentId: transactionId })
      .lean()
      .exec();

    if (transactionTaken) {
      return NextResponse.json({ error: "Transaction ID already used" }, { status: 409 });
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

    const amount = participantCount * PRICE_PER_PARTICIPANT * 100;
    const manualOrderId = `manual_${transactionId}`;

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
      eventPrice: PRICE_PER_PARTICIPANT,
      paymentId: transactionId,
      orderId: manualOrderId,
      transactionId,
      paymentUpiId,
      teamName: resolvedTeamName,
      teamLeaderName: user.name,
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
      await sendRegistrationConfirmationEmail({
        email: user.email,
        studentName: user.name,
        eventTitle: event.title,
        eventPrice: PRICE_PER_PARTICIPANT,
        amountPaise: amount,
        paymentId: transactionId,
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
