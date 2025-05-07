import { resend } from "@/lib/resend";
import PasswordResetEmail from "@/lib/emails/PasswordResetEmail";
import APIResponseInterface from "@/types/APIResponseInterface";

export async function passwordResetEmailSender(
  email: string,
  username: string,
  verificationCode: string
): Promise<APIResponseInterface> {
  try {
    await resend.emails.send({
      from: "Secret Sprinkles <onboarding@resend.dev>",
      to: email,
      subject: "Here’s Your Secret Sprinkles Code!",
      react: PasswordResetEmail({ username, otp: verificationCode }),
    });

    return {
      success: true,
      message: "We've sent you a verification email. Check your inbox!",
    };
  } catch (error) {
    console.error(`Error sending verification email. Details: ${error}`);

    return {
      success: false,
      message: `We’re having trouble sending the verification email. Please try again in a few moments.`,
    };
  }
}
