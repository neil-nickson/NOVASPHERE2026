import nodemailer from "nodemailer";

const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER;
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const EMAIL_SERVER_PORT = Number(process.env.EMAIL_SERVER_PORT || 587);
const EMAIL_FROM = process.env.EMAIL_FROM;
const hasEmailConfig =
  !!EMAIL_SERVER_USER &&
  !!EMAIL_SERVER_PASSWORD &&
  !!EMAIL_SERVER_HOST &&
  !!EMAIL_FROM;

const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      host: EMAIL_SERVER_HOST,
      port: EMAIL_SERVER_PORT,
      secure: EMAIL_SERVER_PORT === 465,
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD
      }
    })
  : null;

export async function sendVerificationEmail(email: string, otpCode: string) {
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email environment variables are not fully configured");
    }

    console.warn("SMTP is not configured. Skipping verification email in development.");
    console.info(`DEV OTP for ${email}: ${otpCode}`);
    return { sent: false };
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: "Your login code - Inter-College Events",
    html: `
      <p>Thank you for registering for Inter-College Events.</p>
      <p>Your one-time verification code is:</p>
      <p style="font-size: 20px; font-weight: bold; letter-spacing: 4px;">${otpCode}</p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `
  });

  return { sent: true };
}

type RegistrationConfirmationPayload = {
  email: string;
  studentName: string;
  eventTitle: string;
  eventPrice: number;
  amountPaise: number;
  paymentId: string;
  orderId: string;
  registrationId: string;
};

export async function sendRegistrationConfirmationEmail({
  email,
  studentName,
  eventTitle,
  eventPrice,
  amountPaise,
  paymentId,
  orderId,
  registrationId
}: RegistrationConfirmationPayload) {
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email environment variables are not fully configured");
    }

    console.warn("SMTP is not configured. Skipping registration confirmation email in development.");
    return { sent: false };
  }

  const paidAmount = (amountPaise / 100).toFixed(2);

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: "Registration Confirmed - NOVASPHERE 2026",
    html: `
      <p>Hi ${studentName},</p>
      <p>Your registration has been confirmed successfully for NOVASPHERE 2026.</p>
      <p><strong>Event:</strong> ${eventTitle}</p>
      <p><strong>Event Fee:</strong> ₹${eventPrice.toFixed(2)}</p>
      <p><strong>Paid Amount:</strong> ₹${paidAmount}</p>
      <p><strong>Payment ID:</strong> ${paymentId}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Registration ID:</strong> ${registrationId}</p>
      <p>Please keep this email for your records.</p>
      <p>Regards,<br/>NOVASPHERE 2026 Team</p>
    `
  });

  return { sent: true };
}

