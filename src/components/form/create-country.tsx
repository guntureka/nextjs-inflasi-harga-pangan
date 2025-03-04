"use client";

import { CountrySchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatLabel } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { uploadFile } from "@/lib/actions/uploadthing";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { createCountry } from "@/lib/actions/countries";

type FormValues = z.infer<typeof CountrySchema>;

export function CreateCountryForm() {
  const [preview, setPreview] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(CountrySchema),
    defaultValues: {
      name: "",
      code: "",
      currency: "",
      geojson: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    toast.error("error", {
      description: "erro",
    });
    // setIsLoading(true);
    // let geojsonUrl = null;

    // if (values.geojson) {
    //   try {
    //     const res = await uploadFile(values.geojson);
    //     if (res.error?.message) {
    //       throw new Error(res.error.message);
    //     }
    //     if (res.data?.ufsUrl) {
    //       geojsonUrl = res.data.ufsUrl;
    //     }
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       toast("Error", { description: error.message });
    //     } else {
    //       toast("Error", { description: "An unknown error occurred." });
    //     }
    //     setIsLoading(false);
    //     return;
    //   }
    // }

    // const { geojson, ...filteredValues } = values;

    // try {
    //   await createCountry({ ...filteredValues, geojsonUrl });
    //   toast("Success", { description: "Create Success" });
    //   form.reset();
    // } catch (error) {
    //   toast("Error", { description: error instanceof Error ? error.message : "Failed to create country." });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const onGeojsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("geojson", file);
    }
  };

  const keyFields = Object.keys(CountrySchema.shape) as Array<keyof typeof CountrySchema.shape>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-3xl">
        {keyFields
          .filter((v) => v != "geojson")
          .map((keyField, index) => (
            <FormField
              key={index}
              control={form.control}
              name={keyField}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{formatLabel(keyField)}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

        <FormField
          control={form.control}
          name="geojson"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input type="file" accept=".geojson" onChange={onGeojsonChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full">Create</Button>
      </form>
    </Form>
  );
}
