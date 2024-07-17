import dbConnect from "@/lib/dbConnection";
import CourseModel from "@/models/Courses";

export async function POST(req: Request) {
  await dbConnect();

  const { title, courseContent, duration } = await req.json();

  try {
    const existingCourse = await CourseModel.findOne({ title });

    if (existingCourse) {
      return Response.json(
        { message: "Course already exists" },
        { status: 400 }
      );
    }

    const newCourse = new CourseModel({
      title,
      courseContent,
      duration,
    });

    await newCourse.save();

    return Response.json(
      { message: "Course created successfully" },
      { status: 201 }
    );
  } catch (error) {
    // It's a good practice to handle and log the error
    console.error("Error creating course:", error);
    return Response.json({ message: "Error creating course" }, { status: 500 });
  }
}
