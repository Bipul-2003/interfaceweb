import dbConnect from "@/lib/dbConnection";
import EnrollmentModel from "@/models/Enrollments";

import SessionModel from "@/models/Sessions";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const { id } = params;

    const enrollment = await EnrollmentModel.findById(id);

    return Response.json({ enrollment }, { status: 200 });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return Response.json(
      { message: "Error fetching enrollments" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const { id } = params;
    const { paymentDone, bookingConfirmed } = await req.json();

    const enrollment = await EnrollmentModel.findById(id);
    if (!enrollment) {
      return Response.json(
        { message: "Enrollment not found" },
        { status: 404 }
      );
    }
    if (enrollment.status === "waiting") {
      return Response.json(
        { message: "Enrollment is in waiting status" },
        { status: 400 }
      );
    }
    if (enrollment.status === "booked") {
      return Response.json(
        { message: "Enrollment is already booked" },
        { status: 400 }
      );
    }
    const session = await SessionModel.findById(enrollment.session);
    if (!session) {
      return Response.json({ message: "Session not found" }, { status: 404 });
    }
    if (session.bookedStudents.length >= session.maxCapacity) {
      return Response.json({ message: "Session is full" }, { status: 400 });
    }

    if (paymentDone == true && bookingConfirmed == true) {
      enrollment.paymentStatus = "completed";
      enrollment.status = "booked";

      session.bookedStudents.push(enrollment.user);
      session.enrolledStudents = session.enrolledStudents.filter(
        (student) => student.toString() !== enrollment.user.toString()
      );
      if (
        session.waitingStudents.length > 0 &&
        session.enrolledStudents.length < session.maxCapacity && session.bookedStudents.length < session.maxCapacity
      ) {
        const id = session.waitingStudents.shift();
        if (id) {
          session.enrolledStudents.push(id);
          const waitingstudentenrollment =
            await EnrollmentModel.findOneAndUpdate(
              { user: id, session: session._id },
              { status: "enrolled", bookedOn: new Date() }
            );
          if (!waitingstudentenrollment) {
            return Response.json(
              { message: "Error updating waiting student enrollment" },
              { status: 500 }
            );
          }
        }
      }
    }
    await session.save();
    await enrollment.save();

    return Response.json(
      { message: "Enrollment updated", data: enrollment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return Response.json(
      { message: "Error updating enrollment" },
      { status: 500 }
    );
  }
}
