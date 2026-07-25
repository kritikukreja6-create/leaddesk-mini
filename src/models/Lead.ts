import mongoose, { Schema, model, models } from "mongoose";

export interface ILead {
  name: string;
  email: string;
  budgetRange: string;
  message: string;
  status: "New" | "Contacted" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    budgetRange: {
      type: String,
      required: [true, "Budget range is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const Lead = models.Lead || model<ILead>("Lead", LeadSchema);

export default Lead;