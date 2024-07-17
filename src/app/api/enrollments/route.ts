import dbConnect from "@/lib/dbConnection";
import Enrollment from "@/models/Enrollments";


export async function GET() {
    await dbConnect()
    try {
        const enrollments = await Enrollment.find();
    
        return Response.json({ enrollments });
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return Response.json({ message: "Error fetching enrollments" }, { status: 500 });
    }
}