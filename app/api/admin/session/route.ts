import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = Boolean(verifyAdminSessionToken(token));

  return NextResponse.json({ authenticated });
}
