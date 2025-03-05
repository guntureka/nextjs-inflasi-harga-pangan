import { deleteUsersByID, getUsers } from "@/actions/user";
import { columns } from "@/components/dashboard/user/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function Page() {
  const users = await getUsers();

  if (!users) {
    return <div>Something error!</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">USER</h1>
        </div>
        <div>
          <Link href="/dashboard/users/create">
            <Button>+ Create</Button>
          </Link>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={users}
          initialColumnVisibility={{
            createdAt: false,
            updatedAt: false,
          }}
          deleteFunc={deleteUsersByID}
        />
      </div>
    </div>
  );
}
