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
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-10 py-12 sm:px-6 lg:px-8">
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
          className="mx-auto mt-16 max-w-xl sm:mt-20"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block font-semibold">
                      Message
                    </FormLabel>
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
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              className="relative bg-primary text-primary-foreground hover:bg-primary/80 focus:ring focus:ring-ring border"
              type="submit"
              disabled={isSending}
            >
              {isSending && (
                <Loader className="absolute inset-0 m-auto h-4 w-4 animate-spin" />
              )}
              <span className={isSending ? "invisible" : ""}>Send</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
