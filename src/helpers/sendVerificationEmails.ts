import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmails(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Email",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification Code email sent" };
  } catch (error: any) {
    return {
      success: false,
      message: "Verification Code email sending failed",
    };
  }
}
