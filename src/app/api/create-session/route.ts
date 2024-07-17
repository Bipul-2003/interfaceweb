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
      startDate:dateRange.from,
      startTime,
    });
    if (new Date(dateRange.from) < new Date(Date.now())) {
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
    const paymentLastDate = new Date(
      startDateObj.getTime() - 3 * 24 * 60 * 60 * 1000
    );
    // console.log(paymentLastDate);

    const bookingLastDate = new Date(
      startDateObj.getTime() - 5 * 24 * 60 * 60 * 1000
    );
    // console.log(bookingLastDate);
    const newSession = new SessionModel({
      courseid: new mongoose.Types.ObjectId(courseid),
      startDate:dateRange.from,
      sessionno: (await SessionModel.countDocuments({courseid})) + 1,
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
    // It's a good practice to handle and log the error
    console.error("Error creating Session:", error);
    return Response.json(
      { message: "Error creating Session" },
      { status: 500 }
    );
  }
}
