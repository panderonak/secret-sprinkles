"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verificationSchema } from "@/schemas/verificationSchems";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import APIResponseInterface from "@/types/APIResponseInterface";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function page() {
  const router = useRouter();

  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof verificationSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        ...data,
      });

      if (response.data.success) toast.success(response.data.message);

      router.replace("/sign-in");
    } catch (error: any) {
      const axiosError = error as AxiosError<APIResponseInterface>;
      let errorMessage =
        axiosError.response?.data.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);

      console.error(
        `Error occurred while verifying user. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background  text-foreground">
      <div className="w-full max-w-md p-8 space-y-8 rounded-[var(--radius)] shadow-md bg-card text-card-foreground">
        <div className="text-center">
          <h1 className="text-md font-extrabold tracking-tight lg:text-3xl mb-3">
            Secret Sprinkles
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80 focus:ring focus:ring-ring border"
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
