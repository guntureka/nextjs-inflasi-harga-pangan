"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoadingButton } from "../ui/loading-button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { formatFieldLabel, useShowToast } from "@/lib/helper-function";

type FormValues = z.infer<typeof SignInSchema>;

export const SignInForm = () => {
  const [pending, setPending] = React.useState(false);

  const { showErrorToast } = useShowToast();

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setPending(true);

    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          setPending(false);
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setPending(false);
          showErrorToast(ctx.error.message);
        },
      },
    });
  };

  const fields = Object.keys(SignInSchema.shape) as Array<keyof FormValues>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-balance text-sm text-muted-foreground">Enter your data below to sign In</p>
        </div>

        {fields.map((field) => (
          <FormField
            control={form.control}
            key={field}
            name={field as keyof FormValues}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel className="font-semibold capitalize">{formatFieldLabel(field)}</FormLabel>
                <FormControl>
                  <Input
                    type={field.toLowerCase().includes("password") ? "password" : field === "email" ? "email" : "text"}
                    placeholder={`Enter your ${formatFieldLabel(field)}`}
                    {...fieldProps}
                    autoComplete="on"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <LoadingButton pending={pending}>Sign In</LoadingButton>
        <div className="mt-4 text-center text-sm">
          <Link href="/sign-up" className="text-primary hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};
