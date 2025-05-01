"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Message } from "@/models/message.models";
import { Card, CardBody } from "@heroui/card";
import axios from "axios";
import { EllipsisVerticalIcon, Trash } from "lucide-react";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Roboto } from "next/font/google";
import dayjs from "dayjs";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const handleDelete = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`);

    toast.success(response.data.message);

    onMessageDelete(message._id as string);
  };

  return (
    <Card className="relative border border-[var(--border)] rounded-xl shadow-sm hover:shadow-md transition-shadow bg-card text-card-foreground pr-5">
      <div className="absolute top-2 right-2 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="rounded-full size-8 p-0 flex items-center justify-center border border-muted-foreground/20 hover:bg-muted"
              variant="ghost"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[160px] p-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                  aria-label="Delete message"
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the message from our servers.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </PopoverContent>
        </Popover>
      </div>

      <CardBody className="px-6 py-5 flex flex-col gap-4">
        <p
          className={`${roboto.variable} text-base text-black dark:text-[var(--foreground)]`}
        >
          {message.content}
        </p>
        <p className="mt-2 text-sm font-semibold">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </p>
      </CardBody>
    </Card>
  );
}
