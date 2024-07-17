import dbConnect from "@/lib/dbConnection";
import CourseModel from "@/models/Courses";

export async function GET(
  req: Request,
  { params }: { params: { cid: string } }
) {
  await dbConnect();

  try {
    const { cid } = params;

    const course = await CourseModel.findById(cid);

    return Response.json({ course }, { status: 200 });
  } catch (error) {
    console.error("Error fetching course :", error);
    return Response.json({ message: "Error fetching course" }, { status: 500 });
  }
}
