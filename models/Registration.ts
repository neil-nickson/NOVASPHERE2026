import mongoose, { Schema, type Model, type Document } from "mongoose";

type Year = "1st" | "2nd" | "3rd" | "4th";

type TeamMember = {
  name: string;
  email: string;
  mobileNumber: string;
  college: string;
  course: string;
  year: Year;
};

type TeamLeaderDetails = {
  name: string;
  email: string;
  mobileNumber: string;
  college: string;
  course: string;
  year: Year;
};

export interface IRegistration extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  studentName: string;
  studentEmail: string;
  mobileNumber: string;
  college: string;
  course: string;
  year: "1st" | "2nd" | "3rd" | "4th";
  eventTitle: string;
  eventTime?: string;
  eventPrice: number;
  paymentId: string;
  orderId: string;
  teamName?: string;
  teamLeaderName?: string;
  teamLeaderDetails?: TeamLeaderDetails;
  participantCount?: number;
  teamMembers?: TeamMember[];
  paymentUpiId?: string;
  transactionId?: string;
  amount: number;
  status: string;
  createdAt: Date;
}

const TeamMemberSchema = new Schema<TeamMember>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true, enum: ["1st", "2nd", "3rd", "4th"] }
  },
  { _id: false }
);

const TeamLeaderDetailsSchema = new Schema<TeamLeaderDetails>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true, enum: ["1st", "2nd", "3rd", "4th"] }
  },
  { _id: false }
);

const RegistrationSchema = new Schema<IRegistration>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true, enum: ["1st", "2nd", "3rd", "4th"] },
    eventTitle: { type: String, required: true },
    eventTime: { type: String },
    eventPrice: { type: Number, required: true },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    teamName: { type: String },
    teamLeaderName: { type: String },
    teamLeaderDetails: { type: TeamLeaderDetailsSchema },
    participantCount: { type: Number },
    teamMembers: { type: [TeamMemberSchema], default: [] },
    paymentUpiId: { type: String },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });
RegistrationSchema.index({ orderId: 1 }, { unique: true });
RegistrationSchema.index({ paymentId: 1 }, { unique: true });

export const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

