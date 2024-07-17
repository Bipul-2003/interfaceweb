import mongoose, { Schema, Document, Types } from "mongoose";

export interface EnrollmentType extends Document {
  user: Types.ObjectId;
  session: Types.ObjectId;
  status: "enrolled" | "booked" | "waiting";
  paymentStatus: "pending" | "completed";
  bookedOn: Date;
}

export const EnrollmentSchema: Schema<EnrollmentType> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    status: {
      type: String,
      enum: ["enrolled", "booked", "waiting"],
      default: "enrolled",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    bookedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const EnrollmentModel =
  (mongoose.models.Enrollment as mongoose.Model<EnrollmentType>) ||
  mongoose.model<EnrollmentType>("Enrollment", EnrollmentSchema);

export default EnrollmentModel;
