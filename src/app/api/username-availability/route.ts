import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/user.models";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import APIResponseInterface from "@/types/APIResponseInterface";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  await dbConnection();
  try {
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
        message: `Invalid username format. Please check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const { username } = result.data;

    const verifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (verifiedUser) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `This username is already taken. Please choose another one.`,
      };

      return NextResponse.json(responseBody, { status: 409 });
    }

    const responseBody: APIResponseInterface = {
      success: true,
      message: `You're all set! This username is available.`,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error(
      `Error occurred while checking username availability. Error details: ${error.message || error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're experiencing some issues while checking username availability. Please try again shortly.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
