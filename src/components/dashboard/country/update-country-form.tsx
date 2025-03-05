"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCountrySchema } from "@/lib/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loading-button";
import { formatFieldLabel, getImageKey, parseGeoJSON, useShowToast } from "@/lib/helper-function";
import { useSession } from "@/components/session-provider";
import { MapCaller } from "@/components/map-caller";
import { FeatureCollection } from "geojson";
import { UploadedFileData } from "uploadthing/types";
import { deleteFiles, uploadFile } from "@/actions/uploadthing";
import { createCountry, updateCountryByID } from "@/actions/country";
import { country } from "@/db/schema";

type FormValues = z.infer<typeof UpdateCountrySchema>;

interface UpdateCountryFormProps {
  country: typeof country.$inferSelect;
}

export const UpdateCountryForm = ({ country }: UpdateCountryFormProps) => {
  const [pending, setPending] = React.useState(false);
  const [preview, setPreview] = React.useState<FeatureCollection | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { showErrorToast, showSuccessToast } = useShowToast();

  const session = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(UpdateCountrySchema),
    defaultValues: {
      name: country.name,
      code: country.code,
      currency: country.currency,
      geojson: undefined,
      updatedById: session?.user.id,
    },
  });

  const handleGeojsonChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

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

  const onSubmit = React.useCallback(
    async (values: FormValues) => {
      setPending(true);

      try {
        let uploadedFile: UploadedFileData | null = null;

        if (values.geojson) {
          if (country?.geojson) {
            const key = getImageKey(country.geojson);

            if (key) await deleteFiles(key);
          }

          uploadedFile = await uploadFile(values.geojson);
        }

        const result = await updateCountryByID(country.id, {
          ...values,
          geojson: uploadedFile?.ufsUrl,
        });

        if (!result) throw new Error("Failed to create country");

        showSuccessToast("Country updated successfully");
      } catch (error) {
        showErrorToast(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setPending(false);
      }
    },
    [country.geojson, showErrorToast, showSuccessToast]
  );

  React.useEffect(() => {
    let isMounted = true;

    const fetchGeoJSON = async () => {
      if (pending || !country.geojson || typeof country.geojson !== "string" || preview) {
        return;
      }

      setPending(true);

      try {
        const response = await fetch(country.geojson);
        const data = await response.json();

        if (data.type === "FeatureCollection" && isMounted) {
          setPreview(data);
        }
      } catch (error) {
        console.error("Error fetching GeoJSON:", error);
        if (isMounted) {
          showErrorToast("Error loading GeoJSON data");
        }
      } finally {
        if (isMounted) {
          setPending(false);
        }
      }
    };

    fetchGeoJSON();

    return () => {
      isMounted = false;
    };
  }, [country.geojson]);

  const fields = React.useMemo(() => Object.keys(UpdateCountrySchema.shape) as Array<keyof FormValues>, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Update Country</h1>
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
                    <Input type="text" placeholder={`Enter ${formatFieldLabel(field)}`} {...fieldProps} />
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
              <FormLabel className="font-semibold">GeoJSON File</FormLabel>
              <FormControl>
                <Input type="file" accept=".geojson" ref={fileInputRef} onChange={handleGeojsonChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-300">
          <MapCaller maps={preview} key={JSON.stringify(preview)} />
        </div>

        <LoadingButton pending={pending}>Update Country</LoadingButton>
      </form>
    </Form>
  );
};
