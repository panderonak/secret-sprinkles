import { passwordResetEmailSender } from "@/helpers/passwordResetEmailSender";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/user.models";
import { usernameValidation } from "@/schemas/signUpSchema";
import APIResponseInterface from "@/types/APIResponseInterface";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnection();

    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors;
      console.error(
        `Validation failed for username. Errors: ${usernameErrors?.join(", ")}`
      );

      const responseBody: APIResponseInterface = {
        success: false,
        message: `The username format doesn't seem right. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const { username } = result.data;

    const verifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (!verifiedUser) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn't find a user with that username. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    verifiedUser.verificationCode = verificationCode;
    verifiedUser.verificationCodeExpiry = new Date(Date.now() + 3600000);

    await verifiedUser.save();

    const passwordResetEmailResponse = await passwordResetEmailSender(
      verifiedUser.email,
      username,
      verificationCode
    );

    if (!passwordResetEmailResponse.success) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `${passwordResetEmailResponse.message}`,
      };

      return NextResponse.json(responseBody, { status: 500 });
    }

    const responseBody: APIResponseInterface = {
      success: true,
      message: `We've sent a code to your email to help you reset your password.`,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error(
      `Username verification failed. ${error.message || error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're currently experiencing issues verifying your username. Please try again in a moment.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
