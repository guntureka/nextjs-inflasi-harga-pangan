"use client";

import { Table } from "@tanstack/react-table";
import { Ellipsis, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { getImageKey, useShowToast } from "@/lib/helper-function";
import { LoadingButton } from "@/components/ui/loading-button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFiles } from "@/actions/uploadthing";

interface DataTableColumnActionsProps<TData> {
  table: Table<TData>;
  deleteFunc: (id: string[]) => Promise<any | void>;
}

export function DataTableColumnActions<TData>({ table, deleteFunc }: DataTableColumnActionsProps<TData>) {
  const [pending, setPending] = React.useState(false);
  const path = usePathname();
  const { showSuccessToast, showErrorToast } = useShowToast();
  const router = useRouter();

  const onClickDeleteButton = async () => {
    setPending(true);

    const selectable = table.getFilteredSelectedRowModel().flatRows.map((val) => val.original);
    const ids = selectable.map((val) => (val as { id: string }).id).filter(Boolean);

    const images = selectable
      .map((val) => (val as { image?: string })?.image)
      .filter(Boolean)
      .filter((val) => val != undefined);

    if (ids.length === 0) {
      setPending(false);
      return;
    }

    try {
      if (images.length > 0) {
        const filteredImages = images.map(getImageKey).filter((val) => val != undefined);

        await deleteFiles(filteredImages);
      }

      const result = await deleteFunc(ids);
      if (!result) {
        showErrorToast("Something went wrong.");
      } else {
        showSuccessToast("Success delete user.");
        router.refresh();
      }
    } catch (error) {
      showErrorToast(error as Error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">{"Open Menu"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild disabled={!table.getSelectedRowModel().flatRows.length}>
            <DropdownMenuItem>
              <Button
                variant="ghost"

                // className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
                {<span className="ml-2">{"Delete"}</span>}
              </Button>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently delete this file from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            pending={pending}
            variant={"ghost"}
            size={"sm"}
            className={"justify-start"}
            onClick={() => onClickDeleteButton()}
          >
            <>
              <Trash2 className="h-4 w-4 text-red-500" />
              {<span className="ml-2">{"Delete"}</span>}
            </>
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
