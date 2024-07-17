import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import UserModel from "@/models/Users";
import { sendVerificationEmail } from "@/utils/sendVerificatonEmail";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password, firstname, middlename, lastname, phonenumber } = await req.json();

    const existingVerifiedUserWithEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedUserWithEmail) {
      return Response.json(
        { message: "Email already registered", success: false },
        { status: 400 }
      );
    }

    const existingUserWithEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return Response.json(
          { message: "Email already registered", success: false },
          { status: 400 }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const verifyCodeExp = new Date();
        verifyCodeExp.setHours(verifyCodeExp.getHours() + 1);

        existingUserWithEmail.password = hashPassword;
        existingUserWithEmail.verifyCode = verifyCode;
        existingUserWithEmail.verifyCodeExpire = verifyCodeExp;
        await existingUserWithEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const verifyCodeExp = new Date();
      verifyCodeExp.setHours(verifyCodeExp.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpire:verifyCodeExp,
        role:2,
        firstname,
        middlename,
        lastname,
        phonenumber
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { message: emailResponse.message, success: false },
        { status: 500 }
      );
    }
    return Response.json(
      { message: "Email sent..", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in sign-up route", error);
    return Response.json(
      { message: "Error registering while user", success: false },
      { status: 500 }
    );
  }
}
