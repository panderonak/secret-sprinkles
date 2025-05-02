"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import APIResponseInterface from "@/types/APIResponseInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useCompletion } from "@ai-sdk/react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { RetroGrid } from "@/components/magicui/retro-grid";

const specialChar = "||";

const splitMessages = (delimitedMessages: string): string[] => {
  return delimitedMessages.split(specialChar);
};

export default function page() {
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const [isSending, setIsSending] = useState(false);

  async function onSubmit(data: z.infer<typeof messageSchema>) {
    console.log(data);
    setIsSending(true);

    console.log(params);

    try {
      console.log("Before Response");
      const response = await axios.post<APIResponseInterface>(
        "/api/send-message",
        {
          content: data.content,
          username: params.username,
        }
      );
      console.log("After Response");
      toast.success(
        response.data.message ||
          "You're all set — we've updated your message settings!"
      );
    } catch (error: any) {
      const axiosError = error as AxiosError<APIResponseInterface>;
      let errorMessage =
        axiosError.response?.data.message ||
        "We couldn't send your message. Please try again later.";

      toast.error(errorMessage);

      console.error(
        `Error occurred while sending the message. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
      );
    } finally {
      setIsSending(false);
      reset();
    }
  }

  const initialMessageString =
    "What’s a small moment from your week that made you smile?||If you could instantly master any skill or talent, what would you choose and why?||What’s a place you’ve never been to but feel drawn to explore?";

  const { completion, isLoading, error, complete } = useCompletion({
    api: "/api/message-suggestions",
    initialCompletion: initialMessageString,
    onFinish: () => {
      toast.success("These are the questions you requested. Hope they help!");
    },
    onError: () => {
      toast.error(
        "We’re having trouble sending the questions. Please try again shortly."
      );
    },
  });

  async function suggestMessages() {
    complete("");
  }

  const { watch, setValue, reset } = form;

  const messageContent = watch("content");

  const handleMessageClick = (message: string) => {
    setValue("content", message);
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-medium tracking-tight text-balance text-primary sm:text-5xl">
          Public Profile
        </h2>
        <p className="mt-2 text-lg/8 text-muted-foreground">
          Drop{" "}
          <span className="font-semibold text-foreground">
            @{params.username}
          </span>{" "}
          an anonymous note!
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 mx-auto max-w-2xl"
        >
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" font-semibold">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here..."
                    className="min-h-[120px] resize-none mt-2.5"
                    maxLength={280}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end items-center space-x-3">
            <Button
              onClick={suggestMessages}
              className="my-4"
              disabled={isLoading}
            >
              Suggest Messages
            </Button>

            <Button type="submit" disabled={isSending || !messageContent}>
              {isSending && (
                <Loader className="absolute inset-0 m-auto h-4 w-4 animate-spin" />
              )}
              <span className={isSending ? "invisible" : ""}>Send</span>
            </Button>
          </div>
        </form>
      </Form>

      <div className="my-12 mx-auto max-w-2xl">
        <Card className="bg-background shadow-lg rounded-2xl">
          <CardHeader className="text-center px-6 pt-6">
            <h3 className="text-xl font-bold text-foreground">
              Not Sure What to Say? We've Got You
            </h3>
          </CardHeader>

          <CardBody className="flex flex-col items-center gap-4 px-6 py-8">
            {error ? (
              <p className="text-red-500 text-sm">{error.message}</p>
            ) : (
              splitMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-auto md:w-auto text-sm font-medium text-center break-words whitespace-normal bg-muted px-5 py-2.5 rounded-full cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <div className="py-14 mx-auto max-w-2xl mb-12 px-5">
        <div className="grid grid-cols-1 place-content-center">
          <Card className="bg-card rounded-3xl shadow-lg h-full">
            <CardBody className="text-center flex items-center justify-center px-6 py-12 h-64">
              <p className="mb-6 text-lg font-semibold leading-7 px-4">
                Sign up to get your own message board and start receiving
                anonymous messages from friends and others!
              </p>
              <Link href={"/sign-up"}>
                <Button className="px-8 py-3">Get Started – It’s Free!</Button>
              </Link>
            </CardBody>
            <RetroGrid />
          </Card>
        </div>
      </div>
    </div>
  );
}
