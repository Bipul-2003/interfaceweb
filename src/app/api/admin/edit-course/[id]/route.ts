import dbConnect from "@/lib/dbConnection";
import CourseModel from "@/models/Courses";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await dbConnect();

  const { title, courseContent, duration } = await req.json();

  try {
    const UpdatedCourse = await CourseModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: title,
          courseContent: courseContent,
          duration: duration,
        },
      },
      { new: true }
    );

    if (!UpdatedCourse) {
      return Response.json({ message: "Course not found" }, { status: 404 });
    }

    return Response.json({ message: "Enrollment success" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Failed to update course" },
      { status: 500 }
    );
  }
}
