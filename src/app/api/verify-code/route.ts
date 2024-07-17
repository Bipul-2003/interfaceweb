import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/Users";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, code } = await req.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExp = new Date(user.verifyCodeExpire) > new Date();

    if (isCodeValid && isCodeNotExp) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified",
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Code expired",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error getting verification code", error);
    return Response.json(
      {
        success: false,
        message: "Error checking verication code",
      },
      { status: 500 }
    );
  }
}
