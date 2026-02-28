import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "novasphere_admin";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const ADMIN_FIXED_PASSWORD = "5abc3xyz2abc";

type AdminTokenPayload = {
  u: string;
  exp: number;
};

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required for admin auth");
  }
  return secret;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function getAdminPassword() {
  return ADMIN_FIXED_PASSWORD;
}

export function createAdminSessionToken() {
  const payload: AdminTokenPayload = {
    u: "admin",
    exp: Date.now() + ADMIN_SESSION_TTL_MS
  };

  const payloadPart = base64UrlEncode(JSON.stringify(payload));
  const signaturePart = signValue(payloadPart);
  return `${payloadPart}.${signaturePart}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expectedSignature = signValue(payloadPart);

  const providedBuffer = Buffer.from(signaturePart);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payloadPart)) as AdminTokenPayload;
    if (parsed.u !== "admin" || !parsed.exp || parsed.exp < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
