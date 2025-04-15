"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { toast } from "sonner";
import React, { useState } from "react";
import { signInSchema } from "@/schemas/signInSchema";
import Link from "next/link";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    const response = await signIn("credentials", { redirect: false, ...data });

    console.log(`Next Auth sign in response:: ${response}`);

    if (response?.error) {
      if (response.error == "CredentialsSignin") {
        toast.error(response.error || "Incorrect credentials.");
      }
    }

    if (response?.url) {
      router.replace(`/dashboard`);
      toast.success("Signed up successfully!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background  text-foreground">
      <div className="w-full max-w-md p-8 space-y-8 rounded-[var(--radius)] shadow-md bg-card text-card-foreground">
        <div className="text-center">
          <h1 className="text-md font-extrabold tracking-tight lg:text-3xl mb-3">
            Secret Sprinkles
          </h1>
          <p className="mb-4 text-muted-foreground">
            Sign in to see what anonymous messages are waiting for you. It’s
            fun, light, and full of surprises!
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="Username or Email" {...field} />
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
            <span className="text-zinc-500">Don't have an account? </span>
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
