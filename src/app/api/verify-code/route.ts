import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/Users";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();

    if (!username || !code) {
      return NextResponse.json(
        { success: false, message: "Username and code are required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.verifyCode || !user.verifyCodeExpire) {
      return NextResponse.json(
        { success: false, message: "User is already verified or verification code is missing" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();

    if (!isCodeValid) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (!isCodeNotExpired) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyCode = null;
    user.verifyCodeExpire = null;

    try {
      await user.save();
      return NextResponse.json(
        { success: true, message: "User verified successfully" },
        { status: 200 }
      );
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return NextResponse.json(
        { success: false, message: "Error verifying user" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error during user verification:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during verification" },
      { status: 500 }
    );
  }
}

