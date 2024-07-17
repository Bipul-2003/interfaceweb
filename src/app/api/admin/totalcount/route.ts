import dbConnect from "@/lib/dbConnection";
import CourseModel from "@/models/Courses";
import EnrollmentModel from "@/models/Enrollments";
import SessionModel from "@/models/Sessions";
import UserModel from "@/models/Users";

let totalcounts = {
  total_enrollments: 0,
  total_courses: 0,
  total_users: 0,
  total_revenue:0
};

export async function GET(req: Request) {
  await dbConnect();
  try {
    const total_enrollments = await EnrollmentModel.countDocuments();
    totalcounts.total_enrollments = total_enrollments;

    const total_users = await UserModel.countDocuments({ isVerified: true });
    totalcounts.total_users = total_users;

    const total_courses = await CourseModel.countDocuments();
    totalcounts.total_courses = total_courses;

    const total_revenue = await SessionModel.aggregate([
      {
        $addFields: {
          revenue: { $multiply: [{ $size: "$bookedStudents" }, "$price"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    totalcounts.total_revenue = total_revenue[0]?.totalRevenue || 0;
    return Response.json({ totalcounts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching total counts:", error);
    return Response.json(
      { message: "Error fetching total counts" },
      { status: 500 }
    );
  }
}
