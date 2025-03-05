import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { columns } from "@/components/dashboard/food/columns";
import { deleteFoodsByID, getFoodsWithUser } from "@/actions/food";
import { ImportButton } from "@/components/import-button";
import { CreateCountryForm } from "@/components/dashboard/country/create-country-form";

export default async function Page() {
  const foods = await getFoodsWithUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">FOOD</h1>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard/foods/create">
            <Button>+ Create</Button>
          </Link>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={foods}
          initialColumnVisibility={{
            createdAt: false,
            updatedAt: false,
          }}
          deleteFunc={deleteFoodsByID}
        />
      </div>
    </div>
  );
}
