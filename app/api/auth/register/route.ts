import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Mobile number must be 10 to 15 digits"),
  college: z.string().min(2),
  course: z.string().min(2),
  year: z.enum(["1st", "2nd", "3rd", "4th"])
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, password, mobileNumber, college, course, year } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    await connectDB();

    const hashed = await hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const existing = await User.findOne({ email: normalizedEmail }).exec();

    let user;
    if (existing) {
      if (existing.emailVerified) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }

      existing.name = name;
      existing.password = hashed;
      existing.mobileNumber = mobileNumber;
      existing.college = college;
      existing.course = course;
      existing.year = year;
      existing.otpCode = otpCode;
      existing.otpExpiresAt = otpExpiresAt;
      user = await existing.save();
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashed,
        mobileNumber,
        college,
        course,
        year,
        emailVerified: false,
        otpCode,
        otpExpiresAt
      });
    }

    let emailSent = false;
    try {
      const emailResult = await sendVerificationEmail(normalizedEmail, otpCode);
      emailSent = emailResult.sent;
    } catch (emailError) {
      if (process.env.NODE_ENV === "production") {
        throw emailError;
      }
      console.error("Failed to send verification email in development", emailError);
    }

    return NextResponse.json(
      {
        message: emailSent
          ? "Registered successfully. We have emailed you a 6-digit code to verify your account."
          : "Registered successfully. Email sending is disabled in local development.",
        userId: String(user._id),
        devOtp: !emailSent && process.env.NODE_ENV !== "production" ? otpCode : undefined
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      (error.name === "MongooseServerSelectionError" ||
        error.message.includes("Could not connect to any servers"))
    ) {
      return NextResponse.json(
        {
          error:
            "Database connection failed. Add your current IP to MongoDB Atlas Network Access (or allow 0.0.0.0/0 for development) and try again."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

