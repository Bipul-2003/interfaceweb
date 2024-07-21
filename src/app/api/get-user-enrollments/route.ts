import dbConnect from "@/lib/dbConnection";
import EnrollmentModel from "@/models/Enrollments";

import getSession from "@/utils/getSession";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getSession();
  if (!session) {
    return Response.json(
      { message: "Unauthorized Please login" },
      { status: 401 }
    );
  }
  const user = session.user;
  console.log(user);

  try {
    const enrolments = await EnrollmentModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user?.id),
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
                      _id: 0,
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
                _id: 0,
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
        $addFields: {
          session: {
            $first: "$session",
          },
        },
      },
      {
        $sort: {
          bookedOn: -1,
        },
      },
    ]);

    console.log(enrolments);

    return Response.json({ enrolments }, { status: 200 });
  } catch (error) {
    console.error("Error on getting users:", error);
    return Response.json({ message: "Error getting users" }, { status: 500 });
  }
}


export const dynamic  = "force-dynamic";