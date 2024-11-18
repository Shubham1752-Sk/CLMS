"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "../../../lib/zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/error-message";
import LoadingButton from "@/components/common/loading-button";

export default function SignIn() {
  const [globalError, setGlobalError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    if (isNavigating) return;

    try {
      setLoading(true);
      const result = await login(values);

      if (result.success) {
        setGlobalError("");
        setIsNavigating(true);

        toast({ description: "Login Successful!", variant: "success" });

        setTimeout(() => {
          if (result.token) {
            localStorage.setItem("auth_token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
          }
          router.replace("/dashboard/my-profile");
        }, 100);
      } else {
        setGlobalError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setGlobalError("An unexpected error occurred. Please try again.");
    } finally {
      if (!isNavigating) setLoading(false);
    }
  };

  if (loading && !isNavigating) {
    return <div className="flex items-center justify-center min-h-screen"><Loader /></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        autoComplete="off"
                        disabled={isNavigating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        disabled={isNavigating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton pending={form.formState.isSubmitting || isNavigating} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
