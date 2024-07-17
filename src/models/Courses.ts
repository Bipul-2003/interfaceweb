import mongoose, { Schema, Document, Types } from "mongoose";

export interface CourseType extends Document {
  title: string;
  courseContent: string;
  duration: number;
}

const CourseSchema: Schema<CourseType> = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    courseContent: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const CourseModel =
  (mongoose.models.Course as mongoose.Model<CourseType>) ||
  mongoose.model<CourseType>("Course", CourseSchema);

export default CourseModel;