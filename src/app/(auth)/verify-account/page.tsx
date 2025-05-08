"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import APIResponseInterface from "@/types/APIResponseInterface";
import { Loader } from "lucide-react";
import { usernameSchema } from "@/schemas/usernameSchema";

export default function page() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(data: z.infer<typeof usernameSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post<APIResponseInterface>(
        `/api/verify-account/?username=${data.username}`
      );

      if (response.data.success) toast.success(response.data.message);

      router.replace(`/reset-password/verify/${data.username}`);
    } catch (error: any) {
      const axiosError = error as AxiosError<APIResponseInterface>;
      let errorMessage =
        axiosError.response?.data.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);

      console.error(
        `Error occurred while sign up user. Error details: ${error}. Stack trace: ${error.stack || "No stack trace available"}`
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
            Secret Sprinkles
          </h1>
          <p className="mb-4 text-muted-foreground">
            Don't worry — just enter your username and we'll help you reset it
            in a few quick steps.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username*</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              className="relative bg-primary text-primary-foreground hover:bg-primary/80 focus:ring focus:ring-ring border"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader className="absolute inset-0 m-auto h-4 w-4 animate-spin" />
              )}
              <span className={isSubmitting ? "invisible" : ""}>Continue</span>
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            <span className="text-zinc-500">
              Not a member yet?{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
              —it’s quick and easy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
