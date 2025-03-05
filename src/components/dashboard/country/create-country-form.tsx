"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCountrySchema } from "@/lib/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loading-button";
import { formatFieldLabel, parseGeoJSON, useShowToast } from "@/lib/helper-function";
import { useSession } from "@/components/session-provider";
import { FeatureCollection } from "geojson";
import { UploadedFileData } from "uploadthing/types";
import { uploadFile } from "@/actions/uploadthing";
import { createCountry } from "@/actions/country";
import dynamic from "next/dynamic";
import { MapCaller } from "@/components/map-caller";

type FormValues = z.infer<typeof CreateCountrySchema>;

export const CreateCountryForm = () => {
  const [pending, setPending] = React.useState(false);
  const [preview, setPreview] = React.useState<FeatureCollection | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { showErrorToast, showSuccessToast } = useShowToast();

  const session = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateCountrySchema),
    defaultValues: {
      name: "",
      code: "",
      currency: "",
      geojson: undefined,
      createdById: session?.user.id,
      updatedById: session?.user.id,
    },
  });

  const handleGeojsonChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      if (preview) {
        setPreview(null);
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const parsedData = parseGeoJSON(event.target?.result as string);

          if (!parsedData) {
            showErrorToast("Invalid GeoJSON format");

            setPreview(null);

            if (fileInputRef.current) fileInputRef.current.value = "";

            return;
          }

          setPreview(parsedData);

          form.setValue("geojson", file);
        } catch (e) {
          showErrorToast("Invalid GeoJSON file. Please upload a valid GeoJSON.");

          setPreview(null);

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.readAsText(file);
    },
    [form, preview, showErrorToast]
  );

  React.useEffect(() => {
    return () => {
      if (preview) {
        setPreview(null);
      }
    };
  }, [preview]);

  const onSubmit = async (values: FormValues) => {
    setPending(true);

    try {
      let uploadedFile: UploadedFileData | null = null;

      if (values.geojson) {
        uploadedFile = await uploadFile(values.geojson);
      }

      const result = await createCountry({
        ...values,
        geojson: uploadedFile?.ufsUrl,
      });

      if (!result) showErrorToast("Something went wrong!");

      showSuccessToast("User updated successfully.");
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setPending(false);
    }
  };

  const fields = Object.keys(CreateCountrySchema.shape) as Array<keyof FormValues>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create Country</h1>
        </div>

        {fields
          .filter((field) => field !== "createdById" && field !== "updatedById" && field !== "geojson")
          .map((field) => (
            <FormField
              control={form.control}
              key={field}
              name={field}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel className="font-semibold capitalize">{formatFieldLabel(field)}</FormLabel>
                  <FormControl>
                    <Input type={"text"} placeholder={`Enter your ${formatFieldLabel(field)}`} {...fieldProps} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

        <FormField
          control={form.control}
          name="geojson"
          render={() => (
            <FormItem>
              <FormControl>
                <Input type="file" accept=".geojson" ref={fileInputRef} onChange={handleGeojsonChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-300">
          <MapCaller maps={preview} />
        </div>

        <LoadingButton pending={pending}>Create</LoadingButton>
      </form>
    </Form>
  );
};
