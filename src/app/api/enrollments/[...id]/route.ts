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

    // Find the enrollment by ID
    const enrollment = await EnrollmentModel.findById(id);
    if (!enrollment) {
      return Response.json(
        { message: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Validate enrollment status
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

    // Find the session associated with the enrollment
    const session = await SessionModel.findById(enrollment.session);
    if (!session) {
      return Response.json({ message: "Session not found" }, { status: 404 });
    }
    if (session.bookedStudents.length >= session.maxCapacity) {
      return Response.json({ message: "Session is full" }, { status: 400 });
    }

    // Update enrollment and session if both payment and booking are confirmed
    if (paymentDone && bookingConfirmed) {
      await EnrollmentModel.findByIdAndUpdate(id, {
        paymentStatus: "completed",
        status: "booked"
      });

      await SessionModel.findByIdAndUpdate(
        session._id,
        {
          $push: { bookedStudents: enrollment.user },
          $pull: { enrolledStudents: enrollment.user }
        }
      );

      // If session has a waiting list, enroll the first waiting student if space allows
      if (
        session.waitingStudents.length > 0 &&
        session.bookedStudents.length < session.maxCapacity
      ) {
        const waitingUserId = session.waitingStudents.shift();

        if (waitingUserId) {
          // Add the waiting student to enrolled students list and update their enrollment status
          await SessionModel.findByIdAndUpdate(session._id, {
            $push: { enrolledStudents: waitingUserId },
            $set: { waitingStudents: session.waitingStudents }
          });

          const waitingStudentEnrollment = await EnrollmentModel.findOneAndUpdate(
            { user: waitingUserId, session: session._id },
            { status: "enrolled", bookedOn: new Date() }
          );

          if (!waitingStudentEnrollment) {
            return Response.json(
              { message: "Error updating waiting student enrollment" },
              { status: 500 }
            );
          }
        }
      }
    }

    // Return success response with the updated enrollment
    return Response.json(
      { message: "Enrollment updated", data: await EnrollmentModel.findById(id) },
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
