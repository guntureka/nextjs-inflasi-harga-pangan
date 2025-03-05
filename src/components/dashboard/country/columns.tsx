"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { country } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<
  Omit<typeof country.$inferSelect, "createdById" | "updatedById" | "geojson"> & {
    createdBy: { id: string; name: string } | null;
    updatedBy: { id: string; name: string } | null;
  }
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => <Badge className="capitalize">{row.original.code.toUpperCase()}</Badge>,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Currency" />,
    cell: ({ row }) => <Badge className="capitalize">{row.original.currency.toUpperCase()}</Badge>,
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
