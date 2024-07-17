import mongoose, { Schema, Document, Types } from "mongoose";

export interface SessionType extends Document {
  courseid: Types.ObjectId;
  sessionno: number;
  bookedStudents: Types.ObjectId[];
  instructor: string;
  maxCapacity: number;
  waitingStudents: Types.ObjectId[];
  maxWaitingCapacity: number;
  googlemeetLink: string;
  startDate: Date;
  endDate: Date;
  paymentLastDate: Date;
  bookingLastDate: Date;
  price: number;
  enrolledStudents: Types.ObjectId[];
  startTime: string; // e.g., "03:00" for 3am
  endTime: string; // e.g., "18:00" for 6pm
  days: string[]; 
}

const SessionSchema: Schema<SessionType> = new Schema(
  {
    courseid: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sessionno:{
      type:Number,
      required:true,
    },
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    bookedStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentLastDate: {
      type: Date,
      required: true,
    },
    bookingLastDate: {
      type: Date,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    waitingStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    maxWaitingCapacity: {
      type: Number,
      required: true,
    },
    googlemeetLink: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    days: { 
      type: [String], 
      enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      required: true 
    }
  },
  { timestamps: true }
);

const SessionModel =
  (mongoose.models.Session as mongoose.Model<SessionType>) ||
  mongoose.model<SessionType>("Session", SessionSchema);

export default SessionModel;