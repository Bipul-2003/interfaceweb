import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import EnrollmentModel from "@/models/Enrollments";
import RejectedEnrollmentModel from "@/models/RejectedEnrollments";
import SessionModel from "@/models/Sessions";

export async function GET(req: Request,{ params }: { params: { id: string } }) {
  const { id } = params;

  console.log(id);

  await dbConnect();
  try {
    // const session = await auth();
    // if (!(session?.user?.role === 1)) {
    //   return Response.json(
    //     { message: "Unauthorized Please login" },
    //     { status: 401 }
    //   );
    // }

    const enrollment = await EnrollmentModel.findById(id);
    if (!enrollment) {
      return Response.json(
        { message: "Enrollment not found" },
        { status: 404 }
      );
    }
    const rejectedEnrollment = await RejectedEnrollmentModel.findById(id);
    if (rejectedEnrollment) {
      return Response.json(
        { message: "Enrollment already rejected" },
        { status: 400 }
      );
    }
    const newRejection = new RejectedEnrollmentModel({enrollment:enrollment})
    const rejected = await newRejection.save();
    if (!rejected) {
      return Response.json(
        { message: "Failed to reject enrollment" },
        { status: 500 }
      );
    }
    const modifysession = await SessionModel.findById(enrollment.session);

    if (!modifysession) {
      return Response.json({ message: "Session not found" }, { status: 404 });
    }
    modifysession.enrolledStudents = modifysession.enrolledStudents.filter(
      (student) => student.toString() !== enrollment.user.toString()
    );
    if (modifysession.maxCapacity > modifysession.bookedStudents.length) {
      if (modifysession.waitingStudents.length > 0) {
        modifysession.enrolledStudents.push(modifysession.waitingStudents[0]);
        modifysession.waitingStudents.shift();
      }
    }
    const updatesession = await modifysession.save();
    if (!updatesession) {
      return Response.json(
        { message: "Failed to update session" },
        { status: 500 }
      );
    }

    const deleteEnrollment = await EnrollmentModel.findByIdAndDelete(id);
    if (!deleteEnrollment) {
      return Response.json(
        { message: "Failed to delete enrollment" },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Enrollment rejected", data: deleteEnrollment },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
