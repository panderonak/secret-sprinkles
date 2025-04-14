import { getServerSession } from "next-auth";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/user.models";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import APIResponseInterface from "@/types/APIResponseInterface";
import authOptions from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
): Promise<NextResponse> {
  try {
    const messageId = params.messageId;
    await dbConnection();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session?.user) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Authentication required. Please log in to access this resource.`,
      };

      return NextResponse.json(responseBody, { status: 401 });
    }

    const response = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageId } },
      }
    );

    if (response.modifiedCount < 1) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `Message not found or has already been deleted.`,
      };

      return NextResponse.json(responseBody, { status: 404 });
    }

    const responseBody: APIResponseInterface = {
      success: true,
      message: `Your message has been successfully deleted.`,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error: any) {
    console.error(
      `An error occurred while deleting the message.. Details: ${error.message || error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message:
        "We’re having trouble deleting the message. Please try again soon.",
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
