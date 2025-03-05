"use client";

// import { UserSchema } from "@/app/users/userSchema";
import Link from "next/link";
import { Row } from "@tanstack/react-table";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

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

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  deleteFunc: (id: string[]) => Promise<any | void>;
}

export function DataTableRowActions<TData>({ row, deleteFunc }: DataTableRowActionsProps<TData>) {
  const [pending, setPending] = React.useState(false);
  const path = usePathname();
  const { id } = row.original as { id: string };
  const { showSuccessToast, showErrorToast } = useShowToast();
  const router = useRouter();

  const onClickDeleteButton = async () => {
    setPending(true);

    const { image } = row.original as { image?: string };

    if (image) {
      const key = getImageKey(image);
      if (key) {
        await deleteFiles(key);
      }
    }
    await deleteFunc([id])
      .then((val) => {
        if (!val) {
          showErrorToast("Something went wrong.");
        } else {
          showSuccessToast("Success delete user.");
          router.refresh();
        }
        setPending(false);
      })
      .catch((e) => {
        showErrorToast(e);
        setPending(false);
      });
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
          <DropdownMenuItem>
            <Button variant={"ghost"} size={"sm"} className={"w-full justify-start"} asChild>
              <Link href={`${path}/update/${id}`}>
                <Pencil className="h-4 w-4 text-green-500" />
                {<span className="ml-2">{"Update"}</span>}
              </Link>
            </Button>
          </DropdownMenuItem>
          <DialogTrigger asChild>
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
            className={"w-full justify-start"}
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
