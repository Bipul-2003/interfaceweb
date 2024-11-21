import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import UserModel from "@/models/Users";
import { z } from 'zod';
import { sendVerificationEmail } from '@/utils/sendVerificatonEmail';

// const userSchema = z.object({
//   username: z.string().min(3).max(20),
//   email: z.string().email(),
//   password: z.string().min(8),
//   firstname: z.string(),
//   middlename: z.string().optional(),
//   lastname: z.string(),
//   phonenumber: z.string()
// });

export async function POST(req: Request) {
  await dbConnect();

  try {
    // const body = 
    // const validatedData = userSchema.parse(body);

    const { username, email, password, firstname, middlename, lastname, phonenumber } = await req.json();

    // Check if username already exists
    const existingUserWithUsername = await UserModel.findOne({ username });
    if (existingUserWithUsername) {
      return NextResponse.json(
        { message: "Username already taken", success: false },
        { status: 400 }
      );
    }

    // Check if email already exists and is verified
    const existingVerifiedUserWithEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedUserWithEmail) {
      return NextResponse.json(
        { message: "Email already registered", success: false },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashPassword = await bcrypt.hash(password, 10);
    const verifyCodeExp = new Date(Date.now() + 3600000); // 1 hour from now

    let user = await UserModel.findOne({ email, isVerified: false });

    if (user) {
      // Update existing unverified user
      user.username = username;
      user.password = hashPassword;
      user.verifyCode = verifyCode;
      user.verifyCodeExpire = verifyCodeExp;
      user.firstname = firstname;
      user.middlename = middlename;
      user.lastname = lastname;
      user.phonenumber = phonenumber;
    } else {
      // Create new user
      user = new UserModel({
        username,
        email,
        password: hashPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpire: verifyCodeExp,
        role: 2, // Assuming 2 is the default role for new users
        firstname,
        middlename,
        lastname,
        phonenumber
      });
    }

    await user.save();

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    
    if (!emailResponse.success) {
      return NextResponse.json(
        { message: "User registered but failed to send verification email", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User registered successfully. Verification email sent.", success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in sign-up route", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors, success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error registering user", success: false },
      { status: 500 }
    );
  }
}

