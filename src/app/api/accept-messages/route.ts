import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/user.models";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import APIResponseInterface from "@/types/APIResponseInterface";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnection();

  try {
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session?.user) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Authentication required. Please log in to access this resource.`,
      };

      return NextResponse.json(responseBody, { status: 401 });
    }

    const userId = user._id;

    const { messageAcceptanceStatus } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: messageAcceptanceStatus,
      },
      { new: true }
    );

    if (!updatedUser) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We're currently experiencing issues updating the user's status to accept messages. Please try again shortly.`,
      };

      return NextResponse.json(responseBody, { status: 401 });
    }

    const responseBody: APIResponseInterface = {
      success: true,
      message: `Your message acceptance settings have been updated successfully.`,
      data: updatedUser,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error(
      `An error occurred while updating the user's status to accept messages. Details: ${error.message || error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're currently experiencing issues updating the user's status to accept messages. Please try again shortly.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  await dbConnection();

  try {
    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session?.user) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Authentication required. Please log in to access this resource.`,
      };

      return NextResponse.json(responseBody, { status: 401 });
    }

    const userId = user._id;

    const retrievedUser = await UserModel.findById(userId);

    if (!retrievedUser) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn't find the user you're looking for. Double-check the details and give it another try!`,
      };

      return NextResponse.json(responseBody, { status: 404 });
    }

    const responseBody: APIResponseInterface = {
      success: true,
      message: `We couldn't find the user you're looking for. Double-check the details and give it another try!`,
      isAcceptingMessages: retrievedUser.isAcceptingMessage,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error(
      `An error occurred while retrieving the user's status for message acceptance. Details: ${error.message || error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We're currently facing issues getting the user's status to accept messages. Please try again shortly.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
