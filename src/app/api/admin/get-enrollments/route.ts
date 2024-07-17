import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import EnrollmentModel from "@/models/Enrollments";

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

    const enrollments = await EnrollmentModel.aggregate([
      {
        $match: {
          $or: [{ status: "enrolled" }, { status: "booked" }],
        },
      },
      {
        $lookup: {
          from: "sessions",
          localField: "session",
          foreignField: "_id",
          as: "session",
          pipeline: [
            {
              $lookup: {
                from: "courses",
                localField: "courseid",
                foreignField: "_id",
                as: "course",
                pipeline: [
                  {
                    $project: {
                      title: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                course: {
                  $first: "$course",
                },
              },
            },
            {
              $project: {
                course: 1,
                sessionno: 1,
                paymentLastDate: 1,
                startDate: 1,
                instructor: 1,
                price: 1,
              },
            },
          ],
        },
      },
    
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$session",
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          price: "$session.price",
        },
      },
      { $limit: limit ? parseInt(limit as string) : 5 },
      {
        $sort: {
          bookedOn: -1,
        },
      },
      {
        $project: {
          "user.password": 0,
          "user.verifyCode": 0,
          "user.verifyCodeExpire": 0,
        },
      },
      // Deconstruct the nested "price" object
    ]);

    if (!enrollments) {
      return Response.json(
        { message: "No enrollments found" },
        { status: 404 }
      );
    }
    return Response.json({ enrollments }, { status: 200 });
  } catch (error) {
    console.error("Error on getting enrollments:", error);
    return Response.json(
      { message: "Error getting enrollments" },
      { status: 500 }
    );
  }
}
