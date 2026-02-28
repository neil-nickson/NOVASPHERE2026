import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Registration } from "@/models/Registration";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
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

const razorpayKeySecret = keySecret as string;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit({
    key: `verify-payment:${userId}:${clientIp}`,
    limit: 15,
    windowMs: 5 * 60 * 1000
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many verification attempts. Please retry shortly." },
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
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      eventId
    } = body as {
      razorpay_payment_id?: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
      eventId?: string;
    };

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !eventId
    ) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ error: "Invalid eventId" }, { status: 400 });
    }

    if (!/^pay_[A-Za-z0-9]+$/.test(razorpay_payment_id)) {
      return NextResponse.json({ error: "Invalid payment id" }, { status: 400 });
    }

    if (!/^order_[A-Za-z0-9]+$/.test(razorpay_order_id)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    if (!/^[a-fA-F0-9]{64}$/.test(razorpay_signature)) {
      return NextResponse.json({ error: "Invalid signature format" }, { status: 400 });
    }

    const shasum = crypto.createHmac("sha256", razorpayKeySecret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId).lean().exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const event = await Event.findById(eventId).lean().exec();
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const existingRegistration = await Registration.findOne({
      $or: [{ orderId: razorpay_order_id }, { paymentId: razorpay_payment_id }]
    })
      .lean()
      .exec();

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Payment already processed for this registration" },
        { status: 409 }
      );
    }

    const alreadyRegistered = await Registration.findOne({
      userId: (session.user as any).id,
      eventId,
      status: "paid"
    })
      .lean()
      .exec();

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 409 }
      );
    }

    const amount = Number(event.price) * 100;

    const [rzpOrder, rzpPayment] = await Promise.all([
      razorpay.orders.fetch(razorpay_order_id),
      razorpay.payments.fetch(razorpay_payment_id)
    ]);

    if (!rzpOrder || !rzpPayment) {
      return NextResponse.json({ error: "Unable to validate payment" }, { status: 400 });
    }

    if (rzpOrder.id !== razorpay_order_id) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    }

    if (rzpPayment.order_id !== razorpay_order_id) {
      return NextResponse.json({ error: "Payment does not belong to this order" }, { status: 400 });
    }

    if (rzpPayment.amount !== amount || rzpOrder.amount !== amount) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    if (rzpPayment.currency !== "INR" || rzpOrder.currency !== "INR") {
      return NextResponse.json({ error: "Invalid payment currency" }, { status: 400 });
    }

    if (rzpPayment.status !== "captured" && rzpPayment.status !== "authorized") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const orderEventId = rzpOrder.notes?.eventId;
    const orderUserId = rzpOrder.notes?.userId;

    if (orderEventId && orderEventId !== eventId) {
      return NextResponse.json({ error: "Event mismatch for order" }, { status: 400 });
    }

    if (orderUserId && orderUserId !== userId) {
      return NextResponse.json({ error: "User mismatch for order" }, { status: 400 });
    }

    const registration = await Registration.create({
      userId,
      eventId,
      studentName: user.name,
      studentEmail: user.email,
      mobileNumber: user.mobileNumber,
      college: user.college,
      course: user.course,
      year: user.year,
      eventTitle: event.title,
      eventPrice: event.price,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount,
      status: "paid"
    });

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { registeredEvents: eventId }
      },
      { new: true }
    ).exec();

    return NextResponse.json({
      message: "Payment verified and registration completed",
      registrationId: String(registration._id)
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}

