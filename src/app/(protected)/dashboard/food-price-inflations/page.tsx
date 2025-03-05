import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  createBulkFoodPriceInflation,
  deleteFoodPriceInflationsByID,
  getFoodPriceInflationsWithUser,
} from "@/actions/foodPriceInflation";
import { columns } from "@/components/dashboard/foodPriceInflation/columns";
import { ImportButton } from "@/components/import-button";
import { ExportButton } from "@/components/export-button";

export default async function Page() {
  const foodPriceInflation = await getFoodPriceInflationsWithUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">FOOD PRICE INFLATION</h1>
        </div>
        <div className="flex items-center gap-4">
          <ImportButton
            importExampleData={[
              {
                country: "",
                date: "",
                open: "",
                low: "",
                high: "",
                close: "",
              },
            ]}
            importFunc={createBulkFoodPriceInflation}
          />
          <Link href="/dashboard/food-price-inflations/create">
            <Button>+ Create</Button>
          </Link>
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={foodPriceInflation}
          initialColumnVisibility={{
            createdBy_name: false,
            updatedBy_name: false,
            createdAt: false,
            updatedAt: false,
          }}
          deleteFunc={deleteFoodPriceInflationsByID}
        />
      </div>
    </div>
  );
}
