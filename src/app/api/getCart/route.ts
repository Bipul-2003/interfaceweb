import dbConnect from "@/lib/dbConnection";
import CartModel from "@/models/Cart";
import getSession from "@/utils/getSession";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const user = session.user;

    // Fetch cart items and their associated sessions
    const cartItems = await CartModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user?.id),
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "sessions",
          localField: "products.session",
          foreignField: "_id",
          as: "sessionData",
        },
      },
      {
        $unwind: "$sessionData",
      },
      {
        $lookup: {
          from: "courses",
          localField: "sessionData.courseid",
          foreignField: "_id",
          as: "courseData",
        },
      },
      {
        $unwind: "$courseData",
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "products.enrollment",
          foreignField: "_id",
          as: "enrollmentData",
        }
      },
      {
        $unwind: "$enrollmentData",
      },
      {
        $project: {
          _id: 0,
          status: "$enrollmentData.status",
          enrollmentId: "$products.enrollment",
          sessionId: "$sessionData._id",
          session: {
            enrolledStudentsCount: { $size: "$sessionData.enrolledStudents" },
            maxcapacity: "$sessionData.maxcapacity",
            startDate: "$sessionData.startDate",
            endDate: "$sessionData.endDate",
            instructor: "$sessionData.instructor",
            startTime: "$sessionData.startTime",
            endTime: "$sessionData.endTime",
            days: "$sessionData.days",
          },
          course: {
            title: "$courseData.title",
          },
          paymentLastDate: "$sessionData.paymentLastDate",
          startDate: "$sessionData.startDate",
          instructor: "$sessionData.instructor",
          sessionno: "$sessionData.sessionno",
          price: "$sessionData.price",
        },
      },
    ]);

    // Return the array of sessions with enrollment IDs
    return Response.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json({ message: "Error fetching cart" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  await dbConnect();
  const { sessionid } = await request.json();
  console.log(sessionid);

  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const user = session.user;

    // Remove the specific session ID from the 'product' array
    const updatedCart = await CartModel.findOneAndUpdate(
      { user: user?.id },
      { $pull: { products: { session: sessionid } } },
      { new: true }
    );

    if (!updatedCart) {
      return Response.json({ message: "Error updating cart" }, { status: 500 });
    }

    return Response.json(
      { message: "Session removed from cart", cart: updatedCart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    return Response.json({ message: "Error updating cart" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
