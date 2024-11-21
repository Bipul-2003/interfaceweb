import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
     await resend.emails.send({
      // from: "Interface <onboarding@resend.dev>",
      from: "noreply@ifaceh.com",
      to: email,
      subject: "Interfacehub LLC | Verifiaction Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("Email sent", email);
    return { message: "Email sent", success: true };
  } catch (error) {
    console.log("Error in sending verification email", error);
    return { message: "Error in sending verification email", success: false };
  }
}
