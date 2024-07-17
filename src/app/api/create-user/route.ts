import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/Users";
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username,
        email,
        phonenumber,
        password,
        firstname,
        middlename,
        lastname,
        verifyCode,

        } = await req.json();

        const existingUser = await UserModel.findOne({username});
        if (existingUser) {
          return Response.json(
            { message: "User already exists" },
            { status: 400 }
          );
        }

        const verifyCodeExpire = new Date(Date.now() + 10 * 60 * 1000); //10 mins

    const newUser = new UserModel({
        username,
        email,
        phonenumber,
        password,
        firstname,
        middlename,
        lastname,
        verifyCode,
        verifyCodeExpire
    });

    await newUser.save();

    return Response.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
