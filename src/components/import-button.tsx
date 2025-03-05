"use client";

import React, { useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { country, food } from "@/db/schema";
import { ImportDataSchema, ImportSchema } from "@/lib/zod";
import { useShowToast } from "@/lib/helper-function";
import { getCountries } from "@/actions/country";
import { getFoods } from "@/actions/food";
import { useSession } from "./session-provider";
import { getMonth, getYear } from "date-fns";
import { LoadingButton } from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const MONTHS = [
  { id: "01", name: "January" },
  { id: "02", name: "February" },
  { id: "03", name: "March" },
  { id: "04", name: "April" },
  { id: "05", name: "May" },
  { id: "06", name: "June" },
  { id: "07", name: "July" },
  { id: "08", name: "August" },
  { id: "09", name: "September" },
  { id: "10", name: "October" },
  { id: "11", name: "November" },
  { id: "12", name: "December" },
];

interface ImportButtonProps {
  importExampleData: Record<string, any>[];
  importFunc: (v: any) => Promise<any | void>;
  hasCountry?: boolean;
  hasFood?: boolean;
}

type FormValues = z.infer<typeof ImportSchema>;

export function ImportButton({ importExampleData, importFunc, hasCountry = true, hasFood = false }: ImportButtonProps) {
  const [pending, setPending] = React.useState(false);
  const [foods, setFoods] = React.useState<(typeof food.$inferSelect | null)[]>([]);
  const [countries, setCountries] = React.useState<(typeof country.$inferSelect | null)[]>([]);
  const [importedData, setimportedData] = React.useState<Record<string, any>[]>([]);
  const [columns, setColumns] = React.useState<ColumnDef<Record<string, any>>[]>([]);

  const { showErrorToast, showSuccessToast } = useShowToast();

  const session = useSession();

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(ImportSchema),
    defaultValues: {
      file: undefined,
      countryId: "",
      foodId: "",
      createdById: session?.user.id,
      updatedById: session?.user.id,
    },
  });

  const processFile = useCallback((file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      if (!e.target?.result) return;

      const binaryStr = e.target.result as ArrayBuffer;
      try {
        const wb = XLSX.read(binaryStr, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData: Record<string, any>[] = XLSX.utils.sheet_to_json(ws);

        if (rawData) {
          const formattedData = rawData.map((row) => {
            const newRow: Record<string, any> = {};
            Object.keys(row).forEach((key) => {
              const newKey = key.toLowerCase();
              newRow[newKey] = row[key];
            });
            return newRow;
          });

          // Validate data
          // const validationResults = formattedData.map((item) => ImportDataSchema.safeParse(item));

          // const invalidData = validationResults.filter((result) => !result.success);
          // if (invalidData.length > 0) {
          //   console.log(invalidData)
          //   showErrorToast("Some rows have invalid data. Please check the file.");
          //   return;
          // }

          setimportedData(formattedData);
        }
      } catch (error) {
        showErrorToast("Error processing file.");
        console.error("Error processing file:", error);
      }
    };
  }, []);

  const handleFileChange = (file?: File | null) => {
    if (file) {
      form.setValue("file", file);
      form.trigger("file");
      processFile(file);
    }
  };

  const handleDownloadExample = () => {
    const worksheet = XLSX.utils.json_to_sheet(importExampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, "example.xlsx", { compression: true });
  };

  const onSubmit = async (values: FormValues) => {
    setPending(true);

    const validatedData = importedData.map((v) => {
      const date = new Date(v.date);
      return {
        open: v.open,
        low: v.low,
        high: v.high,
        close: v.close,
        date: date,
        year: getYear(date).toString(),
        month: MONTHS[getMonth(date)].id,
        ...(hasCountry ? { countryId: values.countryId } : {}),
        ...(hasFood ? { foodId: values.foodId } : {}),
        createdById: values.createdById,
        updatedById: values.updatedById,
      };
    });

    const validationResults = validatedData.map((item) => ImportDataSchema.safeParse(item));
    const invalidData = validationResults.filter((result) => !result.success);

    if (invalidData.length > 0) {
      console.log(validationResults);
      showErrorToast("Some rows have invalid data. Please fix them before submitting.");
      setPending(false);
      return;
    }

    try {
      const result = await importFunc(validatedData);
      if (!result) showErrorToast("Something went wrong!");

      showSuccessToast("Food Price has been created.");

      form.reset();
      router.refresh();
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "any Error");
    } finally {
      setPending(false);
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      setPending(true);

      try {
        if (!hasFood && !hasCountry) {
          return;
        } else if (!hasFood) {
          const countryData = await getCountries();
          setCountries(countryData);
          return;
        } else if (!hasCountry) {
          const foodData = await getFoods();
          setFoods(foodData);
          return;
        } else {
          const [foodData, countryData] = await Promise.all([getFoods(), getCountries()]);

          setFoods(foodData);

          setCountries(countryData);
        }
      } catch (error) {
        showErrorToast("Failed to fetch data");
      } finally {
        setPending(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (importedData.length === 0) return;

    setColumns(
      Object.keys(importedData[0]).map((key) => ({
        accessorKey: key,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={key.charAt(0).toUpperCase() + key.slice(1)} />
        ),
      }))
    );
  }, [importedData]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Import</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[60vh] w-full max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>Upload file Excel untuk mengimport data.</DialogDescription>
        </DialogHeader>

        <Button type="button" onClick={handleDownloadExample} className="max-w-xs">
          Download Example
        </Button>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {hasCountry && (
              <FormField
                control={form.control}
                name={"countryId"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold capitalize">Country</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.length > 0 &&
                            countries
                              .filter((v) => v != null)
                              .map((v) => (
                                <SelectItem key={v.id} value={v.id} className="capitalize">
                                  {`${v.name} (${v.currency})`}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {hasFood && (
              <FormField
                control={form.control}
                name={"foodId"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold capitalize">Food</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select food" />
                        </SelectTrigger>
                        <SelectContent>
                          {foods.length > 0 &&
                            foods
                              .filter((v) => v != null)
                              .map((v) => (
                                <SelectItem key={v.id} value={v.id} className="capitalize">
                                  {v.name}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".xlsx" onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton pending={pending}>Import</LoadingButton>
          </form>
        </Form>

        <div className="relative h-96 overflow-auto rounded-md border p-2">
          <DataTable columns={columns} data={importedData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
