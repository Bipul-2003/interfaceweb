import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";
import SessionModel from "@/models/Sessions";

export async function POST(req: Request) {
  await dbConnect();

  const {
    courseid,
    dateRange,
    instructor,
    maxCapacity,
    googlemeetLink, 
    maxWaitingCapacity,
    price,
    startTime,
    endTime,
    days,
  } = await req.json();

  try {
    const existingSession = await SessionModel.findOne({
      courseid: new mongoose.Types.ObjectId(courseid),
      startDate: dateRange.from,
      startTime,
    });

    if (new Date(dateRange.from) < new Date()) {
      return Response.json(
        { message: "Enter a valid start date" },
        { status: 400 }
      );
    }

    if (existingSession) {
      return Response.json(
        { message: "Course already exists" },
        { status: 400 }
      );
    }

    const startDateObj = new Date(dateRange.from);
    const paymentLastDate = new Date(startDateObj.getTime() - 2 * 24 * 60 * 60 * 1000);
    const bookingLastDate = new Date(startDateObj.getTime() - 3 * 24 * 60 * 60 * 1000);

    // Find the last session for this course and get its sessionno
    const lastSession = await SessionModel.findOne({ courseid: new mongoose.Types.ObjectId(courseid) })
      .sort({ sessionno: -1 })
      .select('sessionno');

    let newSessionNo = 1;
    if (lastSession) {
      newSessionNo = Math.floor((lastSession.sessionno + 1) / 1000) * 1000 + 1;
    }

    // Ensure the sessionno is always 3 digits
    newSessionNo = Number(newSessionNo.toString().padStart(3, '0'))

    const newSession = new SessionModel({
      courseid: new mongoose.Types.ObjectId(courseid),
      startDate: dateRange.from,
      sessionno: newSessionNo,
      endDate: dateRange.to,
      instructor,
      maxCapacity,
      maxWaitingCapacity,
      googlemeetLink,
      paymentLastDate,
      bookingLastDate,
      price,
      startTime,
      endTime,
      days,
    });

    await newSession.save();

    return Response.json(
      { message: "Session created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating Session:", error);
    return Response.json(
      { message: "Error creating Session" },
      { status: 500 }
    );
  }
}