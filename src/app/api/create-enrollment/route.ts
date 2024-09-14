import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import CartModel from "@/models/Cart";
import Enrollment from "@/models/Enrollments";
import SessionModel from "@/models/Sessions";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { session } = await req.json();
    const userSession = await auth();

    const user = userSession?.user?.id;
    if (!userSession) {
      return Response.json(
        { message: "Kindly Signin to book" },
        { status: 401 }
      );
    }

    const existingSession = await SessionModel.findById(session);
    if (!existingSession) {
      return Response.json(
        { message: "Session does not exist" },
        { status: 400 }
      );
    }
    if (existingSession.bookedStudents.length > existingSession.maxCapacity) {
      return Response.json({ message: "Session is full" }, { status: 400 });
    }
    if (new Date(existingSession.bookingLastDate) < new Date(Date.now())) {
      return Response.json(
        { message: "Session booking date has passed" },
        { status: 400 }
      );
    }

    const existingEnrollment = await Enrollment.findOne({ user, session });
    if (existingEnrollment) {
      return Response.json(
        { message: "Enrollment already exists" },
        { status: 400 }
      );
    }

    let enrollment;
    let updatedSession;

    if (existingSession.enrolledStudents.length < existingSession.maxCapacity) {
      enrollment = new Enrollment({
        user: user,
        session: session,
        status: "enrolled",
        paymentStatus: "pending",
      });
      await enrollment.save();

      updatedSession = await SessionModel.findByIdAndUpdate(
        session,
        {
          $addToSet: { enrolledStudents: user },
        },
        { new: true }
      );
    } else if (
      existingSession.waitingStudents.length <
      existingSession.maxWaitingCapacity
    ) {
      enrollment = new Enrollment({
        user: user,
        session: session,
        status: "waiting",
        paymentStatus: "pending",
      });
      await enrollment.save();

      updatedSession = await SessionModel.findByIdAndUpdate(
        session,
        {
          $addToSet: { waitingStudents: user },
        },
        { new: true }
      );
    } else {
      return Response.json({ message: "Session is full" }, { status: 400 });
    }

    // Update or create cart
    const cartProduct = {
      session: session,
      enrollment: enrollment._id,
    };

    const updatedCart = await CartModel.findOneAndUpdate(
      { user: user },
      {
        $push: { products: cartProduct },
      },
      { upsert: true, new: true }
    );

    if (!updatedCart) {
      return Response.json(
        { message: "Error updating cart" },
        { status: 500 }
      );
    }

    const message = enrollment.status === "enrolled"
      ? "Added to the cart please pay.."
      : "Added to cart & You are in waitinglist";

    return Response.json(
      {
        message: message,
        data: updatedSession,
        cart: updatedCart,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error creating enrollment:", error);
    return Response.json(
      { message: "Error creating enrollment" },
      { status: 500 }
    );
  }
}
