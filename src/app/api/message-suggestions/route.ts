import APIResponseInterface from "@/types/APIResponseInterface";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = "edge";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      temperature: 0.7, // Controlled creativity
      maxTokens: 150, // Limit response length for cost efficiency
    });

    console.log(`Result: ${result}`);

    const responseBody: APIResponseInterface = {
      success: true,
      message: `These are the questions you requested. Hope they help!`,
    };

    // Create the streaming response
    const streamingResponse = result.toDataStreamResponse();

    // Set custom header with structured data
    streamingResponse.headers.set(
      "X-Structured-Data",
      JSON.stringify(responseBody)
    );

    streamingResponse.headers.set("Content-Type", "text/plain; charset=utf-8");

    return streamingResponse;
  } catch (error: any) {
    console.error(
      `An error occurred while attempting to send the requested questions. Error details: ${error.message || error}. Stack trace: ${error.stack || "No stack trace available"}`
    );

    const responseBody: APIResponseInterface = {
      success: false,
      message: `We’re having trouble sending the questions. Please try again shortly.`,
    };

    return NextResponse.json(responseBody, { status: 500 });
  }
}
