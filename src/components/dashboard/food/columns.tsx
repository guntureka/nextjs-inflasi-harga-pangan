"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { food } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<
  Omit<typeof food.$inferSelect, "createdById" | "updatedById"> & {
    createdBy: { id: string; name: string } | null;
    updatedBy: { id: string; name: string } | null;
  }
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
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
