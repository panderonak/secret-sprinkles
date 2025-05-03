import { verificationEmailSender } from "@/helpers/verificationEmailSender";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/user.models";
import APIResponseInterface from "@/types/APIResponseInterface";
import { signUpSchema } from "@/schemas/signUpSchema";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnection();

  try {
    const body = await request.json();
    const { username, email, password } = signUpSchema.parse(body);

    // Handles the case where the username is already taken and has been verified.

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `The username you’ve chosen is already taken. Please try a different one.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    // Check if a user already exists with the given email address.

    const existingUserByEmail = await UserModel.findOne({ email });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existingUserByEmail) {
      // Check if a user with the given email address exists and is verified.

      if (existingUserByEmail.isVerified) {
        const responseBody: APIResponseInterface = {
          success: false,
          message: `User already exists with this email.`,
        };

        return NextResponse.json(responseBody, { status: 400 });
      } else {
        // Handle case where a user with the given email address exists but is not verified.

        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verificationCode = verificationCode;
        existingUserByEmail.verificationCodeExpiry = new Date(
          Date.now() + 3600000
        );

        await existingUserByEmail.save();
      }
    } else {
      // If the user is registering for the first time

      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send a verification email to the user

    const verificationEmailResponse = await verificationEmailSender(
      email,
      username,
      verificationCode
    );

    if (!verificationEmailResponse.success) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `${verificationEmailResponse.message}`,
      };

      return NextResponse.json(responseBody, { status: 500 });
    }

    const responseBody: APIResponseInterface = {
      success: true,
      message: `You're all set! Check your email to verify your account.`,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors

      const responseBody: APIResponseInterface = {
        success: false,
        message: `t looks like some of the input data isn’t valid. Please double-check and try again.`,
      };

      return NextResponse.json(responseBody, { status: 400 });
    }

    console.error(
      `An error occurred while registering the user: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're experiencing some issues while registering the user. Please try again shortly.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
