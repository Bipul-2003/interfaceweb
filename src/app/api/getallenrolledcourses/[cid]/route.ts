import dbConnect from "@/lib/dbConnection";

import SessionModel from "@/models/Sessions";
export async function GET(req: Request, { params }: {params:{cid:string}}) {
  await dbConnect();
  console.log(params);

  const { cid } = params;
  try {
    const sessions = await SessionModel.find({ courseid: cid });

    return Response.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("Error on getting sessions:", error);
    return Response.json(
      { message: "Error getting sessions" },
      { status: 500 }
    );
  }
}
