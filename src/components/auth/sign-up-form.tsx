"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/lib/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoadingButton } from "../ui/loading-button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { formatFieldLabel, useShowToast } from "@/lib/helper-function";

type FormValues = z.infer<typeof SignUpSchema>;

export const SignUpForm = () => {
  const [pending, setPending] = React.useState(false);

  const { showErrorToast, showSuccessToast } = useShowToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setPending(true);

    await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          form.reset();
          setPending(false);
          showSuccessToast("Your account has been created.");
        },
        onError: (ctx) => {
          setPending(false);
          showErrorToast(ctx.error.message);
        },
      },
    });
  };

  const fields = Object.keys(SignUpSchema._def.schema.shape) as Array<keyof FormValues>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-balance text-sm text-muted-foreground">Enter your data below to sign up</p>
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

        <LoadingButton pending={pending}>Sign Up</LoadingButton>
        <div className="mt-4 text-center text-sm">
          <Link href="/sign-in" className="text-primary hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};
