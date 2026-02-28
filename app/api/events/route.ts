import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: 1 }).lean().exec();
    return NextResponse.json(
      events.map((e) => ({
        id: String(e._id),
        title: e.title,
        description: e.description,
        price: e.price
      }))
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}

