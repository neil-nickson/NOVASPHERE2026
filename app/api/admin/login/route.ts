import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, createAdminSessionToken, getAdminPassword } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  password: z.string().min(1)
});

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit({
    key: `admin-login:${clientIp}`,
    limit: 12,
    windowMs: 10 * 60 * 1000
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again shortly." },
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
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { password } = parsed.data;
    const adminPassword = getAdminPassword();

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ message: "Admin login successful" });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
