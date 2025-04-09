import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/user.models";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import APIResponseInterface from "@/types/APIResponseInterface";
import mongoose from "mongoose";

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

    const userDetails = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userDetails || userDetails.length < 1) {
      const responseBody: APIResponseInterface = {
        success: false,
        message: `We couldn't find the user you're looking for. Please check the details and try again.`,
      };

      return NextResponse.json(responseBody, { status: 404 });
    }

    // Change
    const responseBody: APIResponseInterface = {
      success: true,
      message: `Your message(s) have been received successfully!`,
      messages: userDetails[0]?.messages,
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
