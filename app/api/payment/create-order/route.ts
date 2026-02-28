import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { Registration } from "@/models/Registration";
import mongoose from "mongoose";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  throw new Error("Razorpay environment variables are not configured");
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit({
    key: `create-order:${userId}:${clientIp}`,
    limit: 8,
    windowMs: 5 * 60 * 1000
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many payment attempts. Please retry shortly." },
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
    const { eventId } = body as { eventId?: string };

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ error: "Invalid eventId" }, { status: 400 });
    }

    await connectDB();
    const event = await Event.findById(eventId).lean().exec();
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const existingRegistration = await Registration.findOne({
      userId,
      eventId,
      status: "paid"
    })
      .lean()
      .exec();

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 409 }
      );
    }

    const amount = event.price * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `ev_${String(event._id).slice(-6)}_${Date.now()}`,
      notes: {
        eventId: String(event._id),
        userId,
        email: session.user.email ?? ""
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      event: {
        id: String(event._id),
        title: event.title,
        price: event.price
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

