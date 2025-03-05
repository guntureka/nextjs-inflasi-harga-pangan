"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface ExportButtonProps<TData extends Record<string, any>> {
  data: TData[];
}

export function ExportButton<TData extends Record<string, any>>({ data }: ExportButtonProps<TData>) {
  const filteredData = data.map((v) => ({
    Country: v?.country?.name,
    Food: v?.food?.name,
    Date: v?.date ? format(new Date(v.date), "dd/MM/yyyy") : "",
    Open: v?.open,
    Low: v?.low,
    High: v?.high,
    Close: v?.close,
    "Inflation Rate": v?.inflationRate,
  }));
  const handleExport = () => {
    console.log(data);
    // const worksheet = XLSX.utils.json_to_sheet(filteredData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet);
    // XLSX.writeFile(workbook, "data.xlsx", { compression: true });
  };
  return (
    <Button size={"sm"} onClick={handleExport}>
      Export
    </Button>
  );
}
