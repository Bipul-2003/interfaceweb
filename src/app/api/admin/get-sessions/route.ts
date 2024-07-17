import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import SessionModel from "@/models/Sessions";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const limit = url.searchParams.get("limit");
  console.log(limit);

  try {
    await dbConnect();
    const session = await auth();
    console.log(session?.user);

    // if (!(session?.user?.role === 1)) {
    //   return Response.json(
    //     { message: "Unauthorized Please login" },
    //     { status: 401 }
    //   );
    // }
    // console.log(session?.user?.role);

    const sessions = await SessionModel.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "courseid",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $addFields: {
            bookedStudentsCount: { $size: "$bookedStudents" },
            waitingStudentsCount:{ $size: "$waitingStudents"},
            enrolledStudentsCount:{$size:"$enrolledStudents"}
          }
        },
        
        {
          $unwind: "$course",
        },
      ]);

    if (!sessions) {
      return Response.json(
        { message: "No enrollments found" },
        { status: 404 }
      );
    }
    return Response.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("Error on getting enrollments:", error);
    return Response.json(
      { message: "Error getting enrollments" },
      { status: 500 }
    );
  }
}
