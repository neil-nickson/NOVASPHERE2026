import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ verificationToken: token }).exec();

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.redirect(new URL("/login?verified=1", req.url));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

