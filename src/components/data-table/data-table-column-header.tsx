"use client";

import { cn } from "@/lib/utils";
import { Column, ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import React from "react";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [sort, setSort] = React.useState(false);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const onClickSortButton = () => {
    column.toggleSorting(sort);
    setSort(!sort);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant={"ghost"}
        size={"sm"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => onClickSortButton()}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDown />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp />
        ) : (
          <ChevronsUpDown />
        )}
      </Button>
    </div>
  );
}
