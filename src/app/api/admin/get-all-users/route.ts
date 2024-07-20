import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/Users";

export async function GET() {
  
  await dbConnect();
  try {
    const users = await UserModel.find().select("-password");

    return Response.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return Response.json(
      { message: "Error fetching enrollments" },
      { status: 500 }
    );
  }
}
