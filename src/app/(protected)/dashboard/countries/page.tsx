import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { deleteCountriesByID, getCountriesWithUser } from "@/actions/country";
import { columns } from "@/components/dashboard/country/columns";

export default async function Page() {
  const countries = await getCountriesWithUser();

  if (!countries) {
    return <div>Something error!</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">COUNTRY</h1>
        </div>
        <div>
          <Link href="/dashboard/countries/create">
            <Button>+ Create</Button>
          </Link>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={countries}
          initialColumnVisibility={{
            createdAt: false,
            updatedAt: false,
          }}
          deleteFunc={deleteCountriesByID}
        />
      </div>
    </div>
  );
}
