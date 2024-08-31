import dbConnect from "@/lib/dbConnection";
import CartModel from "@/models/Cart";
import Enrollment from "@/models/Enrollments";
import getSession from "@/utils/getSession";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Unauthorized Please login" },
        { status: 401 }
      );
    }
    const user = session.user;
    const cartitems = await CartModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user?.id),
        },
      },
      {
        $lookup: {
          from: "sessions",
          localField: "product",
          foreignField: "_id",
          as: "session",
          pipeline: [
            {
              $lookup: {
                from: "courses",
                localField: "courseid",
                foreignField: "_id",
                as: "course",
                pipeline: [
                  {
                    $project: {
                      title: 1,
                      _id: 0,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                course: {
                  $first: "$course",
                },
              },
            },
            {
              $project: {
                course: 1,
                _id: 0,
                paymentLastDate: 1,
                startDate: 1,
                instructor: 1,
                sessionno:1,
                price: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          session: {
            $first: "$session",
          },
        },
      },
    ]);
    return Response.json({ cartitems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json({ message: "Error fetching cart" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  await dbConnect();
  const { sessionid } = await request.json();
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Unauthorized Please login" },
        { status: 401 }
      );
    }
    const user = session.user;
    const updatedCart = await CartModel.findOneAndUpdate(
      { user: user?.id },
      { $pull: { items: { product: sessionid } } },
      { new: true }
    );

    if (!updatedCart) {
      return Response.json({ message: "Error updating cart" }, { status: 500 });
    }
    Response.json({ message: "Product removed from cart" }, { status: 200 });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return Response.json(
      { message: "Error creating enrollment" },
      { status: 500 }
    );
  }
}
