import { getCountriesWithFoodPriceInflations } from "@/actions/country";
import { getFoodPricesWithParams } from "@/actions/foodPrice";
import { getFoodPriceInflationsWithParams } from "@/actions/foodPriceInflation";
import { MapCaller } from "@/components/map-caller";
import { country, foodPrice } from "@/db/schema";
import { parseGeoJSON } from "@/lib/helper-function";
import { FeatureCollection } from "geojson";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { month = "", year = "", date = "", countryId = "" } = await searchParams; // ✅ Hapus await
  const foodPriceInflationDatas = await getCountriesWithFoodPriceInflations();
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className="text-xl font-bold">Food Prices by Country</h1>
      <pre className="rounded-md bg-gray-100 p-4 text-sm">{JSON.stringify(foodPriceInflationDatas, null, 2)}</pre>
    </div>
  );
}
