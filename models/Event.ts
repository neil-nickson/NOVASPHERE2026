import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  price: number;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

