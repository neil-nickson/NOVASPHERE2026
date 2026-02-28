import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, otp } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    await connectDB();
    const user = await User.findOne({ email: normalizedEmail }).exec();

    if (!user || !user.otpCode || !user.otpExpiresAt) {
      return NextResponse.json(
        { error: "Code not found. Please register again." },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified." });
    }

    if (user.otpCode !== otp) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Code expired." }, { status: 400 });
    }

    user.emailVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

