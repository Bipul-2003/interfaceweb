import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/Users";

export async function PATCH(req: Request) {
  const { id, role } = await req.json();
  try {
    await dbConnect();

    const session = await auth();
    console.log(session?.user);

    if (!(session?.user?.role === 1)) {
      return Response.json(
        { message: "Unauthorized Please login" },
        { status: 401 }
      );
    }
    console.log(session?.user?.role);
    const user = await UserModel.findByIdAndUpdate(
      { _id: id },
      { role },
      { new: true }
    );
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return Response.json(
      { message: "Error fetching enrollments" },
      { status: 500 }
    );
  }
}
