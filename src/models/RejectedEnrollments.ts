import mongoose, { Schema, Document, Types } from "mongoose";
import { EnrollmentSchema, EnrollmentType } from "./Enrollments";

export interface RejectedEnrollmentType extends Document {
  enrollment: EnrollmentType
}

const RejectedEnrollmentSchema: Schema<RejectedEnrollmentType> = new Schema(
  {
    enrollment: {
      type: EnrollmentSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const RejectedEnrollmentModel =
  (mongoose.models.RejectedEnrollment as mongoose.Model<RejectedEnrollmentType>) ||
  mongoose.model<RejectedEnrollmentType>('RejectedEnrollment', RejectedEnrollmentSchema);

export default RejectedEnrollmentModel;