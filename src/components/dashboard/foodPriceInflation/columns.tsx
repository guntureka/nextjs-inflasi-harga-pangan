"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { country, foodPriceInflation } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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

export const columns: ColumnDef<
  Omit<typeof foodPriceInflation.$inferSelect, "createdById" | "updatedById" | "countryId"> & {
    country: typeof country.$inferSelect | null;
    createdBy: { id: string; name: string } | null;
    updatedBy: { id: string; name: string } | null;
  }
>[] = [
  {
    accessorKey: "country.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <span>{row.original.date ? format(row.original.date, "dd/MM/yyyy") : ""}</span>,
  },
  {
    accessorKey: "month",
    header: ({ column }) => <DataTableColumnHeader column={column} title="month" />,
    cell: ({ row }) => <span>{MONTHS.filter((v) => v.id == row.getValue("month")).map((v) => v.name)}</span>,
  },
  {
    accessorKey: "year",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Year" />,
  },
  {
    accessorKey: "open",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Open" />,
  },
  {
    accessorKey: "low",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Low" />,
  },
  {
    accessorKey: "high",
    header: ({ column }) => <DataTableColumnHeader column={column} title="High" />,
  },
  {
    accessorKey: "close",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Close" />,
  },
  {
    accessorKey: "inflationRate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inflation Rate" />,
  },
  {
    accessorKey: "createdBy.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created By" />,
  },
  {
    accessorKey: "updatedBy.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated By" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <span>{row.original.createdAt ? format(row.original.createdAt, "dd/MM/yyyy") : ""}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => <span>{row.original.updatedAt ? format(row.original.updatedAt, "dd/MM/yyyy") : ""}</span>,
  },
];
