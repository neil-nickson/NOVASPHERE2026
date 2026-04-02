import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";
import { connectDB } from "@/lib/db";
import { Registration } from "@/models/Registration";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExportRow = {
  registrationId: string;
  eventTitle: string;
  studentName: string;
  studentEmail: string;
  mobileNumber: string;
  college: string;
  course: string;
  year: string;
  teamName: string;
  teamLeaderName: string;
  participantCount: number;
  teamMembers: string;
  amountInRupees: number;
  status: string;
  paymentId: string;
  orderId: string;
  transactionId: string;
  paymentUpiId: string;
  createdAt: string;
};

function buildFilename() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `all-registrations-${yyyy}${mm}${dd}.xlsx`;
}

export async function GET() {
  try {
    const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
    const verified = verifyAdminSessionToken(token);

    if (!verified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const registrations = await Registration.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const rows: ExportRow[] = registrations.map((registration) => {
      const studentName = registration.studentName || "";
      const studentEmail = registration.studentEmail || "";
      const mobileNumber = registration.mobileNumber || "";
      const college = registration.college || "";
      const course = registration.course || "";
      const year = registration.year || "";

      const teamMembers = Array.isArray(registration.teamMembers)
        ? registration.teamMembers
            .map((member) => `${member.name || ""} (${member.email || ""})`)
            .filter(Boolean)
            .join(", ")
        : "";

      return {
        registrationId: String(registration._id || ""),
        eventTitle: registration.eventTitle || "",
        studentName,
        studentEmail,
        mobileNumber,
        college,
        course,
        year,
        teamName: registration.teamName || "",
        teamLeaderName: registration.teamLeaderName || registration.teamLeaderDetails?.name || studentName,
        participantCount: Math.max(1, registration.participantCount || 1),
        teamMembers,
        amountInRupees: Math.round((registration.amount || 0) / 100),
        status: registration.status || "",
        paymentId: registration.paymentId || "",
        orderId: registration.orderId || "",
        transactionId: registration.transactionId || "",
        paymentUpiId: registration.paymentUpiId || "",
        createdAt: registration.createdAt ? new Date(registration.createdAt).toISOString() : ""
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: [
        "registrationId",
        "eventTitle",
        "studentName",
        "studentEmail",
        "mobileNumber",
        "college",
        "course",
        "year",
        "teamName",
        "teamLeaderName",
        "participantCount",
        "teamMembers",
        "amountInRupees",
        "status",
        "paymentId",
        "orderId",
        "transactionId",
        "paymentUpiId",
        "createdAt"
      ]
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    const workbookArray = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx"
    }) as ArrayBuffer;
    const workbookBytes = new Uint8Array(workbookArray);

    return new NextResponse(workbookBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${buildFilename()}"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Failed to export registrations", error);
    return NextResponse.json(
      { error: "Failed to export registrations" },
      { status: 500 }
    );
  }
}
