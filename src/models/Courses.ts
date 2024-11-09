import mongoose, { Schema, Document, Types, Model } from "mongoose";
import SessionModel from "./Sessions";

export interface CourseType extends Document {
  title: string;
  courseContent: string;
  duration: number;
}

const CourseSchema = new Schema<CourseType>(
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

// Add pre-remove hook
CourseSchema.pre('findOneAndDelete', async function(this: any, next) {
  try {
    const courseId = this.getQuery()["_id"];
    await SessionModel.deleteMany({ courseid: courseId });
    next();
  } catch (error) {
    next(error as Error);
  }
});

const CourseModel: Model<CourseType> = mongoose.models.Course as Model<CourseType> || mongoose.model<CourseType>("Course", CourseSchema);

export default CourseModel;