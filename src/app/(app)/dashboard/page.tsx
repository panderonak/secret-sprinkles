"use client";

import { Message } from "@/models/message.models";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import APIResponseInterface from "@/types/APIResponseInterface";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { Key, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/custom/MessageCard";
import { User } from "next-auth";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BlurFade } from "@/components/magicui/blur-fade";
import { getUserProfileUrl } from "@/helpers/getUserProfileUrl";

export default function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: true,
    },
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const isAcceptingMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<APIResponseInterface>(
        "/api/accept-messages"
      );
      setValue("acceptMessages", response.data.isAcceptingMessages as boolean);
    } catch (error: any) {
      const axiosError = error as AxiosError<APIResponseInterface>;
      let errorMessage =
        axiosError.response?.data.message ||
        "Couldn't load your message settings. Please try again.";

      toast.error(errorMessage);

      console.error(
        `Error occurred while loading user message settings. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const getMessages = useCallback(
    async function (refresh: boolean = false) {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get<APIResponseInterface>("/api/messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast.success("You're all set — latest messages are here!");
        }

        toast.success(
          response.data.message ||
            "Your message(s) have been received successfully!"
        );
      } catch (error: any) {
        const axiosError = error as AxiosError<APIResponseInterface>;
        let errorMessage =
          axiosError.response?.data.message ||
          "We couldn't load your messages. Please try again.";

        toast.error(errorMessage);

        console.error(
          `Error occurred while loading user messages. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    getMessages();
    isAcceptingMessage();
  }, [session, setValue, toast, isAcceptingMessage, getMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<APIResponseInterface>(
        "/api/accept-messages",
        {
          acceptMessages: !acceptMessages,
        }
      );

      setValue("acceptMessages", !acceptMessages);

      toast.success(
        response.data.message ||
          "You're all set — we've updated your message settings!"
      );
    } catch (error: any) {
      const axiosError = error as AxiosError<APIResponseInterface>;
      let errorMessage =
        axiosError.response?.data.message ||
        "We couldn't update your message settings. Please try again later.";

      toast.error(errorMessage);

      console.error(
        `Error occurred while updating user message settings. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
      );
    }
  };

  const { username } = (session?.user as User) || {};

  const profileUrl = getUserProfileUrl(username!);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success(
      "Your profile URL has been successfully copied to the clipboard!"
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-10 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6">Here’s Your Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">
          Share This Link to Receive Messages
        </h2>
        <div className="flex items-center gap-3 rounded-lg py-4">
          <input
            name="profileUrl"
            type="text"
            value={profileUrl}
            disabled
            className="flex-1 bg-transparent text-sm text-muted-foreground font-mono px-3 py-2 border border-input rounded-lg focus:outline-none"
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="whitespace-nowrap cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-md font-medium text-muted-foreground">
          Accept Messages:
        </span>
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <Badge variant={acceptMessages ? "default" : "secondary"}>
          {acceptMessages ? "On" : "Off"}
        </Badge>
      </div>
      <Separator className="mb-6" />
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            getMessages(true);
          }}
        >
          <RefreshCcw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <div
        className={`${messages.length > 0 ? "columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6 pb-10" : "grid grid-cols-1 md:grid-cols-2 gap-6"}`}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <BlurFade
              key={message._id as Key}
              delay={0.25 + index * 0.05}
              inView
            >
              <div className="break-inside-avoid">
                <MessageCard
                  key={message._id as Key}
                  message={message}
                  onMessageDelete={handleDelete}
                />
              </div>
            </BlurFade>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground text-sm border border-dashed border-border rounded-lg p-8">
            No messages to display.
          </div>
        )}
      </div>
    </div>
  );
}
