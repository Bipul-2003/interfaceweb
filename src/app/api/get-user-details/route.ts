import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/Users";
import getSession from "@/utils/getSession";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized Please login" },
      { status: 401 }
    );
  }
  const id = session.user.id;
  console.log(id);

  try {
  
    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error on getting User:", error);
    return NextResponse.json(
      { message: "Error getting user" },
      { status: 500 }
    );
  }
}
