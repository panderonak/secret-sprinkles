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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import APIResponseInterface from "@/types/APIResponseInterface";
import { Loader } from "lucide-react";

export default function page() {
  const [username, setUsername] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [isCheckingUsernameAvailability, setIsCheckingUsernameAvailability] =
    useState(false);

  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    async function checkUsernameAvailability() {
      if (username) {
        setIsCheckingUsernameAvailability(true);
        setMessage("");
        try {
          const response = await axios.get<APIResponseInterface>(
            `/api/username-availability?username=${username}`
          );
          console.log(`Response: ${response}`);
          setMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<APIResponseInterface>;

          setMessage(
            axiosError.response?.data.message ?? "Error checking username."
          );
          console.error(
            `Error occurred while checking username availability. Error details: ${axiosError}. Stack trace: ${axiosError.stack || "No stack trace available"}`
          );
        } finally {
          setIsCheckingUsernameAvailability(false);
        }
      }
    }

    checkUsernameAvailability();
  }, [username]);

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post<APIResponseInterface>(
        `/api/sign-up`,
        data
      );
      if (response.data.success) toast.success(response.data.message);

      router.replace(`/verify/${username}`);
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
    <div className="flex justify-center items-center min-h-screen bg-background  text-foreground">
      <div className="w-full max-w-md p-8 space-y-8 rounded-[var(--radius)] shadow-md bg-card text-card-foreground">
        <div className="text-center">
          <h1 className="text-md font-extrabold tracking-tight lg:text-3xl mb-3">
            Secret Sprinkles
          </h1>
          <p className="mb-4 text-muted-foreground">
            Sign up to get anonymous messages—real talk, no names.
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
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(evt) => {
                        field.onChange(evt);
                        debounced(evt.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsernameAvailability && (
                    <Loader className="animate-spin" />
                  )}
                  <FormMessage children={message} />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input
                      className="focus:ring focus:ring-ring border"
                      placeholder="Password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
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
              <span className={isSubmitting ? "invisible" : ""}>Sign In</span>
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            <span className="text-zinc-500">Already have an account? </span>
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
