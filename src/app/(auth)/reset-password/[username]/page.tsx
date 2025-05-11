"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { passwordSchema } from "@/schemas/passwordResetSchema";
import APIResponseInterface from "@/types/APIResponseInterface";
import { Loader } from "lucide-react";

export default function page() {
  const params = useParams<{ username: string }>();

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Real-time password matching feedback
  const password = useWatch({
    control: form.control,
    name: "password",
  });

  const confirmPassword = useWatch({
    control: form.control,
    name: "confirmPassword",
  });

  const passwordsMatch = password === confirmPassword && password.length > 0;

  async function onSubmit(data: z.infer<typeof passwordSchema>) {
    setIsSubmitting(true);

    try {
      const response = await axios.patch<APIResponseInterface>(
        `/api/reset-password?username=${encodeURIComponent(params.username)}`,
        { password: data.password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.replace("/sign-in");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<APIResponseInterface>;
      let errorMessage =
        axiosError.response?.data.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);

      console.error(
        `Error occurred while resetting password. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-8 rounded-[var(--radius)] shadow-md bg-card text-card-foreground">
        <div className="text-center">
          <h1 className="text-md font-extrabold tracking-tight lg:text-3xl mb-3">
            Reset Your Password
          </h1>
          <p className="mb-4 text-muted-foreground">
            Choose a strong new password and enter it below.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  {confirmPassword.length > 0 && (
                    <p
                      className={`text-sm ${passwordsMatch ? "text-green-500" : "text-red-500"}`}
                    >
                      {passwordsMatch
                        ? "Password match"
                        : "Password do not must match."}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="relative bg-primary text-primary-foreground hover:bg-primary/80 focus:ring focus:ring-ring border"
              type="submit"
              disabled={
                !password || !confirmPassword || !passwordsMatch || isSubmitting
              }
            >
              {isSubmitting && (
                <Loader className="absolute inset-0 m-auto h-4 w-4 animate-spin" />
              )}
              <span className={isSubmitting ? "invisible" : ""}>
                Reset Password
              </span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
