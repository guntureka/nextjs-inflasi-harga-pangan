"use client";

import { useSession } from "@/components/session-provider";
import { formatFieldLabel, useShowToast } from "@/lib/helper-function";
import { cn } from "@/lib/utils";
import { FoodSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { createFood } from "@/actions/food";

type FormValues = z.infer<typeof FoodSchema>;

export function CreateFoodForm() {
  const [pending, setPending] = React.useState(false);

  const { showErrorToast, showSuccessToast } = useShowToast();

  const session = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(FoodSchema),
    defaultValues: {
      name: "",
      description: "",
      createdById: session?.user.id,
      updatedById: session?.user.id,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setPending(true);

    try {
      const result = await createFood(values);

      if (!result) showErrorToast("Something went wrong!");

      showSuccessToast("Food has been created.");

      form.reset();
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Unknown Error");
    } finally {
      setPending(false);
    }
  };

  const fields = Object.keys(FoodSchema.shape) as Array<keyof FormValues>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create Food</h1>
        </div>

        {fields
          .filter((field) => field != "createdById" && field != "updatedById")
          .map((field) => (
            <FormField
              control={form.control}
              key={field}
              name={field}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel className="font-semibold capitalize">{formatFieldLabel(field)}</FormLabel>
                  <FormControl>
                    {field == "description" ? (
                      <Textarea {...fieldProps} placeholder={`Enter your ${formatFieldLabel(field)}`} />
                    ) : (
                      <Input
                        type={"text"}
                        placeholder={`Enter your ${formatFieldLabel(field)}`}
                        {...fieldProps}
                        autoComplete="on"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

        <LoadingButton pending={pending}>Create</LoadingButton>
      </form>
    </Form>
  );
}
