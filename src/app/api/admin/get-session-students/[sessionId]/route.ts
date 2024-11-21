import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import SessionModel from "@/models/Sessions";
import UserModel from "@/models/Users";
import { NextRequest } from "next/server";
import { Types } from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  await dbConnect();

  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    // Optionally, you can check for admin role if needed
    // if (session.user.role !== 1) {
    //   return Response.json(
    //     { message: "Unauthorized. Admin access required." },
    //     { status: 403 }
    //   );
    // }

    const { sessionId } = params;

    const sessionData = await SessionModel.findById(sessionId);

    if (!sessionData) {
      return Response.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    const userIds = [
      ...sessionData.enrolledStudents,
      ...sessionData.bookedStudents,
      ...sessionData.waitingStudents
    ];

    const users = await UserModel.find(
      { _id: { $in: userIds } },
      'username email phonenumber firstname middlename lastname'
    );

    const formattedUsers = users.map(user => {
      const userId = user._id instanceof Types.ObjectId ? user._id : new Types.ObjectId(user._id as string);
      return {
        username: user.username,
        email: user.email,
        phonenumber: user.phonenumber,
        firstname: user.firstname,
        middlename: user.middlename,
        lastname: user.lastname,
        status: sessionData.enrolledStudents.some(id => id.equals(userId)) ? 'Enrolled' :
                sessionData.bookedStudents.some(id => id.equals(userId)) ? 'Booked' :
                'Waiting'
      };
    });

    return Response.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching session users:", error);
    return Response.json(
      { message: "Error fetching session users" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";