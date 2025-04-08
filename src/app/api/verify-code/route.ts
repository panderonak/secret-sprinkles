import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/user.models";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import APIResponseInterface from "@/types/APIResponseInterface";

const UsernameQuerySchema = z.object({
  accountUsername: usernameValidation,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnection();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const result = UsernameQuerySchema.safeParse(decodedUsername);

    if (!result.success) {
      const usernameErrors = result.error.format().accountUsername?._errors;
      console.error(
        `Validation failed for username. Errors: ${usernameErrors?.join(", ")}`
      );

      const responseBody: APIResponseInterface = {
        success: false,
        message: `Invalid username format. Please check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const { accountUsername } = result.data;

    const user = await UserModel.findOne({ username: accountUsername });

    if (!user) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn\'t find an account with that info. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 500 });
    }

    const isCodeValid = user.verificationCode === code;
    const isCodeNotExpired = new Date(user.verificationCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      const responseBody: APIResponseInterface = {
        success: true,
        message: `Your account has been successfully verified!`,
      };

      return NextResponse.json(responseBody, { status: 200 });
    } else if (!isCodeNotExpired) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Your verification code has expired. Please sign up again to receive a new code.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    } else {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `The verification code is incorrect. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }
  } catch (error: any) {
    console.error(
      `Error occurred while verifying the user. Details: ${error.message || error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're experiencing an issue while verifying the user. Please try again shortly.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
