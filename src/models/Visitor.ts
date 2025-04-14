import mongoose, { Schema, Document } from "mongoose";

export interface IVisitor extends Document {
  ip: string;
  country: string;
  browser: string;
  device: "mobile" | "desktop";
  visitDate: Date;
}

export const VisitorSchema = new Schema<IVisitor>(
  {
    ip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      enum: ["mobile", "desktop"],
      required: true,
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Visitor = mongoose.model<IVisitor>("Visitor", VisitorSchema);
