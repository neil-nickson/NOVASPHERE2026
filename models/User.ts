import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  college: string;
  course: string;
  year: "1st" | "2nd" | "3rd" | "4th";
  emailVerified: boolean;
  verificationToken?: string;
  otpCode?: string;
  otpExpiresAt?: Date;
  registeredEvents: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    year: { type: String, required: true, enum: ["1st", "2nd", "3rd", "4th"] },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
    registeredEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }]
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

