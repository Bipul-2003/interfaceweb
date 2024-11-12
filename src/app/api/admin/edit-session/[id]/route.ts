import dbConnect from "@/lib/dbConnection";
import SessionModel from "@/models/Sessions";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
    const updateSession = await SessionModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
            // courseid: new mongoose.Types.ObjectId(courseid),
            startDate:dateRange.from,
            endDate: dateRange.to,
            instructor,
            maxCapacity,
            maxWaitingCapacity,
            googlemeetLink,
            price,
            startTime,
            endTime,
            days,
        },
      },
      { new: true }
    );

    if (!updateSession) {
      return Response.json({ message: "Session not found" }, { status: 404 });
    }

    return Response.json({ message: "Session Updated success" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Failed to update session" },
      { status: 500 }
    );
  }
}
