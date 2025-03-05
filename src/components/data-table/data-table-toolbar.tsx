"use client";

import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { ExportButton } from "../export-button";
import { ImportButton } from "../import-button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={"Filter"}
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(String(event.target.value))}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button variant="outline" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            {"Clean Filters"}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ExportButton
          data={table.getFilteredSelectedRowModel().rows.map((row) => row.original) as Record<string, any>[]}
        />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
