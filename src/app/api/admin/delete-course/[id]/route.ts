import dbConnect from "@/lib/dbConnection";
import CourseModel from "@/models/Courses";
import SessionModel from "@/models/Sessions";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await dbConnect();

  try {
    // Check if there are any sessions for this course with students
    const sessionsWithStudents = await SessionModel.find({
      courseid: id,
      $or: [
        { bookedStudents: { $ne: [] } },
        { waitingStudents: { $ne: [] } },
        { enrolledStudents: { $ne: [] } }
      ]
    });

    if (sessionsWithStudents.length > 0) {
      return Response.json(
        { message: "Cannot delete course. There are students enrolled in one or more sessions of this course." },
        { status: 400 }
      );
    }

    // If no students are found, proceed with course deletion
    const deletedCourse = await CourseModel.findOneAndDelete({ _id: id });
    
    if (!deletedCourse) {
      return Response.json({ message: "Course not found" }, { status: 404 });
    }

    return Response.json({ message: "Course and associated sessions deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return Response.json(
      { message: "Failed to delete course" },
      { status: 500 }
    );
  }
}