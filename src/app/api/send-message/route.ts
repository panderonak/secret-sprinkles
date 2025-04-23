import UserModel from "@/models/user.models";
import dbConnection from "@/lib/dbConnection";
import { Message } from "@/models/message.models";
import { NextRequest, NextResponse } from "next/server";
import APIResponseInterface from "@/types/APIResponseInterface";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnection();
  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn't find the user you're looking for. Please double-check the details and try again.`,
      };

      return NextResponse.json(responseBody, { status: 404 });
    }

    if (!user.isAcceptingMessage) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `It looks like this user isn't accepting messages at the moment. Please try again later.`,
      };

      return NextResponse.json(responseBody, { status: 403 });
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    const responseBody: APIResponseInterface = {
      success: true,
      message: `Your message has been sent successfully!`,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error: any) {
    console.error(
      `An error occurred while sending the message. Details: ${error.message || error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're having a little trouble sending your message. Please try again in a bit.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
