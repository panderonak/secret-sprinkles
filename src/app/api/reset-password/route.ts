import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/user.models";
import { passwordValidation, usernameValidation } from "@/schemas/signUpSchema";
import APIResponseInterface from "@/types/APIResponseInterface";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

const PasswordBodySchema = z.object({
  password: passwordValidation,
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  await dbConnection();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const usernameResult = UsernameQuerySchema.safeParse(queryParam);

    if (!usernameResult.success) {
      const usernameErrors = usernameResult.error.format().username?._errors;
      console.error(
        `Validation failed for username. Errors: ${usernameErrors?.join(", ")}`
      );

      const responseBody: APIResponseInterface = {
        success: false,
        message:
          usernameErrors?.[0] ||
          "The username format seems off. Please double-check and try again.",
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    const { username } = usernameResult.data;

    const body = await request.json();

    const passwordResult = PasswordBodySchema.safeParse(body);

    if (!passwordResult.success) {
      const passwordErrors = passwordResult.error.format().password?._errors;
      console.error(
        `Password validation failed: ${passwordErrors?.join(", ")}`
      );

      const responseBody: APIResponseInterface = {
        success: false,
        message:
          passwordErrors?.[0] || "Oops! That password doesn't look right.",
      };
      return NextResponse.json(responseBody, { status: 400 });
    }

    const { password } = passwordResult.data;

    const user = await UserModel.findOne({ username });

    if (!user) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn't find your account at the moment. Please try again shortly.`,
      };

      return NextResponse.json(responseBody, { status: 404 });
    }

    if (await bcrypt.compare(password, user.password)) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Your new password needs to be different from the old one.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;

    await user.save({ validateBeforeSave: true });

    const responseBody: APIResponseInterface = {
      success: true,
      message: `All set! Your password was updated successfully.`,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error(
      `Password update failed. \nError Message: ${error.message}\nStack Trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We’re having a little trouble updating your password. Please try again in a moment!`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
